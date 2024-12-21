import { defineStore } from "pinia";

import api from "@/services/api"

export const useUserAreaStore = defineStore("userAreaStoe", {
    state: () => ({
        favoritos: [],
        historico: [],
        documentos: [],
        collection: [],
        load: false,
        temp: {}
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
            return this.documentos.filter( x => x.active)
        },
        readCollection(){
            return this.collection.filter( x => x.active)
        },
        readTempView(){
            return this.temp
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
        saveDoc(item){
            const doc = { ...item }
            const findDoc = this.documentos.find(x => x.title == doc.title)

            if(findDoc) {
                console.log("Já existe um documento com o mesmo nome.");
                return
            }
            this.documentos.push(doc)
            console.log(this.documentos);
        },
        removeDoc(item){
            const doc = { ...item }
            this.documentos = this.documentos.filter(x => x.title != doc.title)
            this.documentos.push(doc)
        },
        saveCollection(item){
            const doc = { ...item, dateCreated: Date.now() }
            const findDoc = this.collection.find(x => x.title == doc.title)

            if(findDoc) {
                console.log("Já existe uma colleção com o mesmo nome.");
                return
            }

            this.collection.push(doc)
            console.log(this.collection);
        },
        printAndViewTemp(item){
            this.temp = { ...item }
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