import { defineStore } from "pinia";

import api from "@/services/api"
import { id } from "vuetify/lib/locale/index.mjs";

export const useUserAreaStore = defineStore("userAreaStoe", {
    state: () => ({
        favoritos: [],
        historico: [],
        documentos: [],
        load: false
    }),
    getters: {
        readFavoritos(){
            return this.favoritos.filter( x => x.fav)
        },
        readHistorico(){
            return this.historico
        },
        readHistoricoFormatdo(){
            const formatado = this.readHistorico.reduce((acc, item) => {

                const dataExist = acc.find( x => x.dateFormate == this.formatDate(item.date))

                if(dataExist) { 
                    dataExist.agg.push({...item})
                } else {
                    const objeto = {
                        dateFormate: this.formatDate(item.date),
                        date: item.date,
                        agg: [{...item}] 
                    }
                    acc.push(objeto)
                }

                return acc
            }, [])

            return formatado
        },
        readDocumentos(){
            return this.documentos
        },
        readLoad(){
            return this.load
        }
    },
    actions:{
        getAllFavoritos(){

        },
        getOnetFavoritos(item){

        },
        saveFavoritos(item){
            const doc = { ...item }
            const findFav = this.favoritos.find(x => x.id == doc.id)
            if(!findFav) {
                this.favoritos.push(doc)
            } else {
                this.favoritos = this.favoritos.filter(x => x.id != doc.id)
                this.favoritos.push(doc)
            }
        },
        async getAllHistórico(){
            this.historico = []
            this.load = true
            try {
                const resp = await api.post('searchs_todo/_search', {
                    from: 0,
                    size: 2000,
                    "query": {
                        "match":{
                            "usuario": "017.917.433-90"
                        }      
                    }
                })

                const  data = resp.data.hits.hits

                data.forEach(x => {
                    let dados = {}
                    dados = { ...x._source }
                    dados.idu = x._id
                    this.historico.push(dados)
                })
                
            } catch (error) {
                console.log('erro get historico');
            } finally {
                this.load = false
            }
        },
        formatDate(timestamp){
            const data = new Date(timestamp);

            const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                }).format(data);

            return dataFormatada
        }
    }
})