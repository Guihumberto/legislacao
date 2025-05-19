import { defineStore } from "pinia";
import api from "@/services/api";

import { useLoginStore } from "./LoginStore";


export const useFavStore = defineStore("favStore", {
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
        async getAllFavoritos(items){

            const idsLaw = items.map(x => x._source.page_to_norma.parent);
            const idsPage = items.map(x => x._id)

            const ids = idsPage.concat(idsLaw)

            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return
            try {
                this.load = true
                this.favoritos = []
                
                const response = await api.post('favorites/_search', {
                    query:{
                        bool:{
                            must:[
                                {
                                    terms:{
                                        id: ids
                                    }
                                },
                                {
                                    match: {
                                        created_by: cpf
                                    }
                                }
                            ]
                        }
                    }
                })

                const resp = response.data.hits.hits
                this.favoritos = resp.map( x => ({ idU: x._id, ...x._source}))
            } catch (error) {
                console.log('erro ao recuperar a pilha de FAVORITOS');
            } finally{
                this.load = false
            }
        },
        async getListFavPages(section = 'law'){
            let data = sessionStorage.getItem('userData')
            if(data) data = JSON.parse(data).cpf
            let cpf = data || false
            if(!cpf){
                console.log('nao carregado o usuário'); 
                console.log('data', data);
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
                console.log('nao existe');
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
                console.log('existe');
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
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return
            try {
                const resp = await api.post('favorites/_search', {
                    query:{
                        bool:{
                            must:[
                                {
                                    term: {
                                        created_by: cpf
                                    }
                                },
                                {
                                    term:{
                                        id: item.id
                                    }
                                }
                            ]
                        }
                    }
                })
                
                const response = resp.data.hits.hits
                return response
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
                const resp = await api.delete(`favorites/_doc/${id}`)
    
                this.favoritos = this.favoritos.filter(x => x.idU != id);
                this.favPages.hits = this.favPages.hits.filter( x => x._id != id)

                this.favPages.total.value--
            } catch (error) {
                console.log('error delete fav');
            }
        },
    },
})