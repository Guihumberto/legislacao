import { defineStore } from "pinia";

import api from "@/services/api"
import apiChat from "@/services/api_chat"

import { useLoginStore } from "@/store/LoginStore";
import { useFavQuestoesStore } from "./favQuestionStore";

export const useQuestoesStore = defineStore("questoesStore", {
    state: () => ({
        questoes: [],
        totalQuestoes: 0,
        totalRespQuestoes: 0,
        q_respondidas: [],
        errorList: [],
        load: false,
        listBancas: [],
        listAnos: []
    }),
    getters: {
        readQuestoes(){
            return this.questoes
        },
        readTotalQuestoes(){
            return this.totalQuestoes
        },
        readTotalRespQuestoes(){
            return this.totalRespQuestoes
        },
        readQuestoesResp(){
            return this.q_respondidas
        },
        readQuestoesMoreResp(){
            const merged = this.readQuestoes.map(q => {
                const respostasDaQuestao = this.readQuestoesResp
                  ?.filter(r => r.id_question === q.id)
                  .sort((a, b) => this.parseTimestamp(b.timestamp) - this.parseTimestamp(a.timestamp))
              
                const respostaMaisRecente = respostasDaQuestao[0]
              
                return {
                  ...q,
                  ...(respostaMaisRecente ? {
                    id_resposta: respostaMaisRecente.id_resposta,
                    timestamp: respostaMaisRecente.timestamp
                  } : {})
                }
            })
            return merged
        },
        readErrorList(){
            return this.errorList
        },
        readLoad(){
            return this.load
        },
        formatDate(){
            const now = new Date();
            
            const day = String(now.getDate()).padStart(2, '0');  // Garante 2 dígitos para o dia
            const month = String(now.getMonth() + 1).padStart(2, '0');  // Meses começam em 0, então somamos 1
            const year = now.getFullYear();
            
            const hours = String(now.getHours()).padStart(2, '0');  // Garante 2 dígitos para a hora
            const minutes = String(now.getMinutes()).padStart(2, '0');  // Garante 2 dígitos para os minutos
            
            return `${day}-${month}-${year} ${hours}:${minutes}`;
        },
        readListBancas(){
            return this.listBancas
        },
        readListAnos(){
            return this.listAnos
        }
    },
    actions:{
        async gerarQuestoes(item){         
            this.load = true
            const loginStore = await useLoginStore()
            if(!loginStore.readLogin?.cpf) return

            const prompt = "Gere 5 questões do tipo certo/errado no estilo cespe/cebraspe, retornando o resultado como um array de objetos, com a seguinte estrutura: {pergunta: 'pergunta', resposta: 'resposta', justificativa: 'justificar citando por que ta certo ou errado'}, informando no campo resposta 'verdadeiro ou falso'"

            try {
                const resp = await apiChat.post('gerar_questoes', {
                    id_group: item.id_law,
                    id_art: item.id_art,
                })

                return resp.data

            } catch (error) {
                console.error('Erro ao gerar questões:', error.response?.data || error.message);
            } finally {
                await this.getQuestoes(item)
                this.load = false
            }
        },
        async getQuestao(item){
            const loginStore = useLoginStore()
            if(!loginStore.readLogin?.cpf) return

            try {
                const resp = await api.get(`questoes/_doc/${item}`)
                return {id: resp.data._id, ...resp.data._source}
            } catch (error) {
                console.log('erro get questoes');
            }
        },
        async getQuestoes(item, filter){
            this.load = true
            const favStore = useFavQuestoesStore()
            const loginStore = useLoginStore()
            if(!loginStore.readLogin?.cpf) return
            this.clear()

            //fitrar todas favoritas
            let listFavoritas = []
            if(filter.favoritas) listFavoritas = await favStore.getAllFavLaw(item.id_law, [])

            //filtrar todas respondidas
            let listRespondidas = []
            if(filter.typeRespQuestions != 1) {
                if(filter.favoritas && listFavoritas.length) {
                    const ids_questoes = listFavoritas.map(q => q.id_question)
                    listRespondidas = await this.getResposndidas(item.id_law, ids_questoes)
                } else {
                    listRespondidas = await this.getResposndidas(item.id_law)
                }
            } 
                

            const must_not = [];

            if(listRespondidas.length && filter.typeRespQuestions == 2){
                must_not.push({ terms: { _id: listRespondidas } });
            }


            const must = [];

            if(listRespondidas.length && filter.typeRespQuestions > 2){
                must.push({ terms: { _id: listRespondidas } });
            }

             //favoritas com todas as questoes
             if(filter.typeRespQuestions == 1 && filter.favoritas && listFavoritas.length){
                const ids_questoes = listFavoritas.map(q => q.id_question)
                must.push({ terms: { _id: ids_questoes } });
            }
           
            if (item.id_law) {
                must.push({ match: { id_law: item.id_law } });
            }

            if (item.id_art) {
                if(!Array.isArray(item.id_art)) must.push({ match: { id_art: item.id_art } });
                if(Array.isArray(item.id_art)) must.push({ terms: { id_art: item.id_art } });
            }

            if(filter.ano.length){
                must.push({ terms: { ano: filter.ano } });
            }

            if(filter.banca.length){
                console.log('bancas - fazer algo', filter.banca);
                must.push({ terms: { 'banca.keyword': filter.banca } });
            }
            
            try {
                const resp = await api.post('questoes/_search', {
                    from: 0,
                    size: 100,
                    query: {
                        bool: {
                            must,
                            must_not
                        }
                    },
                    sort: [
                        {
                            date_created: {
                                order: "asc"
                            },
                        }
                    ]
                }
            )
                this.questoes = resp.data.hits.hits.map(item => ({ id: item._id, ...item._source}))
               
            } catch (error) {
                console.log('erro get questoes');
            } finally {
                const list = this.questoes.map(item => item.id) || []
                if(filter.typeRespQuestions == 1) this.q_respondidas = await this.getMyQuestoesResp(item, list)
                if(!filter.favoritas)await favStore.getAllFavLaw(item.id_law, list)
                this.load = false
            }
        },
        async getMyQuestoesResp(item, list){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            const must = [];

            if(list.length){
                must.push({ terms: { id_question: list } });
            }

            if (cpf) {
                must.push({ term: {  id_user: cpf } });
            }

            if (item.id_law) {
                must.push({ term: { id_law: item.id_law } });
            }

            if (item.id_art) {
                if(!Array.isArray(item.id_art)) must.push({ match: { id_art: item.id_art } });
                if(Array.isArray(item.id_art)) must.push({ terms: { id_art: item.id_art } });
            }

            try {
                const resp = await api.post('questoes_resp/_search', {
                    from: 0,
                    size: 100,
                    query: {
                        bool: {
                          must
                        }
                    },
                    sort: [
                        {
                            timestamp: {
                                order: "desc"
                            },
                        }
                    ]
                }
            )
                return resp.data.hits.hits.map(item => ({ id: item._id, ...item._source}))
            } catch (error) {
                console.log('erro get questoes resp');
            }
        },
        async saveRespQuestao(item){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            const questoes = { ...item, id_user: cpf, timestamp: this.formatDate }

            try {
                const resp = await api.post('questoes_resp/_doc', questoes)
            } catch (error) {
                console.log('erro save questoes resp');
            }
        },
        async saveQuestoesLawManual(item){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            const bulkBody = item.flatMap(doc => [
                { index: { _index: 'questoes' } },
                doc
            ]);

            try {
                const response = await api.post('/_bulk', bulkBody.map(JSON.stringify).join('\n') + '\n', {
                    headers: { 'Content-Type': 'application/x-ndjson' }
                  });
              
                  if (response.data.errors) {
                    console.error('Alguns documentos falharam ao indexar:', response.data.items);
                  } else {
                    console.log('Todos os documentos foram indexados com sucesso.');
                  }

                  console.log('deu tudo certo');
                
            } catch (error) {
                console.log('erro save questoes manuel');
            }
        },
        async relatarErrorQUestao(item){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            const { descriptionError, typeError, id_art, id, id_law, tipo } = item

            const questoes = { descriptionError, typeError, id_art, id_questao: id, id_law, tipo, id_user: cpf, timestamp: this.formatDate, tratado: false }

            try {
                const resp = await api.post('error_question/_doc', questoes)
                return resp.data
            } catch (error) {
                return error.code
            }
        },
        async getAllErrorQuestion(){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
          
            try {
                const resp = await api.post('error_question/_search', {
                    from: 0,
                    size: 100,
                    query:{
                        term:{
                            tratado: false
                        }
                    },
                    sort: [
                        {
                            timestamp: {
                                order: "desc"
                            },
                        }
                    ]
                }
            )
                this.errorList = resp.data.hits.hits.map(item => ({ id: item._id, ...item._source}))
            } catch (error) {
             console.log('erro get error question');
            }
        },
        async tratarErro(item){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return
            try {
                const resp = await api.post(`error_question/_update/${item}`, {
                    "doc":{
                        tratado: true
                    }
                })
                this.updateReadListErro(item)
                console.log('tratado', resp);
            } catch (error) {
                console.log('error no tratamento de erro');
            }
        },
        updateReadListErro(item){
            this.errorList = this.errorList.filter(erro => erro.id != item)
        },
        async deleteQuestao(item){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return
            try {
                const resp = await api.delete(`questoes/_doc/${item.id_questao}`)
                await this.tratarErro(item.id_erro)

                return resp
            } catch (error) {
                console.log('error delete questao');
                return error
            }
        },
        async updateQuestao(item, id_erro){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return
            const objeto = { ...item }
            delete objeto.id
            console.log('id', item.id);
            try {
                const resp = await api.post(`questoes/_update/${item.id}`, {
                    doc: objeto
                })

                await this.tratarErro(id_erro)

                return resp.data.result
                
            } catch (error) {
                console.log('error update questao');
                return 'error'
            }
        },
        //fitros avancados para questoes
        async getResposndidas(item, list = []){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            const must = []

            if (item) {
                must.push({ term: { id_law: item } });
            }

            if (cpf) {
                must.push({ term: { id_user: cpf } });
            }

            if (list.length) {
                must.push({ terms: { id_question: list } });
            }

            try {
                const resp = await api.post('questoes_resp/_search', {
                    from: 0,
                    size: 500,
                    query: {
                        bool: {
                          must
                        }
                    }
                })

                console.log('resp', resp);  

                this.q_respondidas = resp.data.hits.hits.map(item => ({ id: item._id, ...item._source}))
                return this.q_respondidas.map(x => x.id_question)
         
            } catch (error) {
                console.log('error get questoes respondidas');
            }
        },
        parseTimestamp(timestamp){
            const [datePart, timePart] = timestamp.split(' ')
            const [day, month, year] = datePart.split('-').map(Number)
            const [hour, minute] = timePart.split(':').map(Number)
            return new Date(year, month - 1, day, hour, minute)
        },
        clear(){
            this.questoes = []
            // this.q_respondidas = []
        },
        async totasisQuestoesLaw(item){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return
            try {
                const respQ = await api.post('questoes/_search', {
                    size: 0,
                    query:{
                        match:{
                            id_law: item
                        }
                    }
                })
                this.totalQuestoes = respQ.data.hits.total.value

                const respR = await api.post('questoes_resp/_search', {
                    size: 0,
                    query:{
                        bool:{
                            must:[
                                {
                                    term:{
                                        id_user: cpf
                                    }
                                },
                                {
                                    match:{
                                        id_law: item
                                    }
                                }
                            ]
                        }
                    }
                })

                this.totalRespQuestoes = respR.data.hits.total.value
            } catch (error) {
                console.log('error totais questoes law');
            }
        },
        async getListBancas(){
            try {
                const resp = await api.post('questoes/_search', {
                    size: 0,
                    "aggs": {
                        "by_bancas": {
                            "terms": {
                                "field": "banca.keyword",
                                "size": 100
                            }
                        }
                    }
                })
                this.listBancas = resp.data.aggregations.by_bancas.buckets
            } catch (error) {
                console.log('error get bancas');
            }
        },
        async getListAnos(){
            try {
                const resp = await api.post('questoes/_search', {
                    size: 0,
                    "aggs": {
                        "by_anos": {
                            "terms": {
                                "field": "ano",
                                "size": 100
                            }
                        }
                    }
                })
                this.listAnos = resp.data.aggregations.by_anos.buckets
            } catch (error) {
                console.log('error get bancas');
            }
        },
        async getLists(){
            await this.getListBancas()
            await this.getListAnos()
        }
    }
})