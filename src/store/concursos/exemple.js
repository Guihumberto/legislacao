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
       
    }
})