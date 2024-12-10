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
        },
        listUsers: [],
        load: false
    }),
    getters: {
        readLogin(){
            return this.login
        },
        readListUsers(){
            return this.listUsers
        },
        readLoad(){
            return this.load
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
        },
        getUsers(){
            this.load = true
            try {
                const users = [ 'Maria', 'José', 'João', 'Roberto', 'Pedro']
                this.listUsers = [ ...users ]
                
            } catch (error) {
                console.log('erro ao carregar usuários');
            } finally {
                this.load = false
            }
        },
        addUser(item){
            this.load = true
            try {
                this.listUsers.push(item)
            } catch (error) {
                console.log('erro ao add user');
            } finally {
                this.load = false
            }
           
        },
        editUser(){
            this.load = true
            try {
                this.listUsers.push(item)
            } catch (error) {
                console.log('erro ao edit user');
            } finally {
                this.load = false
            }
        }
    }
})