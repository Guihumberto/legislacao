import { defineStore } from "pinia";
import api from "@/services/api"

export const useAggsStore = defineStore("aggsStore", {
    state: () => ({
        aggsTermsSearch: [],
        aggsTermsLaw: [],
        load: false
    }),
    getters: {
        readAggsTermsSearch: (state) => state.aggsTermsSearch.filter(x => x.key.length > 2),
        readAggsTermsLaw: (state) => state.aggsTermsLaw,
        readLoad: (state) => state.load
    },
    actions:{
        async getAggsTermsSearch(terms){
            try {
                this.load = true
                const resp = await api.post('pages_v2/_search', {
                    size: 0,
                    "query": {
                        "match": {
                            "text_page": terms
                        }
                    },
                    "aggs": {
                        "popular_in_terms": {
                            "significant_text": {
                                "field": "text_page",
                                "size": 10
                            }
                        }
                    }
                })

                this.aggsTermsSearch = resp.data.aggregations.popular_in_terms.buckets
            } catch (error) {
                console.log('error aggs search', error);
            } finally {
                this.load = false
            }
        }
    }
})