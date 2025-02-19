import { defineStore } from "pinia";
import abackapi from "@/services/abackapi";

export const useCollectionStore = defineStore("collection", {
    state: () => ({
        collections: [],
        load: false, 
        pagination:{
            page: 1, 
            start: 0, 
            end: 10,
            perPage: 20
        },
    }),
    getters: {
        readCollections(){
            return this.collections.filter(x => x.active && x.publish)
        },
        readLoad(){
            return this.load
        },
    },
    actions:{
        async getCollections(){
            try {
                this.load = true  
                const requestBody = {
                    from: this.pagination.start,
                    size: this.pagination.perPage
                }
                console.log("Json: ", JSON.stringify(requestBody, null, 2));
                const response = await abackapi.post("/listarcolecaoleis", requestBody, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const resp = response.data.hits.hits
                this.collections = resp.map(x => ({ id: x._id, ...x._source }))
            } catch (error) {
                console.log('Erro ao carregar coleções:', error);
            } finally {
                this.load = false
            }
        },
        async getChatWithCollection(item){
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