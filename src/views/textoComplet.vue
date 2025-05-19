<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container sizeLoad': 'container2 sizeLoad'" v-if="pageStore.readLoad">
            <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
            ></v-progress-circular>
        </div>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'" v-else>
            <v-btn variant="tonal" @click="voltar" class="mb-2 btn">Voltar</v-btn>
            <v-btn variant="tonal" @click="router.push(`/avancado/${route.params.id}`)" class="mb-2 ml-2 btn" color="primary">MODO AVANÇADO</v-btn>
            <div class="border pa-5 mb-2 bg-white pagina" v-for="item, i in listPage" :key="i">
                <div class="font-weight-bold d-flex justify-space-between header">
                    <p>{{ item.page_to_norma.title }} | {{ item.ano }}</p> 
                    <p>Página: {{ item.num_page }}/{{ listPage.length }} </p>
                </div>
                <div class="corpo" @mouseup="selectionGet()"  style="position: relative;">
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
    import { computed } from 'vue';
    import SelectionSearch from '@/components/legislacao/elements/selectionSearch.vue'
    import { useHandleTextSelection  } from '@/composables/handleTextSelection'
    import { useRoute, useRouter } from 'vue-router';
    const route = useRoute()
    const router = useRouter()

    import { usePageStore } from '@/store/PageStore';
    const pageStore = usePageStore()

    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()
    
    pageStore.getAllPages(route.params.id)


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
        if(route.query.search == 'news') router.push("/newslaws");
        if(!route.query.search) router.push("/leges");
    }

    const { selectionGet, selectedText, menu, menuPosition } = useHandleTextSelection()
   
</script>

<style lang="scss" scoped>
.sizeLoad{
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