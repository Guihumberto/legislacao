import { defineStore } from "pinia";
import api from "@/services/api";
import apiChat from "@/services/api_chat"

export const useDocumetStore = defineStore("document", {
    state: () => ({
        doc: null,
        documents: [],
        load: false, 
        pagination:{
            page: 1, 
            start: 0, 
            end: 10,
            perPage: 15
        },
    }),
    getters: {
        readDoc(){
            return this.doc
        },
        readDocuments(){
            return this.documents
        },
        readLoad(){
            return this.load
        },
        readPagination(){
            return this.pagination
        }
    },
    actions:{
        async getDoc(id){
            try {
                this.load = true
                this.doc = null
                const response = await api.get(`documents/_doc/${id}`)
                this.doc = response.data?._source
            } catch (error) {
                console.log('erro ao recuperar documento');
                this.doc = null
            } finally{
                this.load = false
            }
        },
        async getListDocuments(){
            try {
                this.load = true
                const response = await api.post('documents/_search', {
                    from: this.pagination.start,
                    size: this.pagination.perPage,
                    query:{
                        bool:{
                            must:[
                                {
                                    "term": {
                                        "active": true
                                    }
                                },
                                {
                                    "term": {
                                        "publish": true
                                    }
                                }
                            ]
                        }
                    }
                })
                const resp = response.data.hits.hits
                this.documents = resp.map( x => ({id: x._id, ...x._source}))
            } catch (error) {
                console.log('Erro ao carregar documents activs',);
            } finally {
                this.load = false
            }
        },
        async getChatWithDocument(item){
            try {
                this.load = true
            } catch (error) {
                console.log('Erro ao carregar coleções do chatbot',);
            } finally {
                this.load = false
            }
        },
        async publishDocument(item){
            try {
                this.load = true

                if(item.publish){
                    const exist = await this.isEmbeddingExist(item.id)
                    if(!exist) this.saveEmbeddings(item.id)
                }
                    
                const response = await api.post(`documents/_update/${item.id}`, {
                    "doc":{
                        publish: item.publish
                    }
                })
                console.log('salvo', response.data);
            } catch (error) {
                console.log('Erro ao salvar e publicar',);
            } finally {
                this.load = false
            }
        },
        async isEmbeddingExist(id){
            try {
                const response = await api.post('document_embeddings/_search', {
                    query:{
                        match:{
                            id: id
                        }
                    }
                })
                const resp = response.data.hits.total.value
               return resp
            } catch (error) {
                console.log('Erro ao verificar a existencia do embedding',);
            }
        },
        async saveEmbeddings(id){
            try {
                const resp = await apiChat.post('save-embeddings', {
                    id: id
                })
                return resp.data

            } catch (error) {
                console.log('erro ao criar embeddings');
            }
        }
    },
})