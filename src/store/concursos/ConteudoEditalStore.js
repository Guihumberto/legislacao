import { defineStore } from "pinia";

import api from "@/services/api"

import { useLoginStore } from "@/store/LoginStore";
import { useSnackStore } from "@/store/snackStore";


export const useConteudoEditalStore = defineStore("conteudoEditalStore", {
    state: () => ({
        conteudoEdital: [],
        edital: {id: null},
        loading: false,
        error: null,
        editaisUser: [],
        conteudoEditalUser: [],
        editalUser: {}
    }),
    getters: {
        getConteudoEdital() {
            return this.conteudoEdital;
        },
        getLoading() {
            return this.loading;
        },
        getError() {
            return this.error;
        },
        readEdital(){
            return this.edital
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
        readEditarUser(){
            return this.editaisUser
        },
        readConteudoEditalUser(){
            return this.conteudoEditalUser
        },
        readEditalUser(){
            return this.editalUser
        }
    },
    actions: {
        async getConteudo(id) {
            this.loading = true;
            this.error = null;
            this.conteudoEdital = []
            try {
                const response = await api.post('conteudo_edital/_search', {
                    from: 0,
                    size:100,
                    query: {
                        match: {
                            id_concurso: id
                        }
                    }
                });
                this.conteudoEdital = response.data.hits.hits.map(hit => hit._source);
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
        async getEdital(idu) {
            this.loading = true;
            this.error = null;
            this.edital = { id: null }
            try {
                const response = await api.get(`edital/_doc/${idu}`);
                this.edital = {id: response.data._id, ...response.data._source }
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
        async createConteudoEdital(conteudoEditalData, concurso) {
            this.loading = true;
            this.error = null;

           const id_concurso = this.createConcurso(concurso)

           if(!id_concurso) return
            
           const newArray = conteudoEditalData.map(obj => ({ ...obj, ...concurso, id_concurso}));
           const bulkData = newArray.flatMap(doc => [{ index: { _index: 'conteudo_edital' } }, doc]);

           try {
                const response = await api.post(`conteudo_edital/_bulk`, bulkData.map(JSON.stringify).join("\n") + "\n", {
                    headers: { "Content-Type": "application/x-ndjson" }
                  });
                  console.log("Documentos indexados via Bulk:", response.data);
           } catch (error) {
                console.log('error create conteudo edital', error);
           } finally {
                this.loading = false;
           }
        },
        async createConcurso(concurso){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            try {
                const response = await api.post('edital/_doc', {
                    ...concurso,
                    created_by: cpf,
                    data_include: this.formatDate
                })
                console.log('response', response);
                return response.data._id
            } catch (error) {
                console.log('erroe create concurso');
                return null
            }
        },
        //importar user
        async importConteudoEditalUser(){
            const snackStore = useSnackStore()
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf

            if(!cpf) {
                snackStore.activeSnack('Faça login para importar editais', 'error',)
                return
            }

            const isExist = await this.verificaEdital(this.readEdital.id)

            if(isExist){
                snackStore.activeSnack('Edital já adicionado a sua área', 'error',)
                return
            }

            const objeto = { ...this.readEdital, created_by: cpf, data_include: this.formatDate, id_edital_ref: this.readEdital.id }
            delete objeto.id
             

            try {
                const response = await api.post('conteudo_edital_import/_doc', objeto);
                const resp = await this.importConteudoUser(this.getConteudoEdital, response.data._id)

                snackStore.activeSnack('Edital importado com sucesso', 'success',)
            } catch (error) {
                console.log('error importar editais', error);
            }
        },
        async importConteudoUser(conteudoEditalData, id_edital) {   
           const loginStore = useLoginStore()
           const cpf = loginStore.readLogin?.cpf  
           if(!id_edital) return

           const concurso = { ...this.readEdital, created_by: cpf, data_include: this.formatDate, id_edital }
           delete concurso.id
            
           const newArray = conteudoEditalData.map(obj => ({ ...obj, ...concurso}));
           const bulkData = newArray.flatMap(doc => [{ index: { _index: 'conteudo_edital_import' } }, doc]);

           try {
                const response = await api.post(`conteudo_edital_import/_bulk`, bulkData.map(JSON.stringify).join("\n") + "\n", {
                     headers: { "Content-Type": "application/x-ndjson" }
                });
           } catch (error) {
                console.log('error create conteudo edital', error);
           }
        },
        async verificaEdital(idu) {
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            try {
               const response = await post.get('conteudo_edital_import/_search', {
                    size: 0,
                    query:{
                        bool:{
                            must:[
                                {
                                    match:{
                                        id_edital_ref: idu
                                    }
                                },
                                 {
                                    match:{
                                        created_by: cpf
                                    }
                                }
                            ]
                        }
                    }
               });
               return response.data.hits.total.value
            } catch (error) {
                this.error = error;
                return true
            }
        },
        async getEditalUser() {
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return
            this.editaisUser = []
            try {
                const response = await api.post('conteudo_edital_import/_search', {
                    size: 100,
                    query:{
                        bool:{
                            must:[
                                {
                                    exists:{
                                        field: "id_edital_ref"
                                    }
                                },
                                 {
                                    match:{
                                        created_by: cpf
                                    }
                                }
                            ]
                        }
                    }
                });
                this.editaisUser = response.data.hits.hits.map(item => ({ id: item._id, ...item._source}))
            } catch (error) {
                this.error = error;
                console.log('error get edital user');
            }
        },
        async getConteudoEditalUser(id) {
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return
            this.conteudoEditalUser = []
            try {
                const response = await api.post('conteudo_edital_import/_search', {
                    size: 100,
                    query:{
                        match:{
                            id_edital: id
                        }
                                
                    }
                });
                this.conteudoEditalUser = response.data.hits.hits.map(item => ({ id: item._id, ...item._source}))
            } catch (error) {
                this.error = error;
                console.log('error get conteudo edital user');
            }
        },
        async getEditalOneUser(id){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return
            this.editalUser = {}
            try {
                const response = await api.get(`conteudo_edital_import/_doc/${id}`);
                this.editalUser = {id: response.data._id, ...response.data._source }
            } catch (error) {
                this.error = error;
                console.log('error get edital user');
            }
        }
  }
})