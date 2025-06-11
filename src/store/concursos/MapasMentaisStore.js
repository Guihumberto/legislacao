import { defineStore } from "pinia";

import api from "@/services/api"

import { useLoginStore } from "@/store/LoginStore";
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

            try {
                const response = await api.post('mind_maps/_doc', data);
                snackStore.activeSnack('Mapa Mental criado com sucesso!', 'success')
                this.mapaMental.push({ idLaw: response.data._id, ...data })
                return response.data
            } catch (err) {
                console.error('Erro ao salvar:', err.response?.data || err.message);
                this.error = err
                snackStore.activeSnack('Erro ao criar o mapa mental!', 'error')
            }
        }
    }
})