import { defineStore } from "pinia";
import api from "@/services/api"
import { useLoginStore } from "@/store/LoginStore";

export const useFavQuestoesStore = defineStore("favQuestoesStore", {
    state: () => ({
        favs: [],
        load: false
    }),
    getters: {
        readFavorites(){
            return this.favs
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
        async saveFavQuestion(item){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            const { id_law, id_art, id, fav, id_origin_law } = item

            const objeto = {
                id_question: id, 
                id_law,
                id_origin_law,
                id_art,
                fav,
                id_user: cpf,
                timestamp: this.formatDate
            }

            const isExiste = await this.isExistFavQuestion(item.id)

            if(isExiste.length){
               await this.updateFavQuestion(isExiste[0], fav)
               return
            }

            try {
                const resp = await api.post('fav_question/_doc', objeto)
                this.favs.push({id: resp.data._id, ...objeto})
                return resp
            } catch (error) {
                console.log('erroe save fav question');
            } 
        },
        async isExistFavQuestion(id_question){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            try {
                const resp = await api.post('fav_question/_search', {
                   query:{
                    bool:{
                           must:[
                               {
                                   term:{
                                       id_user: cpf
                                   }
                               },
                               {
                                   term:{
                                       id_question: id_question
                                   }
                               }
                           ]
                       }
                   }
                })

                return resp.data.hits.hits.map(item => item._id)

            } catch (error) {
                console.log('erroe isExist fav question');
            }
        },
        async updateFavQuestion(item, fav){
            try {
                const response = await api.post(`fav_question/_update/${item}`, {
                    "doc":{
                        fav
                    }
                })
                this.updateReadFav(item, fav)
            } catch (error) {
                console.log('erroe update fav question');
            }
        },
        async getAllFavLaw(item, id_origin_law = null, list = []){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            const must = [];
            const should = [];

            if(list.length){
                must.push({ terms: { id_question: list } });
            }

            if (cpf) {
                must.push({ term: {  id_user: cpf } });
            }

            if (item) {
                should.push({ term: { id_law: item } });
            }

            if(id_origin_law){
                should.push({ term: { id_origin_law } });
            }

            try {
                const resp = await api.post('fav_question/_search', {
                    size: 100,
                    query:{
                        bool: {
                            must,
                            should: should.filter(Boolean),
                            minimum_should_match: 1,
                        }
                    }
                })  
                this.favs = resp.data.hits.hits.map(item => ({id: item._id, ...item._source}))
                return this.favs
            } catch (error) {
                console.log('erroe get all fav law', error?.response?.data || error.message || error);
            } finally {
                this.load = false
            }	
        },
        updateReadFav(item, fav){
            const favSelect = this.favs.find(fav => fav.id == item)
            console.log('item fav', favSelect);
            favSelect.fav = fav
        }
    }
})