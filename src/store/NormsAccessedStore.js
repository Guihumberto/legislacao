import { defineStore } from "pinia";

import api from "@/services/api"
import { useLoginStore } from "./LoginStore";

export const useAccessedNormsStore = defineStore("accessedNorms", {
    state: () => ({
        accessced: [],
        aggsAccessed: [],
        load: false
    }),
    getters: {
        readAccessed(){
            return this.accessced
        },
        readLoad(){
            return this.load
        },
        readAggsAccessed(){
            return this.aggsAccessed
        }
    },
    actions:{
        async aggsAccessdsAllUser(){
            try {
                this.load = true

                const resp = await api.post("access_norms/_search", {
                    size: 0,
                    "query": {
                        "match_all": {}
                    },
                    "aggs": {
                        "by_access": {
                            "terms": {
                                "field": "id",
                                "size": 10
                            }
                        }
                    }
                })
                const response = resp.data.aggregations.by_access.buckets
                const pages = await this.getPageLaws(response.map(x => x.key))
                this.aggsAccessed = pages
            } catch (error) {
                console.log('error aggs normas');
            } finally {
                this.load = false
            }
        },
        async getAccessUser(ids){
            const loginStore = useLoginStore()
            if(!loginStore.readLogin?.cpf) return
            try {
                this.load = true
                const resp = await api.post('access_norms/_search', {
                    from: 0,
                    size: 20,
                    query: {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "user": loginStore.readLogin.cpf
                                    }
                                },
                                {
                                    "terms": {
                                        "id":  ids
                                    }
                                },
                            ]
                        }
                    },

                })
                this.accessced = resp.data.hits.hits.map(item => ({ id: item._id, ...item._source}))

            } catch (error) {
                console.log('error ao acessar');
            } finally {
                this.load = false
            }
        },
        async saveAccess(item, type){
            const loginStore = useLoginStore()

            const objeto = {
                id: item.id, 
                title: item.name,
                num_page: item?.num_page || null,
                type: type, //page or law,
                date_accessed: Date.now(),
                user: loginStore.readLogin?.cpf || null
            }

            try {
                this.load = true
                const res = await api.post('access_norms/_doc', objeto)
            } catch (error) {
                console.log('error ao acessar');
            } finally {
                this.load = false
            }
        },
        async getPageLaws(ids){
            try {
                const resp = await api.post('pages_v2/_search', {
                    query:{
                        terms:{
                            "_id": ids
                        }
                    }
                })
                return resp.data.hits.hits.map(item => ({ id: item._id, ...item._source}))
            } catch (error) {
                console.log('error ao get page');
            }
        }
    }
})