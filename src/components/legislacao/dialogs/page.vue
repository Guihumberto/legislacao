<template>
    <div class="text-right">
      <v-btn
        color="primary"
        size="small"
        variant="text"
        title="Ver a página"
      >
        Ver mais
        <v-dialog
          v-model="dialog"
          activator="parent"
          max-width="1080"
        >
          <v-card>
            <v-card-text>
                <div class="border pa-5">
                    {{ page.page_to_norma.title }} <br>
                    {{ page.tipo }} | Ano: {{ page.ano }} | Pág: {{ page.num_page }}<br>
                    {{ page.path }}
                </div>
                <div class="border pa-5 mt-2">
                  <p 
                      class="formatText" 
                      v-html="searchP ? markSearch(textePage) : textePage"
                  >
                  </p>
                </div>
            </v-card-text>
            <v-card-actions class="d-flex justify-center">
              <v-btn color="primary"  @click="dialog = false">fechar</v-btn>
              <v-btn @click="openUrl()" color="red" variant="outlined">Imprimir</v-btn>
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
      }
    },
    props:{
        page: Object,
        searchP: String,
        id: String
    },
    computed:{
      textePage(){
        let text = this.page.text_page
        text = text.replace(/\n+/g, '<br>');
        return text
      }
    },
    methods:{
      markSearch(texto){
          let palavrasChave = this.searchP.split(' ')

          palavrasChave = this.excluirStopWords(palavrasChave)

          const escapedKeywords = palavrasChave.map(keyword => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

          const regex = new RegExp(`\\b(${escapedKeywords.join('|')})\\b`, 'gi');
          const textoMarcado = texto.replace(regex, '<mark>$1</mark>');

          return textoMarcado;
          
      },
      excluirStopWords(arrayPrincipal) {
        const stopWords = ["a", "o", "e", "é", "um", "uma", "com", "de", "do", "da", "para", "por", "em", "os", "as", "isso", "essa", "esse", "isso", "está"];
        const resultado = arrayPrincipal.filter(palavra => !stopWords.includes(palavra));

        return resultado;
      },
      openUrl(){
        window.open(`textpage/${this.id}?search=search`, '_blank');
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>