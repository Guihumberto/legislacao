import { defineStore } from "pinia";
import api from "@/services/api"

export const useLawStore = defineStore("Law", {
    state: () => ({
        listAllLaws: [],
        load: false,
        totalLaws: 0,
        nroLaws: 500,
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
        }
    }),
    getters: {
        readListAllLaws(){
            return this.listAllLaws
        },
        readLoad(){
            return this.load
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
    },
    actions:{
        async getAllLaw(){
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
        changeNroLaws(){
            this.nroLaws = 4000
            this.getAllLaw()
        },
        searchform(item){
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
        async getLawsAdmConfig1(){
            console.log('teste 1');
            try {
                this.load = true
                const response = await api.post("laws_v3/_search", {
                    from: this.pagination.page * this.pagination.start - 1,
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
                    from: this.pagination.page * this.pagination.start - 1,
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
                    from: this.pagination.page * this.pagination.start - 1,
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
                    from: this.pagination.page * this.pagination.start - 1,
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
        async getLawsAdmConfig(){
            console.log('teste');
            try {
                this.load = true
                const response = await api.post("laws_v3/_search", {
                    from: this.pagination.page * this.pagination.start - 1,
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
                    from: this.pagination.page * this.pagination.start - 1,
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
                    from: this.pagination.page * this.pagination.start - 1,
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
                    from: this.pagination.page * this.pagination.start - 1,
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
            if(item.text && !item.fonte.length && !item.years.length){
                const resp = await this.getSearchPorlei1(item)
                return resp
            } 
            if(item.text && item.fonte.length && item.years.length){
                const resp = await this.getSearchPorlei2(item)
                return resp
            } 
            if(item.text && item.fonte.length && !item.years.length){
                const resp = await this.getSearchPorlei3(item)
                return resp
            } 
            if(item.text && !item.fonte.length && item.years.length){
                const resp = await this.getSearchPorlei4(item)
                return resp
            } 
        },
        async getSearchPorlei1(item){
            this.load = true
            try {
                const response = await api.post("laws_v3/_search", {
                    from: 0,
                    size: 5,
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
                return response.data.hits.hits;
            } catch (error) {
                console.log("erro searchForLaw");
            } finally{
                this.load = false
            }
        },
        async getSearchPorlei2(item){
            this.load = true
            try {
                const response = await api.post("laws_v3/_search", {
                    from: 0,
                    size: 5,
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
                return response.data.hits.hits;
            } catch (error) {
                console.log("error searchlaw");
            }finally{
                this.load = false
            }
        },
        async getSearchPorlei3(item){
            this.load = true
            try {
                const response = await api.post("laws_v3/_search", {
                    from: 0,
                    size: 5,
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
                return response.data.hits.hits;
            } catch (error) {
                console.log("error searchlaw");
            }finally{
                this.load = false
            }
        },
        async getSearchPorlei4(item){
            this.load = true
            try {
                const response = await api.post("laws_v3/_search", {
                    from: 0,
                    size: 5,
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
                return response.data.hits.hits;
            } catch (error) {
                console.log("error searchlaw");
            }finally{
                this.load = false
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
        }
    }
})