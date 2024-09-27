<template>
    <div class="text-center">
      <v-btn
        color="primary"
        size="small"
        variant="tonal"
        title="Ver páginas agregadas"
      >
        Ver
        <v-dialog
          v-model="dialog"
          activator="parent"
          max-width="1080"
        >
          <v-card>
            <v-card-text>
                <div class="border pa-5 mb-2" v-for="item, i in listPage" :key="i">
                  <p class="font-weight-bold">página: {{ item.page }}</p>
                  <p v-html="item.text"></p> 
                </div>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" block @click="dialog = false">fechar</v-btn>
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
        page: Array,
    },
    computed:{
      listPage(){
        let list = this.page
        let list1 = []

       list.forEach(x => {
          x.text = x.text.replace(/\n+/g, '<br>');
          list1.push(x)
        })
        return list1
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
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>