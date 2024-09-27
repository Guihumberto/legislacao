<template>
  <section>
    <div class="container">
      <h2 class="spaceh2">Acesso rápido</h2>
      <div class="even-columns">
        <div class="item" v-for="item, i in linksList" :key="i">
          <h3 class="title" v-if="item.cap == 1">{{ item.title }}</h3>
          <a v-else class="itemlink" href=""> {{item.title}}</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data(){
      return{
        linksList:[
          {cap: 1, title: 'CERTIDÕES', url: '', group: 1},
          {cap: 2, title: 'Emitir Certidão Negativa de Débito - CND', url: '', group: 1},
          {cap: 2, title: 'VALIDAR CERTIDÃO NEGATIVA DE DÉBITO - CND', url: '', group: 1},
          {cap: 2, title: 'Emitir Certidão Negativa de Dívida Ativa - CNDA', url: '', group: 1},
          {cap: 2, title: 'VALIDAR CERTIDÃO NEGATIVA DE DÍVIDA ATIVA - CNDA', url: '', group: 1},
          {cap: 1, title: 'TRANSPARÊNCIA', url: '', group: 2},
          {cap: 2, title: 'Portal das Finanças', url: '', group: 2},
          {cap: 2, title: 'Arrecadação Diária', url: '', group: 2},
          {cap: 2, title: 'Edital', url: '', group: 2},
          {cap: 2, title: 'Relatórios da Administração Tributária', url: '', group: 2},
          {cap: 2, title: 'INCENTIVOS FISCAIS', url: '', group: 2},
          {cap: 2, title: 'Núcleo de Estudos Econômico-Fiscais', url: '', group: 2},
          {cap: 2, title: 'INTEGRIDADE DE RISCOS', url: '', group: 2},
          {cap: 2, title: 'Arrecadação Evolução', url: '', group: 2},
          {cap: 2, title: 'Arrecadação por Município', url: '', group: 2},
          {cap: 2, title: 'Arrecadação', url: '', group: 2},
          {cap: 1, title: 'PROJETOS NACIONAIS', url: '', group: 3},
          {cap: 2, title: 'EFD', url: '', group: 3},
          {cap: 2, title: 'MDF-e', url: '', group: 3},
          {cap: 2, title: 'GNRE Online', url: '', group: 3},
          {cap: 2, title: 'NF-e', url: '', group: 3},
          {cap: 2, title: 'NFC-e', url: '', group: 3},
          {cap: 2, title: 'REDESIM', url: '', group: 3},
          {cap: 2, title: 'CT-e', url: '', group: 3},
          {cap: 2, title: 'SCDE', url: '', group: 3},
          {cap: 2, title: 'GT - ENCAT', url: '', group: 3},
          {cap: 2, title: 'Download XML da NF-e', url: '', group: 3},
          {cap: 2, title: 'BP-e', url: '', group: 3},
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
.container{
  min-height: 50vh;
  overflow: hidden;
}
.even-columns {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 0 30px;
  height: 350px;
}
.item{
  width: 22rem;
  display: flex;
  flex-wrap: wrap;
  padding: .3rem 0;
}
.title{
  font-size: 1.2rem;
  font-weight: 600;
}
.itemlink{
  font-size: 1rem;
  text-decoration: none;
  color: grey;
}
.itemlink:hover{
  color: var(--primary-color);
}
@media (max-width:500px) {
  .even-columns{
    height: 100%;
  }
  .title{
    margin-top: 1rem;
  }
}
</style>
