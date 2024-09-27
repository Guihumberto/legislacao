<template>
  <section>
    <div class="container">
      <div class="even-columns">
        <div class="imgBanner">
          <v-carousel
            cycle
            height="100%"
            hide-delimiter-background
            show-arrows="hover"
          >
            <v-carousel-item
              v-for="(slide, i) in slides"
              :key="i"
              :src="slide.img"
            >
              <v-sheet
                color="transparent"
                height="100%"
              >
                <div class="d-flex fill-height justify-center align-end ">
                  <div class="slidetitle">
                    {{ slide.title }}
                  </div>
                </div>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </div>
        <div class="listNews">
          <h3 class="pa-2 bg-grey">Últimas notícias</h3>
          <v-list class="bg-transparent pa-0" lines="two">
            <v-list-item v-for="item, i in slides" :key="i" link class="border-b">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>
               {{ item.subtitle }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </div>
      </div>
      <div class="btnWrapper">
        <v-btn variant="outlined" color="primary" width="300px">Mais Notícias</v-btn>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {
        colors: [
          'indigo',
          'warning',
          'pink darken-2',
          'red lighten-1',
          'deep-purple accent-4',
        ],
        slides: [
          {id: 1, title:'Assembleia aprova projeto que compensa perdas de arrecadação de R$ 3,5 bilhões', subtitle: 'Mesmo com a necessidade de ajuste fiscal, a orientação do governador Carlos Brandão foi a de proteger as famílias de baixa renda e o meio ambiente.', date:'', img:'https://sistemas1.sefaz.ma.gov.br/arquivossite/imagens/arquivos/23943.png'},
          {id: 2, title:'Arquivos da DIEF de outubro/2023 podem ser entregues até o dia 24/11', subtitle: 'EFD do mês 10/23 pode ser transmitida até o dia 27 de novembro.', date:'', img:'https://sistemas1.sefaz.ma.gov.br/arquivossite/imagens/arquivos/23923.png'},
          {id: 3, title:'Maranhão ganha 1º lugar em prêmio nacional na categoria soluções em gestão fiscal', subtitle: '', date:'', img:'https://sistemas1.sefaz.ma.gov.br/arquivossite/imagens/arquivos/23976.png'},
          {id: 4, title:'Contribuintes do ICMS, IPVA e ITCD tem até o dia 27 de dezembro para aproveitar reduções de multas e juros', subtitle: 'Governo do Maranhão prorroga benefício pela segunda vez.', date:'', img:'https://sistemas1.sefaz.ma.gov.br/arquivossite/imagens/arquivos/23976.png'},
          {id: 5, title:'Alerta Garrafão realiza 2ª fase da operação no interior do Estado e identifica produtos sem selo de controle e sem nota fiscal', subtitle: 'Abordagem foi realizada na região de Caxias, Imperatriz, Bacabal, Santa Inês e Timon.', date:'', img:'https://sistemas1.sefaz.ma.gov.br/arquivossite/imagens/arquivos/23973.png'},
        ],
      }
    },
  }
</script>

<style lang="scss" scoped>
.container{
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  min-height: 50vh;
}
.even-columns{
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 50vh;
}
.imgBanner{
  width: min(100%, 48%);
  height: 100%;
  height: 38vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid grey;
}
.listNews{
  width: 48%;
}
.btnWrapper{
  display: flex;
  justify-content: center;
  padding: 2rem;
}
.slidetitle{
    background: rgba(54, 53, 53, 0.475) 100%;
    font-size: 1.3rem;
    padding: .5rem 1rem 2.5rem;
    color: azure;
  }
@media (max-width: 700px) {
  .even-columns{
    flex-direction: column;
  }
  .imgBanner{
    width: 100%;
  }
  .listNews{
    width: 100%;
    margin-top: 1rem;
  }
}
</style>
