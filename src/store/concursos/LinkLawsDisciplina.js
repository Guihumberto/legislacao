import { defineStore } from "pinia";

import api from "@/services/api"

import { useLoginStore } from "@/store/LoginStore";
import { useSnackStore } from "@/store/snackStore";

export const useLinkLawStore = defineStore("linkLawsStore", {
    state: () => ({
        load: false,
        error: null,
        normas: [],
    }),
    getters: {
        readLoad(){
            return this.load
        },
        readNormas(){
            return this.normas
        }
    },
    actions:{
         async getAllLaw(){
            const snackStore = useSnackStore()
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            // if(!cpf) return
            try {
                this.load = true
                const response = await api.post("laws_v3/_search", {
                    from: 0,
                    size: 100,
                    query:{
                        match:{
                            tipo: "leis-federais"
                        }
                    }
                })
                this.normas = response.data.hits.hits.map( item => ({idU: item._id, ...item._source}))
                snackStore.activeSnack('Normas carregadas  com sucesso !', 'success')
            } catch (error) {
                console.log("error get normas leis federais");
                snackStore.activeSnack('Erro ao carregar as normas!', 'error')
            }finally{
                this.load = false
            }
        },
        async createVinculos(item){
            const snackStore = useSnackStore()
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return
            try {
                const response = await api.post(`laws_v3/_update/${item.idU}`, {
                    "doc":{
                        disciplina: item.disciplina
                    }
                })
                console.log(response);
                snackStore.activeSnack('Normas vinculadas  com sucesso !', 'success')
            } catch (error) {
                console.log("error get normas leis federais");
                snackStore.activeSnack('Erro ao Vincular as normas!', 'error')
            }
        }
    }
})