<template>
    <!-- {{ todasAvaliacoes.find(x => x.idServidor == '44456840315') }}
    <v-list>
        <v-list-item v-for="item, i in periodoVazio" :key="i" class="border-b">
            {{ item.date }} - {{ item }}
            <template v-slot:append>
                <v-btn variant="tonal" @click="alterar(item.id)">
                    ok
                </v-btn>
            </template>
        </v-list-item>
    </v-list> -->
    <!-- <div v-for="item, i in ajustes" :key="i">
        {{i}} - {{ item.idAvaliador }} <br> {{ item.grupo.length }} <br>
        {{ item.grupo.filter(y => y.periodo == '05/2024').length }} - {{ item.grupo.filter(x => x.periodo == '08/2024').length }}
    </div> -->
    <v-card text="Filtros" variant="outlined" color="grey" class="mb-5">
        <v-card-text class="text-black">
            <div class="d-flex justify-space-between align-center">
                <v-text-field   
                    style="max-width: 480px;"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    v-model="search.nome"
                    label="Nome" placeholder="digite o nome" variant="outlined" density="compact">
                </v-text-field>
                <v-select
                    variant="outlined" density="compact"
                    label="Cargos"
                    :items="listCargosServidores"
                    style="max-width: 50%;"
                    v-model="search.cargos"
                    prepend-inner-icon="mdi-account-tie"
                    class="ml-2"
                    clearable
                    multiple
                ></v-select>
            </div>
            <div class="d-flex justify-space-between align-center">
                <v-select
                    variant="outlined" density="compact"
                    label="Avaliação"
                    :items="avaliacaoText"
                    style="max-width: 50%;"
                    v-model="search.avaliacao"
                    prepend-inner-icon="mdi-numeric-10-box"
                    clearable
                ></v-select>
                <v-autocomplete
                    variant="outlined" density="compact"
                    prepend-inner-icon="mdi-account-tie"
                    v-model="search.avaliador"
                    label="Avaliador"
                    :items="avaliadores"
                    item-title="nome"
                    item-value="id"
                    class="ml-2"
                    persistent-hint
                    return-object
                    style="max-width: 50%;"
                    single-line
                    clearable=""
                ></v-autocomplete>
                
            </div>
            <div class="d-flex justify-space-between align-center">
                <div style="max-width: 50%;">
                    <v-radio-group inline v-model="search.tipo" density="compact" label="1º ciclo">
                        <v-radio label="Todos" value="all"></v-radio>
                        <v-radio label="Apenas avaliados" value="two"></v-radio>
                        <v-radio label="Apenas não avaliados" value="three"></v-radio>
                    </v-radio-group>
                    <v-radio-group inline v-model="search.tipo2" density="compact" label="2º ciclo">
                        <v-radio label="Todos" value="all"></v-radio>
                        <v-radio label="Apenas avaliados" value="two"></v-radio>
                        <v-radio label="Apenas não avaliados" value="three"></v-radio>
                    </v-radio-group>
                </div>
                <v-switch color="success" v-model="isTaf" label="Apenas grupo TAF"></v-switch>
            </div>
            <v-btn @click="limpar()" variant="text">Limpar</v-btn>
        </v-card-text>
    </v-card>
    <div class="d-flex justify-space-between align-center">
        <div>
            <p>Total: {{ listaNova.length }} <span v-if="listNovaExibir.length < listaNova.length"> - Filtrados: {{ listNovaExibir.length }}</span> </p>
        </div>
        <div id="exportar">
            <v-btn variant="outlined" color="success" class="mb-2" v-on:click="exportar" prepend-icon="mdi-file-excel-box-outline">Exportar</v-btn>
        </div>
    </div>
    <v-table
      height="60vh"
      fixed-header
      density="compact"
      hover
      v-if="listNovaExibir.length"
    >
      <thead>
        <tr>
          <th class="text-left">
            Nome
          </th>
          <th class="text-left">
            CPF
          </th>
          <th class="text-left">
            Cargo
          </th>
          <th class="text-left">
            Unidade
          </th>
          <th class="text-left">
            1º Ciclo
          </th>
          <th class="text-left">
            Data Avaliação
          </th>
          <th class="text-left">
            2º Ciclo
          </th>
          <th class="text-left">
            Data Avaliação
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in listNovaExibir"
          :key="item.name"
        >
          
          <td :title="item.idAvaliador">{{ item.nome }}</td>
          <td>{{ formatCpf(item.id) }}</td>
          <td>{{ item.cargo }}</td>
          <td style="max-width:150px">{{ item.lotacao }}</td>
          <td v-if="item.maio_pontos">{{ item.maio_pontos }}</td>
          <td v-else>-</td>
          <td v-if="item.maio_date">{{ formatteDate(item.maio_date) }}</td>
          <td v-else>-</td>
          <td v-if="item.agosto_pontos">{{ item.agosto_pontos }}</td>
          <td v-else>-</td>
          <td v-if="item.agosto_date">{{ formatteDate(item.agosto_date) }}</td>
          <td v-else>-</td>
          <!-- <td><v-btn @click="alterar(item.idu)">ok</v-btn></td> -->
        </tr>
      </tbody>
      
    </v-table>
    <div v-else>
        Não há resultados
    </div>
  </template>

