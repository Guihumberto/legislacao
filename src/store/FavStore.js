import { defineStore } from "pinia";
import api from "@/services/api";

import { useLoginStore } from "./LoginStore";

export const useCollectionStore = defineStore("collection", {
    state: () => ({
        favoritos: [],
        favPages: [],
        load: false, 
        pagination:{
            page: 1, 
            start: 1, 
            end: 10,
            perPage: 10
        },
    }),
    getters: {
        readFavoritos(){
            return this.favoritos.filter( x => x.fav)
        },
        readFavPages(){
            return this.favPages
        },
        readLoad(){
            return this.load
        },
        readPagination(){
            return this.pagination
        },
    },
    actions:{
        async getAllFavoritos(){
            const loginStore = useLoginStore()
            try {
                this.load = true
                this.favoritos = []
                const requestBody = {
                    createdby: loginStore.readLogin.cpf
                }
                console.log("Json getAllFavoritos: ", JSON.stringify(requestBody, null, 2));
                const response = await abackapi.post("/favoritos/search", requestBody, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const resp = response.data.hits.hits
                this.favoritos = resp.map( x => ({ idU: x._id, ...x._source}))
            } catch (error) {
                console.log('erro ao recuperar a pilha de FAVORITOS');
            } finally{
                this.load = false
            }
        },
        async getListFavPages(section = 'law'){
            const loginStore = await useLoginStore()
            const cpf = loginStore.readLogin.cpf
            if(!cpf){
                console.log('nao carregado o usuário');//pegar este erro para recarregar
                return
            }
            try {
                this.load = true
                this.favPages = []
                const resp = await api.post('favorites/_search', {
                    from: this.pagination.start -1,
                    size: this.pagination.perPage,
                    query:{
                        bool:{
                            must:[
                                { "match": { "created_by": cpf } },
                                { "match": { "section": section } }
                            ]
                        }
                    }
                })
                this.favPages = resp.data.hits
            } catch (error) {
                console.log('error gav pages law');
            } finally {
                this.load = false
            }
        },
        async saveFavoritos(item){
            const loginStore = useLoginStore()
            this.load = true
            const isFavExist = await this.isFavExist(item)

            if(!isFavExist.length){
                const doc = { ...item, dateCreated: Date.now(), created_by: loginStore.readLogin.cpf }
                try {
                    const resp = await api.post('favorites/_doc/', doc) 
                    this.favoritos.push({ idU: resp.data._id, ...doc })
                } catch (error) {
                    console.log('erro fav')
                } finally {
                    this.load = false
                }    
            } else {
                try {
                    const doc_update = isFavExist[0]._source
                    const resp = await api.post(`favorites/_doc/${isFavExist[0]._id}`, item) 
                    this.favoritos = this.favoritos.map(x =>
                        x.id === doc_update.id ? { ...item } : x
                    );
                } catch (error) {
                    console.log('erro fav')
                } finally {
                    this.load = false
                }    
            }
        },
        async isFavExist(item){
            const loginStore = useLoginStore()
            try {
                this.load = true
                const requestBody = {
                    idItem: item.id,
                    createdby: loginStore.readLogin.cpf
                }
                console.log("Json isFavExist: ", JSON.stringify(requestBody, null, 2));
                const response = await abackapi.post("/favoritos/search", requestBody, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                return response.data.hits.hits
            } catch (error) {
                console.log('erro procura isfav');
            }
        },
        async editFav(item){
            this.load = true
            const objeto = (({ idU, ...rest }) => rest)(item);
            try {
                const response = await api.post(`favorites/_doc/${item.idU}`, objeto)
                this.favoritos = this.favoritos.map(x =>
                    x.idU === item.idU ? {...item } : x
                );
            } catch (error) {
                console.log('erro ao editar favorito');
            } finally {
                this.load = false
            }
        },
        async deleteFav(id){
            try {
                this.load = true
                const resp = await api.delete(`favorites/_doc/${id}`)
                this.favoritos = this.favoritos.filter(x => x.idU != id)

                this.favPages.hits = this.favPages.hits.filter( x => x._id != id)
                this.favPages.total.value--


            } catch (error) {
                console.log('error delete fav');
            } finally {
                this.load = false
            }
        },
    },
})