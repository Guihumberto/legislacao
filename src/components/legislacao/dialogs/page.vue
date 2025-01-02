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
                <div class="border pa-5 mt-2" @mouseup="handleTextSelection()"  style="padding: 20px; position: relative;" >
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
  
  const dialog = ref(false)

  const menu = ref(false)
  const menuPosition = ref({ top: 0, left: 0 });
  const selectedText = ref("")

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

  const handleTextSelection = (event) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      selectedText.value = selection.toString().trim();

      const range = selection.getRangeAt(0).getBoundingClientRect();
      menuPosition.value = {
        top: range.top + window.scrollY, 
        left: range.left + window.scrollX,
      }
      menu.value = true;
    } else {
      menu.value = false;
      selectedText.value = ""
    }
  }
    
</script>

<style lang="scss" scoped>

</style>