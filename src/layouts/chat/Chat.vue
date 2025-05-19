<template>
    <v-app :theme="theme">
        <Header />
        <default-view />
        <Footer />
    </v-app>
</template>

<script setup>
    import Header from './appbar.vue'
    import Footer from './footer.vue'
    import DefaultView from './View.vue'

    import { ref, provide } from 'vue'

    const theme = ref('dark')
    provide('theme', theme)

</script>

<style>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
  font: inherit;
}
ul[role="list"],
ol[role="list"]{
  list-style: none;
}
html:focus-within{
  scroll-behavior: smooth;
}
html, body {
  height: 100%;
}
a:not([class]) {
  text-decoration-skip-ink: auto;
}
img, picture,svg {
  max-width: 100%;
  display: block;
}
body {
  text-rendering: optimizeSpeed;
  line-height: 1.5;
}
@media (max-width: 700px) {
    html{
      font-size: 75%;
    }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

</style>