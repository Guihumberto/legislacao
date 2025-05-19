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
            <v-card-title class="card-title">
              Documento
              <v-btn @click="dialog = false" variant="text" density="comfortable" icon="mdi-close"></v-btn>
            </v-card-title>
            <v-card-text>
              <!-- index das paginas -->
                <div class="border pa-5 mt-10" id="top">
                  <h2>Termos da busca</h2>
                  <div class="py-5">
                    <div class="fieldSearch">Texto: {{ $route.query.search }}</div> 
                    <div class="fieldSearch">Fonte: {{ $route.query.fonte ? $route.query.fonte : 'Amplo' }}</div> 
                    <div class="fieldSearch">Período: {{ $route.query.years ? $route.query.years : 'Amplo' }}</div> 
                  </div>
                  <h2>Lista de páginas anexadas</h2>
                  <div class="py-5">
                    <v-list>
                      <v-list-item 
                        v-for="ind, x in docs" :key="x" 
                        :subtitle="`${ind.tipo} - ${ind.ano}`"
                        link
                        @click="findPage(x)"
                      >
                        <template v-slot:prepend>
                          <v-icon icon="mdi-file-document"></v-icon>
                        </template>
                          <span>pag. {{ ind.num_page }}, do doc {{ ind.name_law }}</span>
                        <template v-slot:append>
                          {{ x + 1 }}
                        </template>
                      </v-list-item>
                    </v-list>
                  </div>
                </div>
                <!-- conteúdo das paginas -->
                <div class="border pa-5 mt-2" v-for="item, i in docs" :key="i" :id="i">
                  <div class="border-b mb-10">
                      {{ item.ano }} |  {{ item.tipo }}  |  {{ item.name_law }} | pág:  {{ item.num_page }}
                  </div>
                  <p 
                      class="formatText" 
                      v-html="textPage(item.text_page)"
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

<script setup>
    import { ref } from 'vue'
   
    const dialog = ref(false)
    const tela = ref(false)
 
    const props = defineProps({
        docs: Array
    })
        
    const textPage = (item) => {
        let text = item
        text = text.replace(/\n+/g, '<br>');
        return text
    }
    const findPage = (item) => {
        const element = document.getElementById(item)
        element.scrollIntoView({behavior: "smooth"})
        tela.value = true
        if(item == 'top'){
          tela.value = false
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
.card-title{
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: blue;
  color: white;
  z-index: 10;
}
.upBtn{
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
}
@media (max-width: 500px) {
  
}
</style>