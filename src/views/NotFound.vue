<template>
    <section>
        <div class="container">
          <h1>Página não encontrada</h1>
          <p>Desculpe, a página que você está procurando não existe.</p>
          <router-link to="/">Voltar para a página inicial</router-link>
        </div>
    </section>
  </template>
  
  <script>
  export default {
    name: 'NotFound'
  }
  </script>
  
  <style scoped>
  .container{
    min-height: 70vh;
  }
  /* Estilos personalizados para a página 404 */
  </style>