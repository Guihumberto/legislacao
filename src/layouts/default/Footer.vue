<template>
  <div class="footer" :class="$route.name == 'Avancado' || $route.name == 'Concurso Painel' || $route.name == 'Forum Law' ? 'noneFooter':''">
      <!-- <div class="container">
        <div class="datasefaz">
          <h3>OH-MY-SEARCH</h3>
          <p>CNPJ:</p>
          <p> Av. Gen. Arthur Carvalho, 500 <br> CEP 65066-320, São Luís - MA</p>
        </div>
        <div>
          <div class="groupbtns">
            <v-btn class="btn" variant="tonal"><v-icon class="mr-2">mdi-phone</v-icon>MANUAIS</v-btn>
            <v-btn class="btn" variant="tonal"><v-icon class="mr-2">mdi-phone</v-icon>Contatos</v-btn>
            <v-btn variant="tonal"><v-icon class="mr-2">mdi-map-marker-circle</v-icon>SOBRE</v-btn>
          </div>
          <div class="my-5 textasdim">
            <p>O conteúdo disponível neste portal está sob responsabilidade <br> de João Humberto Silva Ribeiro Júnior. </p>
            <p>(98) 98465-0786 | email: humberto.junior28@yahoo.com.br</p>
          </div>
          <div class="text-center linksfinal">
            <a href="#" target="_blank">Dowloads</a> |
            <a href="#" target="_blank">Mapa do Site</a> |
            <a href="#" target="_blank">LGPD</a>
          </div>
          <div class="text-center mt-4">
            <contador class="contador" />
          </div>
        </div>
      </div> -->
      <div class="subfooter">
        <h3>© {{ new Date().getFullYear() }} - ESTUDO DA LEI</h3>
        <p class="text-center">Desenvolvido e idealizado por <br class="off"> JOÃO HUMBERTO S R JR.</p>
      </div>
      <div class="py-4 w-100 text-center info">
        https://leges.estudodalei.com.br/
      </div>
  </div>
</template>

<script setup>
  import contador from "@/components/legislacao/elements/contador.vue"
</script>

<style lang="scss" scoped>
  .footer{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    color: var(--clr-accent-100);
    width: 100%;
    background: rgb(158, 158, 165);
    transition: 1s ease;
    animation: topAppear 1s ease;
  }
  .container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 0;
    min-height: 10rem;
    gap: 3rem;
    width: min(90%, 1000px);
  }
  .datasefaz{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .datasefaz > *{
    text-align: left;
    width: 100%;
  }
  .subfooter{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgb(58, 58, 59);
    width: 100%;
    padding: 1rem 0;
  }
  .textasdim{
    font-size: .9rem;
    text-align: center;
  }
  .linksfinal a{
    text-decoration: none;
    padding: .5rem;
    color: #000;
    transition: .5s;
  }
  .linksfinal a:hover{
    text-decoration: underline;
  }
  .btn{
    margin: 0 1rem;
  }
  .off{
    display: none;
  }
  .info{
    background: #03012D;
  }
  .noneFooter{
    display: none;
  }
  @media (max-width:900px) {
    .container{
      flex-direction: column;
    }
    .datasefaz > *{
      text-align: center;
    }
  }
  @media (max-width:500px) {
    .groupbtns{
      display: grid;
      grid-auto-columns: 1fr;
      gap: 1rem;
    }
    .btn{
      margin: 0;
    }
    .off{
      display: block;
    }
    .noneFooter{
      display: none;
    }
  }
  @media print {
      .footer {
          display: none;
      }
  }

  @keyframes topAppear {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
    
  }
</style>
