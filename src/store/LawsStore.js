import { defineStore } from "pinia";
import api from "@/services/api"

export const useLawStore = defineStore("Law", {
    state: () => ({
        listAllLaws: [],
        load: false,
        totalLaws: 0
    }),
    getters: {
        readListAllLaws(){
            return this.listAllLaws
        },
        readLoad(){
            return this.load
        },
        readTotalLaws(){
            return this.totalLaws
        }
    },
    actions:{
        async getAllLaw(){
            try {
                this.load = true
                const response = await api.post("laws_v3/_search", {
                    from: 0,
                    size: 7915
                })
                this.listAllLaws = response.data.hits.hits
                this.totalLaws = response.data.hits.total.value
            } catch (error) {
                console.log("error getAllLaw");
            }finally{
                this.load = false
            }
        }
    }
})