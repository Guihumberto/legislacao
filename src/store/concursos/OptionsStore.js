import { defineStore } from "pinia";

import api from "@/services/api"
import apiChat from "@/services/api_chat"

import { useLoginStore } from "@/store/LoginStore";
import { useSnackStore } from "@/store/snackStore";

import { useNotificationsStore } from '@/store/NotificationsStore'
import { notificationService } from '@/services/notificationService'

export const useOptionsStore = defineStore("optionsStore", {
    state: () => ({
        load: false,
        error: null,
        revisao: [],
    }),
    getters: {
        readLoad(){
            return this.load
        },
        readRevisao(){
            return this.revisao
        },
        readJurisControle(){
            return this.revisao?.filter(x => x?.typeGuide === 'jurisControle')
        },
        readSumulasControle(){
            return this.revisao?.filter(x => x?.typeGuide === 'sumulasControle')
        },
        readFlahsCardsControle(){
            return this.revisao?.filter(x => x?.typeGuide === 'flashcardsControle')
        },
        readQuestoesControle(){
            return this.revisao?.filter(x => x?.typeGuide === 'questoesControle')
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
        readUserMaster(){
            const data = sessionStorage.getItem('userData') || localStorage.getItem('userData');
            const login = {
                login: JSON.parse(data).cpf,
                password: JSON.parse(data).password
            } 
            return login.login == '01791743390'
            ? true
            : false
        }
    },
    actions:{
        async createRevisao(revisao){
            const snackStore = useSnackStore()
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            const objeto = { ...revisao, created_by: cpf, data_include: this.formatDate }

            try{
                const response = await api.post('guia_estudo/_doc', objeto)
        
                console.log('revisao', response);
                this.revisao.push({id: response.data._id, ...objeto }) 
                snackStore.activeSnack("Revisão criada com sucesso!")
                // this.createNotificação({id: response.data._id, ...objeto })

            }catch(error){
                snackStore.activeSnack("Erro ao criar revisão!")
                console.log('erro create revisao', error); 
            }
        },
        async getAllRevisoes(item){
            this.revisao = []
            const snackStore = useSnackStore()
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf || !item?.id_edital_ref) return
            try {
                const response = await api.post('guia_estudo/_search', {
                    size: 1000,
                    query:{
                        "bool":{
                            "should":[
                                 {
                                    bool: {
                                        must: [
                                            { term: { id_concurso: item.id_edital_ref } },
                                            { "terms": { "typeGuide": ["jurisprudencia", "sumulas", "flahscards", "questoes", "resumo", "artigos"] }},
                                        ]
                                    }
                                },
                                {
                                    "bool": {
                                        "must": [
                                            { "terms": { "typeGuide": ["jurisControle", "sumulasControle", "flashcardsControle", "controle", "questoesControle"] }},
                                            { "term": { "id_concurso": item.id_edital_ref }},
                                            { "term": { "user_id": cpf }},
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                })

                this.revisao = response.data.hits.hits.map(item => ({id: item._id, ...item._source}))
                snackStore.activeSnack("Guia Carregado!", "success")
            } catch (error) {
                console.log('erro resumo1')
                snackStore.activeSnack("Erro ao buscar resumo!", "error")
            }
        },
        async concluirGuia(item){
            const snackStore = useSnackStore()
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return
            const id = 'cont-' + item.id + cpf

            const { concluido } = item

            const objeto = {
                guia_id: item.id,
                user_id: cpf,
                concluido: !concluido,
                data_include: this.formatDate,
                typeGuide: 'controle',
                id_concurso: item.id_concurso
            }

            try {
                const response = await api.put(`guia_estudo/_doc/${id}`, objeto )
                
                const find = this.revisao.find(x => x.id === id)
                if(find) find.concluido = !concluido
                if(!find) this.revisao.push({ id, ...objeto })
                
                concluido ? snackStore.activeSnack("Guia desmarcada como concluída!", "info") : snackStore.activeSnack("Guia concluída!", "success")
            } catch (error) {
                console.log('erro concluir guia')
                snackStore.activeSnack("Erro ao concluir guia!", "error")
            }
        },
        alternarConclusao(id) {
            const index = this.revisao.findIndex(x => x.id === id)
            if (index !== -1) {
            this.revisao[index] = {
                ...this.revisao[index],
                concluido: !this.revisao[index].concluido
            }
            }
        },
        clearUnMounted(){
            this.load = false
            this.error = null
            this.revisao = []
        },
        async favJuris(item){
            const snackStore = useSnackStore()
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return
            const id = item.id + cpf

            const objeto = {
                guia_id: item.id,
                user_id: cpf,
                data_include: this.formatDate,
                typeGuide: 'jurisControle',
                id_concurso: item.id_concurso,
                favoriteJuris: item.favoriteJuris
            }

            try {
                const response = await api.put(`guia_estudo/_doc/${id}`, objeto)
                this.updateRevisao({id: response.data._id, ...objeto}) 
                snackStore.activeSnack("Jurisprudência adicionada aos favoritos!", "success")
            }
            catch (error) {
                console.log('erro fav juri')
                snackStore.activeSnack("Erro ao Favoritar jurisprudência!", "error")
            }
        },
        async favSumulas(item){
            const snackStore = useSnackStore()
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return
            const id = item.id + cpf

            const objeto = {
                guia_id: item.id,
                user_id: cpf,
                data_include: this.formatDate,
                typeGuide: 'sumulasControle',
                id_concurso: item.id_concurso,
                favoriteSumulas: item.favoriteSumulas
            }

            try {
                const response = await api.put(`guia_estudo/_doc/${id}`, objeto)
                this.updateRevisao({id: response.data._id, ...objeto}) 
                snackStore.activeSnack("Súmula adicionada aos favoritos!", "success")
            }
            catch (error) {
                console.log('erro fav juri')
                snackStore.activeSnack("Erro ao Favoritar súmula!", "error")
            }
        },
        async updateFlashcard(item){
            const snackStore = useSnackStore()
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return
            const id = item.id + cpf

            const objeto = {
                guia_id: item.id,
                user_id: cpf,
                data_include: this.formatDate,
                typeGuide: 'flashcardsControle',
                id_concurso: item.id_concurso,
                flahscardsreUserMark: item.flahscardsreUserMark
            }

            try {
                const response = await api.put(`guia_estudo/_doc/${id}`, objeto)
                this.updateRevisao({id: response.data._id, ...objeto}) 
                snackStore.activeSnack("Flashcard atualizado!", "success")
            }
            catch (error) {
                console.log('erro fav juri')
                snackStore.activeSnack("Erro ao atualizar flashcard!", "error")
            }
        },
        async updateQuestoes(item){
            const snackStore = useSnackStore()
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return
            const id = item.id + cpf

            const objeto = {
                guia_id: item.id,
                user_id: cpf,
                data_include: this.formatDate,
                typeGuide: 'questoesControle',
                id_concurso: item.id_concurso,
                questoesUserMark: item.questoesUserMark
            }

            try {
                const response = await api.put(`guia_estudo/_doc/${id}`, objeto)
                this.updateRevisao({id: response.data._id, ...objeto}) 
                snackStore.activeSnack("Questões atualizado!", "success")
            }
            catch (error) {
                console.log('erro fav juri')
                snackStore.activeSnack("Erro ao atualizar questões!", "error")
            }
        },
        updateRevisao(objeto){
            const index = this.revisao.findIndex(x => x.id === objeto.id)
            if (index !== -1) {
                this.revisao[index] = {
                    ...this.revisao[index],
                    ...objeto
                }
            } else {
                this.revisao.push(objeto)
            }
        },
        async createNotificação(item){
            const notificationsStore = useNotificationsStore()
            console.log('createNotifcao', item);
            try {
                // Criar notificação para todos os usuários
                await notificationService.createLawNotification(item)
                
                // Atualizar store local se necessário
                notificationsStore.addNotification({
                    type: 'law',
                    title: 'Nova Lei Adicionada',
                    message: `A lei "${item.title}" foi adicionada ao sistema`,
                    actionUrl: `/laws/${item.id}`
                })
                
                // Sucesso
                console.log('Lei criada e notificação enviada!')
            } catch (error) {
                console.error('Erro ao criar lei:', error)
            }
        },
        //chamada IA
        async gerarResumo(item){
            const snackStore = useSnackStore()
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            try {
                const resp = await apiChat.post('/concursos/revisao', {
                    texto: item,
                })
                console.log('resp', resp);
                return resp.data.resumo

            } catch (error) {
                console.log('erro ao gerar resumo')
                snackStore.activeSnack("Erro ao gerar resumo!", "error")
                return 'erro ao gerar resumo'
            }
        },
        async gerarQuestoes(item){
            const snackStore = useSnackStore()
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            try {
                const resp = await apiChat.post('/concursos/questoes', {
                    texto: item,
                })
                return resp.data.questoes

            } catch (error) {
                console.log('erro ao gerar questoes')
                snackStore.activeSnack("Erro ao gerar questões!", "error")
                return 'erro ao gerar resumo'
            }
        },
        async gerarFlashCards(item){
            const snackStore = useSnackStore()
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            try {
                const resp = await apiChat.post('/concursos/flashcards', {
                    texto: item,
                })
                return resp.data.flashcards

            } catch (error) {
                console.log('erro ao gerar flashcards')
                snackStore.activeSnack("Erro ao gerar flashcards!", "error")
                return 'erro ao gerar resumo'
            }
        },
        async gerarJurisprudencia(item){
            const snackStore = useSnackStore()
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            try {
                const resp = await apiChat.post('/concursos/jurisprudencia', {
                    texto: item,
                })
                console.log('resp', resp);
                return resp.data.resumo

            } catch (error) {
                console.log('erro ao gerar jurisprudencia')
                snackStore.activeSnack("Erro ao gerar jurisprudencia!", "error")
                return 'erro ao gerar resumo'
            }
        },
        async gerarMapaMental(item){
            const snackStore = useSnackStore()
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            try {
                const resp = await apiChat.post('/concursos/mindmap', {
                    texto: item,
                })
                console.log('resp', resp);
                return resp.data.resumo

            } catch (error) {
                console.log('erro ao gerar mindmap')
                snackStore.activeSnack("Erro ao gerar mindmap!", "error")
                return 'erro ao gerar resumo'
            }
        },
    }
})