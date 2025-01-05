<template>
  <v-main :class="geralStore.readHeaderShow ? 'with_header': 'no_header' ">
    <router-view />
  </v-main>
</template>

<script setup>
 import { useGeralStore } from '@/store/GeralStore'
 const geralStore = useGeralStore()

</script>

<style scoped>
.no_header, .with_header{
  /* background: rgb(227, 227, 236); */
}
.with_header{
  min-height: calc(100vh - 460px);
}
.no_header{
  min-height: calc(100vh - 340px);
}

</style>