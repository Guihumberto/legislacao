import { defineStore } from "pinia";
import { useLoginStore } from "./LoginStore";

import api from "@/services/api";

export const useHistoryStore = defineStore("history", {
    state: () => ({
        historico: [],
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
        readLoad(){
            return this.load
        }
    },
    actions:{
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