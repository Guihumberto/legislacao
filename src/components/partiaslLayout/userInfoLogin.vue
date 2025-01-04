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
            :icon="readLogin.cpf ? 'mdi-account-tie': 'mdi-login'"
            class="mr-2"
            :title="readLogin.cpf ? 'Sair': 'Entrar'"
          >
          </v-btn>
        </template>
        <v-card min-width="300" v-if="readLogin.cpf">
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
        <v-card v-else class="pa-5" min-width="300">
          <!-- <login /> -->
        </v-card>
      </v-menu>
    </div>
  </template>
  <script>
  import { useLoginStore } from '../../store/LoginStore'
  const loginStore = useLoginStore()

  // import login from '@/components/avaliacao/login/login.vue'

  export default {
    // components:{ login },
    data: () => ({
      menu: false,
    }),
    methods:{
      logout(){
        loginStore.logOut()
        this.menu = false
        this.$router.push('/avaliacao')
      },
      getFirstAndSecondName(fullName) {
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
    },
    computed:{
      readUser(){
        let user = this.readLogin
        let userData = {
          nome: this.getFirstAndSecondName(user.name),
          cargo: user.cargo,
        }
        return userData
      },
      readLogin(){
        return loginStore.readLogin
      }
    }
  }
</script>