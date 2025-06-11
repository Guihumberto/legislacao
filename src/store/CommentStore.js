import { defineStore } from "pinia";

import api from "@/services/api"

import { useLoginStore } from "@/store/LoginStore";
import { useForumStore } from "@/store/ForumStore";
import { useSnackStore } from "./snackStore";

export const useCommentStore = defineStore("commentStore", {
    state: () => ({
        listVotos: [],
        load: false,
        comments: [],
        pagination:{
            start: 1,
            total: 0,
            page: 1,
            perPage: 10
        },
        userComments: [],
        listUsers: [],
        listArts: [],
        totalComments: 0,
        totalCommentsUser: 0
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
        },
        readUsersComments(){
            return this.userComments
        },
        readListUsers(){
            const loginStore = useLoginStore()
            return loginStore.readListUsers
        },
        readListArts(){
            return this.listArts
        },
        readTotalComments(){
            return this.totalComments
        },
        readTotalCommentsUser(){
            return this.totalCommentsUser
        },
        apenasmeusComentarios(){
            return this.readTotalComments == this.readTotalCommentsUser
            ? true
            : false
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
            const snackStore = useSnackStore()
            const forumStore = useForumStore()
            const loginStore = await useLoginStore()
            const cpf = loginStore.readLogin?.cpf || null
            if(!cpf) return

            if(!forumStore.readIsComment){
                snackStore.activeSnack('Edição não foi salva. Necessário ser participante do grupo para salvar edição.', 'error')
                return
            }

            try {
                const resp = await api.post(`law_forum/_update/${item.id}`, {
                    "doc":{
                        textlaw: item.textlaw,
                        last_date_update: this.formatDate
                    }
                })
                forumStore.dispositivosEditsAcumuulados(item)
                // snackStore.activeSnack('Dispositivo editado com sucesso!', 'success')
            } catch (error) {
                console.log('error save dispositivo');
                snackStore.activeSnack('Não foi possível salvar alteração.', 'error')
            }
        },
        async getAllCommnetsLawMore(id, search = {}, sortComments = null){
            const loginStore = await useLoginStore()
            const cpf = loginStore.readLogin?.cpf || null
            if(!cpf) return

            let mustClauses = [];

            if(id){
                mustClauses.push({
                    term: { idGroup: id }
               });
            }

            if(search?.listCpfs?.length){
                mustClauses.push({
                   terms: { created_by: search.listCpfs }
               });
            }

            if(search?.listArts?.length){
                mustClauses.push({
                   terms: { art: search.listArts }
               });
            }

            let sortClauses = [];
            
            sortClauses.push(sortComments);

            try {
                this.load = true
                const resp = await api.post('comments/_search', {
                    from: this.pagination.start -1 + this.readComments.length,
                    size: this.pagination.perPage,
                    query: {
                        bool: {
                            must: mustClauses.length > 0 ? mustClauses : [{ match_all: {} }]
                        }
                    },
                    sort: sortClauses
                })
                const newsComments = resp.data.hits.hits.map( x => ({ id: x._id, ...x._source }))
                this.comments = [...this.comments, ...newsComments]
            
            } catch (error) {
                console.log('error get comments 2');
            } finally {
                this.load = false
            }
        },
        async getUsersCommentsLaw(id){
            try {
                const resp = await api.post('comments/_search', {
                    size: 0,
                    "query": {
                        "match": {
                            "idGroup": id
                        }
                    },
                    "aggs": {
                        "by_user": {
                            "terms": {
                                "field": "created_by",
                                "size": 100
                            }
                        }
                    }
                })

                const response = resp.data.aggregations.by_user.buckets
                this.userComments = response
                return response 

            } catch (error) {
                console.log('error get users comments');
            }
        },
        async getList(id, order){
            await this.getAllCommnetsLaw(id, null, order)
            await this.getListUsers(id)
            await this.getListArts(id)
            this.totasisCommentssLaw(id)
        },
        async getAllCommnetsLaw(id, search = {}, sortComments = null){
            const loginStore = await useLoginStore()
            const cpf = loginStore.readLogin?.cpf || null
            if(!cpf) return

            let mustClauses = [];

            if(id){
                mustClauses.push({
                    term: { idGroup: id }
               });
            }

            if(search?.listCpfs?.length){
                mustClauses.push({
                   terms: { created_by: search.listCpfs }
               });
            }

            if(search?.listArts?.length){
                mustClauses.push({
                   terms: { art: search.listArts }
               });
            }

            let sortClauses = [];
            
            sortClauses.push(sortComments);

            try {
                this.load = true
                const resp = await api.post('comments/_search', {
                    from: this.pagination.start -1,
                    size: this.pagination.perPage,
                    query: {
                        bool: {
                            must: mustClauses.length > 0 ? mustClauses : [{ match_all: {} }]
                        }
                    },
                    sort: sortClauses
                })
                this.comments = resp.data.hits.hits.map( x => ({ id: x._id, ...x._source }))
                this.pagination.total = resp.data.hits.total.value
            } catch (error) {
                console.log('error get comments 1');
            } finally {
                this.load = false
            }
        },
        async getListUsers(id){
            const loginStore = useLoginStore()
            try {
                const resp = await api.post('comments/_search', {
                    size: 0,
                    "query": {
                        "match": {
                            "idGroup": id
                        }
                    },
                    "aggs": {
                        "by_users": {
                            "terms": {
                                "field": "created_by",
                                "size": 100
                            }
                        }
                    }
                })
                this.listUsers =  resp.data.aggregations.by_users.buckets

                const list = {
                    listCpf: this.listUsers.map( x => x.key)
                }
                
                await loginStore.searchUsers(list)

            } catch (error) {
                console.log('error getlist users');
            }
        },
        async getListArts(id){
            try {
                const resp = await api.post('comments/_search', {
                    size: 0,
                    "query": {
                        "match": {
                            "idGroup": id
                        }
                    },
                    "aggs": {
                        "by_arts": {
                            "terms": {
                                "field": "art",
                                "size": 100
                            }
                        }
                    }
                })
                this.listArts =  resp.data.aggregations.by_arts.buckets
            } catch (error) {
                console.log('error getlist users');
            }
        },
        async totasisCommentssLaw(item){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            try {
                const resp = await api.post('comments/_search', {
                    size: 0,
                    query:{
                        match:{
                            idGroup: item
                        }
                    }
                })

                this.totalComments = resp.data.hits.total.value
                const respUser = await api.post('comments/_search', {
                    size: 0,
                    query:{
                        bool:{
                            must:[
                                {
                                    match:{
                                        idGroup: item
                                    }
                                },
                                {
                                    match:{
                                        created_by: cpf
                                    }
                                }
                            ]
                        }
                    }
                })

                this.totalCommentsUser = respUser.data.hits.total.value
            } catch (error) {
                console.log('error totais questoes law');
            }
        },
    }
})