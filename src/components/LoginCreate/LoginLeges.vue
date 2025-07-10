<template>
  <div :class=" flutuante ? 'loginFlutanteWrapper' : 'loginwrapper'">
      <v-form :class="flutuante ? 'loginFlutuante' : 'login'" ref="form" @submit.prevent="login()" v-if="!loginStore.readLogin.cpf">
        <v-img v-if="!flutuante && xs" class="mx-auto mb-5" src="../../assets/logo_leges.svg" max-width="100"></v-img>
         <div class="mb-3">
             <h3 class="destaque px-2" v-if="flutuante">Entre com seu CPF e senha</h3>
             <p v-else class="destaque px-2">Login</p>
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
         <v-btn variant="outlined" color="error" block class="mt-5" prepend-icon="mdi-google" @click="handleGoogleLogin" :disabled="loadLogin">Login com Google</v-btn>
         <div class="d-flex justify-center">
             <v-checkbox color="success" label="Manter conectado" v-model="keepConnected" hide-details></v-checkbox>
         </div>
         <div class="d-flex justify-center align-center" v-if="flutuante">
             <!-- <relatarErro /> | <about /> -->
         </div>
         <v-expand-transition>
             <div v-if="readErro" class="text-center mt-2">
                 <v-btn variant="text" color="error" @click="limparErro()"  append-icon="mdi-close" > {{ readErro }}</v-btn>
             </div>
         </v-expand-transition>
     </v-form>
     <div v-else class="text-center">
         <v-icon class="mb-5" size="5rem" color="primary"> mdi-flash</v-icon>
         <v-alert variant="outlined" type="info" :text="`${loginStore.readLogin.nickname ? loginStore.readLogin.nickname : ''}, seu plano atual é o ${ loginStore.readLogin?.is_premium ? 'PRÓ' : 'BÁSICO'}`"></v-alert>
         <v-btn variant="flat" color="primary" @click="$router.push('/homepainel')" class="mt-5" append-icon="mdi-magnify" v-if="$route.name != 'Assinar'">Iniciar</v-btn>
         <v-btn v-if="$route.name == 'Assinar'" class="mt-5" color="error" @click="loginStore.logOut" variant="text">Entrar com outra conta</v-btn>
        </div>
     <FirstLogin :dialog="dialog" :userNew="userNew" />
 </div>
</template>

<script setup>
    import { ref, provide, onMounted } from 'vue';
    import FirstLogin from './firstLogin.vue'
    import { mask } from 'vue-the-mask'

    import { useAuthStore } from '@/store/firebase/authStore';
    import { useRouter, useRoute } from 'vue-router';
    import { useLoginStore } from '../../store/LoginStore'
    import { useDisplay } from 'vuetify'

    const { xs } = useDisplay()
    const authService = useAuthStore();
    const loginStore = useLoginStore()
    const router = useRouter()
    const route = useRoute()

    const props = defineProps({
        flutuante: {
            default: false,
            type: Boolean
        }
    })

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

    const keepConnected = ref(false)

    const form = ref(null)
    const showPassword = ref(true)
    const dialog = ref(false)

    provide('dialog', dialog)

    const readErro = ref(false)

    const login = async () => {
             const { valid } = await form.value.validate()
             if(valid){
                 loadLogin.value = true
                 const login = await loginStore.loginSSO(userLogin.value, keepConnected.value)
                 loadLogin.value = false

                 if(!login) {
                    readErro.value = "usuário ou senha incorretos"
                    return
                 } 

                 if(!login.name){
                    dialog.value = true
                 } else {
                    if('route', route.name == 'Assinar') return
                    const redirectTo = route.query.redirect || '/homepainel'
                    router.push(redirectTo)
                 }
             }
    }

    const handleGoogleLogin = async () => {
        loadLogin.value = true;
        readErro.value = '';
  
        try {
          await authService.loginWithGoogle();

          const currentUser = authService.getCurrentUser;
          if (currentUser?.uid) {
                const login = await loginStore.addUserGoogle(currentUser, keepConnected.value)
                if (!login.name || !login.cpf) {
                    userNew.value = { ...login };
                    dialog.value = true;
                } else {
                    const redirectTo = route.query.redirect || '/homepainel';
                    router.push(redirectTo);
                }
          }
        } catch (error) {
            readErro.value = traduzirErro(error.code);
            
        } finally {
            loadLogin.value = false;
        }
    };

    const traduzirErro = (errorCode) => {
        switch (errorCode) {
          case 'auth/invalid-email':
            return 'Email inválido.';
          case 'auth/user-disabled':
            return 'Usuário desativado.';
          case 'auth/user-not-found':
            return 'Usuário não encontrado.';
          case 'auth/wrong-password':
            return 'Senha incorreta.';
          default:
            return 'Ocorreu um erro. Tente novamente.';
        }
    };

    const limparErro = () => {
        readErro.value = false
    }

    const userNew = ref({
        name: null, 
        nickname: null, 
        setor: null,
        cargo: 'user'
    })

    onMounted(async () => {
        try {
            loadLogin.value = true;

            const currentUser = authService.getCurrentUser;
            if (currentUser?.uid) {
                const login = await loginStore.addUserGoogle(currentUser, keepConnected.value)
                if (!login.name || !login.cpf) {
                    userNew.value = { ...login };
                    dialog.value = true;
                } else {
                    const redirectTo = route.query.redirect || '/homepainel';
                    // router.push(redirectTo);
                }
            }

        } catch (error) {
            readErro.value = traduzirErro(error.code);
            console.error(error);
        } finally {
            loadLogin.value = false;
        }
    });
</script>

<style lang="scss" scoped>
    .loginwrapper{
        width: 50%;
        display: flex;
        justify-content: right;
    }
    .loginFlutanteWrapper {
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .login{
        width: 80%;
    }
    .loginFlutuante{
        width: 100%;
        font-size: 75%;
    }
    .destaque{
        padding: 2px;
        background: rgb(34, 147, 213);
        color: white;
    }
    @media (max-width: 1000px) {
        .loginwrapper{
            width: 100%;
            justify-content: center;
        }
        .login{
            width: min(500px, 100%);
        }
    }
</style>