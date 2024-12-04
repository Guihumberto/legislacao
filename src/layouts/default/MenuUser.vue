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
        </v-list>
      </v-card>
        
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    
    import { useLoginStore } from '../../store/LoginStore'
    const loginStore = useLoginStore()

    const items = ref([
              { text: 'Início', icon: 'mdi-home', url:'/leges' },
              { text: 'Documentos', icon: 'mdi-folder', url:'/documents' },
              { text: 'Favoritos', icon: 'mdi-star', url:'/favorites' },
              { text: 'Histórico', icon: 'mdi-history', url:'/history' }
    ])

</script>

<style scoped>

</style>