<template>
  <div class="loginwrapper">
      <v-form class="login" ref="form" @submit.prevent="login()">
         <div class="mb-3">
             <h3 v-if="flutuante">Faça seu Login</h3>
             <p class="destaque px-2">Login</p>
         </div>
         <v-text-field
             prepend-inner-icon="mdi-account"
             label="CPF"
             placeholder="Digite seu CPF"
             density="compact"
             variant="outlined"
             v-mask="['###.###.###-##']"
             :rules="[rules.required, rules.mincpf]"
             v-model="userLogin.login"
             clearable
             class="mb-2"
         ></v-text-field>
         <v-text-field
             prepend-inner-icon="mdi-lock"
             :append-inner-icon="showPassword ? 'mdi-eye': 'mdi-eye-off'"
             label="Senha"
             placeholder="Digite sua senha"
             density="compact"
             variant="outlined"
             @click:append-inner.stop="showPassword = !showPassword"
             :type="showPassword ? 'password' : 'text'"
             :rules="[rules.required]"
             v-model="userLogin.password"
             clearable
         >
         </v-text-field>
         <v-btn block color="primary" type="submit" :loading="loadLogin">Entrar</v-btn>
         <div class="d-flex justify-center align-center" v-if="flutuante">
             <!-- <relatarErro /> | <about /> -->
         </div>
         <v-expand-transition>
             <div v-if="readErro">
                 <p class="text-error" >{{ readErro }} <v-icon @click="limparErro()">mdi-close</v-icon></p>
             </div>
         </v-expand-transition>
     </v-form>
     <FirstLogin :dialog="dialog" />
 </div>
</template>

<script setup>
    import { ref, computed, provide } from 'vue';
    import FirstLogin from './firstLogin.vue'
    // import relatarErro from '../avaliacao/parciais/relatarErro.vue';
    // import about from '../avaliacao/parciais/about.vue';
    import { mask } from 'vue-the-mask'

    import { useRouter } from 'vue-router';
    const router = useRouter()

    import { useLoginStore } from '../../store/LoginStore'
    const loginStore = useLoginStore()

    const flutuante = ref(false)
    const rules = {
        required: (value) => !!value || "Campo obrigatório",
        mincpf: (v) => (v||'').length == 14 || "11 dígitos",
        mindn: (v) => (v||'').length == 10 || "8 dígitos",
    }

    const loadLogin = ref(false) 
    const userLogin = ref({
        login: '',
        password: null
    })

    const form = ref(null)
    const showPassword = ref(true)
    const dialog = ref(false)

    provide('dialog', dialog)

    const readLogin = computed(()=> {
        return false //'avaliacaoStore.readLogin'
    })

    const readErro = ref(false)

    const login = async () => {
             const { valid } = await form.value.validate()
             if(valid){
                 loadLogin.value = true
                 const login = await loginStore.loginSSO(userLogin.value)
                 loadLogin.value = false

                 if(!login) {
                    readErro.value = "usuário ou senha incorretos"
                    return
                 } 

                 if(!login.name){
                    dialog.value = true
                 } else {
                    router.push(`/leges`)
                 }
             }
    }

    const limparErro = () => {
        readErro.value = false
    }
</script>

<style lang="scss" scoped>
    .loginwrapper{
        width: 50%;
        display: flex;
        justify-content: center;
    }
    .login{
        width: 80%;
    }
    .destaque{
        padding: 2px;
        background: rgb(34, 147, 213);
        color: white;
    }
    @media (max-width: 1000px) {
        .loginwrapper{
            width: 100%;
        }
        .login{
            width: min(500px, 100%);
        }
    }
</style>