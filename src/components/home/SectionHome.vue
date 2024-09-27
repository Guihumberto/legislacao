<template>
  <section>
    <div class="container">
      <h2 class="spaceh2">Serviços</h2>
      <div class="even-columns">
        <router-link class="box" v-for="item, i in services" :key="i" :to="item.url">
          <p class="text-center">
            {{ item.name }}
          </p>
        </router-link>
      </div>
      <div class="btnWrapper">
        <v-btn variant="outlined" color="primary" width="300px">Mais Serviços</v-btn>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data(){
      return{
        services:[
          {name: 'DARE', url:'/'}, 
          {name: 'IPVA', url:'/'}, 
          {name: 'SEFAZ.NET', url:'/'},
          {name: 'ITCD', url:'/'},
          {name: 'ISENÇÕES IPVA E ICMS/DESONERAÇÕES', url:'/'}, 
          {name: 'DOWNLOAD XML(NF-E)/DOC. FISCAIS ELETRÔNICOS', url:'/'}, 
          {name: 'CERTIDÕES', url:'/'},
          {name: 'LEGISLAÇÃO', url:'/leges'},
          {name: 'CADASTRO/ATIVAÇÃO', url:'/'},
          {name: 'NOTA FISCAL AVULSA ELETRÔNICA (NFA-E)', url:'/'},
          {name: 'LEGISLAÇÃO', url:'/leges'},
          {name: 'CADASTRO/ATIVAÇÃO', url:'/'},
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
.container{
  display: flex;
  flex-direction: column;

}
.even-columns{
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  width: 100%;
}
.box{
  width: 14rem;
  height: 5rem;
  background-color: var(--primary-color);
  color: white;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  transition: .5s ease;
}
.box:hover{
  transform: scaleX(1.1);
}
.btnWrapper{
  display: flex;
  justify-content: center;
  padding: 2rem;
}

</style>
