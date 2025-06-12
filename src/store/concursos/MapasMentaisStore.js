import { defineStore } from "pinia";

import api from "@/services/api"
import apiChat from "@/services/api_chat"

import { useLoginStore } from "@/store/LoginStore";
import { useForumStore } from "../ForumStore";
import { useSnackStore } from "@/store/snackStore";

export const useMapaMentalStore = defineStore("mapaMentalStore", {
    state: () => ({
        mapaMental: [],
        loading: false,
        error: null,
    }),
    getters: {
        readLoad(){
            return this.loading;
        },
        readError(){
            return this.error;
        },
        readMapaMental(){
            return this.mapaMental;
        },
        readForumLaw(){
            const forumStore = useForumStore()
            return forumStore.readAllPages
        }
    },
    actions: {
        async getMapasMentais(id = '1742907391517'){
            const snackStore = useSnackStore()
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post('mind_maps/_search', {
                    from: 0,
                    size: 100,
                    query: {
                        match: {
                            'id': id
                        }
                    }
                });
                this.mapaMental = response.data.hits.hits.map(item => ({ idLaw: item._id, ...item._source}))
                snackStore.activeSnack('Mapas Mentais carregados com sucesso!', 'success')
            } catch (error) {
                this.error = error
                snackStore.activeSnack('Erro ao carregar os mapas mentais!', 'error')
            }
        },
        async createMindMap(data){
            this.error = null;
            const snackStore = useSnackStore()
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            const arts = [  data.art, ...data.arts].map(art => parseInt(art))
            const artsNoRepeat = [...new Set(arts)]
            const dipositivosText = this.getDispositvosForum(artsNoRepeat)

            if(!dipositivosText) return

            try {
                const resp = await apiChat.post('/generate_mapmind', {
                    texto: dipositivosText,
                })
       
                const objeto = {
                    ...data,
                    ...resp.data.mapamental
                }
                const resp2 = await this.saveElasticMapMind(objeto)
                this.mapaMental.push({ idLaw: resp2._id, ...objeto })
                snackStore.activeSnack('Mapa Mental criado com sucesso!', 'success')
            } catch (err) {
                this.error = err
                snackStore.activeSnack('Erro ao criar o mapa mental!', 'error')
            }
        },
        async saveElasticMapMind(data){
            try {
                const response = await api.post('mind_maps/_doc', data);
                this.mapaMental.push({ idLaw: response.data._id, ...data })
                return response.data
            } catch (err) {
                console.error('Erro ao salvar:', err.response?.data || err.message);
            }
        },
        getDispositvosForum(arts){
            try {
                const list = this.readForumLaw.filter(item => !item.estrutura)
                const listDispositivos = list.filter(item => arts.includes(item.art)).map( x => x.textlaw).join('\n')
                return listDispositivos
            } catch (error) {
                return null
            }
        }
    }
})