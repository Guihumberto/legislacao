<template>
  <div class="footer">
      <div class="container">
        <div class="datasefaz">
          <!-- <img class="mb-2" src="https://www.transparencia.ma.gov.br/assets/images/v2/img/governo2-removebg-preview.png" alt=""> -->
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
        </div>
      </div>
      <div class="subfooter">
        <h3>© 2024 - OH-MY-SEARCH</h3>
        <p class="text-center">Desenvolvido e idealizado por <br class="off"> JOÃO HUMBERTO S R JR.</p>
      </div>
  </div>
</template>

<script>
  import dialoghorario from '@/components/dialogs/horarios'
  export default {
    components:{
      dialoghorario
    },
    methods:{
      goTO(item){
        window.open(item, '_blank');
      }
    }
  }
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
}
@media print {
    .footer {
        display: none;
    }
}
</style>
