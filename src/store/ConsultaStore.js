import { defineStore } from "pinia";
import api from "@/services/api"

export const useConsultaStore = defineStore("Consulta", {
    state: () => ({
        totalConsultas: 0,
        totalLaws: 0,
        totalPages: 0,
        load: false, 
        loadAll: false,
    }),
    getters: {
        readTotalConsulta(){
            return this.totalConsultas
        },
        readTotalLaws(){
            return this.totalLaws
        },
        readTotalPages(){
            return this.totalPages
        },
        readLoadAll(){
            return this.loadAll
        },
    },
    actions:{
        async contadorConsulta(){
            try{
                this.load = true
                const response = await api.post("searchs_todo/_search", { 
                    "track_total_hits": true
                })
                this.totalConsultas = response.data.hits.total.value;

            } catch {
                console.log("erro contador");
            } finally {
                this.load = false
            }
        },
        async contadorLaws(){
            try{
                this.load = true
                const response = await api.post("laws_v3/_search", { 
                    "track_total_hits": true
                })
                this.totalLaws = response.data.hits.total.value;

            } catch {
                console.log("erro contador");
            } finally {
                this.load = false
            }
        },
        async contadorPages(){
            try{
                this.load = true
                const response = await api.post("pages_v2/_search", { 
                    "track_total_hits": true
                })
                this.totalPages = response.data.hits.total.value;

            } catch {
                console.log("erro contador");
            } finally {
                this.load = false
            }
        },
        async contadores(){
            try {
                this.loadAll = true
                await this.contadorConsulta()
                await this.contadorLaws()
                await this.contadorPages()
            } catch (error) {
                console.log("erro all count");
            } finally {
                this.loadAll = false
            }
        }
    }
})