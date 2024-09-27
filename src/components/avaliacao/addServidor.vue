<template>
    <div class="text-center tooltip" :class="{ show: showTooltip }">
      
      <v-btn 
        title="Adicionar Servidor a Equipe"
        prepend-icon="mdi-plus"
        @click="dialog = true" variant="text" color="green" density="compact">
        Adicionar Servidor
      </v-btn>
      <div class="tooltiptext" @click="showTooltip = false">Comece por aqui! <v-icon size="1rem">mdi-close-circle</v-icon></div>
      <v-dialog
        v-model="dialog"
        width="auto"
      >
        <v-card
          max-width="400"
          prepend-icon="mdi-plus-circle"
          text="Use o campo abaixo para incluir o servidor."
          title="Adicionar Servidor a Equipe"
        >
        <v-card-text class="px-5">
            <v-radio-group
              v-model="type"
              inline
            >
              <v-radio
                label="CPF"
                value="cpf"
              ></v-radio>
              <v-radio
                label="Nome"
                value="nome"
                @click="limpar()"
              ></v-radio>
            </v-radio-group>
            <v-form @submit.prevent="loadServidor()" ref="form">
                <v-text-field
                    label="CPF"
                    v-model="cpf"
                    variant="outlined"
                    density="compact"
                    placeholder="999.999.999-99"
                    v-mask="'###.###.###-##'"
                    :rules="[rules.required, rules.mincpf]"
                    clearable
                    prepend-inner-icon="mdi-numeric"
                    v-if="type == 'cpf'"
                >
                  <template v-slot:append>
                      <v-btn type="submit" flat color="success" icon="mdi-check" density="compact"></v-btn>
                  </template>
                </v-text-field>
                <v-text-field
                    label="Nome"
                    v-model.trim="nome"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required, rules.minnome]"
                    prepend-inner-icon="mdi-magnify"
                    placeholder="busque pelo nome"
                    clearable
                    v-if="type == 'nome'"
                >
                  <template v-slot:append>
                      <v-btn type="submit" flat variant="outlined" title="buscar" color="success" icon="mdi-magnify" density="compact"></v-btn>
                  </template>
                </v-text-field>
            </v-form>
            <div v-if="servidor.id || error && type == 'cpf'" class="border pa-2 mt-2">
              <div v-if="!servidor.nota">
                <div v-if="servidor.nome">
                  <b>Nome: </b>{{ servidor.nome }}<br>
                  <b>CPF: </b>{{ cpfShow }}<br>
                  <b>Cargo: </b>{{ servidor.cargo }}<br>
                </div>        
                <v-alert v-if="error" type="error" class="my-2">
                  <span>{{ errorMsg }}</span>
                </v-alert>
                <v-btn v-else class="mt-2" block color="primary" @click="incluirCpfEquipe()">Incluir</v-btn>
                <div class="d-flex justify-center">
                  <v-btn @click="limpar(), cpf = ''" variant="text" density="compact" color="grey">Limpar</v-btn>
                </div>
              </div>
              <v-alert v-else type="warning">
                  Não é possível adicionar o/a servidor(a) {{ servidor.nome }} na equipe, pois
                  já encontra-se avaliado.
              </v-alert>

            </div>
            <div v-if="erroMsg && type =='cpf'" class="text-red">
              <p class="text-center"><v-icon class="mr-2">mdi-alert-box-outline</v-icon>{{ erroMsg }}.</p> 
              <create class="mt-5" :newCPF="this.cpf" :equipe="equipe" @close="incluirCpfEquipeNovo($event)" />
            </div>

            <!-- busca por nome -->
            <div v-if="type == 'nome'">
              <v-list v-if="searchNome">
                <v-list-item 
                  @click="incluirporNome(item._source.id)"
                  v-for="item, i in searchNome" :key="i" link density="compact">
                  <template v-slot:prepend>
                    <v-icon class="mr-n5">mdi-account</v-icon>
                  </template>
                  <div class="mr-3">
                    <small> {{item._source.nome}}</small> <br>
                    <small>Mat: {{ item._source.matricula }}</small>
                  </div>
                  <template v-slot:append>
                  <v-btn color="success" icon="mdi-check" density="compact"></v-btn>
                  </template>
                </v-list-item>

                <div v-if="!searchNome.length" class="text-red">
                  <p class="text-center"><v-icon class="mr-2">mdi-alert-box-outline</v-icon>Termo da busca não localizado.</p> 
                  <create class="mt-5 ml-n7" />
                </div>
                <v-btn block color="grey" variant="text" density="compact" @click="searchNome = null, nome = ''">limpar</v-btn>
              </v-list>
            
            </div>

           
        </v-card-text>
          <template v-slot:actions>
            <v-btn
              class="ms-auto"
              text="Fechar"
              @click="dialog = false, limpar(), cpf = '', nome = ''"
            ></v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
  </template>

  <script>
  import {mask} from 'vue-the-mask'
  import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
  const avaliacaoStore = useAvaliacaoStore() 

  import create from '@/components/avaliacao/relatorio/createServidor.vue'

  export default {
    directives:{ mask },
    components:{ create },
    data () {
      return {
        dialog: false,
        cpf: '',
        type: 'cpf',
        nome: '',
        searchNome: null,
        rules:{
            required: (value) => !!value || "Campo obrigatório",
            mincpf: (v) => (v||'').length == 14 || "11 dígitos",
            minnome: (v) => (v||'').length > 4 || "mínimo de 4 caracteres"
        },
        error: false,
        errorMsg: null,
        showTooltip: false
      }
    },
    computed:{
      servidor(){
        return avaliacaoStore.readServidorOne
      },
      erroMsg(){
        return avaliacaoStore.readErro
      },
      equipe(){
        return avaliacaoStore.readEquipe
      },
      cpfShow(){
          return avaliacaoStore.completarComZeros(this.servidor.id)
      }
    },
    methods:{
      async loadServidor(){
        const { valid } = await this.$refs.form.validate()
        this.error = false
        this.errorMsg = null

        if(valid){
          if(this.type == 'nome'){
            avaliacaoStore.limparServidor()
            const resp = await avaliacaoStore.searchServidores(this.nome)
            this.searchNome = resp.data.hits.hits
            return
          }
          if(!avaliacaoStore.validarCPF(this.cpf)) {
            avaliacaoStore.limparServidor()
            this.error = true
            this.errorMsg = "O número do CPF é inválido."
            return
          }
        
          this.limpar()
          this.verificarEquipe()
          this.verificarGestor()

          
          avaliacaoStore.findServidor(this.cpf)

          if(await avaliacaoStore.findAvaliacaoPorCpf(this.cpf)){
            this.error = true
            this.errorMsg = 'Já consta avaliação realizada para este(a) servidor(a)'
          }
        }
      },
      incluirCpfEquipe(){
        const response = avaliacaoStore.addServidorequipe(this.servidor.id)
        if(response){
          this.error = true
          this.errorMsg = 'Servidor já está na sua equipe. Atualize a página ou conecte-se novamente.'
        } 
        this.createServidor()
      },
      createServidor(){
        this.dialog = false
        this.cpf = ''
        this.searchNome = null
        this.nome = ''
        this.limpar()
      },
      async incluirCpfEquipeNovo(item){      
        this.cpf = item
        this.loadServidor()
      },
      limpar(){
        avaliacaoStore.limparServidor()
        this.error = false
        this.errorMsg = false
      },
      incluirporNome(item){
        this.cpf = avaliacaoStore.completarComZeros(item)
        this.type = 'cpf'
        this.loadServidor()
      },
      verificarEquipe(){
        const CPF = avaliacaoStore.apenasNumeros(this.cpf);
        const findCPF = this.equipe.equipe.find(x => x == CPF)
        this.error = !!findCPF
        if(this.error) this.errorMsg = "Servidor já encontra-se na sua equipe."
      },
      verificarGestor(){
        const CPF = avaliacaoStore.apenasNumeros(this.cpf);
        if(avaliacaoStore.readLogin.id == CPF){
          this.error = true
          this.errorMsg = "Não é possível adicionar seu próprio CPF."
        }
      },
      sortName(a, b) {
          if (a.nome < b.nome) {
              return -1;
          }
          if (a.nome > b.nome) {
              return 1;
          }
          return 0;
      },
      toolTipoShow(){
        let teste = !!this.equipe.equipe.length
        if(!teste){
          setTimeout(() => {
            this.showTooltip = true;
          }, 2000)
        }
        
      }
    },
    created(){
      avaliacaoStore.erro = ''
    },
    mounted() {
        this.toolTipoShow()
    }
  }
</script>
<style>
.tooltip {
    position: relative;
    display: inline-block;
    cursor: pointer;
}

.tooltip .tooltiptext {
    visibility: hidden;
    min-width: 150px;
    min-height: 30px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 5px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    bottom: -20%; /* Posiciona o tooltip acima do texto */
    left: -45%;
    margin-left: -60px;
    opacity: 0;
    transition: opacity 0.3s;
}
.tooltiptext::after {
      content: '';
      position: absolute;
      bottom: 10px; /* Posição da seta */
      right: -14px; /* Posição horizontal da seta */
      width: 12px;
      border: 6px solid transparent;
      border-left: 8px solid black;
  }

.tooltip.show .tooltiptext {
    visibility: visible;
    opacity: 1;
}
</style>