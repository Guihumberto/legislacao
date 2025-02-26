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
        ></v-avatar>

        <div>leges.estudo@gmail.com</div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="[icon, text] in links"
          :key="icon"
          :prepend-icon="icon"
          :title="text"
          link
          to="/"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
</template>

<script setup>
  import { ref, inject, computed } from 'vue'

  const theme = inject('theme')
  const drawer = ref(false)

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
    ['mdi-arrow-left', 'Legisação',],
  ]
</script>

<style scoped>

</style>