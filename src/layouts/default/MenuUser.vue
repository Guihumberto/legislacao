<template>
    <div>
        <div class="text-center my-5">
        <v-avatar class="mb-3" size="5rem" variant="tonal" color="blue"><v-icon size="3rem">mdi-account</v-icon></v-avatar>
        <h3>{{ loginStore.readLogin.nickname }}</h3>
        <h4>{{  loginStore.readLogin.setor }}</h4>
        <!-- <v-btn color="red" variant="text" class="text-lowecase">Sair <v-icon class="ml-1" size=".9rem">mdi-logout</v-icon></v-btn> -->
      </div>
      <v-divider></v-divider>
      <v-card
        class="mx-auto"
        max-width="300"
        elevation="0"
        color="transparent"
      >
        <v-list density="compact">
          <v-list-subheader>Menu</v-list-subheader>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :value="item"
            color="primary"
            :to="item.url"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>

            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item>
          <div class="my-5" v-if="loginStore.readLogin.admin">
            <v-list-subheader>Gerencial</v-list-subheader>
            <v-list-item
              v-for="(item, i) in managerial"
              :key="i"
              :value="item"
              color="primary"
              :to="item.url"
            >
              <template v-slot:prepend>
                <v-icon :icon="item.icon"></v-icon>
              </template>
  
              <v-list-item-title :title="item.text" v-text="item.text"></v-list-item-title>
            </v-list-item>
          </div>
          <div class="my-5" v-if="loginStore.readLogin.admin">
            <v-list-subheader>Administração</v-list-subheader>
            <v-list-item
              v-for="(item, i) in adms"
              :key="i"
              :value="item"
              color="primary"
              :to="item.url"
            >
              <template v-slot:prepend>
                <v-icon :icon="item.icon"></v-icon>
              </template>
  
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item>
          </div>
          <div class="my-5" v-if="forumStore.readMyGroup.length">
            <v-list-subheader class="d-flex justify-space-between align-center">
              Meus Foruns
              <ConfigMyGroup :groups="forumStore.readMyGroup" />
            </v-list-subheader>
            <transition-group name="fade">
              <v-list-item
                v-for="(item, i) in forumStore.readMyGroup"
                :key="i"
                color="primary"
                :to="`/avancado/forumlaw/${item.id}`"
                prepend-icon="mdi-forum"
              >
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-list-item-title v-bind="props" v-text="item.title"></v-list-item-title>
                  </template>
                  {{ item.title }}
                </v-tooltip>
              </v-list-item>
            </transition-group>
            <v-btn 
              @click="$router.push('/permissoes')"
              prepend-icon="mdi-check-circle" variant="text" block >Permissões
              <template v-slot:append>
                <v-badge
                  color="info"
                  :content="solicitationStore.readTotalAvaliations"
                  inline
                ></v-badge>
                <v-badge
                  color="success"
                  :content="solicitationStore.readTotalInvites"
                  inline
                ></v-badge>
              </template>
            </v-btn>
          </div>
          <div v-else>
            <v-btn 
              @click="$router.push('/permissoes')"
              prepend-icon="mdi-check-circle" variant="text" block >Permissões
              <template v-slot:append>
                <v-badge
                  color="info"
                  :content="solicitationStore.readTotalAvaliations"
                  inline
                ></v-badge>
                <v-badge
                  color="success"
                  :content="solicitationStore.readTotalInvites"
                  inline
                ></v-badge>
              </template>
            </v-btn>
          </div>
        </v-list>
      </v-card>        
    </div>
    
</template>

<script setup>  
    import { onMounted } from 'vue'
    import ConfigMyGroup from '@/components/dialogs/configMyGroup.vue'

    import { useForumStore } from '@/store/ForumStore'
    const loginStore = useLoginStore()
    
    import { useLoginStore } from '../../store/LoginStore'
    const forumStore = useForumStore()
    
    import { useSolicitationsStore } from '@/store/SolicitationsStore'
    const solicitationStore = useSolicitationsStore()

    onMounted(() => {
      forumStore.getForum()
    })

    solicitationStore.getAll()

    const items = [
              { text: 'Início', icon: 'mdi-home', url:'/leges' },
              { text: 'Normas', icon: 'mdi-file-document-multiple', url:'/legesporlei' },
              { text: 'Documentos', icon: 'mdi-folder', url:'/documents' },
              { text: 'Favoritos', icon: 'mdi-star', url:'/favorites' },
              { text: 'Histórico', icon: 'mdi-history', url:'/history' },
              { text: 'Meus Posts', icon: 'mdi-forum-outline', url:'/myposts' }
    ]

    const managerial = [
              { text: 'Normas mais acessadas', icon: 'mdi-book', url:'/gerencial/normas' },
              { text: 'Termos mais buscados ', icon: 'mdi-magnify', url:'/gerencial/search' }
    ]

    const adms = [
              { text: 'Importar', icon: 'mdi-upload', url:'/importar' },
              { text: 'Normas', icon: 'mdi-file-document', url:'/laws' },
              { text: 'Usuários', icon: 'mdi-account-group', url:'/users' },
              { text: 'Fonte', icon: 'mdi-format-list-bulleted-square', url:'/fonte_admin' },
              { text: 'Publicações', icon: 'mdi-newspaper-variant', url:'/publishs_admin' },
    ]

</script>

<style scoped>

</style>