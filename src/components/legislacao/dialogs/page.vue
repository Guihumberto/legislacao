<template>
    <div class="text-right">
      <v-btn
        color="primary"
        size="small"
        variant="text"
        title="Ver a página"
        @click="$emit('last_accessed')"
      >
        Ver Pág. {{ page.num_page }}
        <v-dialog
          v-model="dialog"
          activator="parent"
          max-width="1080"
        >
          <v-card class="card">
            <v-card-title class="bg-primary d-flex justify-space-between align-center">
              <span>
                Página {{ page.num_page }} - {{ page.page_to_norma.title }}
              </span>
              <v-btn density="compact" variant="text" icon="mdi-close" @click="dialog = false"></v-btn>
            </v-card-title>
            <v-card-text>
                <div class="border pa-5">
                    {{ page.page_to_norma.title }} <br>
                    {{ page.tipo }} | Ano: {{ page.ano }} | Pág: {{ page.num_page }} de {{ pageStore.readTotalPages }}<br>
                    {{ page.path }}
                    <div class="navigation">
                      <v-progress-circular indeterminate v-if="pageStore.readLoad"></v-progress-circular>
                      <v-btn v-if="navigationPerPage" @click="navigationPerPage = false, num_page = page.num_page" color="warning" variant="text" class="mr-5">Voltar a página da busca</v-btn>
                      <v-btn-toggle
                        density="compact"
                        variant="outlined"
                      >
                        <v-btn prepend-icon="mdi-arrow-left" :disabled="num_page == 1" @click="backPage()">
                          <span class="hidden-sm-and-down">Anterior</span>
                        </v-btn>

                        <v-btn 
                          :title="docExiste(idNavegation) ? 'Remover página do documento criado' : 'Adicionar página ao documento criado'"
                          :append-icon="docExiste(idNavegation) ? 'mdi-minus-circle' : 'mdi-plus-circle'" :class="docExiste(idNavegation) ? 'bg-error' : 'bg-success'" @click="addPageDocument()">
                          Pág. <span v-if="!navigationPerPage">{{ page.num_page }}</span>
                               <span v-else>{{ num_page }} </span>
                        </v-btn>

                        <v-btn append-icon="mdi-arrow-right" @click="nextPage()" :disabled="num_page == pageStore.readTotalPages">
                          <span class="hidden-sm-and-down">Próxima</span>
                        </v-btn>
                      </v-btn-toggle>
                    </div>
                </div>
                <div class="border pa-5 mt-2 texto" :class="pageStore.readLoad ? 'load' : ''" @mouseup="selectionGet()"  style="padding: 20px; position: relative;" >
                  <p 
                      class="formatText" 
                      v-html="searchP ? markSearch(textePage) : textePage"
                      v-if="!navigationPerPage"
                  >
                  </p>
                  <div v-else>
                    <p 
                        class="formatText" 
                        v-html="searchP ? markSearch(textePagePagination) : textePagePagination"
                    >
                    </p>
                  </div>
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
                    :page="page"
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
  import { computed, inject, onMounted, ref, watch } from 'vue'
  import SelectionSearch from '../elements/selectionSearch.vue';
  import { useHandleTextSelection  } from '@/composables/handleTextSelection'
  
  import { usePageStore } from '@/store/PageStore';
  const pageStore = usePageStore()

  const dialog = ref(false)

  const document = inject('document')

  const docExiste = (item) => {
      let ids = document.value.map(x => x.id)
      let find = ids.find(x => x == item)
      return !!find
      ? find
      : false
  }

  watch(dialog, (newValue) => {
    if(dialog.value){
      pageStore.getAllPages(props.page.page_to_norma.parent)
    }
  })

  const idNavegation = computed(() => {
    return !navigationPerPage.value
      ? props.page.id
      : objetopagesNavigation.value.id
  })

  const props = defineProps({
        page: Object,
        searchP: String,
        id: String
  })

  const textePage = computed(() => {
        // let text = highlightUppercaseWords(props.page.text_page)
        const text = props.page.text_page.replace(/\.\n/g, '.<br><br>')
                                          .replace(/\;\n/g, ';<br><br>')
                                          .replace(/\n+/g, '<br>');
        return text
  })

  const textePagePagination = computed(() => {
        if(navigationPerPage.value){
          const text = pagesNavigation.value.replace(/\n+/g, '<br>');
          return text
        }
        return textePage.value
  })

  const highlightUppercaseWords = (text) => {
    const lines = text.split('\n');
    const uppercaseRegex = /\b[A-Z]+\b/g;

    const highlightedLines = lines.map(line => {
      if (uppercaseRegex.test(line)) {
        return line.replace(uppercaseRegex, match => `<span class="font-weight-bold">${match}</span>`);
      }
      return line; 
    });
    return highlightedLines.join('\n');
  }
    
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

  //navegar pelas páginas da legislação
  const navigationPerPage = ref(false)
  const num_page = ref(null)
  const pagesNavigation = ref(null)
  const objetopagesNavigation = ref(null)

  const backPage = async () => {
    if(num_page.value > 1) {
      navigationPerPage.value = true
      num_page.value--

      const objeto = {
        id: props.page.page_to_norma.parent,
        num_page: num_page.value
      }
      const resp = await pageStore.getPageNorma(objeto)
      objetopagesNavigation.value = resp.data[0]
      pagesNavigation.value = resp.data[0].text_page
    }
  }

  const nextPage = async () => {
    if(num_page.value <= pageStore.readTotalPages) {
      navigationPerPage.value = true
      num_page.value++
  
      const objeto = {
        id: props.page.page_to_norma.parent,
        num_page: num_page.value
      }
      const resp = await pageStore.getPageNorma(objeto)
      pagesNavigation.value = resp.data[0].text_page
      objetopagesNavigation.value = resp.data[0]
    }
  }

  const addPageDocument = () => {
    if(navigationPerPage.value){
      inserirDoc(objetopagesNavigation.value);
    } else {
      inserirDoc(props.page);
    }
  }

  const inserirDoc = (item) => {
        const res = docExiste(item.id)
        if(res){
            document.value = document.value.filter(x => x.id != res)
        }else {
            const objeto = {
                id: item.id,
                id_law: item.page_to_norma.parent,
                name_law: item.page_to_norma.title,
                text_page: item.text_page,
                ano: item.ano,
                tipo: item.tipo,
                num_page: item.num_page,
                revogado: item.revogado,
                sigiloso: item.sigiloso
            }
            document.value.push(objeto)
        }
  }

  onMounted(() => {
    num_page.value = props.page.num_page
  })
    
</script>

<style lang="scss" scoped>
.card {
  font-family: 'Merriweather', serif;
  font-size: 1rem; /* 16px */
  line-height: 1.7; /* Espaçamento entre linhas */
  letter-spacing: 0.5px; /* Espaçamento entre letras */
  color: #333;
  background-color: #f9f9f9;
  max-width: 1000px;
  margin: 0 auto;
}
.navigation{
  text-align: right;
  margin-top: 2rem;
}
.load{
  background: rgb(231, 226, 226);
  transition: 1s ease;
}
.texto{
  max-width: 1200px;
  max-height: 60vh;
  overflow-y: scroll; /* Apenas rolagem vertical */
  overflow-x: hidden; /* Sem rolagem horizontal */
}

@media (max-width: 768px) {
  .navigation{
    text-align: center;
  }
}


</style>