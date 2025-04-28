import { defineStore } from "pinia";
import apia from "@/services/api_semantic"
import api from '@/services/api'

import { useOrderBy } from "@/composables/orderBy";

export const useGeneralStore = defineStore("General", {
    state: () => ({
        menuSide: false,
        listSearch: [],
        req: false,
        search: {},
        periodo:[],
        aggsFonte: [],
        noShowNews: true,
        tipos:[],
        resultsSearch: [],
        semanticSearchList: [],
        areaTransferencia: [],
        load: false
    }),
    getters: {
        readListStore(){
            return this.listSearch.sort(useOrderBy('date', false))
        },
        readListReduzida(){
            const list = this.listSearch.map(x => x.text)
            const listUnique = [...new Set(list)]
            return listUnique
        },
        readReq(){
            return this.req
        },
        readSearch(){
            return this.search
        },
        readPeriodo(){
            return this.periodo
        },
        readTipos(){
            return this.tipos.sort(useOrderBy('nome', true))
        },
        readShowNews(){
            return this.noShowNews
        },
        readResultSearch(){
            return this.resultsSearch
        },
        readMenuSide(){
            return this.menuSide
        },
        readSemanticList(){
            return this.semanticSearchList
        },
        readAreaTransferencia(){
            return this.areaTransferencia
        },
        readLoad(){
            return this.load
        },
        readAggsFonte(){
            return this.aggsFonte
        },
        readTiposRestrict(){
            if(false){
                return this.tipos.filter(x => !x.restrict).sort((a, b) => a.nome > b.nome)
            } else {
                return this.tipos.sort(useOrderBy('nome', true))
            }
            
        }
    },
    actions:{
        addListSearch(item){
            if(!item?.date) item.date = Date.now()
            let search = { ...item }
            this.listSearch.unshift(search)
        },
        reqChange(item, i, search = null){
            this.req = item
            if(search){
                this.search = search
            } else {
                this.search = this.listSearch[i]
            }     
        },
        reqChangeFromSelectSearch(item, i){
            const objeto = {
                text: i,
                years: [],
                fonte: [],
                termo: 2,
                precision: false,
                assertividade:1,
                enableFuzzy:true
            }
            this.req = item
            this.search = objeto
        },
        reqChangeFromHistory(req, item){
            const objeto = {
                text: item.text_search,
                years: item.years,
                fonte: item.sources,
                termo: item.termos,
                precision: item.precision
            }
            this.req = req
            this.search = objeto
        },
        removeListSearch(item){
            this.listSearch = this.listSearch.filter(x => x.id != item)
        },
        removeAll(){
            this.listSearch = []
        },
        fonteNome(item){
            try {
                const tipo = this.tipos.find(x => x.nome == item)
                return tipo
            } catch (error) {
                console.log('erro nome-mudar');
            }
        },
        changeShowsNews(item){
            this.noShowNews = item
        },
        copyResults(items){
            this.resultsSearch = items
        },
        async semanticSearch(item){
            try {
                const response = await apia.post('blog/', { text: item })
                let resp = response.data
                this.semanticSearchList = resp
            } catch (error) {
                console.log("Ocorreu um erro na api semantic");
            }
           
        },
        copyPaste(item){
            this.areaTransferencia.push(item)
        },
        clearAreadeTransferencia(){
            this.areaTransferencia = []
        },
        removeItemAT(item){
            this.areaTransferencia.splice(item, 1)
        },
         ///aggs
        async getAllYearsLaws(){
            try {
                this.load = true
                this.periodo = []
                const resp = await api.post('laws_v3/_search', {
                    size: 0,
                    "aggs": {
                        "by_year": {
                            "terms": {
                                "field": "ano",
                                "size": 1000
                            }
                        }
                    }
                })
                const response = resp.data.aggregations.by_year.buckets
                if(response.length){
                    this.periodo = response.map(x => x.key).sort((a, b) => b - a)
                }
                
            } catch (error) {
                console.log('error aggs years');
            } finally {
                this.load = false
            }
        },
        async getAllFonteLaws(){
            try {
                this.load = true

                const resp = await api.post('laws_v3/_search', {
                    size: 0,
                    "aggs": {
                        "by_tipo": {
                            "terms": {
                                "field": "tipo",
                                "size": 100
                            }
                        }
                    }
                })
                this.aggsFonte =  resp.data.aggregations.by_tipo.buckets
                
            } catch (error) {
                console.log('error aggs tipo');
            } finally {
                this.load = false
            }
        },
        async getListFonteMudar(){
            try {
                this.load = true
                this.tipos = []
                
                const resp = await api.post('listfonte/_search', {
                    size: 1000
                })
                const response = resp.data.hits.hits

                if(response.length){
                    this.tipos = response.map(x => ({ id: x._id, ...x._source}))
                }
                
            } catch (error) {
                console.log('error aggs years');
            } finally {
                this.load = false
            }
        },
        async saveFonteMudar(item){
            const objeto = { ...item }
            try {
                this.load = true
                if(objeto?.id) {
                    const id = objeto.id
                    delete objeto.id

                    const resp = await api.post(`listfonte/_doc/${id}`, objeto)
                    console.log('editar', resp);
                    this.tipos = this.tipos.map(x =>
                        x.id === id ? {...objeto } : x
                    );
                } else {
                    const resp = await api.post('listfonte/_doc', objeto)
                    console.log('salvar', resp);
                    this.tipos.push(objeto)
                }
                
            } catch (error) {
                console.log('erro ao salvar o nome da fonte-mudar');
            } finally {
                this.load = false
            }
        }
    }
})