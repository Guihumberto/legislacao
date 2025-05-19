<template>
    <v-system-bar app>
      <v-btn density="compact" variant="text" icon="mdi-menu" @click="drawer = !drawer"></v-btn>
        <v-spacer></v-spacer>

        <span class="font-weight-bold mr-2">Chat Arcádio</span>
        <v-icon>mdi-forum</v-icon>

        <v-btn class="ml-5" density="compact" variant="text" @click="activeModDark" :icon="themeIcon"></v-btn>
    </v-system-bar>
    <v-navigation-drawer v-model="drawer" app>
      <v-sheet
        class="pa-4 text-center"
      >
        <v-avatar
          class="mb-4"
          color="grey-darken-1"
          size="64"
          v-if="loginStore.readLogin.cpf"
        ></v-avatar>
        <div>
          <div v-if="loginStore.readLogin.cpf">
            <div>{{ loginStore.readLogin.nickname }}</div>
            <v-btn color="error" variant="text" class="text-lowercase" @click="loginStore.logOut($router, '/chatarcadio'), chatStore.chat = []">sair</v-btn>

          </div>
          <v-btn variant="outlined" v-else @click="dialog = true">Login</v-btn>
        </div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="[icon, text, link] in links"
          :key="icon"
          :prepend-icon="icon"
          :title="text"
          link
          :to="link"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-dialog v-model="dialog" width="500" class="text-center">
        <v-card class="w-100 text-center">
          <v-card-text>
            <v-form ref="form" @submit.prevent="login()">
              <div class="mb-3">
                <h3 class="destaque px-2">Entre com seu CPF e senha</h3>
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
         <div class="d-flex justify-center">
             <v-checkbox color="success" label="Manter conectado" v-model="keepConnected" hide-details></v-checkbox>
         </div>
            </v-form>
          </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
  import { ref, inject, computed } from 'vue'

  import { useLoginStore } from '@/store/LoginStore'
  const loginStore = useLoginStore()

  import { useChatStore } from '@/store/ChatStore'
  const chatStore = useChatStore()
  
  import { useRoute } from 'vue-router'
  const route = useRoute()

  loginStore.loadUserData()
  
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

  const theme = inject('theme')
  const drawer = ref(false)
  const dialog = ref(false)

  const activeModDark = () => {
    if(theme.value === 'light') {
      theme.value = 'dark'
    } else {
      theme.value = 'light'
    }
  }

  const themeIcon = computed(() => {
    return theme.value === 'light' 
    ? 'mdi-weather-sunny'
    : 'mdi-weather-night'
  })

  const links = [
    ['mdi-home', 'Início', '/chatarcadio'],
    ['mdi-text-box', 'Legisação', '/'],
  ]

  const login = async () => {
            const { valid } = await form.value.validate()
            if(valid){
                loadLogin.value = true
                const login = await loginStore.loginSSO(userLogin.value, keepConnected.value)
                if(route.params?.id){
                  await chatStore.getChat(route.params?.id)
                }
                loadLogin.value = false
                dialog.value = false

                if(!login) {
                  readErro.value = "usuário ou senha incorretos"
                  return
                } 
            }
  }

</script>

<style scoped>

</style>