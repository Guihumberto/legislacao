import { defineStore } from "pinia";

import api from "@/services/api"

import { useLoginStore } from "@/store/LoginStore";
import { useSnackStore } from "@/store/snackStore";

export const useRevisaoStore = defineStore("revisaoStore", {
    state: () => ({
        load: false,
        error: null,
        revisao: null,
    }),
    getters: {
        readLoad(){
            return this.load
        },
        reasRevisao(){
            return this.revisao
        }
    },
    actions:{
        async createRevisao(revisao){
            console.log('revisao', revisao);
            const snackStore = useSnackStore()
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            try {
                const response = await api.post('conteudo_edital/_update_by_query', {
                    "script":{
                        source: `
                            ctx._source.resumo_geral = params.resumo_geral;
                            ctx._source.top_relevante = params.top_relevante;
                        `,
                        params: {
                            resumo_geral: revisao.resumoTexto,
                            top_relevante: revisao.pontosChaves
                        }
                    },
                    "query": {
                        "bool": {
                            "must": [
                                {
                                "term": {
                                    "disciplina": revisao.disciplina
                                }
                                },
                                {
                                "match": {
                                    "id_concurso": revisao.id_concurso
                                }
                                }
                            ]
                        }
                    }
                })
                snackStore.activeSnack('Revisão salva com sucesso', 'success',)
            } catch (error) {
                console.log('erro')
                snackStore.activeSnack('Ocorreu um erro ao salvar', 'error',)
            } 
        },
        async getRevisao(item){
            const snackStore = useSnackStore()
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return
            try {
                const response = await api.post('conteudo_edital/_search', {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                "term": {
                                    "disciplina": item.disciplina
                                }
                                },
                                {
                                "match": {
                                    "id_concurso": item.id_concurso
                                }
                                }
                            ]
                        }
                    }
                })
                this.revisao = response.data.hits.hits[0]._source
                snackStore.activeSnack('Revisão carregada', 'success',)
            } catch (error) {
                console.log('erro')
                snackStore.activeSnack('Ocorreu um erro', 'error',)
            } 
        }
    }
})
