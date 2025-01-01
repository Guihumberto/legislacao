import { defineStore } from "pinia";
import api from "@/services/api"

export const useCollectionStore = defineStore("collection", {
    state: () => ({
        collections: [],
        load: false, 
    }),
    getters: {
        readCollections(){
            return this.collections.filter(x => x.active)
        },
        readLoad(){
            return this.load
        },
    },
    actions:{
        async getCollections(){
            try {
                this.load = true  
                const response = await api.get('collection/_search')
                const resp = response.data.hits.hits
                this.collections = resp.map(x => ({ id: x._id, ...x._source }))
            } catch (error) {
                console.log('erro ao load get collections');
            } finally {
                this.load = false
            }
        }
    }
})