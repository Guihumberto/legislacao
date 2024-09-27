<template>
  <section class="atendimento">
    <div class="container">
      <h2 class="spaceh2 text-white">Atendimento</h2>
      <div class="even-columns">
        <div class="item" v-for="item, i in ways" :key="i">
          <v-icon size="5rem" v-if="item.icon">{{ item.icon }}</v-icon>
          <h6 class="px-2" v-html="item.title"></h6>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data(){
      return{
        ways:[
          {id:1, title: 'Pagamento <br> emissão de DARE', icon: 'mdi-barcode', ulr:''},
          {id:2, title: 'Benefícios Fiscais', icon: '', ulr:''},
          {id:3, title: 'Orientação Tributária', icon: '', ulr:''},
          {id:4, title: 'Malhas Fiscais', icon: '', ulr:''},
          {id:5, title: 'Cadastro de Contribuintes', icon: '', ulr:''},
          {id:6, title: 'Guia de Orientação EFD', icon: '', ulr:''},
          {id:7, title: 'Informações Importantes', icon: '', ulr:''},
          {id:8, title: 'Contatos', icon: '', ulr:''},
          {id:9, title: 'Manuais', icon: '', ulr:''},
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
.atendimento{
  background: var(--primary-color);
}
.container{
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
.even-columns{
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 8rem;
  gap: 1rem;
  transition: .5s ease;
}
.item{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  color: #000;
  border-radius: 8px;
  font-weight: 400;
  transition: .5s;
  text-align: center;
  border: 10px double var(--primary-color);
}
.even-columns .item:nth-child(1){
  grid-row: 1 / 3;
  grid-column: 1/ 3;
}
.item:hover{
  transform: scale(1.1);
}
@media (max-width:750px) {
  .even-columns{
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width:500px) {
  .even-columns{
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
