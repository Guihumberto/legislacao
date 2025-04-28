import { defineStore } from "pinia";

import api from "@/services/api"
import apiChat from "@/services/api_chat"
import { useLoginStore } from "./LoginStore";
import { usePageStore } from "./PageStore";

export const useSearchStore = defineStore("searchStore", {
    state: () => ({
        results: [],
        load: false,
        loadSaveEmbbedings: false
    }),
    getters: {
        reasResults(){
            return this.results
        },
        readLoad(){
            return this.load
        },
        readLoadSaveEmbbedings(){
            return this.loadSaveEmbbedings
        }
    },
    actions:{
        async searchDirect(pergunta, id=null){
            if(id){
                const resp = await this.searchId(pergunta, id)
                return resp
            } else {
                this.search(pergunta)
            }
        },
        async search(search){
            try {
                this.load = true
                this.results = []
                const resp = await api.post('pages_v2/_search', {
                    query: {
                        "match": {
                            "text_page": search
                        }
                    }
                })
                this.results = resp.data.hits.hits
                return this.results[0]._source
            } catch (error) {
                console.log('erro search');
            } finally {
                this.load = false
            }
        },
        async searchId(search, id){
            try {
                this.load = true
                this.results = []
                const resp = await api.post('document_embeddings/_search', {
                    query: {
                       bool:{
                        "must":[
                            {
                                "match": {
                                    "text": {
                                        "query": search,
                                        "fuzziness": "AUTO",
                                        "fuzzy_transpositions": true
                                    }
                                }
                            },
                            {
                                "term": {
                                    "id": {
                                         "value": id
                                     }
                                 }
                            }
                        ]
                       }
                    }
                })
                this.results = resp.data.hits.hits
                return this.results[0]._source.text
            } catch (error) {
                console.log('erro search');
            } finally {
                this.load = false
            }
        },
        async searchChatInit(){
            const resp = await apiChat.get()
            return resp.data//"resposta"
        },
        async searchChatApi(ask, id){
            try {
                this.load = true

                const resp = await apiChat.post('ask', {
                    question: ask,
                    idCollection: id,
                })
                return resp.data.answer

            } catch (error) {
                console.log('erro search');
                
            } finally {
                this.load = false
            }
        },
        async isEmbeddingExist(id){
            try {
                const response = await api.post('document_embeddings/_search', {
                    query:{
                        match:{
                            id: id
                        }
                    }
                })
                const resp = response.data.hits.total.value
                return resp
            } catch (error) {
                console.log('Erro ao verificar a existencia do embedding',);
            }
        },
        async saveEmbbedings(item){
            this.loadSaveEmbbedings = true
             try {
                 const resp = await apiChat.post('save-collection-embeddings', {
                     ids: [item.parent],
                     title: item.title,
                     id: item.parent
                 })
                 if(resp.data){
                     console.log('Embedding criado com sucesso', resp.data);
                     this.loadSaveEmbbedings = false
                 }
                 return resp.data
             } catch (error) {
                 console.log('erro ao criar embeddings');
             } finally {
                this.loadSaveEmbbedings = false
             }
         },
        async resumoPage(texto){
            try {
                this.load = true

                const resp = await apiChat.post('resumir', {
                    texto: texto
                })
                return resp.data.resumo

            } catch (error) {
                console.log('erro search');
                
            } finally {
                this.load = false
            }
        },
        async palavraChave(texto){
            try {
                this.load = true

                const resp = await apiChat.post('palavras-chave', {
                    texto: texto
                })
                return resp.data.palavrasChave 

            } catch (error) {
                console.log('erro search');
                
            } finally {
                this.load = false
            }
        },
        async searchElastic(search, page){
            try {
                this.load = true
                const resp = await api.post('pages_v2/_search', {
                    from: page.inicio * page.page,
                    size: page.qtd,
                    query: {
                        "multi_match": {
                        "query": search.text,
                        "fields": [
                            "text_page",
                            "page_to_norma.title^2"  
                        ],
                        "type": "most_fields"  
                        }
                    }
                })
                return resp
            } catch (error) {
                console.log('erro search alternative');
            } finally {
                this.load = false
            }
        },
        async searchIaAll(search){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return
            this.load = true
            try {
                const resp = await apiChat.post('ask', {
                    question: search
                })
                return resp.data.answer
            } catch (error) {
                console.log('erro search arcadio ia');
            } finally {
                this.load = false
            }
        },
        async overView(id){
            const pageStore = usePageStore()
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return
            this.load = true

            const orientacao = 'Faça um pequeno resumo em poucas palavras sobre o o que esse texto se trata. Seja Objetivo e direto.'

            const item = {
                id: id,
                num_page: 1
            }

            try {
                const page = await pageStore.getPageNorma(item)
   
                const resp = await apiChat.post('resumir', {
                    texto: page.data[0].text_page,
                    orientacao
                })

                await pageStore.saveResumoIA(page.data[0].id, resp.data.resumo)

                return resp.data.resumo

            } catch (error) {
                console.log('erro search arcadio ia');
            } finally {
                this.load = false
            }
        }
    }
})