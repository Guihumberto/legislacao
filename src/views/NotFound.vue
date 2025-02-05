<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
          <h1>Página não encontrada</h1>
          <p>Desculpe, a página que você está procurando não existe.</p>
          <router-link to="/">Voltar para a página inicial</router-link>
        </div>
    </section>
</template>

<script setup>
  import { useGeralStore } from '@/store/GeralStore';
  const geralStore = useGeralStore()

</script>

<style scoped>
</style>