import { defineStore } from "pinia";

import api from "@/services/api"
import { useLoginStore } from "./LoginStore";
import { cat } from "stopword";
import { query } from "firebase/firestore";

export const useLawStore = defineStore("Law", {
    state: () => ({
        listAllLaws: [],
        load: false,
        loadSearch: false,
        totalLaws: 0,
        nroLaws: 1500,
        pagination:{
            page: 1, 
            start: 1, 
            end: 15,
            perPage: 15
        },
        lawsListConfigAdm: [],
        totalLawsListConfigAdm: 0,
        search:{
            text: '',
            fonte: [],
            years: [],
            sigiloso: false, 
            revogado: false,
            eficaz: true
        },
        main_laws: [],
        lawsAggs: [],
        results: []
    }),
    getters: {
        readListAllLaws(){
            return this.listAllLaws
        },
        readLoad(){
            return this.load
        },
        readLoadSearch(){
            return this.loadSearch
        },
        readTotalLaws(){
            return this.totalLaws
        },
        readLawsListConfigAdm(){
            return this.lawsListConfigAdm
        },
        readTotalLawsAdmConfig(){
            return this.totalLawsListConfigAdm
        },
        readTotalPagesLawsAdmConfig(){
            return Math.ceil(this.readTotalLawsAdmConfig/this.pagination.perPage) 
        },
        readMainLaws(){
            return this.main_laws
        },
        readLawsAggs(){
            return this.lawsAggs
        },
        readResults(){
            return this.results.hits
        },
        readResultsLaw(){
            return this.results
        }
    },
    actions:{
        async getLawsAggs(){
            const response = await api.post("laws_v3/_search", {
                "aggs": {
                    "by_tipys": {
                    "terms": {
                        "field": "tipo",
                        "size": 100
                    }
                    }
                }
            })
            this.lawsAggs = response.data.aggregations.by_tipys.buckets;
        },
        async getAllLaw(){
            try {
                this.load = true
                const response = await api.post("laws_v3/_search", {
                    from: 0,
                    size: this.nroLaws,
                    query:{
                        terms:{
                            ano: [2025, 2024, 2023]
                        }
                    }
                })
                this.listAllLaws = response.data.hits.hits
                this.totalLaws = response.data.hits.total.value
            } catch (error) {
                console.log("error getAllLaw");
            }finally{
                this.load = false
            }
        },
        async getAllLaw2(){
            try {
                this.load = true
                const response = await api.post("laws_v3/_search", {
                    from: 0,
                    size: this.nroLaws
                })
                this.listAllLaws = response.data.hits.hits
                this.totalLaws = response.data.hits.total.value
            } catch (error) {
                console.log("error getAllLaw");
            }finally{
                this.load = false
            }
        },
        async getLastLawsAdd(search = false){

            let mustClauses = [];

            if(search?.tipo || search?.ano){
                if(search?.tipo && search?.ano == 'null'){
                    mustClauses.push({
                        term: { tipo: search.tipo }
                   });
                }
    
                if(search?.ano && !search?.tipo == 'null'){
                    mustClauses.push({
                        term: { ano: search.ano }
                    });
                }
    
                if(search?.tipo != 'null' && search?.ano != 'null'){
                    mustClauses.push({
                        term: { tipo: search.tipo }
                    });
                    mustClauses.push({
                        term: { ano: search.ano }
                    });
                }
                if(search?.tipo == 'null' && search?.ano == 'null') mustClauses = [];
            }

            try {
                this.load = true
                const response = await api.post("laws_v3/_search", {
                  size: 10,
                  query: {
                    bool: {
                        must: mustClauses.length > 0 ? mustClauses : [{ match_all: {} }]
                    }
                  },
                  sort: [
                    {
                      _doc: {
                        order: "desc", // Ordena pelos IDs em ordem decrescente
                      },
                    },
                  ],
                  })
                return response.data.hits.hits

            } catch (error) {
                console.log("error");
            }finally{
                this.load = false
            }
        },
        changeNroLaws(){
            this.nroLaws = 4000
            this.getAllLaw2()
        },
        searchform(item){
            if(item.fav_law){
                const laws = this.readMainLaws.map(x => x.id)
                this.getJustMainLaws(laws)
                return
            }
            this.search = { ...item }
            if(!this.search.text && !this.search.fonte.length && !this.search.years.length){
                this.initSearch()
                this.search.revogado = item.revogado
                this.search.sigiloso = item.sigiloso
                this.search.eficaz = item.eficaz
                this.getLawsAdmConfig()
                return
            } 
            if(this.search.text && !this.search.fonte.length && !this.search.years.length) this.getLawsAdmConfig1()
            if(this.search.text && this.search.fonte.length && this.search.years.length) this.getLawsAdmConfig2()
            if(this.search.text && this.search.fonte.length && !this.search.years.length) this.getLawsAdmConfig3()
            if(this.search.text && !this.search.fonte.length && this.search.years.length) this.getLawsAdmConfig4()
            if(!this.search.text && this.search.fonte.length && this.search.years.length) this.getLawsAdmConfig5()
            if(!this.search.text && !this.search.fonte.length && this.search.years.length) this.getLawsAdmConfig6()
            if(!this.search.text && this.search.fonte.length && !this.search.years.length) this.getLawsAdmConfig7()
        },
        searchDirecPagination(){
            if(!this.search.text && !this.search.fonte.length && !this.search.years.length) this.getLawsAdmConfig()
                
            if(this.search.text && !this.search.fonte.length && !this.search.years.length) this.getLawsAdmConfig1()
            if(this.search.text && this.search.fonte.length && this.search.years.length) this.getLawsAdmConfig2()
            if(this.search.text && this.search.fonte.length && !this.search.years.length) this.getLawsAdmConfig3()
            if(this.search.text && !this.search.fonte.length && this.search.years.length) this.getLawsAdmConfig4()
            if(!this.search.text && this.search.fonte.length && this.search.years.length) this.getLawsAdmConfig5()
            if(!this.search.text && !this.search.fonte.length && this.search.years.length) this.getLawsAdmConfig6()
            if(!this.search.text && this.search.fonte.length && !this.search.years.length) this.getLawsAdmConfig7()
            
        },
        async getLawsSelected(ids){
            try {
                this.load = true
                const response = await api.post("laws_v3/_search", {
                    from: 0,
                    size: 5000,
                    query: {
                        "bool": {
                            "must": [
                                {
                                    "terms": {
                                        "id": ids
                                    }
                                },
                            ]
                        }
                    }
                })

                return {
                    data: response.data.hits.hits,
                    total: response.data.hits.total.value
                } 
            } catch (error) {
                console.log('error laws selected');
            } finally {
                this.load = false
            }
        },
        async getJustMainLaws(items){
            try {
                this.load = true
                const response = await api.post("laws_v3/_search", {
                    from: this.pagination.page * this.pagination.start - 1,
                    size: this.pagination.perPage,
                    query: {
                        "bool": {
                            "must": [
                                {
                                    "terms": {
                                        "id": items
                                    }
                                }
                            ]
                        }
                    }
                })
                this.lawsListConfigAdm = response.data.hits.hits
                this.totalLawsListConfigAdm = response.data.hits.total.value
            } catch (error) {
                console.log("error get main laws admin");
            }finally{
                this.load = false
            }
        },
        async getLawsAdmConfig(){
            try {
                this.load = true
                const response = await api.post("laws_v3/_search", {
                    from:  this.pagination.page * this.pagination.perPage - this.pagination.perPage,
                    size: this.pagination.perPage,
                    query: {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "revogado": this.search.revogado
                                    }
                                },
                                {
                                    "term": {
                                        "sigiloso": this.search.sigiloso
                                    }
                                }
                            ]
                        }
                    }
                })
                this.lawsListConfigAdm = response.data.hits.hits
                this.totalLawsListConfigAdm = response.data.hits.total.value
            } catch (error) {
                console.log("error getAllLaw main");
            }finally{
                this.load = false
            }
        },
        async getLawsAdmConfig1(){
            console.log('teste 1');
            try {
                this.load = true
                const response = await api.post("laws_v3/_search", {
                    from:  this.pagination.page * this.pagination.perPage - this.pagination.perPage,
                    size: this.pagination.perPage,
                    query: {
                        "bool": {
                            "must": [
                                {
                                    "match": {
                                        "title": this.search.text
                                    }
                                },
                                {
                                    "term": {
                                        "revogado": this.search.revogado
                                    }
                                },
                                {
                                    "term": {
                                        "sigiloso": this.search.sigiloso
                                    }
                                }
                            ]
                        }
                    }
                })
                this.lawsListConfigAdm = response.data.hits.hits
                this.totalLawsListConfigAdm = response.data.hits.total.value
            } catch (error) {
                console.log("error getAllLaw");
            }finally{
                this.load = false
            }
        },
        async getLawsAdmConfig2(){
            try {
                this.load = true
                const response = await api.post("laws_v3/_search", {
                    from:  this.pagination.page * this.pagination.perPage - this.pagination.perPage,
                    size: this.pagination.perPage,
                    query: {
                        "bool": {
                            "must": [
                                {
                                    "match": {
                                        "title": this.search.text
                                    }
                                },
                                {
                                    "terms": {
                                        "tipo": this.search.fonte
                                    }
                                },
                                {
                                    "terms": {
                                        "ano": this.search.years
                                    }
                                },
                                {
                                    "term": {
                                        "revogado": this.search.revogado
                                    }
                                },
                                {
                                    "term": {
                                        "sigiloso": this.search.sigiloso
                                    }
                                }
                            ]
                        }
                    }
                })
                this.lawsListConfigAdm = response.data.hits.hits
                this.totalLawsListConfigAdm = response.data.hits.total.value
            } catch (error) {
                console.log("error getAllLaw");
            }finally{
                this.load = false
            }
        },
        async getLawsAdmConfig3(){
            console.log('teste 3');
            try {
                this.load = true
                const response = await api.post("laws_v3/_search", {
                    from:  this.pagination.page * this.pagination.perPage - this.pagination.perPage,
                    size: this.pagination.perPage,
                    query: {
                        "bool": {
                            "must": [
                                {
                                    "match": {
                                        "title": this.search.text
                                    }
                                },
                                {
                                    "terms": {
                                        "tipo": this.search.fonte
                                    }
                                },
                                {
                                    "term": {
                                        "revogado": this.search.revogado
                                    }
                                },
                                {
                                    "term": {
                                        "sigiloso": this.search.sigiloso
                                    }
                                }
                            ]
                        }
                    }
                })
                this.lawsListConfigAdm = response.data.hits.hits
                this.totalLawsListConfigAdm = response.data.hits.total.value
            } catch (error) {
                console.log("error getAllLaw");
            }finally{
                this.load = false
            }
        },
        async getLawsAdmConfig4(){
            console.log('teste 4');
            try {
                this.load = true
                const response = await api.post("laws_v3/_search", {
                    from:  this.pagination.page * this.pagination.perPage - this.pagination.perPage,
                    size: this.pagination.perPage,
                    query: {
                        "bool": {
                            "must": [
                                {
                                    "match": {
                                        "title": this.search.text
                                    }
                                },
                                {
                                    "terms": {
                                        "ano": this.search.years
                                    }
                                },
                                {
                                    "term": {
                                        "revogado": this.search.revogado
                                    }
                                },
                                {
                                    "term": {
                                        "sigiloso": this.search.sigiloso
                                    }
                                }
                            ]
                        }
                    }
                })
                this.lawsListConfigAdm = response.data.hits.hits
                this.totalLawsListConfigAdm = response.data.hits.total.value
            } catch (error) {
                console.log("error getAllLaw");
            }finally{
                this.load = false
            }
        },
        async getLawsAdmConfig5(){
            console.log('teste 2');
            try {
                this.load = true
                const response = await api.post("laws_v3/_search", {
                    from:  this.pagination.page * this.pagination.perPage - this.pagination.perPage,
                    size: this.pagination.perPage,
                    query: {
                        "bool": {
                            "must": [
                                {
                                    "terms": {
                                        "tipo": this.search.fonte
                                    }
                                },
                                {
                                    "terms": {
                                        "ano": this.search.years
                                    }
                                },
                                {
                                    "term": {
                                        "revogado": this.search.revogado
                                    }
                                },
                                {
                                    "term": {
                                        "sigiloso": this.search.sigiloso
                                    }
                                }
                            ]
                        }
                    }
                })
                this.lawsListConfigAdm = response.data.hits.hits
                this.totalLawsListConfigAdm = response.data.hits.total.value
            } catch (error) {
                console.log("error getAllLaw");
            }finally{
                this.load = false
            }
        },
        async getLawsAdmConfig6(){
            console.log('teste 2');
            try {
                this.load = true
                const response = await api.post("laws_v3/_search", {
                    from:  this.pagination.page * this.pagination.perPage - this.pagination.perPage,
                    size: this.pagination.perPage,
                    query: {
                        "bool": {
                            "must": [
                                {
                                    "terms": {
                                        "ano": this.search.years
                                    }
                                },
                                {
                                    "term": {
                                        "revogado": this.search.revogado
                                    }
                                },
                                {
                                    "term": {
                                        "sigiloso": this.search.sigiloso
                                    }
                                }
                            ]
                        }
                    }
                })
                this.lawsListConfigAdm = response.data.hits.hits
                this.totalLawsListConfigAdm = response.data.hits.total.value
            } catch (error) {
                console.log("error getAllLaw");
            }finally{
                this.load = false
            }
        },
        async getLawsAdmConfig7(){
            console.log('teste 2');
            try {
                this.load = true
                const response = await api.post("laws_v3/_search", {
                    from:  this.pagination.page * this.pagination.perPage - this.pagination.perPage,
                    size: this.pagination.perPage,
                    query: {
                        "bool": {
                            "must": [
                                {
                                    "terms": {
                                        "tipo": this.search.fonte
                                    }
                                },
                                {
                                    "term": {
                                        "revogado": this.search.revogado
                                    }
                                },
                                {
                                    "term": {
                                        "sigiloso": this.search.sigiloso
                                    }
                                }
                            ]
                        }
                    }
                })
                this.lawsListConfigAdm = response.data.hits.hits
                this.totalLawsListConfigAdm = response.data.hits.total.value
            } catch (error) {
                console.log("error getAllLaw");
            }finally{
                this.load = false
            }
        },
        async getSearchPorlei(item){
            const search = { ...item}
            search.text = this.removerAcentos(item.text)

            if(item.text && !item.fonte.length && !item.years.length){
                const resp = await this.getSearchPorlei1(search)
                return resp
            } 
            if(item.text && item.fonte.length && item.years.length){
                const resp = await this.getSearchPorlei2(search)
                return resp
            } 
            if(item.text && item.fonte.length && !item.years.length){
                const resp = await this.getSearchPorlei3(search)
                return resp
            } 
            if(item.text && !item.fonte.length && item.years.length){
                const resp = await this.getSearchPorlei4(search)
                return resp
            } 
            if(!item.text && item.fonte.length && item.years.length){
                const resp = await this.getSearchPorlei5(search)
                return resp
            } 
        },
        async getSearchPorlei1(item){
            this.loadSearch = true
            try {
                const response = await api.post("laws_v3/_search", {
                    from: this.pagination.page * this.pagination.start - 1,
                    size: this.pagination.perPage,
                    query:{
                        multi_match:{
                            "query": item.text,
                            "fields":[
                                "title^2",
                                "description_norm^1",
                                "tipo"
                            ],
                            "type": "cross_fields"
                        }
                    }
                })
                this.lawsListConfigAdm = response.data.hits.hits
                this.totalLawsListConfigAdm = response.data.hits.total.value
                return response.data.hits;
            } catch (error) {
                console.log("erro searchForLaw");
            } finally{
                this.loadSearch = false
            }
        },
        async getSearchPorlei2(item){
            this.loadSearch = true
            try {
                const response = await api.post("laws_v3/_search", {
                    from: this.pagination.page * this.pagination.start - 1,
                    size: this.pagination.perPage,
                    query: {
                        "bool": {
                            "must": [
                                {
                                    "multi_match":{
                                        "query": item.text,
                                        "fields":[
                                            "title^2",
                                            "description_norm^1",
                                            "tipo"
                                        ],
                                        "type": "cross_fields"
                                    }
                                },
                                {
                                    "terms": {
                                        "tipo": item.fonte
                                    }
                                },
                                {
                                    "terms": {
                                        "ano": item.years
                                    }
                                }
                            ]
                        }
                    }
                })
                this.lawsListConfigAdm = response.data.hits.hits
                this.totalLawsListConfigAdm = response.data.hits.total.value
                return response.data.hits;
            } catch (error) {
                console.log("error searchlaw");
            }finally{
                this.loadSearch = false
            }
        },
        async getSearchPorlei3(item){
            this.loadSearch = true
            try {
                const response = await api.post("laws_v3/_search", {
                    from: this.pagination.page * this.pagination.start - 1,
                    size: this.pagination.perPage,
                    query: {
                        "bool": {
                            "must": [
                                {
                                    "multi_match":{
                                        "query": item.text,
                                        "fields":[
                                            "title^2",
                                            "description_norm^1",
                                            "tipo"
                                        ],
                                        "type": "cross_fields"
                                    }
                                },
                                {
                                    "terms": {
                                        "tipo": item.fonte
                                    }
                                }
                            ]
                        }
                    }
                })
                this.lawsListConfigAdm = response.data.hits.hits
                this.totalLawsListConfigAdm = response.data.hits.total.value
                return response.data.hits;
            } catch (error) {
                console.log("error searchlaw");
            }finally{
                this.loadSearch = false
            }
        },
        async getSearchPorlei4(item){
            this.loadSearch = true
            try {
                const response = await api.post("laws_v3/_search", {
                    from: this.pagination.page * this.pagination.start - 1,
                    size: this.pagination.perPage,
                    query: {
                        "bool": {
                            "must": [
                                {
                                    "multi_match":{
                                        "query": item.text,
                                        "fields":[
                                            "title^2",
                                            "description_norm^1",
                                            "tipo"
                                        ],
                                        "type": "cross_fields"
                                    }
                                },
                                {
                                    "terms": {
                                        "ano": item.years
                                    }
                                }
                            ]
                        }
                    }
                })
                this.lawsListConfigAdm = response.data.hits.hits
                this.totalLawsListConfigAdm = response.data.hits.total.value
                return response.data.hits;
            } catch (error) {
                console.log("error searchlaw");
            }finally{
                this.loadSearch = false
            }
        },
        async getSearchPorlei5(item){
            this.loadSearch = true
            try {
                const response = await api.post("laws_v3/_search", {
                    from: this.pagination.page * this.pagination.start - 1,
                    size: this.pagination.perPage,
                    query: {
                        "bool": {
                            "must": [
                                {
                                    "terms": {
                                        "ano": item.years
                                    }
                                },
                                {
                                    "terms": {
                                        "tipo": item.fonte
                                    }
                                }
                            ]
                        }
                    }
                })
                this.lawsListConfigAdm = response.data.hits.hits
                this.totalLawsListConfigAdm = response.data.hits.total.value
                return response.data.hits;
            } catch (error) {
                console.log("error searchlaw");
            }finally{
                this.loadSearch = false
            }
        },
        async getMainLaws(){
            try {
                this.load = true
                this.main_laws = []
                const response = await api.get('main_laws/_search')
                const resp = response.data.hits.hits
                this.main_laws = resp.map(x => ({ id: x._id, ...x._source }))
            } catch (error) {
                console.log('error get main laws');
            } finally {
                this.load = false
            }
        },
        async addMainLaw(item){
            this.load = true
            const isExist = await this.isMainLawExist(item.id)

            if(isExist) {
                this.removeMainLaw(item.id)
                return
            }       

            try {
                const loginStore = useLoginStore()
                const doc = { ...item, created_by: loginStore.readLogin.cpf }
                const response = await api.post(`main_laws/_doc/${item.id}`, doc)
                this.main_laws.push({...doc})
            } catch (error) {
                console.log('erro add law');
            } finally {
                this.load = false
            }
        },
        async removeMainLaw(id){
            try {
                const response = await api.delete(`main_laws/_doc/${id}`)
                this.main_laws = this.main_laws.filter(x => x.id != id)
            } catch (error) {
                console.log("erro remove main law");
            } finally {
                this.load = false
            }
        },
        async isMainLawExist(id){
            try {
                const response = await api.get(`main_laws/_doc/${id}`)
                return response.data._id
            } catch (error) {
                console.log("erro main law exist");
            }
        },
        async deleteLaw(id){
            try {
                this.load = true
                const response = await api.post('laws_v3/_delete_by_query', {
                    "query": {
                        "match": {
                            "id": id
                        }
                    }
                })
                await this.deletePagesLaw(id)
                this.lawsListConfigAdm = this.lawsListConfigAdm.filter( x => x._source.id != id)
            } catch (error) {
                console.log('erro delete law')
            } finally {
                this.load = false
            }
        },
        async deletePagesLaw(id){
            try {
                const response = await api.post('pages_v2/_delete_by_query', {
                    "query": {
                        "match": {
                            "page_to_norma.parent": id
                        }
                    }
                })
            } catch (error) {
                console.log('erro delete law page')
            }
        },
        //search for disciplinas
        async getLawForDisciplines(id){
            this.load = true
            try {
                const response = await api.post('laws_v3/_search', {
                    query:{
                        match:{
                            disciplina: id
                        }
                    },
                    min_score: 1.0
                })
                return response.data.hits.hits.map(x => x._source)
            } catch (error) {
                console.log('erro get disciplines');
            } finally {
                this.load = false
            }
        },
        async getLawLeisFederais(){
            this.load = true
            try {
                const response = await api.post('laws_v3/_search', {
                    size: 30,
                    query:{
                        match:{
                            tipo: "leis-federais"
                        }
                    },
                    min_score: 1.0
                })
                return response.data.hits.hits.map(x => x._source)
            } catch (error) {
                console.log('erro get disciplines');
            } finally {
                this.load = false
            }
        },
        async searchLaw(search){
            try {
                const resp = await api.post('laws_v3/_search', {
                    size: 5,
                    query:{
                        bool: {
                            must: [
                                { 
                                    multi_match: { 
                                        query: search, 
                                        fields: ["title^2", "description_norm", "ano", "tipo", "disciplina" ],
                                        fuzziness: "AUTO",
                                        operator: "and"
                                    } 
                                }
                            ],
                        }
                    },
                    min_score: 1.0
                })
                return resp.data.hits.hits.map(x => x._source)
            } catch (error) {
                console.log('erro get disciplines');
            }
        },
        initSearch(){
            this.search = {
                text: '',
                fonte: [],
                years: [],
                sigiloso: false, 
                revogado: false,
                eficaz: true
            }
        },
        removerAcentos(str) {
            return str
                .normalize("NFD")         // Decomposição em caracteres base + diacríticos
                .replace(/[\u0300-\u036f]/g, ""); // Remove os diacríticos
        },
        copyResults(items){
            this.results = items
        }
    }
})