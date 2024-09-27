<template>
  <section>
    <div class="container">
      <h2 class="spaceh2">Dúvidas Frequentes</h2>
      <div class="even-columns">
        <v-expansion-panels>
          <v-expansion-panel
            elevation="0"
            color="var(--primary-color)"
            class="border text-white font-weight-bold"
            v-for="item, i in answers"
            :key="i"
            :title="item.ans"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          ></v-expansion-panel>
        </v-expansion-panels>
      </div>
      <div class="btnWrapper">
        <v-btn variant="outlined" color="primary" width="300px">Ver Mais</v-btn>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data(){
      return{
        answers:[
          {id:1, ans: 'Como Acessar o SEFAZNET?', resp: 'lorem10'},
          {id:2, ans: 'Como fazer um Pacelamento?', resp: 'lorem10'},
          {id:3, ans: 'Como solicitar Restiuição?', resp: 'lorem10'},
          {id:4, ans: 'Como consultar o IPVA?', resp: 'lorem10'},
          {id:5, ans: 'Como preencher a declaração do ITCD?', resp: 'lorem10'},
          {id:6, ans: 'Como regularizar minha empresa?', resp: 'lorem10'},
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
.container{
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
.btnWrapper{
  display: flex;
  justify-content: center;
  padding: 2rem;
}

</style>
