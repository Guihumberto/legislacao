import { defineStore } from "pinia";

import api from "@/services/api"
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
        async search(search){
            try {
                this.load = true
                const resp = await api.get('pages_v2/_search', {
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
        }
    }
})