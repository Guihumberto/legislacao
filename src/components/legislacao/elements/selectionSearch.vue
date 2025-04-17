<template>
    <v-menu
        :style="{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }"
        v-model="isVisible"
        :close-on-content-click="false"
        absolute
        >
            <v-btn-toggle
            divided
            variant="flat"
            rounded="xl"
            density="compact"
            > 
                <v-btn 
                   title="Acrescentar termo a busca padrão"
                   class="bg-green-lighten-1" @click="actionsSearch('acrescentar')">
                  <v-icon>mdi-magnify-plus</v-icon>
                </v-btn>
                <v-btn 
                    title="Buscar termo por página (padrão)"
                    class="bg-success" @click="actionsSearch('search')" prepend-icon="mdi-magnify">
                    <span class="hidden-sm-and-down">por termo</span>
                </v-btn>
                <v-btn 
                    title="Buscar termo por norma"
                    class="bg-primary" @click="actionsSearch('leges')" prepend-icon="mdi-file-find">
                    <span class="hidden-sm-and-down">por norma</span>
                </v-btn>
                <v-btn 
                    title="Copiar para área de transferência"
                    class="bg-grey" @click="actionsSearch('copy')" prepend-icon="mdi-content-paste">
                </v-btn>
            </v-btn-toggle>
    </v-menu>
 
</template>

<script setup>
  import { ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  const router = useRouter()

  import { useGeneralStore } from '@/store/GeneralStore'
  const generalStore = useGeneralStore()
  
  import { useSnackStore } from '@/store/snackStore';
  const snackStore = useSnackStore()

  const isVisible = ref(false)
  
  const props = defineProps({
    menu: Boolean,
    selectedText: String,
    menuPosition: Object,
    searchP:{
      type: String,
      default: ""
    },
    direct: {
      type: Boolean,
      default: false
    },
    page:{
      type: [Object, Boolean],
      default: false
    }
  })
  
  const actionsSearch = (action) => {
    if(action == 'search') {
      if(props.direct){
        router.push('/leges')
        generalStore.reqChangeFromSelectSearch(true, props.selectedText)
      } else {
        generalStore.reqChangeFromSelectSearch(true, props.selectedText)
      }
    } 

    if(action == 'acrescentar') {
      const search = (`${props.searchP} ${props.selectedText}`).trim()
      if(props.direct){
        router.push('/leges')
        generalStore.reqChangeFromSelectSearch(true, search)
      } else {
        generalStore.reqChangeFromSelectSearch(true, search)
      }
    }
    
    if(action == 'leges') router.push(`/legesporlei?text_search=${props.selectedText}`)

    if(action == 'copy') {
      let objeto = { texto_selected: props.selectedText }
      if(props.page){
        objeto.nam_law = props.page.page_to_norma.title
        objeto.tipo = props.page.tipo
        objeto.num_page = props.page.num_page
      }

      generalStore.copyPaste(objeto)
      navigator.clipboard.writeText(props.selectedText);
      snackStore.activeSnack('Texto copiado para área de transferência', 'primary')
    }

    isVisible.value = false;
  }

  watch(
      () => props.menu, (newVal) => {
        if(props.selectedText.length > 4)
        isVisible.value = newVal;
      }
  )
</script>

<style lang="scss" scoped>
</style>