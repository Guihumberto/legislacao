import { defineStore } from "pinia";

import api from "@/services/api"
import { useLoginStore } from "@/store/LoginStore";

export const useForumStore = defineStore("forumStore", {
    state: () => ({
        chat: [],
        load: false,
        allPagesLaw: [],
        total_pages: null,
        myGroup: []
    }),
    getters: {
        readChat(){
            return this.chat
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
        readAllPages(){
            return this.allPagesLaw
        },
        readTotalPages(){
            return this.total_pages
        },
        readMyGroup(){
            return this.myGroup
        }
    },
    actions:{
        async createForum(item, textlaw){
            this.load = true
            const loginStore = await useLoginStore()
            if(!loginStore.readLogin?.cpf) return
            const cpf = loginStore.readLogin.cpf

            const objeto = {
                ...item,
                created_by: cpf,
                data_include: this.formatDate
            }

            try {
                const resp = await api.post('group_forum/_doc', objeto)
          
                await this.createLawForum(textlaw, resp.data._id)
                return { code: resp.status, id: resp.data._id }

            } catch (error) {
                console.log('erro save chat');
                return 500
            } finally {
                this.load = false
            }
        },
        async createLawForum(item, id){
            const newArray = item.map(obj => ({ ...obj, comments: [], idGroup: id }));

            const bulkData = newArray.flatMap(doc => [{ index: { _index: 'law_forum' } }, doc]);

            try {
                const response = await api.post(`law_forum/_bulk`, bulkData.map(JSON.stringify).join("\n") + "\n", {
                    headers: { "Content-Type": "application/x-ndjson" }
                  });
                  console.log("Documentos indexados via Bulk:", response.data);
            } catch (error) {
                console.log('error createLawForum');
            }
        },
        async getForum(){
            this.load = true
            const loginStore = useLoginStore()
            if(!loginStore.readLogin?.cpf) return
            const cpf = loginStore.readLogin?.cpf
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
                this.myGroup = resp.data.hits.hits.map(item => ({ id: item._id, ...item._source}))
            } catch (error) {
                console.log('erro getForum');
            } finally {
                this.load = false
            }
        },
        async forumExist(id){
            this.load = true
            const loginStore = useLoginStore()
            if(!loginStore.readLogin?.cpf) return

            try {
                const resp = await api.post('group_forum/_search', {
                    query:{
                        "term":{
                            "idLaw": id
                        }
                    }
                })
                const response = resp.data.hits
                return { total: response.total.value, _source: response.hits }
            } catch (error) {
                
            }
        },
        async getAllPages(id){
            try {
                this.load = true
                const response = await api.post("law_forum/_search", {
                    from: 0,
                    size: 5000,
                    "query": {
                        "match": {
                            "idGroup": id
                        }
                    }
                })
                const resp = response.data.hits.hits
                this.allPagesLaw = resp.map( x => x._source)
                this.total_pages = response.data.hits.total.value
            } catch (error) {
                console.log("error");
            }finally{
                this.load = false
            }
        },
    }
})