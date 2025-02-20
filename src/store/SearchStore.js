import { defineStore } from "pinia";

import api from "@/services/api"
import apiChat from "@/services/api_chat"
import { useLoginStore } from "./LoginStore";

export const useSearchStore = defineStore("searchStore", {
    state: () => ({
        results: [],
        load: false
    }),
    getters: {
        reasResults(){
            return this.results
        },
        readLoad(){
            return this.load
        }
    },
    actions:{
        async searchDirect(pergunta, id=null){
            if(id){
                const resp = await this.searchId(pergunta, id)
                return resp
            } else {
                this.search(pergunta)
            }
        },
        async search(search){
            try {
                this.load = true
                this.results = []
                const resp = await api.post('pages_v2/_search', {
                    query: {
                        "match": {
                            "text_page": search
                        }
                    }
                })
                this.results = resp.data.hits.hits
                return this.results[0]._source
            } catch (error) {
                console.log('erro search');
            } finally {
                this.load = false
            }
        },
        async searchId(search, id){
            try {
                this.load = true
                this.results = []
                const resp = await api.post('document_embeddings/_search', {
                    query: {
                       bool:{
                        "must":[
                            {
                                "match": {
                                    "text": {
                                        "query": search,
                                        "fuzziness": "AUTO",
                                        "fuzzy_transpositions": true
                                    }
                                }
                            },
                            {
                                "term": {
                                    "id": {
                                         "value": id
                                     }
                                 }
                            }
                        ]
                       }
                    }
                })
                this.results = resp.data.hits.hits
                return this.results[0]._source.text
            } catch (error) {
                console.log('erro search');
            } finally {
                this.load = false
            }
        },
        async searchChatInit(){
            const resp = await apiChat.get()
            return resp.data//"resposta"
        },
        async searchChatApi(ask, id){
            try {
                this.load = true

                const resp = await apiChat.post('ask', {
                    question: ask,
                    idCollection: id,
                })
                return resp.data.answer

            } catch (error) {
                console.log('erro search');
                
            } finally {
                this.load = false
            }
           
        }
    }
})