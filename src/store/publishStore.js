import { defineStore } from "pinia";

import api from "@/services/api"
import { useLoginStore } from "./LoginStore";

export const usePublishStore = defineStore("publish", {
    state: () => ({
        load: false,
        publicacoes: [],
        pagination:{
            page: 1, 
            start: 0, 
            end: 10,
            perPage: 10
        },
    }),
    getters: {
        readLoad(){
            return this.load
        },
        readPublicacoes(){
            return this.publicacoes
        }
    },
    actions:{
        async savePublicacoes(item){
            try {
                this.load = true
                const loginStore = useLoginStore()
                const cpf = loginStore.readLogin.cpf
                if(!cpf) return
                
                item.created_by = cpf

                const resp = await api.post('publicacoes/_doc/', item)
                console.log('salvo publish');

            } catch (error) {
                console.log('erro publish');
            } finally {
                this.load = false
            }
        },
        async getPublicacoes(){
            try {
                this.load = true
                this.publicacoes = []

                const resp = await api.post('publicacoes/_search', {
                    from: this.pagination.start,
                    size: this.pagination.perPage,
                    query: {
                        match_all: {}, // Retorna todos os documentos
                    },
                    sort: [
                        {
                          _doc: {
                            order: "desc", // Ordena pelos IDs em ordem decrescente
                          },
                        },
                    ],
                })

                const response = resp.data.hits.hits
                this.publicacoes = response.map( x => ({ idU: x._id, ...x._source  }))

            } catch (error) {
                console.log('erro get publish');
            } finally {
                this.load = false
            }
        },
        async removePublicacoes(id){
            try {
                const response = await api.delete(`publicacoes/_doc/${id}`)
                this.publicacoes = this.publicacoes.filter(x => x.idU != id)
            } catch (error) {
                console.log("erro remove list publicacoes");
            } finally {
                this.load = false
            }
        },
        async editPublicacoes(item){
            try {
                this.load = true
                const loginStore = useLoginStore()
                const cpf = loginStore.readLogin.cpf
                if(!cpf) return
                item.edit_by = cpf

                const resp = await api.post(`publicacoes/_doc/${item.idU}`, item)
                this.publicacoes = this.publicacoes.map(x =>
                    x.idU === item.idU ? {...item } : x
                );

                console.log('edit publish');

            } catch (error) {
                console.log('erro publish');
            } finally {
                this.load = false
            }
        }
    }
})