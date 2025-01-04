<template>
  <section class="search" :class="geralStore.readSearch ? 'activeSearch' : 'flagmaranhao'">
    <div class="container">
      <div class="logo">
        <v-icon size="5rem">mdi-script-text</v-icon>
        <div class="ml-2">
          <small>Legislação <v-chip density="compact">BETA</v-chip></small>
          <div class="d-flex justify-center align-center">
            <h1 class="title">OH-MY-SEARCH</h1>
          </div>
          <progress-linear />
        </div>
      </div>
      <boxResumo />
    </div>
  </section>
</template>

<script setup>
  import progressLinear from '@/components/legislacao/elements/progressLinear.vue'
  import boxResumo from '@/components/home/boxResumo.vue';

  import { useGeralStore } from '@/store/GeralStore'
  const geralStore = useGeralStore()

  geralStore.changeTitleApp({title:'Legislação', to:'/'})
    
  
</script>

<style lang="scss" scoped>
.container{
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 1rem;
  transition: .5s ease;
  min-height: 60vh;
  flex-direction: column;
}
.container.active{
  min-height: 70vh;
  align-items: baseline;
}
.flagmaranhao{
  background: var(--primary-color);
}
.logo{
  line-height: normal;
  user-select: none;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  // background: linear-gradient(60deg, blue, rgb(80, 111, 195), rgb(145, 79, 210));
}
.logo h1 {
  font-weight: 800;
}

</style>
