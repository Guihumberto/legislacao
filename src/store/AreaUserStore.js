import { defineStore } from "pinia";

import api from "@/services/api"
import abackapi from "@/services/abackapi";
import apiChat from "@/services/api_chat"

import { useLoginStore } from "./LoginStore";
import { useGeneralStore } from "./GeneralStore";

export const useUserAreaStore = defineStore("userAreaStoe", {
    state: () => ({
        favoritos: [],
        favNormas: [],
        favPages: [],
        historico: [],
        documentos: [],
        collection: [],
        load: false,
        loadLocal: false,
        loadSaveEmbbeding: false,
        temp: {},
        pagination:{
            page: 1, 
            start: 1, 
            end: 10,
            perPage: 10
        },
        totalHistorico: 0,
        totalDocs: 0,
        totalCollection: 0,
        loadHistorico: false,
    }),
    getters: {
        readFavoritos(){
            return this.favoritos.filter( x => x.fav)
        },
        readFavNormas(){
            return this.favNormas
        },
        readFavPages(){
            return this.favPages
        },
        readHistorico(){
            return this.historico
        },
        readLoadHistorico(){
            return this.loadHistorico
        },
        readHistoricoComplete(){
            return this.totalHistorico <= this.readHistorico.length
            ? true
            : false
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
        readCollection(){
            return this.collection.filter(x => x.active)
        },
        readTempView(){
            return this.temp
        },
        readLoad(){
            return this.load
        },
        readLoadLocal(){
            return this.loadLocal
        },
        readLoadSaveEmbbeding(){
            return this.loadSaveEmbbeding
        },
        readPagination(){
            return this.pagination
        },
        readTotalDocuments(){
            return this.totalDocs
        },
        readTotalCollection(){
            return this.totalCollection
        }
    },
    actions:{
        //Favoritos
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
        //Histórico
        async getAllHistórico(){
            const generalStore = useGeneralStore()
            const loginStore = useLoginStore()
            this.historico = []
            this.load = true
            try {
                const resp = await api.post('searchs_todo/_search', {
                    from: 0,
                    size: 15,
                    "query":{
                        match:{
                            usuario: loginStore.readLogin.cpf
                        }
                    },
                    sort: [
                        {
                            date: {
                                order: "desc", // Ordena pelos IDs em ordem decrescente
                            },
                        }
                    ]
                })

                const  data = resp.data.hits.hits
                this.totalHistorico = resp.data.hits.total.value

                this.historico = data.map(x => ({idu: x._id, ...x._source}))
                this.historico.forEach(x => {
                    const search = {
                        id: x.idu,
                        text: x.text_search,
                        years: x.years,
                        fonte: x.sources,
                        termo: x.termos,
                        precision: x.precision,
                        date: x.date
                    }
                    generalStore.addListSearch(search);
                })
                
            } catch (error) {
                console.log('erro get historico');
            } finally {
                this.load = false
            }
        },
        async getAllHistóricoPlus(){
            const loginStore = useLoginStore()
            this.loadHistorico = true
            try {
                const resp = await api.post('searchs_todo/_search', {
                    from: this.pagination.page * this.pagination.start - 1,
                    size: this.pagination.perPage,
                    "query":{
                        match:{
                            usuario: loginStore.readLogin.cpf
                        }
                    },
                    sort: [
                        {
                            date: {
                                order: "desc", // Ordena pelos IDs em ordem decrescente
                            },
                        }
                    ]
                })

                const  data = resp.data.hits.hits
                const novo = data.map(x => ({idu: x._id, ...x._source}))
                this.historico = this.historico.concat(novo)
            } catch (error) {
                console.log('erro get historico');
            } finally {
                this.loadHistorico = false
            }
        },
        loadPlusHistory(){
            this.pagination.page++
            this.getAllHistóricoPlus()
        },
        async saveHistory(search){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            try {
                this.load = true
                const response = await api.post("searchs_todo/_doc", {
                    "text_search": search.text,
                    "years": search.years,
                    "sources": search.fonte,
                    "precision": search.precision ? search.precision : false,
                    "termos":  search.termo ? search.termo : null,
                    "usuario": cpf ? cpf : null,
                    "date": Date.now()
                })
            } catch (error) {
                console.log("error search todo salvar no banco");
            } finally {
                this.load = false
            }
        },
        async searchHistory(item){
            const loginStore = useLoginStore()
            try {
                this.load = true
                const resp = await api.post('searchs_todo/_search', {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                "match": {
                                    "text_search": item 
                                    }
                                },
                                {
                                "match": {
                                    "usuario": loginStore.readLogin.cpf
                                    }
                                }
                            ]
                        }
                    }
                })
                const  data = resp.data.hits.hits
                this.historico = data.map(x => ({idu: x._id, ...x._source}))
            } catch (error) {
                console.log('error history search');
            } finally {
                this.load = false
            }
        },
        //Documentos
        async saveDoc(item){
            const loginStore = useLoginStore()
            this.load = true
            const doc = { ...item, dateCreated: Date.now(), created_by: loginStore.readLogin.cpf }
            const findDoc = this.documentos.find(x => x.title == doc.title)

            if(findDoc) {
                console.log("Já existe um documento com o mesmo nome.");
                return
            }

            try {
                const resp = await api.post('documents/_doc', doc)
                this.documentos.push({ id:resp.data._id, ...doc } )
            } catch (error) {
                console.log('erro ao salvar o documento');
            } finally { 
                this.load = false
            }      
        },
        async editDoc(item){
            this.load = true
            const objeto = (({ id, ...rest }) => rest)(item);
            try {
                const response = await api.post(`documents/_doc/${item.id}`, objeto)
                this.documentos = this.documentos.filter(x => x.id != item.id)
                this.totalDocs--
            } catch (error) {
                console.log('erro ao editar collection');
            } finally {
                this.load = false
            }
        },
        async getDocs(){
            const loginStore = useLoginStore()
            if(!loginStore.readLogin?.cpf){
                return
            }
            try {
                this.load = true
                this.documentos = []
                const response = await api.post('documents/_search', {
                    from: this.pagination.start -1,
                    size: this.pagination.perPage,
                    query:{
                        bool:{
                            must:[
                                {
                                    "match":{
                                        created_by: loginStore.readLogin.cpf
                                    }
                                },
                                {
                                    "term": {
                                        "active": true
                                    }
                                },
                            ]
                        }
                    }
                })
                const resp = response.data.hits.hits
                this.documentos = resp.map( x => ({id: x._id, ...x._source}))
                this.totalDocs = response.data.hits.total.value

            } catch (error) {
                console.log('erro ao recuperar a pilha de documentos');
            } finally{
                this.load = false
            }
        },
        //Coleção de normas
        async saveCollection(item){
            const loginStore = useLoginStore()
            this.load = true
            const doc = { ...item, dateCreated: Date.now(), created_by: loginStore.readLogin.cpf }
            const findDoc = this.collection.find(x => x.title == doc.title)

            if(findDoc) {
                console.log("Já existe uma colleção com o mesmo nome.");
                return
            }

            try {
                const resp = await api.post('collection/_doc', doc)
                this.collection.push({id: resp.data._id, ...doc})
            } catch (error) {
                console.log('erro ao salvar a colecao');
            } finally { 
                this.load = false
            }           
        },
        async editCollection(item){
            this.loadLocal = true
            const objeto = (({ id, ...rest }) => rest)(item)

            if (item.publish) {
                const isExistEmbedding = await this.isEmbeddingExist(item.id)
                if(!isExistEmbedding) this.saveEmbbedings(item);
            }

            try {
                const response = await api.post(`collection/_doc/${item.id}`, objeto)
                this.collection = this.collection.filter(x =>
                    x.id != item.id ? {...item } : x
                )
                if(!item.active) this.totalCollection--
            } catch (error) {
                console.log('erro ao editar collection');
            } finally {
                this.loadLocal = false
            }
        },
        async isEmbeddingExist(id){
            try {
                const response = await api.post('document_embeddings/_search', {
                    query:{
                        match:{
                            id: id
                        }
                    }
                })
                const resp = response.data.hits.total.value
                return resp
            } catch (error) {
                console.log('Erro ao verificar a existencia do embedding',);
            }
        },
        async saveEmbbedings(item){
           this.loadSaveEmbbedings = true
            const ids =item.laws.map(x => x.id)
            try {
                const resp = await apiChat.post('save-collection-embeddings', {
                    ids: ids,
                    title: item.title,
                    id: item.id
                })
                if(resp.data){
                    console.log('Embedding criado com sucesso', resp.data);
                    this.loadSaveEmbbedings = false
                }
                return resp.data
            } catch (error) {
                console.log('erro ao criar embeddings');
            }
        },
        async getCollection(){
            const loginStore = useLoginStore()
            if(!loginStore.readLogin?.cpf){
                return
            }
            try {
                this.load = true
                this.collection = []
                const response = await api.post('collection/_search', {
                    from: this.pagination.start -1,
                    size: this.pagination.perPage,
                    query:{
                        bool:{
                            must:[
                                {
                                    "match":{
                                        created_by: loginStore.readLogin.cpf
                                    }
                                },
                                {
                                    "term": {
                                        "active": true
                                    }
                                },
                            ]
                        }
                    }
                })
                const resp = response.data.hits.hits
                this.collection = resp.map( x => ({id: x._id, ...x._source}))
                this.totalCollection = response.data.hits.total.value

            } catch (error) {
                
            } finally{
                this.load = false
            }
        },
        //Miscelênia
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