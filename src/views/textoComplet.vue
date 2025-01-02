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
            <v-btn variant="tonal" @click="router.push(`/avancado/${route.params.id}`)" class="mb-2 ml-2 btn" color="primary">MODO AVANÇADO</v-btn>
            <div class="border pa-5 mb-2 bg-white pagina" v-for="item, i in listPage" :key="i">
                <div class="font-weight-bold d-flex justify-space-between header">
                    <p>{{ item.page_to_norma.title }} | {{ item.ano }}</p> 
                    <p>Página: {{ item.num_page }}/{{ listPage.length }} </p>
                </div>
                <div class="corpo" @mouseup="handleTextSelection()"  style="position: relative;">
                    <p v-html="item.text_page"></p> 
                    <SelectionSearch 
                        :menuPosition="menuPosition"
                        :selectedText="selectedText"
                        :menu="menu"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import SelectionSearch from '@/components/legislacao/elements/selectionSearch.vue'
    import { useRoute, useRouter } from 'vue-router';
    const route = useRoute()
    const router = useRouter()

    import { usePageStore } from '@/store/PageStore';
    const pageStore = usePageStore()
    
    pageStore.getAllPages(route.params.id)

     const menu = ref(false)
     const menuPosition = ref({ top: 0, left: 0 });
     const selectedText = ref("")

     const listPage = computed(() => {
        let list = pageStore.readAllPages.map(x => x._source)
        let list1 = []

        list.forEach(x => {
            x.text_page = x.text_page.replace(/\n+/g, '<br>');
            list1.push(x)
        })
            
        return list1.sort((a, b) => a.num_page - b.num_page)
     })
       
    const voltar = () => {
        if(route.query.idpage) router.go(-1)
        if(route.query.search == 'search') router.push("/leges");
        if(route.query.search == 'leges') router.push("/legesporlei");
        if(route.query.search == 'favs') router.push("/favorites");
        if(!route.query.search) router.push("/leges");
    }

    const handleTextSelection = (event) => {
        const selection = window.getSelection();

        if (selection && selection.toString().trim()) {
            selectedText.value = selection.toString().trim();

            const range = selection.getRangeAt(0).getBoundingClientRect();
            menuPosition.value = {
                top: range.top + window.scrollY - 50, 
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
section {
    min-height: calc(100vh - 466px);
}
.sizeLoad{
    height: 55vh;
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
    .pagina {
        width: 190mm;
        height: 285mm;
        margin: 0;
    }
    // .pagina .header{
    //     height: 10mm;
    //     margin-bottom: 2rem;
    // }

    .content {
        box-shadow: none;
        margin: 0;
    }
}

</style>