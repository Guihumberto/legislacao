import { defineStore } from "pinia";
import abackapi from "@/services/abackapi";

export const useAutoSuggestionStore = defineStore("autosuggestion", {
    state: () => ({
        autosuggestion: [],
        load: false
    }),
    getters: {
        readAutoSuggestion(){
            return this.autosuggestion
        },
        readLoad(){
            return this.load
        }
    },
    actions:{
        async fetchSuggestions(text){
            try{
                this.load = true
                const requestBody = {
                    prefix: text
                }
                console.log("Json: ", JSON.stringify(requestBody, null, 2));
                const response = await abackapi.post("/listarsugestoesautocomplete", requestBody, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                this.autosuggestion = response.data.suggest.name_suggestion;
            } catch(e){
                console.log('erro auto sugestion')
            } finally {
                this.load = false
            }
        }
    }
})