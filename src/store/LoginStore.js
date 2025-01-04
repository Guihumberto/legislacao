import { defineStore } from "pinia";
import api from "@/services/api"

import { useUserAreaStore } from "./AreaUserStore";

export const useLoginStore = defineStore("loginStore", {
    state: () => ({
        login:{
            login: null,
            name: null,
            apelido: null,
            firstLogin: false,
            dateFirstLogin: null
        },
        user:{
            name: null, 
            cpf: null, 
            password: 123456,
            nickname: null, 
            img: null,
            about: null, 
            cargo: null, 
            setor: null, 
            first_login: null, 
            last_login: null, 
            perfil: 1,
            admin: false, 
            active: true, 
            date_created: null
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
        async loginSSO(item){
            const userAreaStore = useUserAreaStore()
            const cpf = this.apenasNumeros(item.login)
            const user = await this.findUserElastic(cpf)
            if(user._source.cpf == cpf && user._source.password == item.password){
                this.login = { id: user._id, ...user._source }
                this.login.last_login = Date.now()
                await this.editUser(this.login)
                if(!user._source?.first_login){
                    this.login.first_login = Date.now()
                    await this.editUser(this.login)
                }
                this.saveUserData()
                userAreaStore.getAllFavoritos()
                return this.login
            } else {
                return false
            }
        },
        logOut(){
            this.clearLogin()
            window.location.href = '/'
            this.saveUserData()
        },
        clearLogin(){
            this.login = {
                cpf: null,
                name: null,
                nickname: null
            }
        },
        async getUsers(){
            this.load = true
            this.listUsers = []
            try {
                const response = await api.post('users/_search')
                const resp = response.data.hits.hits
                const users = resp.map(x => ({
                        id: x._id,
                        ...x._source
                    })
                )
                this.listUsers = [ ...users ]
                
            } catch (error) {
                console.log('erro ao carregar usuários');
            } finally {
                this.load = false
            }
        },
        async addUser(item){
            this.load = true
            const isExist = await this.findUserElastic(item)
            const isInvalidCpf = this.validarCPF(item)
            
            if(isExist || !isInvalidCpf){
                console.log(isExist);
                return true
            }
            try {
                this.user.cpf = item
                this.user.date_created = Date.now()

                const resp = await api.post('users/_doc', this.user)
                this.listUsers.push( {...this.user} )
                this.clearUser()
                return false
            } catch (error) {
                console.log('erro ao add user');
            } finally {
                this.load = false
            }
        },
        async editUser(user){
            this.load = true
            const objeto = (({ id, ...rest }) => rest)(user);
            try {
                const resp = await api.post(`users/_doc/${user.id}`, objeto)
                const updatedData = this.listUsers.map(item =>
                    item.id === user.id ? {...user } : item
                );
            } catch (error) {
                console.log('erro ao edit user');
            } finally {
                this.load = false
            }
        },
        clearUser(){
            this.user = {
                name: null, 
                cpf: null, 
                password: 123456,
                nickname: null, 
                img: null,
                about: null, 
                cargo: null, 
                setor: null, 
                first_login: null, 
                last_login: null, 
                perfil: 1,
                admin: false, 
                active: true, 
                date_created: null
            }
        },
        async findUserElastic(cpf){
            try {
                this.load = true
                const response = await api.post('users/_search', 
                    {
                        "query":{
                            "match":{
                                "cpf": cpf
                            }
                        }
                    }
                )

                const user = response.data.hits.hits
                return user.length
                ? user[0]
                : false
            } catch (error) {
                console.log("erro: elastic servidor encontrar");
            } finally {
                this.load = false
            }
        },
        apenasNumeros(str) {
            try {
                return str.replace(/\D/g, '');
            } catch (error) {
                return str
            }
        },
        validarCPF(cpf) {
            // Remove caracteres não numéricos
            cpf = cpf.replace(/[^\d]/g, '');
        
            // Verifica se o CPF tem 11 dígitos
            if (cpf.length !== 11) {
                return false;
            }
        
            // Verifica se todos os dígitos são iguais (ex.: 111.111.111-11)
            if (/^(\d)\1{10}$/.test(cpf)) {
                return false;
            }
        
            // Calcula o primeiro dígito verificador
            let soma = 0;
            for (let i = 0; i < 9; i++) {
                soma += parseInt(cpf.charAt(i)) * (10 - i);
            }
            let resto = 11 - (soma % 11);
            let digito1 = (resto === 10 || resto === 11) ? 0 : resto;
        
            // Calcula o segundo dígito verificador
            soma = 0;
            for (let i = 0; i < 10; i++) {
                soma += parseInt(cpf.charAt(i)) * (11 - i);
            }
            resto = 11 - (soma % 11);
            let digito2 = (resto === 10 || resto === 11) ? 0 : resto;
        
            // Verifica se os dígitos calculados conferem com os dígitos informados
            return (digito1 === parseInt(cpf.charAt(9)) && digito2 === parseInt(cpf.charAt(10)));
        },
        saveUserData() {
            sessionStorage.setItem('userData', JSON.stringify(this.readLogin));
        },
        loadUserData() {
            try {
                this.load = true
                const data = sessionStorage.getItem('userData');
                if (data) {
                    const login = {
                        login: JSON.parse(data).cpf,
                        password: JSON.parse(data).password
                    } 
                    if(login.login) this.loginSSO(login)
                }
            } catch (error) {
                console.log('erro storage load data');
            } finally {
                this.load = false
            }
        },
        async loginMalha(){
            const data = await sessionStorage.getItem('userData');
    
            if (data) {
                const login = {
                   login: JSON.parse(data).cpf,
                   dn: JSON.parse(data).password
                } 
                if(login.login) {
                    
                    try {
                        const user = (await this.findUserElastic(parseInt(login.cpf))).data._source
    
                        if(user.cpf == login.login && user.password == login.dn){
                            await this.setEquipe(login.login)
                            this.login = user  
                            this.saveUserData()
                            return await this.login
                        }
                    }catch{
                        console.log('error local storage');
                    }
    
                }
           }
            
        },
    }
})