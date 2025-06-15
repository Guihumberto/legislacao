import { defineStore } from "pinia";
import api from "@/services/api"

import { useUserAreaStore } from "./AreaUserStore";
import { useAuthStore } from "./firebase/authStore";
import { useConteudoEditalStore } from "./concursos/ConteudoEditalStore";

export const useLoginStore = defineStore("loginStore", {
    state: () => ({
        login:{
            cpf: null,
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
        load: false,
        pagination:{
            page: 1, 
            start: 0, 
            end: 10,
            perPage: 10
        },
        totalPages: 0
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
        },
        readPagination(){
            return this.pagination
        },
        readTotalPages(){
            return this.totalPages
        }
    },
    actions:{
        async loginSSO(item, connected = false){
            try {
                this.load = true
                const userAreaStore = useUserAreaStore()
                const cpf = this.apenasNumeros(item.login)
                const user = await this.findUserElastic(cpf)

                if(user._source.cpf == cpf && user._source.password == item.password){
                    this.login = { id: user._id, ...user._source }
                    const date_now = Date.now()
                    this.login.last_login = date_now
                    await this.editUser(this.login)
                    if(!user._source?.first_login){
                        this.login.first_login = date_now
                        await this.editUser(this.login)
                    }

                    this.saveUserData(connected)

                    // await userAreaStore.getAllFavoritos()
                    await userAreaStore.getAllHistórico()
                    await userAreaStore.getCollection()
                    await userAreaStore.getDocs()
                    
                    
                    return this.login
                } else {
                    return false
                }
            } catch (error) {
                console.log("erro login");
            } finally {
                this.load = false
            }
        },
        logOut(router, link = null){
            const authStore = useAuthStore()
            authStore.logout()
            this.clearLogin()
            if(link){
                router.push(link)
            } else {
                router.push('/leges')
            }
            this.unmountedDestruct()
            sessionStorage.removeItem('userData')
            localStorage.removeItem('userData');
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
                const response = await api.post('users/_search', {
                    from: this.readPagination.start,
                    size: this.readPagination.perPage
                })
                const resp = response.data.hits.hits
                const users = resp.map(x => ({ id: x._id, ...x._source }) )
                this.listUsers = [ ...users ]
                this.totalPages = response.data.hits.total.value
            } catch (error) {
                console.log('erro ao carregar usuários');
            } finally {
                this.load = false
            }
        },
        async searchUsers(search){
            this.listUsers = []

            let mustClauses = [];

            if(search.name){
                 mustClauses.push({
                    match: { name: search.name }
                });
            }

            if(search.cpf){
                mustClauses.push({
                   match: { cpf: search.cpf }
               });
            }

            if(search?.listCpf.length){
                mustClauses.push({
                   terms: { cpf: search.listCpf }
               });
            }

            if(search.lotacao){
                mustClauses.push({
                   match: { setor: search.lotacao }
               });
            }

            if(search.perfil){
                mustClauses.push({
                   match: { perfil: search.perfil }
               });
            }

            if(search.perfilAdm){
                mustClauses.push({
                   match: { admin: search.perfilAdm }
               });
            }

            try {
                const response = await api.post('users/_search', {
                    from: this.readPagination.start,
                    size: this.readPagination.perPage,
                    query: {
                        bool: {
                            must: mustClauses.length > 0 ? mustClauses : [{ match_all: {} }]
                        }
                    }
                })
                const resp = response.data.hits.hits
                const users = resp.map(x => ({ id: x._id, ...x._source }) )
                this.listUsers = [ ...users ]
                this.totalPages = response.data.hits.total.value
            } catch (error) {
                console.log('erro ao buscar usuários');
            }
        },
        async addUser(item){
            this.load = true
            const isExist = await this.findUserElastic(item)
            const isInvalidCpf = this.validarCPF(item)
            
            if(isExist || !isInvalidCpf){
                return true
            }
            try {
                this.user.cpf = item
                this.user.date_created = Date.now()

                const resp = await api.post('users/_doc', this.user)
                this.listUsers.push( {id: resp.data._id, ...this.user} )
                this.clearUser()
                return false
            } catch (error) {
                console.log('erro ao add user');
            } finally {
                this.load = false
            }
        },
        async addUserGoogle(item, connected = false){
            this.load = true
            const user = await this.findUserElasticUID(item.uid)

            if(user) {
                this.login = { id: user._id, ...user._source }
                const resp = await this.loginUserGoogle(connected)
                return resp
            } else {
                const resp = await this.saveUserGoogle(item, connected)
                return resp
            }
        },
        async loginUserGoogle(connected = false){
            try {
                const date_now = Date.now()
                this.login.last_login = date_now
                await this.editUser(this.login)

                if(this.login.first_login){
                    this.login.first_login = date_now
                    await this.editUser(this.login)
                }

                this.saveUserData(connected)

                // await userAreaStore.getAllFavoritos()
                // await userAreaStore.getAllHistórico()
                // await userAreaStore.getCollection()
                // await userAreaStore.getDocs()
                
                return this.login
            } catch (error) {
                console.log('erro ao logar usuário google');
            }
        },
        async saveUserGoogle(item, connected){
            const objeto = {
                name: null,
                nickname: item.displayName,
                cpf: null,
                uid: item.uid,
                perfil: 1,
                date_created: Date.now(),
                last_login: Date.now(),
                first_login: Date.now(),
                admin: false,
                img: item.photoURL,
                active: true,
                setor: null,
                cargo: null,
                about: null,
                email: item.email,
            }

            try {
                const resp = await api.post('users/_doc', objeto)
                this.login = { id:  resp.data._id, ...objeto }
                this.listUsers.push( {...this.login} )
                this.saveUserData(connected)

                return objeto
            } catch (error) {
                console.log('erro ao salvar user google', error);
            } 
        },
        async editUser(user){
            const objeto = (({ id, ...rest }) => rest)(user);
            if(objeto.cpf) objeto.cpf = this.apenasNumeros(user.cpf)
         
            if(objeto?.cpf) {
                const isInvalidCpf = this.validarCPF(objeto.cpf)
                if(!isInvalidCpf){
                    return {erro: true, msg: 'CPF inválido'}
                }

                const isExist = await this.findUserElastic(objeto.cpf)
                if(isExist){
                    return {erro: true, msg: 'CPF já cadastrado'}
                }
            }

            try {
                const resp = await api.post(`users/_doc/${user.id}`, objeto)
                this.listUsers = this.listUsers.map(item =>
                    item.id === user.id ? {...user } : item
                );

                console.log('resp elastic', resp);

                this.setLogin(user)
                console.log('store login: editou user', this.readLogin);
                return {erro: false, msg: 'Tudo certo!'}
                
            } catch (error) {
                console.log('erro ao edit user');
                return {erro: true, msg: 'erro nao mapeado'}
            } 
        },
        setLogin(user){
            console.log('store login: editou user', user);

            if(user?.cpf) this.login.cpf = this.apenasNumeros(user.cpf)
            this.login.name = user.name
            this.login.nickname = user.nickname
            console.log('store login: salvo user', this.readLogin);
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
        async findUserElasticUID(uid){
            try {
                this.load = true
                const response = await api.post('users/_search', 
                    {
                        "query":{
                            "match":{
                                "uid": uid
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
        saveUserData(connected) {
            if(connected){
                localStorage.setItem('userData', JSON.stringify(this.readLogin));
            } else {
                sessionStorage.setItem('userData', JSON.stringify(this.readLogin));
            }
        },
        loadUserData() {
            try {
                this.load = true
                const data = sessionStorage.getItem('userData') || localStorage.getItem('userData');
                if (data) {
                    const login = {
                        login: JSON.parse(data).cpf,
                        password: JSON.parse(data).password
                    } 
                    if(login.login) this.loginSSO(login)
                    if(!login?.login) this.load = false
                    
                }
            } catch (error) {
                console.log('erro storage load data');
            }
        },
        async searchTimeRealUser(user){
            console.log('user', user);  
            try {
               const response = await api.post('users/_search', {
                size: 10,
                query: {
                    match_phrase_prefix: {
                        name: user
                    }
                  }
               })
               const resp = response.data.hits.hits.map( x => ({ id: x._id, ...x._source }))
               return resp
            } catch (error) {
                console.log('erro search time real user');
            }
        },
        unmountedDestruct(){
            const conteudoStore = useConteudoEditalStore()
            conteudoStore.unMontedDestruct()
        },
    }
})