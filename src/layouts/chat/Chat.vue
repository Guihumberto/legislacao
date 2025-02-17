<template>
    <v-app :theme="theme">
      <div class="container">
        <Header />
        <default-view class="content" />
      </div>
    </v-app>
</template>

<script setup>
    import Header from './appbar.vue'
    import DefaultView from './View.vue'

    import { ref, provide } from 'vue'

    const theme = ref('dark')
    provide('theme', theme)

</script>

<style scoped>

</style>