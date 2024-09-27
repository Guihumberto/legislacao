<template>
    <div class="text-center pa-4">
      <v-btn @click="dialog = true" icon="mdi-plus" title="adicionar usuários" color="success">
      </v-btn>
  
      <v-dialog
        v-model="dialog"
        width="auto"
      >
        <v-card
          max-width="400"
          prepend-icon="mdi-plus"
          text="Incluir acesso a usuários aos relatórios e configurações."
          title="Acesso a Administração"
        >
        <v-card-text>
            <v-form @submit.prevent="loadServidor()" ref="form">
                <v-text-field
                    label="Nome"
                    v-model.trim="nome"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required, rules.minnome]"
                    prepend-inner-icon="mdi-magnify"
                    placeholder="busque pelo nome"
                    clearable
                >
                  <template v-slot:append>
                      <v-btn type="submit" flat variant="outlined" title="buscar" color="success" icon="mdi-magnify" density="compact"></v-btn>
                  </template>
                </v-text-field>
            </v-form>
            <v-list v-if="searchNome.length">
                <v-list-item 
                  @click="addPerfil(item._source)"
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
                </div>
                <v-btn block color="grey" variant="text" density="compact" @click="searchNome = [], nome = ''">limpar</v-btn>
              </v-list>
        </v-card-text>
          <template v-slot:actions>
            <v-btn
              class="ms-auto"
              text="Fechar"
              @click="dialog = false"
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

  export default {
    directives:{ mask },
    data () {
      return {
        dialog: false,
        rules:{
            required: (value) => !!value || "Campo obrigatório",
            mincpf: (v) => (v||'').length == 14 || "11 dígitos",
            minnome: (v) => (v||'').length > 4 || "mínimo de 4 caracteres",
        },
        nome: '',
        error: false,
        errorMsg: null,
        searchNome: []
      }
    },
    methods:{
        async loadServidor(){
            const { valid } = await this.$refs.form.validate()
            this.error = false
            this.errorMsg = null
    
            if(valid){
                avaliacaoStore.limparServidor()
                const resp = await avaliacaoStore.searchServidores(this.nome)
                this.searchNome = resp.data.hits.hits
            }
        },
        addPerfil(item){
            let servidor = { ...item }
            servidor.perfil = 5
            avaliacaoStore.updatePerfil(servidor)
            this.dialog = false
            this.error = false
            this.errorMsg = null
            this.nome = ''
            this.searchNome = []
            this.$emit('carregar')
        }
    }
  }
</script>

<style lang="scss" scoped>

</style>