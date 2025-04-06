import { defineStore } from "pinia";

import api from "@/services/api"

import { useLoginStore } from "@/store/LoginStore";
import { useSnackStore } from "./snackStore";

export const useCommentStore = defineStore("commentStore", {
    state: () => ({
        comments: [],
        load: false
    }),
    getters: {
        readComments(){
            return this.comments
        },
        readLoad(){
            return this.load
        }
    },
    actions:{
 
    }
})