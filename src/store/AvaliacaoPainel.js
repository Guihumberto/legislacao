import { defineStore } from "pinia";
import api from "@/services/api"

export const usePainelStore = defineStore("painel", {
    state: () => ({
        servidores: [],
        equipes: [],
        avaliacoes: [],
        load: false,
        pesquisa: []
    }),
    getters: {
        readServidores(){
            return this.servidores
        },
        readEquipes(){
            return this.equipes
        },
        readAvaliacoes(){
            return this.avaliacoes
        },
        readLoad(){
            return this.load
        },
        readPesquisa(){
            return this.pesquisa
        }
    },
    actions:{
        async cargaServidores(){
            try {
                this.servidores = []
                this.load = true
                const response = await api.post("servidores/_search", {
                    from: 0,
                    size: 2000
                })
                const servidores = response.data.hits.hits
    
                servidores.forEach(x => {
                    this.servidores.push(x._source)
                })
    
            } catch (error) {
                console.log("error carga");
            }finally{
                this.load = false
            }
        },
        async cargaEquipe(){
            try {
                this.avaliacao = []
                this.load = true
                
                const response = await api.post("equipe/_search", {
                    from: 0,
                    size: 2000
                })
                const avaliacao = response.data.hits.hits
    
                avaliacao.forEach(x => {
                    this.equipes.push(x._source)
                })
    
            } catch (error) {
                console.log(error);
            } finally {
                this.load = false
            }
        },
        async allAvaliationsSefaz(){
            try {
                this.avaliacaoSefaz = []
                this.load = true
                const response = await api.post('avaliacao/_search', {
                    from: 0,
                    size: 5500
                })
    
                const avaliacao = response.data.hits.hits
    
                avaliacao.forEach(x => {
                    this.avaliacoes.push(x._source)
                })
            } catch (error) {
                console.log("elastic erro 11");
            } finally {
                this.load = false
            }
        },
        async cargaPesquisa(){
            try {
                this.servidores = []
                this.load = true
                const response = await api.post("pesquisasatisfacao/_search", {
                    from: 0,
                    size: 2000
                })
                const pesquisa = response.data.hits.hits
    
                pesquisa.forEach(x => {
                    this.pesquisa.push(x._source)
                })
    
            } catch (error) {
                console.log("error carga");
            }finally{
                this.load = false
            }
        },
        cargaInitPainel(){
            this.load = true
            try {
                this.cargaEquipe()
                this.cargaServidores()
                this.allAvaliationsSefaz()
                this.cargaPesquisa()
            } catch (error) {
                console.log('error carga painel');
            } finally {
                this.load = false
            }
        },
        async findAvaliacao(cpf, ref){
            const id = this.apenasNumeros(cpf)
            const resp = await api.post('avaliacao/_search', {
                "query": {
                    "match":{
                        "idServidor": parseInt(id)
                    }
                }
            })
            return resp.data.hits.hits
        },
        //funções
        apenasNumeros(str) {
            try {
                return str.replace(/\D/g, '');
            } catch (error) {
                return str
            }
        },
    }
});