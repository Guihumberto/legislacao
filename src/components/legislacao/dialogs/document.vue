<template>
    <div class="text-center">
      <v-btn
        color="white"
        variant="outlined"
      >
        Documento Criado ({{ docs.length }})
        <v-dialog
          v-model="dialog"
          activator="parent"
          max-width="1080"
        >
          <v-card class="dialogBox">
            <v-card-title class="bg-primary">Documento</v-card-title>
            <v-card-text>
              <!-- index das paginas -->
                <div class="border pa-5 mt-2" id="top">
                  <h2>Termos da busca</h2>
                  <div class="py-5">
                    <div class="fieldSearch">Texto: {{ $route.query.search }}</div> 
                    <div class="fieldSearch">Fonte: </div> 
                    <div class="fieldSearch">Período: </div> 
                    <div class="fieldSearch">Busca:{{ $route.query.termo == 2 ? ' por palavras' : 'por Frase exata' }} </div> 
                    <div class="fieldSearch">Precisão: {{ $route.query.precision == 'true' ? 'Sim' : 'Não' }}</div>
                  </div>
                  <h2>Lista de páginas anexadas</h2>
                  <div class="py-5">
                    <v-list>
                      <v-list-item 
                        v-for="ind, x in docs" :key="x" 
                        :subtitle="`${ind._source.tipo} - ${ind._source.ano}`"
                        link
                        @click="findPage(x)"
                      >
                        <template v-slot:prepend>
                          <v-icon icon="mdi-file-document"></v-icon>
                        </template>
                          <span>pag. {{ ind._source.num_page }}, do doc {{ ind._source.page_to_norma.title }}</span>
                        <template v-slot:append>
                          {{ x + 1 }}
                        </template>
                      </v-list-item>
                    </v-list>
                  </div>
                </div>
                <!-- conteúdo das paginas -->
                <div class="border pa-5 mt-2" v-for="item, i in docs" :key="i" :id="i">
                  <div class="border-b">
                      {{ item._source.ano }} |  {{ item._source.tipo }}  |  {{ item._source.page_to_norma.title }} | pág:  {{ item._source.num_page }}
                  </div>
                  <p 
                      class="formatText" 
                      v-html="textPage(item._source.text_page)"
                  ></p>
                </div>
            </v-card-text>
            <v-card-actions class="d-flex justify-center">
              <v-btn color="primary"  @click="dialog = false">fechar</v-btn>
              <!-- <v-btn color="red" variant="outlined">Imprimir</v-btn> -->
            </v-card-actions>
            <v-btn v-if="tela" class="upBtn" color="success" icon="mdi-arrow-up"  @click="findPage('top')"></v-btn>
          </v-card>
        </v-dialog>
      </v-btn>
    </div>
  </template>

<script>
    export default {
        data(){
            return{
                dialog: false,
                tela: false
            }
        },
        props:{
            docs: Array
        },
        methods:{
            textPage(item){
                let text = item
                text = text.replace(/\n+/g, '<br>');
                return text
            },
            findPage(item){
                const element = document.getElementById(item)
                element.scrollIntoView({behavior: "smooth"})
                this.tela = true
                if(item == 'top'){
                  this.tela = false
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
.fieldSearch{
  padding: .6rem .5rem;
  background: rgb(222, 218, 218);
  margin:.5rem 0;
}
.dialogBox{
  position: relative;
}
.upBtn{
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
}
@media (max-width: 500px) {
  
}
</style>