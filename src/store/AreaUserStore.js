import { defineStore } from "pinia";

import api from "@/services/api"
import { useLoginStore } from "./LoginStore";
import { useGeneralStore } from "./GeneralStore";

export const useUserAreaStore = defineStore("userAreaStoe", {
    state: () => ({
        favoritos: [],
        historico: [],
        documentos: [],
        collection: [],
        load: false,
        temp: {},
        pagination:{
            page: 1, 
            start: 1, 
            end: 15,
            perPage: 15
        },
        totalHistorico: 0,
        loadHistorico: false,
    }),
    getters: {
        readFavoritos(){
            return this.favoritos.filter( x => x.fav)
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
        async getAllFavoritos(){
            const loginStore = useLoginStore()
            try {
                this.load = true
                this.favoritos = []
                const response = await api.post('favorites/_search', {
                    query:{
                        match:{
                            created_by: loginStore.readLogin.cpf
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
                    doc_update.fav = !doc_update.fav
                    const resp = await api.post(`favorites/_doc/${isFavExist[0]._id}`, doc_update) 
                    const updatedData = this.favoritos.map(x =>
                        x.id === doc_update.id ? {...doc_update } : x
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
                const response = await api.post('favorites/_search/', {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "id": item.id
                                    }
                                },
                                {
                                    "term": {
                                        "created_by": loginStore.readLogin.cpf
                                    }
                                }
                            ]
                        }
                    }
                })
                return response.data.hits.hits
            } catch (error) {
                console.log('erro procura isfav');
            }
        },
        async editFav(item){
            this.load = true
            const objeto = (({ id, ...rest }) => rest)(item);
            try {
                const response = await api.post(`favorites/_doc/${item.id}`, objeto)
                const updatedData = this.favoritos.map(x =>
                    x.id === item.id ? {...item } : x
                );
            } catch (error) {
                console.log('erro ao editar favorito');
            } finally {
                this.load = false
            }
        },
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
                        text: x.text_search,
                        years: x.years,
                        fonte: x.sources,
                        termo: x.termos,
                        precision: x.precision
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
                this.documentos.push(doc)
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
                const updatedData = this.documentos.map(x =>
                    x.id === item.id ? {...item } : x
                );
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
                    query:{
                        match:{
                            created_by: loginStore.readLogin.cpf
                        }
                    }
                })
                const resp = response.data.hits.hits
                this.documentos = resp.map( x => ({id: x._id, ...x._source}))

            } catch (error) {
                console.log('erro ao recuperar a pilha de documentos');
            } finally{
                this.load = false
            }
        },
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
                this.collection.push(doc)
            } catch (error) {
                console.log('erro ao salvar a colecao');
            } finally { 
                this.load = false
            }           
        },
        async editCollection(item){
            this.load = true
            const objeto = (({ id, ...rest }) => rest)(item);
            try {
                const response = await api.post(`collection/_doc/${item.id}`, objeto)
                const updatedData = this.collection.map(x =>
                    x.id === item.id ? {...item } : x
                );
            } catch (error) {
                console.log('erro ao editar collection');
            } finally {
                this.load = false
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
                    query:{
                        match:{
                            created_by: loginStore.readLogin.cpf
                        }
                    }
                })
                const resp = response.data.hits.hits
                this.collection = resp.map( x => ({id: x._id, ...x._source}))

            } catch (error) {
                
            } finally{
                this.load = false
            }
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