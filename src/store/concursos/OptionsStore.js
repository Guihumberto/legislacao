import { defineStore } from "pinia";

import api from "@/services/api"

import { useLoginStore } from "@/store/LoginStore";
import { useSnackStore } from "@/store/snackStore";

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
                    size: 100,
                    query:{
                        match:{
                            id_concurso: item.id_edital_ref
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
        clearUnMounted(){
            this.load = false
            this.error = null
            this.revisao = []
        }
    }
})