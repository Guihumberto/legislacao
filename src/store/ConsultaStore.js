import { defineStore } from "pinia";
import abackapi from "@/services/abackapi";

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
                const requestBody = "C"
                console.log("parâmetro ", requestBody);
                const response = await abackapi.post("/contadores", requestBody, {
                    headers: {
                        "Content-Type": "text/plain"
                    }
                });
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
                const requestBody = "L"
                console.log("parâmetro ", requestBody);
                const response = await abackapi.post("/contadores", requestBody, {
                    headers: {
                        "Content-Type": "text/plain"
                    }
                });
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
                const requestBody = "P"
                console.log("parâmetro ", requestBody);
                const response = await abackapi.post("/contadores", requestBody, {
                    headers: {
                        "Content-Type": "text/plain"
                    }
                });
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
                console.log('load', this.loadAll);
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