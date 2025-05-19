import { defineStore } from "pinia";
import api from "@/services/api"

export const usePageStore = defineStore("page", {
    state: () => ({
        page: null,
        allPagesLaw: [],
        total_pages: null,
        load: false
    }),
    getters: {
        readPage(){
            return this.page
        },
        readAllPages(){
            return this.allPagesLaw
        },
        readLoad(){
            return this.load
        },
        readTotalPages(){
            return this.total_pages
        }
    },
    actions:{
        async getPage(item){
            try {
                this.load = true
                const response = await api.get(`pages_v2/_doc/${item}`)
                this.page = response.data._source
            } catch (error) {
                console.log('erro get page')
            } finally {
                this.load = false
            }
        },
        async getAllPages(id){
            try {
                this.load = true
                const response = await api.post("pages_v2/_search", {
                    from: 0,
                    size: 5000,
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "match": {
                                        "page_to_norma.parent": id
                                    }
                                }
                            ]
                        }
                    }
                })
                this.allPagesLaw = response.data.hits.hits
                this.total_pages = response.data.hits.total.value
            } catch (error) {
                console.log("error");
            }finally{
                this.load = false
            }
        },
        async getPagesCollection(ids){
            try {
                this.load = true
                const response = await api.post("pages_v2/_search", {
                    from: 0,
                    size: 5000,
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "terms": {
                                        "page_to_norma.parent": ids
                                    }
                                }
                            ]
                        }
                    }
                })
                return response.data.hits.hits
            } catch (error) {
                console.log("error");
            }finally{
                this.load = false
            }
        },
        async fetchSuggestions(item){
            try {
                this.load = true
                const response = await api.post("pages_v2/_search", {
                    query: {
                        "match_phrase_prefix": {
                            "text_page": {
                                "query": item,
                                "slop" : 10
                            }
                        }
                    }
                });
                return response.data.hits.hits;
            } catch (error) {
                console.error('Erro ao buscar sugestões:', error);
            } finally {
                this.load = false
            }
            
        },
        //filtrar página de uma norma específica
        async getPageNorma(item){
            try {
                this.load = true
                const response = await api.post("pages_v2/_search", {
                    from: 0,
                    size: 5000,
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "match": {
                                        "page_to_norma.parent": item.id
                                    }
                                },
                                {
                                    "match": {
                                        "num_page": item.num_page
                                    }
                                },
                            ]
                        }
                    }
                })
                const resp = response.data.hits.hits
                return { total_pages: response.data.hits.total.value,  data: resp.map( x => ({ id: x._id, ...x._source}))}
            } catch (error) {
                console.log('error');
            } finally {
                this.load = false
            }
        },
        async saveResumoIA(id, resumo, keywords = []){
            try {
                const resp = await api.post(`pages_v2/_update/${id}`, {
                    "doc":{
                        summary: resumo,
                        keywords: keywords
                    }
                })
            } catch (error) {
                console.log('erro save resumo ia');
            }
        }
    }
})