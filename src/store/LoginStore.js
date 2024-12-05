import { defineStore } from "pinia";

export const useLoginStore = defineStore("loginStore", {
    state: () => ({
        testUser:{
            login: "017.917.433-90",
            name: 'João Humberto Silva Ribeiro Júnior',
            nickname: 'Humberto',
            orgao: 'SEFAZ MA',
            setor: 'LEGES',
            password: 123456,
            firstLogin: true
        },
        login:{
            login: null,
            name: null,
            apelido: null,
            firstLogin: false,
            dateFirstLogin: null
        }
    }),
    getters: {
        readLogin(){
            return this.login
        }
    },
    actions:{
        loginSSO(item){
            if(this.testUser.login == item.login && this.testUser.password == item.password){
                this.login = { ...this.testUser }
                this.login.dateFirstLogin = Date.now()
                return this.login
            } else {
                return false
            }
        },
        logOut(){
            this.clearLogin()
            window.location.href = '/'
        },
        clearLogin(){
            this.login = {
                login: null,
                name: null,
                apelido: null,
                firstLogin: false,
                dateFirstLogin: null
            }
        }
    }
})