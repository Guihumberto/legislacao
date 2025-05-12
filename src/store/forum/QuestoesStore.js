import { defineStore } from "pinia";

import api from "@/services/api"
import apiChat from "@/services/api_chat"

import { useLoginStore } from "@/store/LoginStore";
import { useFavQuestoesStore } from "./favQuestionStore";

export const useQuestoesStore = defineStore("questoesStore", {
    state: () => ({
        questoes: [],
        totalQuestoes: 0,
        totalRespQuestoes: 0,
        q_respondidas: [],
        load: false
    }),
    getters: {
        readQuestoes(){
            return this.questoes
        },
        readTotalQuestoes(){
            return this.totalQuestoes
        },
        readTotalRespQuestoes(){
            return this.totalRespQuestoes
        },
        readQuestoesResp(){
            return this.q_respondidas
        },
        readQuestoesMoreResp(){
            const merged = this.readQuestoes.map(q => {
                const respostasDaQuestao = this.readQuestoesResp
                  ?.filter(r => r.id_question === q.id)
                  .sort((a, b) => this.parseTimestamp(b.timestamp) - this.parseTimestamp(a.timestamp))
              
                const respostaMaisRecente = respostasDaQuestao[0]
              
                return {
                  ...q,
                  ...(respostaMaisRecente ? {
                    id_resposta: respostaMaisRecente.id_resposta,
                    timestamp: respostaMaisRecente.timestamp
                  } : {})
                }
            })
            return merged
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
                })

                return resp.data

            } catch (error) {
                console.error('Erro ao gerar questões:', error.response?.data || error.message);
            } finally {
                this.load = false
                await this.getQuestoes(item)
            }
        },
        async getQuestoes(item){
            this.load = true
            const favStore = useFavQuestoesStore()
            const loginStore = useLoginStore()
            if(!loginStore.readLogin?.cpf) return
            this.clear()

            const must = [];

            if (item.id_law) {
                must.push({ match: { id_law: item.id_law } });
            }

            if (item.id_art) {
                console.log('chama api', item.id_art);
                if(!Array.isArray(item.id_art)) must.push({ match: { id_art: item.id_art } });
                if(Array.isArray(item.id_art)) must.push({ terms: { id_art: item.id_art } });
            }

            try {
                const resp = await api.post('questoes/_search', {
                    from: 0,
                    size: 100,
                    query: {
                        bool: {
                            must
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
                this.totalQuestoes = resp.data.hits.total.value
               
            } catch (error) {
                console.log('erro get questoes');
            } finally {
                this.q_respondidas = await this.getMyQuestoesResp(item)
                await favStore.getAllFavLaw(item.id_law)
                this.load = false
            }
        },
        async getMyQuestoesResp(item){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            const must = [];

            if (cpf) {
                must.push({ term: {  id_user: cpf } });
            }

            if (item.id_law) {
                must.push({ term: { id_law: item.id_law } });
            }

            if (item.id_art) {
                if(!Array.isArray(item.id_art)) must.push({ match: { id_art: item.id_art } });
                if(Array.isArray(item.id_art)) must.push({ terms: { id_art: item.id_art } });
            }

            try {
                const resp = await api.post('questoes_resp/_search', {
                    from: 0,
                    size: 100,
                    query: {
                        bool: {
                          must
                        }
                    },
                    sort: [
                        {
                            timestamp: {
                                order: "desc"
                            },
                        }
                    ]
                }
            )
                this.totalRespQuestoes = resp.data.hits.total.value
                return resp.data.hits.hits.map(item => ({ id: item._id, ...item._source}))
            } catch (error) {
                console.log('erro get questoes resp');
            }
        },
        async saveRespQuestao(item){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            const questoes = { ...item, id_user: cpf, timestamp: this.formatDate }

            try {
                const resp = await api.post('questoes_resp/_doc', questoes)
            } catch (error) {
                console.log('erro save questoes resp');
            }
        },
        async saveQuestoesLawManual(item){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            const bulkBody = item.flatMap(doc => [
                { index: { _index: 'questoes' } },
                doc
            ]);

            try {
                const response = await api.post('/_bulk', bulkBody.map(JSON.stringify).join('\n') + '\n', {
                    headers: { 'Content-Type': 'application/x-ndjson' }
                  });
              
                  if (response.data.errors) {
                    console.error('Alguns documentos falharam ao indexar:', response.data.items);
                  } else {
                    console.log('Todos os documentos foram indexados com sucesso.');
                  }

                  console.log('deu tudo certo');
                
            } catch (error) {
                console.log('erro save questoes manuel');
            }
        },
        parseTimestamp(timestamp){
            const [datePart, timePart] = timestamp.split(' ')
            const [day, month, year] = datePart.split('-').map(Number)
            const [hour, minute] = timePart.split(':').map(Number)
            return new Date(year, month - 1, day, hour, minute)
        },
        clear(){
            this.questoes = []
            this.totalQuestoes = 0
            // this.q_respondidas = []
        }
    }
})