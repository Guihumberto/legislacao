import { defineStore } from "pinia";

export const useUserAreaStore = defineStore("userAreaStoe", {
    state: () => ({
        favoritos: [],
        historico: [],
        documentos: []
    }),
    getters: {
        readFavoritos(){
            return this.favoritos.filter( x => x.fav)
        },
        readHistorico(){
            return this.historico
        },
        readDocumentos(){
            return this.documentos
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
        }
    }
})