<script>
    import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
    const avaliacaoStore = useAvaliacaoStore() 

    import gestores from './notaGestores.vue'
    import tratarnaoaval from './tratarNaoAval.vue'

    import moment from 'moment'
    import 'moment/locale/pt-br'


    export default {
        components:{ gestores, tratarnaoaval},
        data () {
            return {
                search:{
                    nome: '',
                    avaliador: '',
                    unidade: '',
                    tipo: 'all',
                    tipo2: 'all',
                    avaliacao: '',
                    cargos: [],
                    ciclo: ''
                },
                avaliacaoText:['Crítico', 'Baixo', 'Regular', 'Bom', 'Ótimo'],
                taf:[ "AGENTE RECEITA ESTADUAL", "AUDITOR FISCAL DA RECEITA ESTADUAL", "Gestor da receita estadual V", "AUDITOR", "AGENTE DA RECEITA ESTADUAL" ],
                isTaf: false,
                avalmedia: [],
                naoaval:[]
            }
        },
        computed:{
            unidades(){
                let list = this.servidores.map(x => x.lotacao)
                list = [...new Set(list)]
                return list
            },
            avaliadores(){
                let list = avaliacaoStore.readAvaliacao.map(x => x.idGestor)
                let newList = []

                this.servidores.forEach(x => {
                    list.forEach(a =>{
                        if(a == x.id){
                            newList.push(x)
                        }
                    })
                })
                return newList
            },
            servidores(){
                let list = avaliacaoStore.readServidores
                return list
            },
            listEquipe(){
                return avaliacaoStore.readAvaliacao
            },
            allServidores(){
                let list = []
                this.servidores.forEach( x=> {
                    this.allServidoresAvaliados.forEach(s => {
                        if(x.id == s.idServidor){
                            x.nota = true
                            x.pontos = this.pontos(s.criterios)
                            x.avaliador = s.idAvaliador
                            x.periodo = s.periodo
                        } 
                    })
                    list.push(x)
                })
                return list
            },
            allServidoresAvaliados(){
                let list = avaliacaoStore.readSefazAvalaidos.filter(x => x.periodo == this.search.ciclo)
                return list
            },
            allServidorescomNota(){
                let list = this.allServidores

                if(this.readAvaliadosComMedia){
                    this.avalmedia = list.filter(x => this.readAvaliadosComMedia.includes(x.avaliador))
                    this.naoaval = list.filter(x => !x.nota)
                }

                if(this.search.tipo == 'two') list = list.filter(x => x.nota)
                if(this.search.tipo == 'three') list = list.filter(x => !x.nota)
                
                if(this.search.unidade) list =list.filter(x => x.lotacao == this.search.unidade) 

                if(this.search.nome){
                    let search = this.search.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                    let exp = new RegExp(search.trim().replace(/[\[\]!'@><|//\\&*()_+=]/g, ""), "i")
                    list =  list.filter(item => exp.test(item.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "") ) )
                }

                if(this.search.avaliacao){
                    switch(this.search.avaliacao){
                        case 'Crítico':
                            list = list.filter(x => x.pontos >= 0 && x.pontos <= 20)
                            break
                        case 'Baixo':
                            list = list.filter(x => x.pontos >= 21 && x.pontos <= 40)
                            break
                        case 'Regular':
                            list = list.filter(x => x.pontos >= 41 && x.pontos <= 60)
                            break
                        case 'Bom':
                            list = list.filter(x => x.pontos >= 61 && x.pontos <= 80)
                            break
                        case 'Ótimo':
                            list = list.filter(x => x.pontos >= 81 && x.pontos <= 100)
                            break

                        default:
                            list = list
                    }
                }

                if(this.search.avaliador){
                    let newList = []
                    this.listEquipe.forEach(eq => {
                        if(eq.idGestor == this.search.avaliador.id){
                            list.forEach(l => {
                                if(eq.equipe.includes(l.id)) newList.push(l)
                            })
                        }
                    })
                    list = newList
                }
                if(this.search.cargos.length){
                    list = list.filter(x => this.search.cargos.includes(x.cargo))
                }

                if(this.search.ciclo){
                    list = list.filter(x => x.periodo == this.search.ciclo && x.nota || x.tratado)
                }
                if(this.isTaf){
                    list = list.filter(x => this.taf.includes(x.cargo))
                }

                return list
            },
            listCargosServidores(){
                let list = this.servidores.map(x => x.cargo)
                list = [...new  Set(list)]
                return list
            },
            listCiclo(){
                return avaliacaoStore.readListCiclosAvaliations.map(x => x.referencia)
            },
            readAvaliadosComMedia(){
                return avaliacaoStore.readAvaliacaoComMedia
            },
            notaGestores(){
                let list = this.avalmedia.reduce((acc, atual) => {
                    const gestorExiste = acc.find(c => c.avaliador === atual.avaliador);

                    if (gestorExiste){
                        gestorExiste.avaliados.push({id: atual.id, nota: atual.pontos})
                    } else {
                        acc.push({
                            avaliador: atual.avaliador,
                            nome: this.servidores.find( x => x.id == atual.avaliador).nome,
                            avaliados: [{id: atual.id, nota: atual.pontos}]
                        })
                    }
                    return acc
                }, [])
                return list
            },
            readNaoAvaliados(){
                return this.naoaval.filter(x => this.taf.includes(x.cargo))
            },
            readTratados(){
                return avaliacaoStore.readNaoAvaliados
            },
            todasAvaliacoes(){
                let list = avaliacaoStore.readSefazAvalaidos
                return list
            },
            listaNova(){
                const list = this.servidores

                let novalist = []

                list.forEach(s => {
                    let objeto = {...s}

                    this.todasAvaliacoes.forEach(a => {
                       if(s.id == a.idServidor){
                            objeto.idu = a.idu
                            objeto.ciclo = a.periodo
                            objeto.ciclo = a.idAvaliador
                            
                            // if(a.periodo == '') {
                            //     objeto.maio = 'sim'
                            //     objeto.maio_pontos = this.pontos(a.criterios)
                            //     objeto.maio_date = a.dateFirstAvaliation
                            // }
                        
                            if(a.periodo == '05/2024') {
                                objeto.maio = 'sim'
                                objeto.maio_pontos = this.pontos(a.criterios)
                                objeto.maio_date = a.dateFirstAvaliation
                            }
                            if(a.periodo != '05/2024') {
                                objeto.agosto = 'sim'
                                objeto.agosto_pontos = this.pontos(a.criterios)
                                objeto.agosto_date = a.dateFirstAvaliation
                            }
                       }
                    })

                    novalist.push(objeto)
                })
                return novalist
            },
            listNovaExibir(){
                let list = this.listaNova

                if(true){
                    list = list.filter(x => !this.readAvaliadosComMedia.includes(x.id) )
                }

                if(this.search.nome){
                    let search = this.search.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                    let exp = new RegExp(search.trim().replace(/[\[\]!'@><|//\\&*()_+=]/g, ""), "i")
                    list =  list.filter(item => exp.test(item.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "") ) )
                }

                if(this.search.cargos.length){
                    list = list.filter(x => this.search.cargos.includes(x.cargo))
                }

                if(this.isTaf){
                    list = list.filter(x => this.taf.includes(x.cargo))
                }

                if(this.search.tipo == 'two') list = list.filter(x => x.maio_pontos)
                if(this.search.tipo == 'three') list = list.filter(x => !x.maio_pontos)

                if(this.search.tipo2 == 'two') list = list.filter(x => x.agosto_pontos)
                if(this.search.tipo2 == 'three') list = list.filter(x => !x.agosto_pontos)

                if(this.search.unidade) list =list.filter(x => x.lotacao == this.search.unidade) 

                if(this.search.avaliacao){
                    switch(this.search.avaliacao){
                        case 'Crítico':
                            list = list.filter(x => x.agosto_pontos >= 0 && x.agosto_pontos <= 20)
                            break
                        case 'Baixo':
                            list = list.filter(x => x.agosto_pontos >= 21 && x.agosto_pontos <= 40)
                            break
                        case 'Regular':
                            list = list.filter(x => x.agosto_pontos >= 41 && x.agosto_pontos <= 60)
                            break
                        case 'Bom':
                            list = list.filter(x => x.agosto_pontos >= 61 && x.agosto_pontos <= 80)
                            break
                        case 'Ótimo':
                            list = list.filter(x => x.agosto_pontos >= 81 && x.agosto_pontos <= 100)
                            break

                        default:
                            list = list
                    }
                }

                if(this.search.avaliador){
                    let newList = []
                    this.listEquipe.forEach(eq => {
                        if(eq.idGestor == this.search.avaliador.id){
                            list.forEach(l => {
                                if(eq.equipe.includes(l.id)) newList.push(l)
                            })
                        }
                    })
                    list = newList
                }

                return list
            },
            periodoVazio(){   
                const list = this.todasAvaliacoes.map(x => {
                    return{
                        id: x.idu,
                        date: this.formatteDate(x.dateFirstAvaliation),
                        periodo: x.periodo,
                        avaliador: x.idAvaliador,
                        servidor: x.idServidor
                    }
                }).filter(x => x.servidor == '9374507315 ')
                return list
            },
            ajustes(){
                let list = this.todasAvaliacoes.reduce((acc, item) => {
                    const avaliadorExiste = acc.find(c => c.idAvaliador === item.idAvaliador);

                    if(avaliadorExiste){
                        avaliadorExiste.grupo.push({id: item.idServidor, periodo: item.periodo })
                    } else {
                        acc.push({
                            idAvaliador: item.idAvaliador,
                            grupo:[{id: item.idServidor, periodo: item.periodo }]
                        })
                    }
                    return acc;
                }, [])
                return list
            }
        },
        methods:{
            pontos(arraySimples){
                try {
                    
                    const arrayDeObjetos = [];
                    for (let i = 0; i < arraySimples.length; i++) {
                        let novo = arraySimples[i].split(',')
                        const obj = {
                            id: novo[0],
                            nota: novo[1],
                        };
                        arrayDeObjetos.push(parseInt(obj.nota));
                    }
                    let soma = arrayDeObjetos.reduce((acc, valorAtual) => acc + valorAtual, 0)
                    return soma
                } catch (error) {
                    return "erro calculo"
                }
            },
            formatCpf(cpf){
                return avaliacaoStore.completarComZeros(cpf)
            },
            limpar(){
                this.search = {
                    nome: '',
                    avaliador: '',
                    unidade: '',
                    tipo: 'all',
                    avaliacao: '',
                    ciclo: '',
                    cargos: []
                }
            },
            exportar() {
                function _clean(n) {
                    return '"' + n.toString().replace('"', '').replace(",", "") + '"';
                }
                let planilha = this.listNovaExibir.map(a => 
                    [
                        _clean(a.matricula?.toString() ?? ""), 
                        _clean(a.nome ?? ""), 
                        _clean(a.cargo ?? ""), 
                        _clean(a.lotacao ?? ""), 
                        _clean(a.maio_pontos ?? ""), 
                        _clean(a.agosto_pontos ?? ""), 
                    ]);
                planilha = [["MATRICULA", "NOME", "CARGO", "UNIDADE","NOTA 1CICLO", "NOTA 2CICLO"].map(_clean), ...planilha].map(arr => arr.join(",")).join("\r\n");
                const blob = new Blob([planilha], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'avaliacoes.csv';
                a.click();                
            },
            formatteDate(item){
                return moment(item).locale('pt-br').format('DD/MM/YYYY HH:mm')
            },
            alterar(idu){
                avaliacaoStore.updateAvaliacao(idu)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>