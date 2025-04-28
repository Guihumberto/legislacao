import { defineStore } from "pinia";
import { useLoginStore } from "./LoginStore";

import api from "@/services/api";

export const useHistoryStore = defineStore("history", {
    state: () => ({
        historico: [],
        aggsHistory: [],
        load: false, 
        pagination:{
            page: 1, 
            start: 0, 
            end: 10,
            perPage: 15
        },
    }),
    getters: {
        readHistorico(){
            return this.historico
        },
        readAggsHistory(){
            return this.aggsHistory
        },
        readLoad(){
            return this.load
        }
    },
    actions:{
        async getHistoryAggs(){
            try {
                this.load = true

                const resp = await api.post('searchs_todo/_search', {
                    size: 0,
                    "query": {
                        "match_all": {} // Garante que a busca é válida
                    },
                    "aggs": {
                        "by_hist": {
                            "terms": {
                                "field": "text_search.keyword",
                                "size": 10
                            }
                        }
                    }
                })
                const response = resp.data.aggregations.by_hist.buckets
                this.aggsHistory = response.map(x => x.key)

                console.log('resposen aggs', resp);

            } catch (error) {
                console.log('error get history by_hist', error);
            } finally {
                this.load = false
            }
        },
        async removeAll(){
            console.log('teste');
            const loginStore = useLoginStore()
            if(!loginStore.readLogin.cpf) return
            this.load = true
            try {
                const resp = await api.post('searchs_todo/_update_by_query', {
                    "script": {
                        source: 'ctx._source.usuario = params.novo_usuario',
                        lang: 'painless',
                        params: {
                          novo_usuario: '' 
                        }
                    },
                    "query":{
                        match:{
                            usuario: loginStore.readLogin.cpf
                        }
                    }
                })
                console.log('remove all ok');
            } catch (error) {
                console.log('erro remove all historico');
            } finally {
                this.load = false
            }
        },
        async removeItem(item){
            try {
                this.load = true
                const response = await api.post(`searchs_todo/_update/${item.id}`, {
                    "doc":{
                        usuario: null
                    }
                })
            } catch (error) {
                console.log('Erro ao remover historico',);
            } finally {
                this.load = false
            }
        }
    }
})