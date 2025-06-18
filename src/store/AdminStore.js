import { defineStore } from "pinia";

import api from "@/services/api"
import { useLoginStore } from "./LoginStore";
import { useSnackStore } from "./snackStore";
import { useNotificationsStore } from '@/store/NotificationsStore'
import { notificationService } from '@/services/notificationService'

export const useAdminStore = defineStore("admin", {
    state: () => ({
        load: false
    }),
    getters: {
        readLoad(){
            return this.load
        }
    },
    actions:{
        async saveLogTransacoes(item, cpf, transacao){
            try {
                this.load = true
                const resp = await api.post('log_transacoes/_doc/', {
                    usuario: cpf,
                    dateCreated: Date.now(),
                    transacao,
                    obs: item
                })
                console.log('salvo log');
            } catch (error) {
                console.log('erro edit log');
            } finally {
                this.load = false
            }
        }, 
        async editLaw(item, field){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin.cpf
            const editLaw = `editar lei campo ${field}`
            const id = item.idU
            const doc = item
            delete doc.idU
            try {
                this.load = true
                const resp = await api.post(`laws_v3/_doc/${id}`, doc)
                if(field == 'revogado') await this.editPagesLawRevogado(doc)
                if(field == 'sigiloso') await this.editPagesLawSigiloso(doc)
                if(field == 'eficaz') await this.editPagesLawEficaz(doc)
                await this.saveLogTransacoes(id, cpf, editLaw)
                console.log('salvo');
            } catch (error) {
                console.log('erro edit law');
            } finally {
                this.load = false
            }
        },
        async editPagesLawRevogado(item){
            console.log('revogado')
            try {
                const resp = await api.post('pages_v2/_update_by_query', {
                    "script":{
                        source: "ctx._source.revogado = params.novo_valor", // Atualiza o campo
                        params: {
                            novo_valor: item.revogado // Substitua pelo novo valor do campo
                        }
                    },
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "match": {
                                        "page_to_norma.parent": item.id
                                    }
                                }
                            ]
                        }
                    }
                })
                console.log('salvo', resp);
            } catch (error) {
                console.log('erro edit law all');
            }
        },
        async editPagesLawSigiloso(item){
            console.log('sigiloso')
            try {
                const resp = await api.post('pages_v2/_update_by_query', {
                    "script":{
                        source: "ctx._source.sigiloso = params.novo_valor", // Atualiza o campo
                        params: {
                            novo_valor: item.sigiloso // Substitua pelo novo valor do campo
                        }
                    },
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "match": {
                                        "page_to_norma.parent": item.id
                                    }
                                }
                            ]
                        }
                    }
                })
                console.log('salvo', resp);
            } catch (error) {
                console.log('erro edit law all');
            }
        },
        async editPagesLawEficaz(item){
            console.log('eficaz')
            try {
                const resp = await api.post('pages_v2/_update_by_query', {
                    "script":{
                        source: "ctx._source.eficaz = params.novo_valor", // Atualiza o campo
                        params: {
                            novo_valor: item.eficaz // Substitua pelo novo valor do campo
                        }
                    },
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "match": {
                                        "page_to_norma.parent": item.id
                                    }
                                }
                            ]
                        }
                    }
                })
                console.log('salvo', resp);
            } catch (error) {
                console.log('erro edit law all');
            }
        },
        async indexarNorma(law, pages){
            const loginStore = useLoginStore()
            const snackStore = useSnackStore()
            const cpf = loginStore.readLogin.cpf
            const saveLaw = 'indexar nova norma'
            try {
                this.load = true
                const exist = await this.lawExist(law)

                if(exist){
                    return {idU:"error", text: "Erro: norma já adicionada"}
                } 

                const respLaw = await this.indexarLaw(law)
                await this.indexarPages(law, pages)
                await this.saveLogTransacoes( respLaw.data._id, cpf, saveLaw)

                snackStore.activeSnack('Norma adicionada com sucesso', 'success')
                law.tags = [law.tipo, law.ano]
                this.createNotificação(law)
                return {idU: respLaw.data._id, id_law: law.id}
            } catch (error) {
                console.log('erro indexar');
                snackStore.activeSnack('Erro ao indexar norma', 'error')
            } finally {
                this.load = false
            }
        },
        async indexarLaw(law){
            try {
                const resp = await api.post('laws_v3/_doc/', law) 
                return resp
            } catch (error) {
                console.log('erro law index');
            }
        },
        async indexarPages(law, pages){
            try {
                const documents = pages.map( x=> ({
                    path: law.path, 
                    tipo: law.tipo, 
                    revogado: law.revogado,
                    ano: law.ano,
                    sigiloso: law.sigiloso,
                    fonte: law.fonte,
                    eficaz: law.eficaz,
                    text_page: x.text,
                    num_page: x.num_page,
                    page_to_norma:{
                        parent: law.id,
                        name: "page",
                        title: law.title
                    }
                }))

                let bulkData = '';

                documents.forEach(doc => {
                    bulkData += JSON.stringify({ index: { _index: 'pages_v2' } }) + '\n';
                    bulkData += JSON.stringify(doc) + '\n';
                });

                const resp = await api.post('/_bulk', bulkData, {
                    headers: { 'Content-Type': 'application/x-ndjson' }
                });

                console.log('pages law save');
            } catch (error) {
                console.log('erro pages index', error);
            }
        },
        async lawExist(law){
            try {
                this.load = true
                const response = await api.post("laws_v3/_search", {
                    query: {           
                            "bool": {
                                "must":[
                                    {
                                        "match":{
                                            "title": {query: law.title, operator: "and"}
                                        }
                                    },  
                                    {
                                        "term": {
                                            "tipo": law.tipo
                                        }
                                    },
                                    {
                                        "term": {
                                            "ano": law.ano
                                        }
                                    },
                                ]
                            }     
                    }
                })
                return response.data.hits.total.value
            } catch (error) {
                console.log('error law exist');
            } 
        },
        async createNotificação(item){
            const notificationsStore = useNotificationsStore()
            try {
                // Criar notificação para todos os usuários
                await notificationService.createLawNotification(item)
                
                // Atualizar store local se necessário
                notificationsStore.addNotification({
                    type: 'law',
                    title: 'Nova Norma Adicionada',
                    message: `A lei "${item.title}" foi adicionada ao sistema`,
                    actionUrl: `/avancado/${item.id}`
                })
                
                // Sucesso
                console.log('Lei criada e notificação enviada!')
            } catch (error) {
                console.error('Erro ao criar lei:', error)
            }
        },
    }
})