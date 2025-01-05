import { defineStore } from "pinia";
import api from "@/services/api"

export const useAutoSuggestion = defineStore("autosuggestion", {
    state: () => ({
        suggestions: null,
    }),
    getters: {
        readSuggestions(){
            return this.suggestions
        }
    },
    actions:{
        async getSuggestions(){
            try {
                this.load = true
                const response = await  api.post("autocomplete/_search", {
                    "suggest":{
                        "name_suggestion" :{
                        "prefix" : "subs",
                        "completion" : {
                            "field": "suggest"
                        }
                        }
                    }
                })
                this.suggestions = response.data.hits.hits;
            } catch (error) {
                console.log('erro get page')
            } finally {
                this.load = false
            }
        }
    }
})