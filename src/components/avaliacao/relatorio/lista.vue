<template>

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
                <v-select
                    variant="outlined" density="compact"
                    label="Unidade"
                    :items="unidades"
                    style="max-width: 50%;"
                    v-model="search.unidade"
                    prepend-inner-icon="mdi-briefcase"
                    class="mr-2"
                    clearable
                ></v-select>
                <v-select
                    variant="outlined" density="compact"
                    label="Avaliação"
                    :items="avaliacaoText"
                    style="max-width: 50%;"
                    v-model="search.avaliacao"
                    prepend-inner-icon="mdi-numeric-10-box"
                    clearable
                ></v-select>
            </div>
            <div class="d-flex justify-space-between align-center">
                <v-select
                    variant="outlined" density="compact"
                    label="Cargos"
                    :items="listCargosServidores"
                    style="max-width: 50%;"
                    v-model="search.cargos"
                    prepend-inner-icon="mdi-account-tie"
                    class="mr-2"
                    clearable
                    multiple
                ></v-select>
                <v-select
                    variant="outlined" density="compact"
                    label="Ciclo"
                    :items="listCiclo"
                    style="max-width: 50%;"
                    v-model="search.ciclo"
                    prepend-inner-icon="mdi-calendar"
                    clearable
                ></v-select>
            </div>
            <div class="d-flex justify-space-between align-center">
                <v-radio-group inline v-model="search.tipo" density="compact" style="max-width: 50%;">
                    <v-radio label="Todos" value="all"></v-radio>
                    <v-radio label="Apenas avaliados" value="two"></v-radio>
                    <v-radio label="Apenas não avaliados" value="three"></v-radio>
                </v-radio-group>
                <v-switch color="success" v-model="isTaf" label="Apenas grupo TAF"></v-switch>
            </div>
            <v-btn @click="limpar()" variant="text">Limpar</v-btn>
        </v-card-text>
    </v-card>
    <div class="d-flex justify-space-between align-center">
        <div>
            <p>Total: {{ servidores.length }} <span v-if="allServidorescomNota.length < servidores.length"> - Filtrados: {{ allServidorescomNota.length }}</span> </p>
        </div>
        <gestores :gestores="notaGestores" />
        <tratarnaoaval :naoavaliados="readNaoAvaliados" />
        <div id="exportar">
            <v-btn variant="outlined" color="success" class="mb-2" v-on:click="exportar" prepend-icon="mdi-file-excel-box-outline">Exportar</v-btn>
        </div>
    </div>
    <v-table
      height="60vh"
      fixed-header
      v-if="allServidorescomNota.length"
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
            Unidade
          </th>
          <th class="text-left">
            Avaliado
          </th>
          <th class="text-left">
            Nota
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in allServidorescomNota"
          :key="item.name"
        >
          <td>{{ item.nome }}</td>
          <td>{{ formatCpf(item.id) }}</td>
          <td>{{ item.lotacao }}</td>
          <td :class="item.nota ? 'text-green font-weight-bold' : 'text-grey'">{{ item.nota ? 'Sim' : 'Não' }}</td>
          <td :title="item.avaliador">{{ item.pontos }}</td>
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


    export default {
        components:{ gestores, tratarnaoaval},
        data () {
            return {
                search:{
                    nome: '',
                    avaliador: '',
                    unidade: '',
                    tipo: 'all',
                    avaliacao: '',
                    cargos: [],
                    ciclo: ''
                },
                avaliacaoText:['Crítico', 'Baixo', 'Regular', 'Bom', 'Ótimo'],
                items: [
                    { state: 'Florida', abbr: 'FL' },
                    { state: 'Georgia', abbr: 'GA' },
                    { state: 'Nebraska', abbr: 'NE' },
                    { state: 'California', abbr: 'CA' },
                    { state: 'New York', abbr: 'NY' },
                ],
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

                // if(this.search.ciclo && this.readTratados.length){
                //     list.forEach(x => {
                //         if(this.readTratados.includes(x.id)){
                //             x.tratado = true
                //         }
                //     })
                // }

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
                let planilha = this.allServidorescomNota.map(a => [_clean(a.id?.toString() ?? ""), _clean(a.nome ?? ""), _clean(a.email ?? ""), _clean(a.nota ? a.pontos : "Nao Avaliado(a)")]);
                planilha = [["CPF", "NOME", "EMAIL", "NOTA"].map(_clean), ...planilha].map(arr => arr.join(",")).join("\r\n");
                const blob = new Blob([planilha], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'avaliacoes.csv';
                a.click();                
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>