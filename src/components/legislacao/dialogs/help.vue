<template>
    <div class="text-center">
      <v-btn
        color="primary"
        variant="text"
      >
      <v-icon size="30">mdi-help-circle-outline</v-icon>
        <v-dialog
          v-model="dialog"
          activator="parent"
          width="auto"
        >
          <v-card max-width="800">
            <v-card-title class="bg-primary">MANUAL</v-card-title>
            <v-card-text>
              <div class="questions" v-for="item, i in questions" :key="i">
                <h3>{{ item.question }}</h3>
                <p>{{ item.answer }}</p>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" block @click="dialog = false">Fechar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-btn>
    </div>
  </template>
  <script>
  export default {
    data () {
      return {
        dialog: false,
        questionsPorTemos:[
          {
            id: 1, 
            question: "Como funciona?",
            answer: "Digite na barra de busca termos de interesse e digite enter ou no botão buscar. É possível bucar por termos avulso ou frase exata. Isso influenciará na quantidade de resultados retornados (único campo obrigatório)."
          },
          {
            id: 2,
            question: "Restringir buscas",
            answer: "Os campos Fonte da Norma e Período, se marcados, restrigem os resultados a seleção realizada. Se nenhum campo for marcado a busca será realizada em todas as fontes ou períodos disponíveis. Utilize estes campos caso saiba que determinada norma, por exemplo, esteja em uma 'portaria' do ano '2023' (é necessário preencher os temos/frases no campo busca)."
          },
          {
            id: 3,
            question: "Aumentar a precisão",
            answer: "A marcação desse campo restringe os resultados retornados para os mais relevantes. O seu funcionamento será modificado dependente da opção selecionada dos campos 'qualquer palavra' (padrão) ou 'frase exata'. Se 'qualquer palavra' estiver selecionado o motor de busca retornará como verdadeiro resultados desde que encontre um dos termos buscados. Caso 'aumentar precisão esteja marcado o motor de busca retornará apenas resutlados que contenha todos os termos inseridos no campo 'busca', independente da ordem ou distância dos temos '"
          },
          {
            id: 4,
            question: "Resultados das buscas",
            answer: "as resultados das buscas são organizadas por relevância. De forma simplificada, o motor de busca pecorre cada página da legislação e retorna as página mais relevantes de cada legislação. Cada resultado da busca, na visualização por página (padrão), refere-se a uma página. É possível verificar a relevância do resultado por uma seta em cada linha de resultado, sento a dupla seta azul para cima a mais relevante e a seta vermelha para baixo a menos relevante."
          },
          {
            id: 5,
            question: "Criar documento",
            answer: "Na visualização por página (padrão) é possível montar um documento a partir das buscas realizadas ao clicar no icone do lado esquerdo do resultado. O documento criado persiste quando realizada nova busca, mas é apagado ao atualizar a página ou fechar o navegador."
          },
          {
            id: 6,
            question: "Modos de visualização",
            answer: "No menu que fica logo acima dos resultados, é possível ver o total de registros (páginas) que foram encontrados. No menu existe um ícone do lado direto no qual é possível mudar a visualização por documentos agregados. Na vsualização por documentos agregados os resultados são exibidos por norma com todas as páginas relevantes encontradas na busca."
          },
          {
            id: 7,
            question: "Histórico das buscas",
            answer: "As buscas realizadas serão armazenadas temporariamente na barra lateral esquerda com todos os atributos que foram marcados. o Histórico da busca é apagado ao atualizar a página ou fechar o navegador."
          }
        ],
        questionsPorLei:[
          {
            id: 1,
            question:"Busca por lei",
            answer: "Digite o nome ou número da norma no campo buscar ou clique na fonte correspondente para expandir e localizar a norma por ano."
          },
          {
            id: 2,
            question:"Restringir a busca",
            answer: "Selecione a Fonte e/ou período para restringir os resultados da busca. O campo 'Buscar' não é obrigatório. A seleção exibirá apenas os resultados correspondentes."
          },
        ]
      }
    },
    props:{
      idHelp: Number
    },
    computed:{
      questions(){
        if(this.idHelp == 2){
          return this.questionsPorLei
        } else {
          return this.questionsPorTemos
        }
      }
    }
  }
</script>

<style scoped>
.questions h3{
  font-weight: 500;
  font-size: 1.5rem;
}
.questions p{
  padding: .3rem .1rem;
}
</style>