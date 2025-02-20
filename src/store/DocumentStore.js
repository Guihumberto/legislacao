import { defineStore } from "pinia";
import api from "@/services/api";

export const useDocumetStore = defineStore("document", {
    state: () => ({
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
        }
    },
})