import { defineStore } from "pinia";

import api from "@/services/api"
import { useLoginStore } from "@/store/LoginStore";

export const useSolicitationsStore = defineStore("solicitationStore", {
    state: () => ({
        avaliations: [],
        totalAvaliations: 0,
        solicitations: [],
        invites: [],
        load: false
    }),
    getters: {
        readAvaliations(){
            return this.avaliations
        },
        readSolicitations(){
            return this.solicitations
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
        readTotalAvaliations(){
            return this.totalAvaliations
        },
        readInvites(){
            return this.invites
        }
    },
    actions:{
        async getAvaliations(){
            const loginStore = await useLoginStore()
            if(!loginStore.readLogin?.cpf) return
            const cpf = loginStore.readLogin.cpf

            const ids = await this.getGroup(cpf)

            try {
                this.avaliations = []
                const resp = await api.post('permission_group_forum/_search', {
                    query: {
                        bool:{
                            must:[
                                {
                                    "terms": {
                                        "idGroup": ids
                                    }
                                },
                                {
                                    "term": {
                                        "admPermission": false 
                                    }
                                }
                            ]
                        }
                        
                    }
                })

                console.log('resp ava', resp);

                this.avaliations = resp.data.hits.hits.map( x => ({ id: x._id, ...x._source }) )
                this.totalAvaliations = resp.data.hits.total.value
                
            } catch (error) {
                console.log('error get solicitatons');
            }
        },
        async getSolicitations(){
            const loginStore = await useLoginStore()
            if(!loginStore.readLogin?.cpf) return
            const cpf = loginStore.readLogin.cpf

            try {
                this.solicitations = []
                const resp = await api.post('permission_group_forum/_search', {
                    query: {
                        bool:{
                            must:[
                                {
                                    "term": {
                                        "idUser": cpf
                                    }
                                },
                                {
                                    "term": {
                                        "admPermission": false
                                    }
                                }
                            ]
                        }
                        
                    }
                })

                console.log('resp solic', resp);

                this.solicitations = resp.data.hits.hits.map( x => ({ id: x._id, ...x._source }) )
                
            } catch (error) {
                console.log('error get solicitatons');
            }
        },
        async getInvites(){
            const loginStore = await useLoginStore()
            if(!loginStore.readLogin?.cpf) return
            const cpf = loginStore.readLogin.cpf

            try {
                this.solicitations = []
                const resp = await api.post('permission_group_forum/_search', {
                    query: {
                        bool:{
                            must:[
                                {
                                    "term": {
                                        "idUser": cpf
                                    }
                                },
                                {
                                    "term": {
                                        "admPermission": true
                                    }
                                },
                                {
                                    "term": {
                                        "userPermission": false
                                    }
                                }
                            ]
                        }
                        
                    }
                })

                this.invites = resp.data.hits.hits.map( x => ({ id: x._id, ...x._source }) )
                
            } catch (error) {
                console.log('error get solicitatons');
            }
        },
        async getGroup(cpf){
            try {
                const resp = await api.post('group_forum/_search', {
                    from: 0,
                    size: 100,
                    query: {
                        "term": {
                            "created_by": cpf
                        }
                    },
                    sort: [
                        {
                            data_include: {
                                order: "desc"
                            },
                        }
                    ]
                })
                return resp.data.hits.hits.map(item => item._id )
            } catch (error) {
                console.log('erro getForum');
            } 
        },
        async acceptAvaliations(id){
            const loginStore = await useLoginStore()
            if(!loginStore.readLogin?.cpf) return
            const cpf = loginStore.readLogin.cpf

            try {
                const resp = await api.post(`permission_group_forum/_update/${id}`, {
                    "doc":{
                        admPermission: true, 
                        date_permision: this.formatDate
                    }
                })
               console.log('resp acept', resp);
               this.avaliations = this.avaliations.filter( x => x.id != id)
   
            } catch (error) {
                console.log('error aceitar mygrupo');
            }
        },
        async acceptInvites(id){
            const loginStore = await useLoginStore()
            if(!loginStore.readLogin?.cpf) return
            const cpf = loginStore.readLogin.cpf

            try {
                const resp = await api.post(`permission_group_forum/_update/${id}`, {
                    "doc":{
                        userPermission: true, 
                        date_permision: this.formatDate
                    }
                })
               this.invites = this.invites.filter( x => x.id != id)
            } catch (error) {
                console.log('error aceitar mygrupo');
            }
        }
    }
})