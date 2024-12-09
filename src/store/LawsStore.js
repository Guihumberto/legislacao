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
            text: '2024',
            tipo: ['leis-estaduais', 'portarias'],
            ano: [2024],
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
        async getLawsAdmConfig(){
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
                                        "tipo": this.search.tipo
                                    }
                                },
                                {
                                    "terms": {
                                        "ano": this.search.ano
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
        searchform(item){
            this.search.text = item.text
            this.getLawsAdmConfig()
        }
    }
})