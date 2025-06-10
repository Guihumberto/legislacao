<template>
  <v-app>
    <div class="container">
      <default-bar />
      <default-view class="content" />
      <Footer />
      <v-snackbar
                v-model=" $snackStore.readSnack.snackbar"
                :timeout=" $snackStore.readSnack.timeout"
                :color=" $snackStore.readSnack.color"
            >
          {{  $snackStore.readSnack.text }}
          <template v-slot:actions>
              <v-btn
              color="blue"
              variant="text"
              @click="$snackStore.readSnack.snackbar = false"
              >
              X
              </v-btn>
          </template>
      </v-snackbar>
    </div>
  </v-app>
</template>

<script setup>
  import { onMounted, ref, provide } from 'vue'

  import DefaultBar from './AppBar.vue'
  import DefaultView from './View.vue'
  import Footer from './Footer.vue'

  import { useGeneralStore } from '@/store/GeneralStore'
  const generalStore = useGeneralStore()

  import { useLawStore } from '@/store/LawsStore'
  const lawStore = useLawStore()

  import { useConsultaStore } from '@/store/ConsultaStore'
  const consultaStore = useConsultaStore()  

  const theme = ref('light')
  provide('theme', theme)

  onMounted(async () => {
    await generalStore.getListFonteMudar()
    await generalStore.getAllYearsLaws()
    await lawStore.getMainLaws()
    await lawStore.getAllLaw()
    await consultaStore.contadores()
  })
  


</script>

<style>
:root{
  --primary-color: #0063AA;
  --second-color: pink;
  --teste-color: yellowgreen;

  --clr-accent-400: hsl(12, 88%, 59%);
  --clr-accent-100: hsl(13, 100%, 96%);

  --clr-primary-400: hsl(228, 39%, 23%);

  --clr-neutral-100: hsl(232, 12%, 13%);
  --clr-neutral-900: hsl(0, 0%, 0%);

  --ff-primary: 'Be Vietnam Pro', sans-serif;

  --ff-body: var(--ff-primary);
  --ff-heading: var(--ff-primary);

  --fw-regular: 400;
  --fw-semi-bold: 500;
  --fw-bold: 700;

  --fs-300: .8125rem;
  --fs-400: .875rem;
  --fs-500: 0.9375rem;
  --fs-600: 1rem;
  --fs-700: 1.875rem;
  --fs-800: 2.5rem;
  --fs-900: 3.5rem;

  --fs-body: var(--fs-400);
  --fs-primary-heading: var(--fs-800);
  --fs-secondary-heading: var(--fs-700);
  --fs-nav: var(--fs-500);
  --fs-button: var(--fs-300);
}

.title-root { color: #1976D2; } /* primary */
.title-concept { color: #2196F3; } /* blue */
.title-definition { color: #4CAF50; } /* green */
.title-category { color: #FF9800; } /* orange */
.title-exclusion { color: #F44336; } /* red */
.title-special { color: #9C27B0; } /* purple */
.title-item { color: #9E9E9E; } /* grey */

@media (min-width: 50em) {
  :root {
    --fs-body: var(--fs-500);
    --fs-primary-heading: var(--fs-900);
    --fs-secondary-heading: var(--fs-800);
    --fs-nav: var(--fs-300);
  }
}
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
@media (prefers-reduced-motion: reduce) {
  html:focus-within {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
h1 {
  font-size: var(--fs-800);
}
h2 {
  font-size: var(--fs-700);
}
h3 {
  font-size: var(--fs-600);
}
h4 {
  font-size: var(--fs-500);
}
.spaceh2 {
  margin-bottom: 2em;
}
section{
  transition: 1s ease;
}
section:nth-child(odd){
  background: rgb(227, 227, 236);
}
section .container{
  width: min(90vw, 1000px);
  margin-inline: auto;
  /* margin-bottom: 1rem; */
  min-height: calc(100vh - 273px);
  padding: 1rem 0 .1rem;
  transition: 1s ease;
}

section .container2{
  width: min(90vw, 1000px);
  margin-inline: auto;
  /* margin-bottom: 1rem; */
  min-height: calc(100vh - 152px);
  padding: 1rem 0 .1rem;
  transition: 1s ease;
}

@media (max-width: 500px){
  section{
    padding: .5rem 0;
  }
}
@media (max-width:310px) {
  .container{
    display: none;
  }
}
@media (max-width: 700px) {
    html{
      font-size: 75%;
    }
}

@media (max-height: 844px) {
  section .container, section .container2{
    min-height: 100vh;
  }
}

@keyframes aparecer {
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}
/* shepherf */
.shepherd-content {
  word-wrap: break-word;
  white-space: normal;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}



</style>
