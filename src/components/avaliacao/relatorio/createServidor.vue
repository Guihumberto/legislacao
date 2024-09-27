<template>
    <div class="text-center">
      <v-btn @click="dialog = true" prepend-icon="mdi-plus" variant="flat" color="success">
        Incluir Servidor
      </v-btn>
  
      <v-dialog
        v-model="dialog"
        width="auto"
      >
        <v-card
          max-width="400"
          prepend-icon="mdi-plus"
          text="Use um formulário abaixo para Adicionar um servidor(a) que não foi encontrado na lista."
          title="Incluir Servidor"
        >
        <v-alert v-if="success" type="success" class="ma-5">
            Registo do(a) servidor(a) criado com sucesso!
        </v-alert>
        <v-card-text v-else>
            <v-alert v-if="erro" class="mb-5" variant="outlined" type="warning">
                {{ erro }}
            </v-alert>
            <v-form @submit.prevent="create()" ref="form">
                <v-text-field
                    label="Nome"
                    v-model="servidor.nome"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                    clearable
                ></v-text-field>
                <v-text-field
                    label="CPF"
                    v-model="servidor.id"
                    variant="outlined"
                    density="compact"
                    v-mask="'###.###.###-##'"
                    class="my-2"
                    :rules="[rules.required, rules.mincpf]"
                    clearable
                ></v-text-field>
                <v-text-field
                    label="Data de Nascimento"
                    v-model="servidor.dn"
                    variant="outlined"
                    density="compact"
                    v-mask="'##/##/####'"
                    :rules="[rules.required, rules.mindn]"
                    clearable
                ></v-text-field>
                <v-text-field
                    label="Matrícula"
                    v-model="servidor.matricula"
                    variant="outlined"
                    density="compact"
                    v-mask="'###########'"
                    class="my-2"
                    clearable
                    :rules="[rules.required]"
                ></v-text-field>
                <v-select
                    label="Cargo"
                    v-model="servidor.cargo"
                    :items="listCargo"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                    clearable
                ></v-select>
                <v-text-field
                    label="Email"
                    v-model="servidor.email"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                    class="mt-2"
                    clearable
                >
                <template v-slot:append>
                  <span class="pa-2 border bg-blue-lighten-5 text-grey">@sefaz.ma.gov.br</span>
                </template>
              </v-text-field>
                <v-text-field
                    label="Lotação"
                    v-model="servidor.lotacao"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                    class="mt-2"
                    clearable
                ></v-text-field>
                <v-checkbox label="Gestor" v-model="servidor.Gestor"></v-checkbox>
                <v-btn :loading="load" type="submit" block color="success">Salvar</v-btn>
            </v-form>
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
import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
const avaliacaoStore = useAvaliacaoStore() 
import {mask} from 'vue-the-mask'

  export default {
    data () {
      return {
        dialog: false,
        servidor:{
            nome: '',
            id: null,
            cargo: '',
            lotacao: '',
            descricao: '',
            dn: '',
            Gestor: false,
            matricula: '',
            efetivo: 'EFETIVO',
            status: 'ATIVO',
            email: '',

        },
        rules:{
            required: (value) => !!value || "Campo obrigatório",
            mincpf: (v) => (v||'').length == 14 || "11 dígitos",
            mindn: (v) => (v||'').length == 10 || "8 dígitos",
        },
        listCargo:[
            "AUDITOR FISCAL DA RECEITA ESTADUAL",
            "AGENTE DA RECEITA ESTADUAL"
        ],
        erro: null,
        success: null,
        load: null
      }
    },
    directives:{
        mask
    },
    props:{
      newCPF: String,
      equipe: Object
    },
    methods:{
        async create(){
            this.erro = ''
            const { valid } = await this.$refs.form.validate()
                if(valid){
                    this.load = true
                    const cpf = avaliacaoStore.apenasNumeros(this.servidor.id)
                    const CPFnotEdit = this.servidor.id
                    
                    if(!avaliacaoStore.validarCPF(this.servidor.id)){
                        this.erro = 'Este número de CPF é inválido'
                        this.load = false
                        return
                    }
                    const isExist = await avaliacaoStore.findServidorElastic(parseInt(cpf))
                    if(isExist){
                        this.erro = 'Servidor já consta na base de dados!'
                        this.load = false
                        return
                    } else {
                        this.servidor.id = parseInt(cpf)

                        if(this.servidor.email.split('').includes('@')){
                          this.servidor.email = this.servidor.email.split('@')[0]
                        } else {
                          this.servidor.email = this.servidor.email + "@sefaz.ma.gov.br"
                        }
                        
                        this.servidor.dn = avaliacaoStore.converterInverseNew(this.servidor.dn)
                        this.servidor.descricao = this.servidor.lotacao

                        await avaliacaoStore.createServidorElastic(this.servidor)
                        avaliacaoStore.addServidorListAll(this.servidor)

                        try {
                          if(this.equipe.idGestor) this.includeEquipe(CPFnotEdit)
                        } catch (error) {
                          this.success = true
                          this.limpar()
                          this.load = false
                        } 

                        
                    }
                }
        },
        includeEquipe(item){
          this.$emit('close', item)
        },
        limpar(){
            this.servidor = {
                nome: '',
                id: '',
                cargo: '',
                lotacao: '',
                dn: '',
                Gestor: false,
                matricula: ''
            }
        }
    },
    created(){
      this.newCPF ? this.servidor.id = this.newCPF : ''
    }
  }
</script>
<style lang="scss" scoped>

</style>