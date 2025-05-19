<template>
  <v-main>
      <v-container
        fluid
        class="v-container"

      >
        <router-view />
      </v-container>
    </v-main>
</template>
<script setup>
</script>
<style scoped>
  .v-container{
    min-height: calc(100vh - 64px);
    display: flex;
  }
</style>