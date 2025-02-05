<template>
    <v-app>
      <div class="container">
        <Header />
        <default-view class="content" />
        <Footer />
      </div>
    </v-app>
</template>

<script setup>
    import Header from './appbar.vue'
    import DefaultView from './View.vue'
    import Footer from './footer.vue'
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
  font: inherit;
}
</style>