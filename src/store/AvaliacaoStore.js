import { defineStore } from "pinia";
import api from "@/services/api"

export const useAvaliacaoStore = defineStore("avaliacao", {
  state: () => ({
    pageInitial:{
        title: 'Avaliação de Desempenho Individual',
        Describle: 'A Avaliação de Desempenho Individual (ADI) tem por objetivo aferir o desempenho do servidor ativo no exercício das atribuições desempenhadas na SEFAZ/MA, com foco na contribuição individual para o alcance dos objetivos organizacionais.'
    },
    loadInit: false,
    listCicloAvaliations:[],
    dadosNewAvaliation:{
        referencia: '',
        startdate: '',
        enddate: '',
        id: ''
    },
    dadosCriterios:[],
    criterios:[
        {id: 1, nota:'', name: 'Assiduidade', 
          desc: 'Avalie a presença e pontualidade de sua equipe. Esse tipo de avaliação considera a frequência com que o servidor comparece ao trabalho ou aos compromissos e a pontualidade em relação aos horários estabelecidos.',
          icon: 'mdi-human-greeting'
        },
        {id: 2, nota:'', name: 'Disciplina', 
          desc: 'Avalie o comportamento dos indivíduos em relação às regras, normas e regulamentos estabelecidos. Esse tipo de avaliação foca na conduta, na ética e no cumprimento das políticas internas, visando promover um ambiente de trabalho ou estudo ordenado e produtivo.',
          icon: 'mdi-school'
        },
        {id: 3, nota:'', name: 'Capacidade de iniciativa', 
          desc: 'Avalie a proatividade do servidor. Essa avaliação foca na habilidade de uma pessoa de tomar ações de forma independente, identificar oportunidades de melhoria e resolver problemas sem esperar instruções detalhadas.',
          icon: 'mdi-run'
        },
        {id: 4, nota:'', name: 'Produtividade', 
          desc: 'Avalie o desempenho do servidor em termos de quantidade e qualidade do trabalho realizado. Esse tipo de avaliação foca na capacidade de um indivíduo de cumprir metas e objetivos dentro de um determinado período, utilizando eficientemente os recursos disponíveis. ',
          icon: 'mdi-progress-helper'
        },
        {id: 5, nota:'', name: 'Responsabilidade', 
          desc: 'Avalie o grau de compromisso, confiabilidade e capacidade do servidor de assumir e cumprir suas obrigações.',
          icon: 'mdi-human-greeting'
        },
        {id: 6, nota:'', name: 'Interação com a equipe', 
          desc: 'Avalie a capacidade do servidor de trabalhar de maneira colaborativa, comunicativa e eficaz com seus colegas',
          icon: 'mdi-account-group'
        },
        {id: 7, nota:'', name: 'Relacionamento', 
          desc: 'Avalie a habilidade do servidor de estabelecer e manter relacionamentos saudáveis, respeitosos e produtivos com colegas, clientes, fornecedores e outras partes interessadas.',
          icon: 'mdi-relation-many-to-many'
        },
    ],
    servidores:[
        {id: '01791743390', nome: 'João Humberto', cargo: 'Auditor Fiscal', dn: '01/02/1986', nota: ''},
        {id: '11111111111', nome: 'José Lorem', cargo: 'Auditor Fiscal', dn: '01/02/1986', nota: ''},
        {id: '22222222222', nome: 'Maria Ipsulum', cargo: 'Auditor Fiscal', dn: '01/02/1986', nota: ''},
        {id: '33333333333', nome: 'Jack Alpha', cargo: 'Auditor Fiscal', dn: '01/02/1986', nota: ''},
        {id: '44444444444', nome: 'Jonh Beta', cargo: 'Auditor Fiscal', dn: '01/02/1986', nota: ''},
        {id: '55555555555', nome: 'Ilda Sugar', cargo: 'Auditor Fiscal', dn: '01/02/1986', nota: ''},
        {id: '66666666666', nome: 'Ilda Sugar', cargo: 'Auditor Fiscal', dn: '01/02/1986', nota: ''},
        {id: '11791743390', nome: 'João Humberto', cargo: 'Auditor Fiscal', dn: '01/02/1986', nota: ''},
        {id: '71111111111', nome: 'José Lorem', cargo: 'Auditor Fiscal', dn: '01/02/1986', nota: ''},
        {id: '72222222222', nome: 'Maria Ipsulum', cargo: 'Auditor Fiscal', dn: '01/02/1986', nota: ''},
        {id: '73333333333', nome: 'Jack Alpha', cargo: 'Auditor Fiscal', dn: '01/02/1986', nota: ''},
        {id: '74444444444', nome: 'Jonh Beta', cargo: 'Auditor Fiscal', dn: '01/02/1986', nota: ''},
        {id: '75555555555', nome: 'Ilda Sugar', cargo: 'Auditor Fiscal', dn: '01/02/1986', nota: ''},
        {id: '76666666666', nome: 'Ilda Sugar', cargo: 'Auditor Fiscal', dn: '01/02/1986', nota: ''},
    ],
    avaliacao: [
        {idGestor: '01791743390', equipe:['1111111111', '22222222222', '33333333333', '44444444444', '55555555555']},
        {idGestor: '11791743390', equipe:['71111111111', '72222222222', '73333333333', '74444444444', '75555555555']},
        {idGestor: '21791743390', equipe:['81111111111', '82222222222', '83333333333', '84444444444', '85555555555']},
        {idGestor: '31791743390', equipe:['91111111111', '92222222222', '93333333333', '94444444444', '95555555555']},
    ],
    avaliacaoSefaz: [],
    equipeFilter: {},
    isLogin:{},
    menuSide: false,
    erro: '',
    servidorOne: {},
    servidorAvaliado:{},
    allAvaliations: [],
    load: false,
    sendMailLastAvaliation: false,
    loadFinalizar: false,
    avaliacaoFinalizada: null,
    isFinalizada: false,
    loadUpdatePage: false,
    listPesquisaSatisfacao: [],
    avaliadosComMedia:[
        5230622652,
        4634958457,
        5471427300,
        42775590349,
        13758683300,
        14999790378,
        22499393300,
        10452184304,
        43239862387,
        25117378334,
        61375403320,
        17651476387,
        17525314349,
        8051780310,
        12894010397,
        25163272349,
        12484180349,
        2980498300,
        12568023368,
        25163132334,
        27131190306,
        10393349705,
        13755803372,
    ],
    naoAvaliadosServidores:[],
    periodoEncerrado: true
  }),
  getters: {
    nameCiclo(){
        let name = "Primeiro"
        if(this.dadosNewAvaliation.referencia == '05/2024') name = "Primeiro"
        if(this.dadosNewAvaliation.referencia == '08/2024') name = "Segundo"
        return name
    },
    readLoadUpdatePage(){
        return this.loadUpdatePage
    },
    readIsFinalizada(){
        return this.isFinalizada
    },
    readLoadInit(){
        return this.loadInit
    },
    readFinalizar(){
        if(this.avaliacaoFinalizada){
            if(this.avaliacaoFinalizada.refAvaliation == this.dadosNewAvaliation.referencia){
                return this.avaliacaoFinalizada
            } else {
                return null
            }
        }
        return this.avaliacaoFinalizada
    },
    readPageInitial(){
        return this.pageInitial
    },
    readListCiclosAvaliations(){
        return this.listCicloAvaliations
    },
    readDadosNewAvaliation(){
        return this.dadosNewAvaliation
    },
    readDadosCriterios(){
        const criterios = this.dadosCriterios.map(x => x._source)
        return criterios
    },
    readServidores(){
        return this.servidores
    },
    readAvaliacao(){
        return this.avaliacao
    },
    readSefazAvalaidos(){
        return this.avaliacaoSefaz
    },
    readLogin(){
        return this.isLogin
    },
    readErro(){
        return this.erro
    },
    readEquipe(){
        let equipe = this.equipeFilter
        if(equipe.equipe.length){
            equipe.equipe = [ ...new Set(equipe.equipe)]
        }
        return equipe
    },
    readServidorOne(){
        return this.servidorOne
    },
    readAvaliacaoServidor(){
        return this.servidorAvaliado
    },
    readCriterios(){
        return this.criterios
    },
    readAllAvaliationsServidoresEquipe(){
        return this.allAvaliations
    },
    readLoad(){
        return this.load
    },
    readSendEmail(){
        return this.sendMailLastAvaliation
    },
    readPesquisaSatisfacao(){
        return this.listPesquisaSatisfacao
    },
    readPesquisaSatisfacaoAtual(){
        let pesquisa = this.listPesquisaSatisfacao[0]
        return pesquisa
    },
    readAvaliacaoComMedia(){
        return this.avaliadosComMedia
    },
    readNaoAvaliados(){
        return this.naoAvaliadosServidores
    },
    readPeriodoEncerrado(){
        return this.periodoEncerrado
    }
  },
  actions:{
    async loginSSO(login){
         try {
            const response = await fetch("https://sso.sefaz.ma.gov.br/auth/realms/sefaz/protocol/openid-connect/token", {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'username': login.cpf,
                    'password': login.password,
                    'grant_type': 'password',
                    'client_id': "client-legisla"
                })
            })
           return response.status
        } catch (e) {
            console.log("erro senha:", e);
        } 
    },
    async login(item){
        this.limpar()

        const login = {
            cpf: this.apenasNumeros(item.login),
            password: item.password
        }
        
        const sso = await this.loginSSO(login) 

        if(sso == 200) {
            try {
                const user = (await this.findServidorElastic(parseInt(login.cpf))).data._source
                const res = await this.setEquipe(login.cpf)
                await this.findAllAvaliacaoGestorId(login.cpf)
                this.isLogin = user
                this.saveUserData()

            } catch (error) {
                console.log("ERRO NO LOGIN");
            }
        } else{
            this.erro = 'CPF e/ou Senha incorreto(s)'
        }
    },
    async loginPorDN(item){
        this.limpar()

        const cpf = this.apenasNumeros(item.login)
    
        try {
            const user = (await this.findServidorElastic(parseInt(cpf))).data._source
     
            if(user.id == cpf && this.converter(user.dn) == item.dn){
                const res = await this.setEquipe(cpf)
                await this.findAllAvaliacaoGestorId(cpf)
                this.isLogin = user
                this.saveUserData()
                this.entrouComDNregistros()
            } else {
                this.erro = 'CPF e/ou Data de Nascimento incorreto(s)'
            }

        } catch (error) {
            
        }
    },
    async entrouComDNregistros(){
        try {
            const resp = api.post('datadenascimento/_doc', {
                cpf: this.isLogin.id,
                nome: this.isLogin.name,
                dateIn: Date.now()
            })
            console.log(resp);
        } catch (error) {
            console.log("erro ao salvar dn");
        }
    },
    async setEquipe(cpf){
        const equipe = await this.findEquipeElastic(parseInt(cpf))

        if(!equipe){
            this.equipeFilter = {'idGestor': cpf, "equipe": []}
            return
        }

        this.equipeFilter = equipe.data._source

        this.servidoresMinhaEquipe(this.equipeFilter)
    },
    async servidoresMinhaEquipe(equipe){
        try {
            this.servidores = []
            this.load = true
            const response = await api.post("servidores/_search", {
                from: 0,
                size: 2000
            })
            const servidores = response.data.hits.hits

            servidores.forEach(x => {
                equipe.equipe.forEach(y => {
                    if(y == x._id){
                        this.servidores.push(x._source)
                    }
                })
            })

        } catch (error) {
            console.log("error carga");
        }finally{
            this.load = false
        }
    },
    async findServidor(item){
        const cpf = this.apenasNumeros(item)

        const newServidor = await this.findServidorElastic(parseInt(cpf))
       
        const servidor = newServidor.data._source
 
        
        if(servidor){
            this.servidorOne = servidor
        } else {
            this.servidorOne = {}
            this.erro = 'Servidor não encontrado'
        }
    },
    async addServidorequipe(item){
        const idServidor = item

        const isServidorNaEquipe = await this.findServidorNaSuaEquipe(idServidor)
        if(isServidorNaEquipe){
            return true
        }

        this.equipeFilter.equipe.push(idServidor)
        this.servidores.push(this.readServidorOne)

        this.limparServidor()

        try {
            const response = await api.post(`equipe/_doc/${parseInt(this.readEquipe.idGestor)}`, this.readEquipe)
        } catch (error) {
            console.log("error salvar add equipe")
        } finally {
            await this.setEquipe(parseInt(this.readLogin.id))
            this.verifyLastAvaliation()
        }

        this.excluirServidorEquipe(idServidor)
    },
    async excluirServidorEquipe(item){
        const idServidor = item

        const isAvaliacaoServidor = await this.findAvaliacaoPorCpf(idServidor)
        if(isAvaliacaoServidor){
            console.log('servidor com avaliação', idServidor);
            return
        }

        try {
            let equipe = await this.findServidorEquipe(parseInt(idServidor))

            if(equipe.idGestor){
                equipe.equipe = equipe.equipe.filter(x => x != idServidor)
            }

            const response = await api.post(`equipe/_doc/${equipe.idGestor}`, equipe)

        } catch (error) {
            console.log("erro: nao apagou o servidor a equipe");
        }
    },
    async excluirIdEquipe(data){
        try {  
            //excluir isso?
            let ava
            this.avaliacao.forEach(x => {
                 if(x.idGestor == data.idGestor){
                     x.equipe = data.equipe
                     ava = x
                 }
             })

             this.equipeFilter = {...data}
     
             const response = await api.post(`equipe/_doc/${data.idGestor}`, data)
         
        } catch (error) {
             console.log("erro: nao excluiu");
        } 
    },
    async findAvaliacaoPorCpf(item){
        const cpf = this.apenasNumeros(item)
        try {
            const response = await api.post('avaliacao/_search', {
                "query": {
                    "bool": {
                        "must":[
                            {
                                "match":{
                                    "idServidor": parseInt(cpf)
                                }
                            },
                            {
                                "match_phrase":{
                                    "periodo" : this.dadosNewAvaliation.referencia
                                }
                            }
                        ]
                    }
                }
            })
            return response.data.hits.total.value

        } catch (error) {
            // console.log("erro elastic 7");
        }
    },
    limparServidor(){
        this.servidorOne = {}
        this.erro = ''
    },
    avaliarEquipe(cpf){
        const equipe = this.avaliacao.find(x => x.idGestor == cpf)
        return equipe
    },
    apenasNumeros(str) {
        try {
            return str.replace(/\D/g, '');
        } catch (error) {
            return str
        }
    },
    converter(date){
        let data = date.split('-',).reverse().join('/')
        return data
    },
    limpar(){
        this.isLogin = {}
        this.erro = ''
        this.saveUserData()

    },
    verificarServidorNaequipe(item){
        console.log("verificar servidor na equipe");
    },
    async saveAvaliacaoServidor(item){
       if(await this.findAvaliacaoPorCpf(item.idServidor)) return false
        
        const avaliacao = {
            idServidor: item.idServidor,
            idAvaliador: item.idAvaliador,
            criterios: [...item.criterios],
            comments: item.comments,
            dateFirstAvaliation: item.dateFirstAvaliation,
            updateDate: [],
            periodo: this.dadosNewAvaliation.referencia
        }
        
        let critArray =  avaliacao.criterios.map(x => Object.values(x).join(', '))

        if(critArray == 0){
            return false
        }
    
        try {
            this.load = true
            const response = await api.post("avaliacao/_doc", {
                "idServidor": avaliacao.idServidor,
                "idAvaliador": avaliacao.idAvaliador,
                "criterios": critArray,
                "comments": avaliacao.comments,
                "dateFirstAvaliation": avaliacao.dateFirstAvaliation,
                "updateDate": avaliacao.updateDate,
                "periodo": avaliacao.periodo
            })

            avaliacao.idu = response.data._id 

            this.allAvaliations.push(avaliacao)
            
        } catch (e) {
            console.log(e);
            console.log("erro elastic 9");
        } finally {
            this.load = false
            this.verifyLastAvaliation()
        }
    },
    async deleteAvaliacao(item){
        try {
            const resp = await api.delete(`avaliacao/_doc/${item}`)
            this.allAvaliations = this.allAvaliations.filter(x => x.idu != item)
        } catch (error) {
            console.log('erro ao deletar avaliação');
        }
    },
    foundAvaliationServidor(item){
        this.servidorAvaliado = {}
        const avaliacao = this.allAvaliations.find(x => x.idServidor == item)
        this.servidorAvaliado = avaliacao
    },
    saveUpdateAvaliacaoServidor(item){
        let date = Date.now()
        let objeto = { ...item }

        objeto.updateDate.push(date)

        this.atualizarObjeto(this.allAvaliations, objeto);
        this.editAvaliationElastic(objeto)
    },
    atualizarObjeto(array, novoObjeto) {
        const index = array.findIndex(obj => obj.idServidor === novoObjeto.idServidor);
        // Verificar se o objeto foi encontrado
        if (index !== -1) {
          // Atualizar o objeto
          array[index] = { ...array[index], ...novoObjeto };
        } else {
          console.log('Objeto com o id não encontrado.');
        }
    },
    arrayToObjetct(arraySimples){
        const arrayDeObjetos = [];
        for (let i = 0; i < arraySimples.length; i++) {
            let novo = arraySimples[i].split(',')
            const obj = {
                id: novo[0],
                nota: novo[1],
            };
            arrayDeObjetos.push(obj);
        }
        return arrayDeObjetos
    },
    async findServidorElastic(cpf){
        try {
            this.load = true
            const response = await api.get(`servidores/_doc/${cpf}`)
            return response
        } catch (error) {
            console.log("erro: elastic 1");
            this.erro = 'Servidor não encontrado'
            this.servidorOne = {}
        } finally {
            this.load = false
        }
    },
    async findEquipeElastic(cpf){
        try {
            this.load = true
            const response = await api.get(`equipe/_doc/${cpf}`)
            return response
        } catch (error) {
            console.log("erro: elastic 2");
        } finally {
            this.load = false
        }
    },
    async findServidorEquipe(cpf){
        try {
            this.load = true
            const idGestor = this.readLogin.id
            const response = await api.get('equipe/_search')

            let equipe = response.data.hits.hits.filter(x => x._id != idGestor).map(x => x._source)
            
            let findEquipe

            const fun = await equipe.forEach( x => {
                if(x.equipe.includes(cpf)){
                    findEquipe = x
                }
            })

            return findEquipe

        } catch (error) {
            console.log("erro: elastic 3");
        } finally {
            this.load = false
        }
    },
    async findServidorNaSuaEquipe(cpf){
        try {
            this.load = true
            const idGestor = this.readLogin.id
            const response = await api.get(`equipe/_doc/${idGestor}`)

            return response.data._source.equipe.includes(cpf)

        } catch (error) {
            console.log("erro: elastic 8");
        } finally {
            this.load = false
        }
    },
    async findAllAvaliacaoGestor(){
        try {
            this.load = true
            const response  = await api.post('avaliacao/_search', {
                from: 0,
                size: 1000,
                "query": {
                    "bool": {
                        "must":[
                            {
                                "match":{
                                    "idAvaliador": this.readLogin.id
                                }
                            },
                            {
                                "match_phrase":{
                                    "periodo" : this.dadosNewAvaliation.referencia
                                }
                            }
                        ]
                    }
                }
            })
            let data = response.data.hits.hits

            this.allAvaliations = []

            data.forEach(x => {
                let dados = {}
                dados = { ...x._source }
                dados.idu = x._id
                dados.criterios = this.arrayToObjetct(dados.criterios)
                this.allAvaliations.push(dados)
            })

        } catch (error) {
            console.log("erro elastic 4");
        } finally{
            this.load = false
        }
    },
    async findAllAvaliacaoGestorId(idGestor){
        try {
            this.load = true
            const response  = await api.post('avaliacao/_search', {
                from: 0,
                size: 1000,
                "query": {
                    "bool": {
                        "must":[
                            {
                                "match":{
                                    "idAvaliador": parseInt(idGestor)
                                }
                            },
                            {
                                "match_phrase":{
                                    "periodo" : this.dadosNewAvaliation.referencia
                                }
                            }
                        ]
                    }
                },
                "min_score": 0.03
            })
            let data = response.data.hits.hits

            this.allAvaliations = []

            data.forEach(x => {
                let dados = {}
                dados = { ...x._source }
                dados.idu = x._id
                dados.criterios = this.arrayToObjetct(dados.criterios)
                this.allAvaliations.push(dados)
            })
         } catch (error) {
            console.log("erro elastic 4");
        } finally{
            this.load = false
            this.findOneAavaliationServidorCPF(idGestor)
        }
    },
    async findOneAavaliationServidor(uid){
        try {
            const response = await api.get(`avaliacao/_doc/${uid}`)
            this.servidorAvaliado = { ...response._source }
            this.servidorAvaliado.idu = response._id
            
        } catch (error) {
            console.log("erro elasctic 5");
        }
    },
    async findOneAavaliationServidorCPF(idGestor){
        try {
            const response  = await api.post('avaliacao/_search', {
                from: 0,
                size: 10,
                "query": {
                            
                    "match":{
                        "idServidor": parseInt(idGestor)
                    }
                            
                }
            })
            let data = response.data.hits.hits

            data.forEach(x => {
                let dados = {}
                dados = { ...x._source }
                dados.idu = x._id
                dados.criterios = this.arrayToObjetct(dados.criterios)
                this.allAvaliations.push(dados)
            })
        } catch (error) {
            console.log("erro elasctic avaliacao por cpf");
        }
    },
    async editAvaliationElastic(item){
        const avaliacao = {...item}
        let critArray =  avaliacao.criterios.map(x => Object.values(x).join(', '))
        avaliacao.criterios = critArray
        avaliacao.periodo = this.dadosNewAvaliation.referencia

        try {
            this.load = true
            const response = await api.post(`avaliacao/_doc/${item.idu}`, avaliacao)

        } catch (e) {
            console.log(e);
        } finally {
            this.load = false
            this.verifyLastAvaliation()
        }
    },
    async searchServidores(search){
        try {
            const response = await api.post('servidores/_search', {
                "query":{
                    "match":{
                        "nome": search
                    }
                }
            })
            return response

        } catch (error) {
            console.log("erro elastic 12");
        }
    },
    async searchAdmServidores(){
        try {
            const response = await api.post('servidores/_search', {
                "query":{
                    "match":{
                        "perfil": 5
                    }
                }
            })
            return response.data.hits.hits

        } catch (error) {
            console.log("erro elastic adm servidores");
        }
    },
    async updatePerfil(item){
        try {
            const resp = await api.post(`servidores/_doc/${item.id}`, item)
            this.login = {...item}
        } catch (error) {
            console.log('erro ao editar o perfil');
        }
    },
    //Finalizar avaliacoes Ciclo
    async finalizarAvaliacaoEquipe(item){
        try {
            this.loadFinalizar = true
            const object = {
                gestorId: item.id,
                dateAvaliacaoFirst: Date.now(),
                refAvaliation: this.dadosNewAvaliation.referencia
            }
            const response = await api.post('finalizadas/_doc', object) 
            object.id = response.data._id 
            this.avaliacaoFinalizada = object
        } catch (error) {
            console.log('erro finalizar elastic');
        } finally {
            this.loadFinalizar = false
        }
    },
    async getAvaliacaoFinalizada(){
        const cpf = this.apenasNumeros(this.isLogin.id)
        try {
            const response = await api.post('finalizadas/_search', {
                "query": {
                    "bool": {
                        "must":[
                            {
                                "match":{
                                    "gestorId": parseInt(cpf)
                                }
                            },
                            {
                                "match_phrase":{
                                    "refAvaliation": this.dadosNewAvaliation.referencia
                                }
                            }
                        ]
                    }
                }
            })
            this.avaliacaoFinalizada = response.data.hits.hits[0]._source
            this.avaliacaoFinalizada.id = response.data.hits.hits[0]._id
        } catch (error) {
            // console.log("erro elastic 7");
        }
    },
    finalizarAvaliacaoDelete(){
        try {
            const response = api.delete(`finalizadas/_doc/${this.avaliacaoFinalizada.id}`)
            this.avaliacaoFinalizada = null
        } catch (error) {
            console.log('erro apagar avaliacao finalizada no elastic');
        }
    },
    async showAvaliacaoFinalizadaServidor(idAvaliador){
        try {
            const response = await api.post('finalizadas/_search', {
                "query": {
                    "bool": {
                        "must": [
                            {
                            "match": {
                                "gestorId": parseInt(idAvaliador)
                                }
                            },
                            {
                            "match_phrase": {
                                "refAvaliation": this.dadosNewAvaliation.referencia
                                }
                            }
                        ]
                    }
                }
            })
            this.isFinalizada = !!response.data.hits.hits[0]._id
        } catch (error) {
            // console.log("erro elastic 7");
        }
    },
    //tratamento nao avaliados
    async getTratarNaoAvaliados(){
        try {
            this.naoAvaliadosServidores = []

            const response = await api.get('tratamento/_search')
            response.data.hits.hits.forEach(x => {
                const objeto = { 
                    id: x._id, 
                    ...x._source
                }
                this.naoAvaliadosServidores.push(objeto)
            })
        } catch (error) {
            console.log('erro tratamento nao avaliados');
        }
    },
    async tratarNaoAvaliados(item){
        try {
            const objeto = {
                ...item, 
                operador: this.readLogin.id, 
                date: Date.now()
            }

            const response = await api.post('tratamento/_doc', objeto) 
            console.log(response.data._id);
            objeto.id = response.data._id
            this.naoAvaliadosServidores.push(objeto)
        } catch (error) {
            console.log('erro tratamento nao avaliados');
        }
    },
    async editTratarNaoAvaliados(item){
        try {
            const response = await api.put(`tratamento/_doc/${item}`)
        } catch (error) {
            console.log('erro tratamento nao avaliados');
        }
    },
    //funcoes
    completarComZeros(numero) {
        try {
            let numeroStr = numero.toString();
            let zerosFaltando = 11 - numeroStr.length;
        
            for (let i = 0; i < zerosFaltando; i++) {
                numeroStr = '0' + numeroStr;
            }
            return numeroStr;
        } catch (error) {
            return numero
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
    //storage
    saveUserData() {
        sessionStorage.setItem('userData', JSON.stringify(this.readLogin));
    },
    loadUserData() {
        try {
            const data = sessionStorage.getItem('userData');
            if (data) {
                const login = {
                    login: JSON.parse(data).id,
                    dn: JSON.parse(data).dn
                } 
                if(login.login) this.loginLocalStorage(login)
            }
        } catch (error) {
            console.log('erro storage load data');
        } finally {
            
        }
    },
    async loginLocalStorage(login){
        this.loadUpdatePage = true
        this.limpar()
        try {
            const user = (await this.findServidorElastic(parseInt(login.login))).data._source

            if(user.id == login.login && user.dn == login.dn){
                await this.setEquipe(login.login)
                await this.findAllAvaliacaoGestorId(user.id)
                this.isLogin = user  
                this.saveUserData()
            }
            else {
                this.erro = 'CPF e/ou Data de Nacimento incorreto(s)'
            }
        }catch{
            console.log('error local storage');
        } finally {
            this.loadUpdatePage = false
        }
    },
    converterInverse(date){
        try {
            let data = date.split('-').reverse().join('/')
            return data
        } catch (error) {
            return date
        }
        
    },
    converterInverseNew(date){
        try {
            let data = date.split('/').reverse().join('-')
            return data
        } catch (error) {
            return date
        }
        
    },
    //relatorio
    async cargaServidores(){
        try {
            this.servidores = []
            const response = await api.post("servidores/_search", {
                from: 0,
                size: 2000
            })
            const servidores = response.data.hits.hits

            servidores.forEach(x => {
                this.servidores.push(x._source)
            })

        } catch (error) {
            console.log("error carga");
        }
    },
    async cargaEquipe(){
        try {
            this.avaliacao = []
            
            const response = await api.post("equipe/_search", {
                from: 0,
                size: 2000
            })
            const avaliacao = response.data.hits.hits

            avaliacao.forEach(x => {
                this.avaliacao.push(x._source)
            })

        } catch (error) {
            console.log(error);
        } 
    },
    async allAvaliationsSefaz(){
        try {
            this.avaliacaoSefaz = []
            const response = await api.post('avaliacao/_search', {
                from: 0,
                size: 5500
            })

            const avaliacao = response.data.hits.hits

            avaliacao.forEach(x => {
                const objeto = {
                    ...x._source,
                    idu: x._id
                }
                this.avaliacaoSefaz.push(objeto)
            })
        } catch (error) {
            console.log("elastic erro 11");
        }
    },
    cargaIncialrelatorio(){
        this.load = true
        try {
            this.listAvaliationsInit()
            this.cargaServidores()
            this.cargaEquipe()
            this.allAvaliationsSefaz()
            this.getTratarNaoAvaliados()
        } catch (error) {
            console.log('carga inicial erro');
        } finally {
            this.load = false
        }
    },
    async createServidorElastic(item){
        const response = await api.post(`servidores/_doc/${item.id}`, item)
    },
    addServidorListAll(servidor){
        this.servidores.push(servidor)
    },
    //configuracao
    async pageInicial(){
        try {
            const response = await api.get('pagehome/_doc/1')
            this.pageInitial = response.data._source
        } catch (error) {
            console.log(error);
        }
    },
    async editPageInitial(item){
        try {
            const response = await api.put('pagehome/_doc/1', item)
            this.pageInitial = { ...item }
        } catch (error) {
            console.log("error edit page initial");
        }
    },
    async criteriosCarga(){
        try {
            const response = await api.get('criteriosdata/_search')
            this.dadosCriterios = response.data.hits.hits
        } catch (error) {
            console.log(error);
        }
    },
    async editCreteriosData(item){
        try {
            const response = api.put(`criteriosdata/_doc/${item.id}`, item)
            this.criteriosCarga()
        } catch (error) {
            console.log("erro editar criterios data");
        }
    },
    //ciclo de avaliações
    async avaliationInit(){
        try {
            const response = await api.post('dadosavaliation/_search', {
                "query": {
                    "match": {
                        "status": true
                    }
                }
            })
            this.dadosNewAvaliation = response.data.hits.hits[0]._source
            this.dadosNewAvaliation.id = response.data.hits.hits[0]._id
        } catch (error) {
            console.log(error);
        }
    },
    async listAvaliationsInit(){
        try {
            const response = await api.get('dadosavaliation/_search')
        
            const ciclosAvaliations = response.data.hits.hits

            ciclosAvaliations.forEach(x => {
                let dados = { ...x._source}
                dados.id = x._id
                this.listCicloAvaliations.push(dados)
            })
        } catch (error) {
            console.log(error);
        }
    },
    async saveDadosNewAvaliation(item){
        try {
            const response = await api.post('dadosavaliation/_doc', item)
            this.listCicloAvaliations.push({ ...item }) 
        } catch (error) {
              console.log("erro salvar nova data de avaliacao");
        }
    },
    async editDadosNewAvaliation(item){
        const id = item.id
        let objeto = {...item}
        delete objeto.id
        try {
            const response = await api.put(`dadosavaliation/_doc/${id}`, objeto)
            objeto.id = id
            this.atualizarObjeto(this.listCicloAvaliations, objeto);
            if(objeto.status){
                this.dadosNewAvaliation = {...objeto}
            }
        } catch (error) {
            console.log("erro editar ciclo de avaliacao");
        }
    },
    cargaInicial(){
        this.loadInit = true
        try {
            this.pageInicial()
            this.criteriosCarga()
            this.avaliationInit()
            this.listAvaliationsInit()
        } catch (error) {
            console.log('erro carga inicial');
        } finally {
            this.loadInit = false
        }
    },
    //pesquisa de satisfação
    async getPesquisaSatisfacao(){
        try {
            this.listPesquisaSatisfacao = []
            const resp = await api.post('pesquisasatisfacao/_search', {
                "query": {
                    "bool": {
                        "must":[
                            {
                                "match_phrase":{
                                    "user": parseInt(this.readLogin.id)
                                }
                            },
                            {
                                "match_phrase":{
                                    "ref" : this.dadosNewAvaliation.referencia
                                }
                            }
                        ]
                    }
                }
            })

            const avaliacao = resp.data.hits.hits

            avaliacao.forEach(x => {
                console.log(x);
                this.listPesquisaSatisfacao.push(x._source)
            })

        } catch (error) {
            console.log('erro get pesquisa satisfacao');
        }
        
    },
    async savePesquisaSatisfacao(item){
        let nova = {}
        nova.id = this.readDadosNewAvaliation.id //mesma daddos newavaliation
        nova.ref = this.readDadosNewAvaliation.referencia
        nova.user = this.readLogin.id
        nova.notas =  item.map(x => Object.values(x).join(', '))
        nova.date = Date.now()

        try {
            const resp = await api.post('pesquisasatisfacao/_doc', nova)
            this.listPesquisaSatisfacao.push(nova)
        } catch (error) {
            console.log('erro pesquisa de satisfacao');
        }
    },
    //descartar
    DsetEquipe(cpf){
        // this.minhaEquipe(cpf)
        const foundEquipe = this.avaliacao.find(x => x.idGestor == cpf)
        console.log(foundEquipe);
        this.equipeFilter = foundEquipe
    },
    verifyLastAvaliation(){
        try {
            let totalEquipe = this.readEquipe.equipe.length
            let totalAvaliations = this.readAllAvaliationsServidoresEquipe.length
            let conta = totalEquipe -totalAvaliations
            if(conta == 1 || conta == 0){
                this.sendMailLastAvaliation = true
            }
        } catch (error) {
            this.sendMailLastAvaliation = false
            console.log('erro contar error')
        }
        
    },
    async loginMalha(){
        const data = await sessionStorage.getItem('userData');

        if (data) {
            const login = {
               login: JSON.parse(data).id,
               dn: JSON.parse(data).dn
            } 
            if(login.login) {
                
                try {
                    const user = (await this.findServidorElastic(parseInt(login.login))).data._source

                    if(user.id == login.login && user.dn == login.dn){
                        await this.setEquipe(login.login)
                        this.isLogin = user  
                        this.saveUserData()
                        return await this.isLogin
                    }
                }catch{
                    console.log('error local storage');
                }

            }
       }
        
    },
    async updateAvaliacao(itemId){
        try {
            const resp = await api.get(`avaliacao/_doc/${itemId}`)
   
            let objeto = {...resp.data._source}
            objeto.periodo = "08/2024"
            const response = await api.post(`avaliacao/_doc/${itemId}`, objeto)
            console.log("sucesso", objeto)
        } catch (error) {
            console.log("deu ruim", error);
        }
    },
    async encerrarCiclo(){
        try {
            const resp = await api.get('pagehome/_doc/1')

            this.periodoEncerrado = resp.data._source.finalizarciclo
        } catch (error) {
            console.log('erro ao encerrar o periodo');
        }
    }
  }
});