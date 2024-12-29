import { defineStore } from "pinia";

export const useSnackStore = defineStore("snackbar", {
    state: () => ({
        snack: {
            snackbar: false,
            text: '',
            timeout: 2000,
            color: "primary",
            elevation: "24"
        },
    }),
    getters: {
        readSnack(){
            return this.snack
        }
    },
    actions:{
        activeSnack(item){
            this.snack.snackbar = true 
            this.snack.text = item?.text ? item.text : item 
            this.snack.color = item?.color ? item.color : 'primary'
        },
        clearSnack(){
            this.snack = {
                snackbar: true,
                text: '',
                timeout: 2000,
                color: "primary",
                elevation: "24"
            }
        }
    }
})