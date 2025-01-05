<template>
    <v-dialog
        transition="dialog-top-transition"
        width="500px"
        v-model="ShowTotal"
      >
          <v-card>
            <v-toolbar
              color="primary"
              title="Atualizações 0.0.1"
            ></v-toolbar>
            <v-card-text class="px-10">
              <ul>
                <li>Coleção de Normas.</li>
                <li>Buscar a partir do texto.</li>
                <li>Favoritar normas e páginas.</li>
                <li>Salvar documentos.</li>
                <li>Criação de Posts.</li>
              </ul>
            </v-card-text>
            <v-card-actions>
              <v-checkbox
                v-model="noShow"
                label="Não mostrar mais"
                @click="naoMostrar"
              ></v-checkbox>
              <v-btn
                variant="text"
                @click="dialog = false"
              >Fechar</v-btn>
            </v-card-actions>
          </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref, computed } from 'vue'
    import { useGeneralStore } from '@/store/GeneralStore'
    const generalStore = useGeneralStore()  

    const dialog = ref(false)
    const noShow = ref(false)
   
    const ShowTotal = computed(() => {
        if(generalStore.readShowNews && dialog.value){
            return true
        } else {
            return false
        }
    })
      
    const naoMostrar = () => {
        generalStore.changeShowsNews(false)
    }

    const activeDialog = () => {
      setTimeout(()=>{
        dialog.value = true
      }, 2000)
    }
      
    activeDialog()

</script>

<style lang="scss" scoped>

</style>