<template>
    <v-navigation-drawer app color="white" location="right" width="290">

    <v-toolbar>
      <v-toolbar-title>Legislação</v-toolbar-title>
    </v-toolbar>
    <v-list class="ma-0 pa-0" lines="three"> 
      <v-list-item v-for="item, i in legislacao" :key="i" link @click="goTO(item.url)">
        <v-list-item-title>{{ item.nome }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ item.desc }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
    </v-navigation-drawer>
</template>

<script>
  export default {
    data: () => ({
      legislacao:[
        {id: 1, nome:'LEI 12.286, DE 28 DE MAIO DE 2024', desc:'Repristina o art. 88 da Lei no 6.107, de 27 de julho de 1994, que dispõe sobre o regime jurídico dos servidores públicos civis do Estado do Maranhão e acrescenta a Seção V, ao Capítulo VI, da Lei no 10.765, de 29 de dezembro de 2017, que dispõe sobre a criação do Grupo Ocupacional Tributação, Arrecadação e Fiscalização - TAF, da Administração Tributária do Estado do Maranhão e o Plano de Carreiras, Cargos e Salários, e dá outras providências.', url:'https://sistemas1.sefaz.ma.gov.br/portalsefaz/files?codigo=24738'},
        {id: 2, nome:'MEDIDA PROVISÓRIA Nº 443, DE 24 DE ABRIL DE 2024', desc: 'Repristina o art. 88 da Lei nº 6.107, de 27 de julho de 1994, que dispõe sobre o regime jurídico dos servidores públicos civis do Estado do Maranhão e acrescenta a Seção V, ao Capítulo VI, da Lei nº 10.765, de 29 de dezembro de 2017, que dispõe sobre a criação do Grupo Ocupacional Tributação, Arrecadação e Fiscalização - TAF, da Administração Tributária do Estado do Maranhão e o Plano de Carreiras, Cargos e Salários, e dá outras providências.', url: 'https://sistemas1.sefaz.ma.gov.br/portalsefaz/files?codigo=24739'},
        {id: 3, nome:'PORTARIA N° 207, DE 10 DE JUNHO DE 2024', desc: 'Estabelece as regras e critérios para a realização da avaliação de desempenho individual do servidor do grupo TAF para fins da Gratificação de Aumento de Produtividade pelo Desempenho do Servidor Ativo Relativamente às Atividades Desenvolvidas, nos termos do Decreto nº 39.142, de 7 de junho de 2024.', url:'https://sistemas1.sefaz.ma.gov.br/portalsefaz/files?codigo=24742'},
        {id: 4, nome:'DECRETO Nº 39.142, DE 7 DE JUNHO DE 2024.', desc:'Regulamenta as formas e condições para o pagamento da Gratificação de Aumento de Produtividade de que trata o art. 88, da Lei nº 6.107, de 27 de julho de 1994 aos servidores do Grupo Ocupacional Tributação, Arrecadação e Fiscalização – TAF, e dá outras providências', url: 'https://www.sindaftema.org.br/wp-content/uploads/2024/06/3.-DECRETO-No-39.142-DE-7-DE-JUNHO-DE-2024.-regulamentacao-da-produtividade.pdf'},
      ]
    }),
    methods:{
      goTO(url){
        window.open(url, '_blank');
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>