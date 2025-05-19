<template>
          <v-card class="dialogBox">
            <v-card-title class="bg-primary">Documento</v-card-title>
            <v-card-text>
              <!-- index das paginas -->
                <div class="border pa-5 mt-2" id="top">
                  <h2> {{ docs.title }}</h2>
                  <router-link :to="`/documents/${docs.id}`">Abrir em uma nova página</router-link>
                  <div class="py-5">
                    <v-list>
                      <v-list-item 
                        v-for="ind, x in docs.pages" :key="x" 
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
                <div class="border pa-5 mt-2" v-for="item, i in docs.pages" :key="i" :id="i">
                  <div class="border-b">
                      {{ item.ano }} |  {{ item.tipo }}  |  {{ item.name_law }} | pág:  {{ item.num_page }}
                  </div>
                  <p 
                      class="formatText mt-10" 
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
  </template>

<script setup>
    import { ref, inject } from 'vue'

    const dialog = inject('dialog2')
    const tela = ref(false)

    const props = defineProps({
      docs: Object
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
.upBtn{
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
}
@media (max-width: 500px) {
  
}
</style>