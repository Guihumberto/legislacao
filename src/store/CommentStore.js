import { defineStore } from "pinia";

import api from "@/services/api"

import { useLoginStore } from "@/store/LoginStore";
import { useForumStore } from "@/store/ForumStore";
import { useSnackStore } from "./snackStore";

export const useCommentStore = defineStore("commentStore", {
    state: () => ({
        listVotos: [],
        load: false,
        comments: []
    }),
    getters: {
        readListVotos(){
            return this.listVotos
        },
        readLoad(){
            return this.load
        },
        formatDate(){
            const now = new Date();
            
            const day = String(now.getDate()).padStart(2, '0');  // Garante 2 dígitos para o dia
            const month = String(now.getMonth() + 1).padStart(2, '0');  // Meses começam em 0, então somamos 1
            const year = now.getFullYear();
            
            const hours = String(now.getHours()).padStart(2, '0');  // Garante 2 dígitos para a hora
            const minutes = String(now.getMinutes()).padStart(2, '0');  // Garante 2 dígitos para os minutos
            
            return `${day}-${month}-${year} ${hours}:${minutes}`;
        },
        readComments(){
            return this.comments
        }
    },
    actions:{
        async getVotoComment(item){
            const loginStore = await useLoginStore()
            const cpf = loginStore.readLogin?.cpf || null
            if(!cpf) return

            try {
                const resp = await api.post('avaliacao_comment/_search', {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "userId": cpf
                                    }
                                },
                                {
                                    "term": {
                                        "idGroup": item._id
                                    }
                                }
                            ]
                        }
                    }
                })

                const response = resp.data.hits.hits
                this.listVotos = response.map( x => ({ id: x._id, ...x._source }))

            } catch (error) {
                console.log('error get voto');
            }
        },
        async saveVotoComment(item, tipo){
            const loginStore = await useLoginStore()
            const cpf = loginStore.readLogin?.cpf || null
            if(!cpf) return
            const id = item.id + cpf

            const objeto = {
                userId: cpf,
                commentId: item.id,
                idGroup: item.idGroup,
                art: item.art,
                type: tipo,
                date_last_voto: this.formatDate
            }

            try {
                const resp = await api.put(`avaliacao_comment/_doc/${id}`, objeto)
                this.listVotos.push({id: resp.data._id, ...objeto})
                this.updatePontos(item)
                return resp.data
            } catch (error) {
                console.log('error save voto');
            }
        },
        async deleteVotoComment(id, item){
            const loginStore = await useLoginStore()
            const cpf = loginStore.readLogin?.cpf || null
            if(!cpf) return
            try {
                const resp = await api.delete(`avaliacao_comment/_doc/${id}`)
                this.listVotos = this.listVotos.filter( x => x.id !== id)
                this.updatePontos(item)
            } catch (error) {
                console.log('error delete voto');
            }
        },
        async updatePontos(item){
            const loginStore = await useLoginStore()
            const cpf = loginStore.readLogin?.cpf || null
            if(!cpf) return

            try {
                const resp = await api.post(`comments/_update/${item.id}`, {
                    "doc":{
                        pontos: item.pontos
                    }
                })
                console.log('update pontos ok');
            } catch (error) {
                console.log('error update pontos');
            }
        },
        async saveDispositivoEdit(item){
            const loginStore = await useLoginStore()
            const cpf = loginStore.readLogin?.cpf || null
            if(!cpf) return
            try {
                const resp = await api.post(`law_forum/_update/${item.id}`, {
                    "doc":{
                        textlaw: item.textlaw,
                        last_date_update: this.formatDate
                    }
                })
                console.log('salvo');
            } catch (error) {
                console.log('error save dispositivo');
            }
        },
        async getAllCommnetsLaw(){
            const loginStore = await useLoginStore()
            const cpf = loginStore.readLogin?.cpf || null
            if(!cpf) return
            try {
                const resp = await api.get('comments/_search')
                this.comments = resp.data.hits.hits.map( x => ({ id: x._id, ...x._source }))
            } catch (error) {
                console.log('error get comments');
            }
        }
    }
})