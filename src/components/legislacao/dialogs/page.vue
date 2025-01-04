<template>
    <div class="text-right">
      <v-btn
        color="primary"
        size="small"
        variant="text"
        title="Ver a página"
      >
        Ver Pág. {{ page.num_page }}
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
                <div class="border pa-5 mt-2" @mouseup="selectionGet()"  style="padding: 20px; position: relative;" >
                  <p 
                      class="formatText" 
                      v-html="searchP ? markSearch(textePage) : textePage"
                  >
                  </p>
                  <!-- <v-menu
                    :style="{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }"
                    v-model="menu"
                    :close-on-content-click="false"
                    absolute
                  >
                    <v-btn-toggle
                      divided
                      variant="flat"
                      rounded="xl"
                    >
                      <v-btn class="bg-success" @click="actionsSearch('search')" prepend-icon="mdi-magnify">
                        <span class="hidden-sm-and-down">por termo</span>
                      </v-btn>
                      <v-btn class="bg-primary" @click="actionsSearch('leges')" prepend-icon="mdi-magnify">
                        <span class="hidden-sm-and-down">por norma</span>
                      </v-btn>
                    </v-btn-toggle>
                  </v-menu> -->
                  <SelectionSearch 
                    :menuPosition="menuPosition"
                    :selectedText="selectedText"
                    :menu="menu"
                  />
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

<script setup>
  import { computed, ref } from 'vue'
  import SelectionSearch from '../elements/selectionSearch.vue';
  import { useHandleTextSelection  } from '@/composables/handleTextSelection'

  const dialog = ref(false)

  const props = defineProps({
        page: Object,
        searchP: String,
        id: String
  })

  const textePage = computed(() => {
        let text = props.page.text_page
        text = text.replace(/\n+/g, '<br>');
        return text
  })
    
  const markSearch = (texto) => {
      let palavrasChave = props.searchP.split(' ')

      palavrasChave = excluirStopWords(palavrasChave)

      const escapedKeywords = palavrasChave.map(keyword => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

      const regex = new RegExp(`\\b(${escapedKeywords.join('|')})\\b`, 'gi');
      const textoMarcado = texto.replace(regex, '<mark>$1</mark>');

      return textoMarcado;
      
  }
      
  const excluirStopWords = (arrayPrincipal) => {
    const stopWords = ["a", "o", "e", "é", "um", "uma", "com", "de", "do", "da", "para", "por", "em", "os", "as", "isso", "essa", "esse", "isso", "está"];
    const resultado = arrayPrincipal.filter(palavra => !stopWords.includes(palavra));

    return resultado;
  }

  const openUrl = () => {
    window.open(`textpage/${props.id}?search=search`, '_blank');
  }

  const { selectionGet, selectedText, menu, menuPosition } = useHandleTextSelection()
    
</script>

<style lang="scss" scoped>

</style>