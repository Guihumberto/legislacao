<template>
    <div class="text-center">
      <v-btn @click="dialog = true" prepend-icon="mdi-calendar" variant="text">
        Entrar com data de nascimento
      </v-btn>
  
      <v-dialog
        v-model="dialog"
        width="auto"
      >
        <v-card
          max-width="400"
          prepend-icon="mdi-calendar"
          title="Entrar com o Data de Nascimento"
        >
            <v-card-text v-if="!sendMail">
              <p class="pb-5">Digite seu email e data de nascimento nos campos abaixo.</p> 
                <v-form @submit.prevent="entrarPorEmail()" ref="form">
                  <v-text-field
                    prepend-inner-icon="mdi-account"
                    label="CPF"
                    placeholder="Digite seu CPF"
                    density="compact"
                    variant="outlined"
                    v-mask="'###.###.###-##'"
                    :rules="[rules.required, rules.mincpf]"
                    v-model="userLogin.login"
                    clearable
                  ></v-text-field>
                  <v-text-field
                    class="mt-2"
                    prepend-inner-icon="mdi-calendar"
                    label="Data de Nascimento"
                    placeholder="01/02/1986"
                    v-mask="'##/##/####'"
                    density="compact"
                    variant="outlined"
                    :rules="[rules.required]"
                    v-model="userLogin.dn" 
                  >
                  </v-text-field>
                  <v-btn block color="primary" type="submit" :loading="loadLogin">ENTRAR</v-btn>
                </v-form>
            </v-card-text>
            <v-alert v-else type="success" class="ma-5">
              <p>Email enviado com sucesso!</p>
            </v-alert>
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
    directives:{
        mask
    },
    data () {
      return {
        dialog: false,
        userLogin:{
            login: '',
            dn: '',
            password: '',
            email: ''
        },
        mailsef: '@sefaz.ma.gov.br',
        loadLogin: false,
        rules:{
            required: (value) => !!value || "Campo obrigatório",
            mincpf: (v) => (v||'').length == 14 || "11 dígitos",
            mindn: (v) => (v||'').length == 10 || "8 dígitos",
        },
        sendMail: false
      }
    },
    props:{
      cpf:false
    },
    methods:{
      async entrarPorEmail(){
          const { valid } = await this.$refs.form.validate()
          if(valid){
              this.loadLogin = true
              const resp = await avaliacaoStore.loginPorDN(this.userLogin)
              // this.sendMail = true
              // this.loadLogin = false
              if(!resp){
                this.$emit('erroDN')
              }
          }
      },
    },
    created(){
      this.userLogin.login = this.cpf
    }
  }
</script>

<style lang="scss" scoped>

</style>