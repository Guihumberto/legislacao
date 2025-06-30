<template>
    <div class="text-center">
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        location="bottom left"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            :icon="loginStore.readLogin.cpf ? 'mdi-account-tie': 'mdi-login'"
            :title="loginStore.readLogin.cpf ? 'Sair': 'Entrar'"
          >
          </v-btn>
        </template>
        <v-card min-width="300" v-if="loginStore.readLogin.cpf">
          <v-list>
            <v-list-item
              prepend-icon="mdi-account-circle"
              :subtitle="readUser.cargo"
              :title="readUser.nome"
            >
              <template v-slot:append>
                <v-btn
                  color="red"
                  icon="mdi-logout"
                  variant="text"
                  @click="logout()"
                ></v-btn>
              </template>
            </v-list-item>
          </v-list>
  
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
  
            <v-btn
              variant="text"
              @click="menu = false"
            >
              Fechar
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card v-else class="pa-2" min-width="300">
          <LoginLeges :flutuante="true" />
        </v-card>
      </v-menu>
    </div>
  </template>
  <script setup>
    import { ref, computed } from 'vue'

    import LoginLeges from '../LoginCreate/LoginLeges.vue'

    import { useLoginStore } from '../../store/LoginStore'
    const loginStore = useLoginStore()

    import { useRouter } from 'vue-router'
    const router = useRouter()


    const menu = ref(false)
  
    const logout = () => {
      loginStore.logOut()
      menu.value = false
      router.push('/homepainel')
    }

    const getFirstAndSecondName = (fullName) => {
      try {
        const nameParts = fullName.trim().split(/\s+/);
        const firstName = nameParts.length > 0 ? nameParts[0] : '';
        const secondName = nameParts.length > 1 ? nameParts[1] : '';

        const complete = `${firstName} ${secondName} `

        return complete;
        
      } catch (error) {
          return fullName
      }
    }
  
    const readUser = computed(() => {
        let user = loginStore.readLogin
        let userData = {
          nome: getFirstAndSecondName(user.name),
          cargo: user.cargo,
        }
        return userData
    })
</script>