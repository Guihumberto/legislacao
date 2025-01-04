<template>
    <section>
        <div class="sizeLoad" v-if="pageStore.readLoad">
            <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
            ></v-progress-circular>
        </div>
        <div class="container" v-else>
            <v-btn variant="tonal" @click="voltar" class="mb-2 btn">Voltar</v-btn>
            <v-btn variant="tonal" color="red" prepend-icon="mdi-file-pdf-box" class="ml-2 mb-2 btn" @click="gerarPdf()">PDF</v-btn>
            <div class="border pa-5 mb-2 bg-white">
                <div class="font-weight-bold d-flex justify-space-between">
                    <p >{{ pageStore.readPage?.tipo }} | {{ pageStore.readPage?.page_to_norma.title }} | {{ pageStore.readPage?.ano }}</p> 
                    <p>Página: {{ pageStore.readPage?.num_page }} </p>
                </div>
                <div class="corpo" @mouseup="selectionGet()"  style="position: relative;">
                    <p v-html="listPage"></p> 
                    <SelectionSearch 
                        :menuPosition="menuPosition"
                        :selectedText="selectedText"
                        :menu="menu"
                        :direct="true"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
     import { computed, ref } from "vue"
     import SelectionSearch from '@/components/legislacao/elements/selectionSearch.vue'
     import { useHandleTextSelection  } from '@/composables/handleTextSelection'

     import { usePageStore } from '@/store/PageStore'
     const pageStore = usePageStore()

     import { usePrintMail } from '@/store/PrintMailStore'
     const printStore = usePrintMail() 
     
     import { useRoute, useRouter } from "vue-router"
     const route = useRoute()
     const router = useRouter()
     

     pageStore.getPage(route.params.id)

     const listPage = computed(() => {
        let list = pageStore.readPage?.text_page
        if(pageStore.readPage) list = list.replace(/\n+/g, '<br>');  
        return list
     })

     const gerarPdf = () => {
        router.push(`/text/${pageStore.readPage.page_to_norma.parent}?idpage=${route.params.id}`)
     }
     const voltar = () => {
        router.push("/leges");
     }

     const { selectionGet, selectedText, menu, menuPosition } = useHandleTextSelection()
    
</script>

<style lang="scss" scoped>
section {
    min-height: 85vh;
}
.sizeLoad{
    min-height: 60vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.corpo{
    margin: 2rem;
    font-size: 15px;
    line-height: 2.1em
}
@media print {
    .btn {
        display: none;
    }
}
</style>