import { defineStore } from "pinia";

import api from "@/services/api"
import apiChat from "@/services/api_chat"

import { useLoginStore } from "@/store/LoginStore";

export const useQuestoesStore = defineStore("questoesStore", {
    state: () => ({
        questoes: [],
        load: false
    }),
    getters: {
        readQuestoes(){
            return this.questoes
        },
        readLoad(){
            return this.load
        }
    },
    actions:{
        async gerarQuestoes(item){
            this.load = true
            const loginStore = await useLoginStore()
            if(!loginStore.readLogin?.cpf) return

            const prompt = "Gere 5 questões do tipo certo/errado no estilo cespe/cebraspe, retornando o resultado como um array de objetos, com a seguinte estrutura: {pergunta: 'pergunta', resposta: 'resposta', justificativa: 'justificar citando por que ta certo ou errado'}, informando no campo resposta 'verdadeiro ou falso'"

            try {
                const resp = await apiChat.post('gerar_questoes', {
                    id_group: item.id_law,
                    id_art: item.id_art,
                    prompt
                })

                await this.getQuestoes(item)
                return resp.data

            } catch (error) {
                console.log('erro save questoes');
            } finally {
                this.load = false
            }
        },
        async getQuestoes(item){
            this.load = true
            const loginStore = useLoginStore()
            if(!loginStore.readLogin?.cpf) return
            try {
                const resp = await api.post('questoes/_search', {
                    from: 0,
                    size: 10,
                    query: {
                        bool: {
                            must:[
                                {
                                    "match": {
                                        id_law: item.id_law,
                                    }
                                },
                                {
                                    "match": {
                                        id_art: item.id_art
                                    }
                                }
                            ]
                        }
                    },
                    sort: [
                        {
                            date_created: {
                                order: "asc"
                            },
                        }
                    ]
                }
            )
                this.questoes = resp.data.hits.hits.map(item => ({ id: item._id, ...item._source}))
            } catch (error) {
                console.log('erro get questoes');
            } finally {
                this.load = false
            }
        }
    }
})