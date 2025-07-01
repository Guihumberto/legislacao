import { defineStore } from "pinia";

import api from "@/services/api"
import { useLoginStore } from "./LoginStore";
const loginStore = useLoginStore()

export const usePostStore = defineStore("postStore", {
    state: () => ({
        posts: [],
        load: false,
        post: null
    }),
    getters: {
        readPost(){
            return this.post
        },
        readPosts(){
            return this.posts //.filter( x => x.active)
        },
        readLoad(){
            return this.load
        }
    },
    actions:{
        async getPosts(){
            try {
                this.load = true
                this.posts = []
                const response = await api.post('blog_law_v2/_search', {
                    from: 0,
                    size: 500,
                    // "query":{
                    //     match:{
                    //         created_by: loginStore.readLogin.cpf,
                    //         generateIA: true or false
                    //     }
                    // }
                })
                const resp = response.data.hits.hits
                this.posts = resp.map( x => ({id: x._id, ...x._source}))

            } catch (error) {
                console.log('erro ao caputar posts');
            } finally {
                this.load = false
            }
        },
        async savePost(item){
            try {
                this.load = true
                const doc = { ...item, dateCreated: Date.now(), created_by: loginStore.readLogin.cpf }
                const resp = await api.post('posts/_doc', doc)
                const id = resp.data._id
                this.posts.push({ id: id, ...doc})
                this.post = { id: id, ...doc}
                return this.post
            } catch (error) {
                console.log('erro ao caputar posts');
            } finally {
                this.load = false
            }
        },
        async editPost(item){
            try {
                this.load = true
                const objeto = (({ id, ...rest }) => rest)(item);
                const response = await api.post(`posts/_doc/${item.id}`, objeto)
                const updatedData = this.posts.map(x =>
                    x.id === item.id ? {...item } : x
                );
            } catch (error) {
                console.log('erro ao editar posts');
            } finally {
                this.load = false
            }
        },
        async getPost(item){
            try {
                this.load = true
                const response = await api.get(`posts/_doc/${item}`)
                const resp = { id: response.data._id, ...response.data._source }
                return resp
            } catch (error) {
                console.log('erro ao pegar one post');
            } finally {
                this.load = false
            }
        }
    }
})