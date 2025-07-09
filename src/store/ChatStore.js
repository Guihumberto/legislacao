import { defineStore } from "pinia";
import api from "@/services/api"
import { useLoginStore } from "@/store/LoginStore";

export const useChatStore = defineStore("chatStore", {
    state: () => ({
        chat: [],
        load: false
    }),
    getters: {
        readChat(){
            return this.chat
        },
        readLoad(){
            return this.load
        }
    },
    actions:{
        async saveChat(item){
            this.load = true
            const loginStore = await useLoginStore()
            if(!loginStore.readLogin?.cpf) return

            const chat = {
                usuario: loginStore.readLogin.cpf,
                idCollection: item.idCollection,
                user: item.user,
                content: item.content,
                date: Date.now()
            }   

            try {
                const resp = await api.post('chat/_doc', chat)
            } catch (error) {
                console.log('erro save chat');
            } finally {
                this.load = false
            }
        },
        async getChat(id){
            this.load = true
            const loginStore = useLoginStore()
            if(!loginStore.readLogin?.cpf) return
            try {
                const resp = await api.post('chat/_search', {
                    from: 0,
                    size: 100,
                    query: {
                        bool: {
                            must:[
                                {
                                    "match": {
                                        usuario: loginStore.readLogin.cpf,
                                    }
                                },
                                {
                                    "match": {
                                        idCollection: id
                                    }
                                }
                            ]
                        }
                    },
                    sort: [
                        {
                            date: {
                                order: "asc"
                            },
                        }
                    ]
                })
                this.chat = resp.data.hits.hits.map(item => ({ id: item._id, ...item._source}))
            } catch (error) {
                console.log('erro get chat');
            } finally {
                this.load = false
            }
        }
    }
})