<template>
   <section>
    <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
        <div v-if="documentStore.readLoad">
            <h5>Aguarde...</h5>
        </div>
        <div v-else>
            <div class="border pa-5 mt-2" id="top" v-if="documentStore.readDoc?.title">
                <h2> {{ documentStore.readDoc?.title }}</h2>
                <div class="py-5">
                <v-list>
                    <v-list-item 
                    v-for="ind, x in  documentStore.readDoc.pages" :key="x" 
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
            <div class="border pa-5 mt-2" v-for="item, i in  documentStore.readDoc.pages" :key="i" :id="i" v-if="documentStore.readDoc?.title">
                <div class="border-b">
                    {{ item.ano }} |  {{ item.tipo }}  |  {{ item.name_law }} | pág:  {{ item.num_page }}
                </div>
                <p 
                    class="formatText mt-10" 
                    v-html="textPage(item.text_page)"
                ></p>
            </div>
            <v-btn v-if="tela" class="upBtn" color="success" icon="mdi-arrow-up"  @click="findPage('top')"></v-btn>
        </div>
    </div>
</section>
</template>

<script setup>
    import { onMounted, ref } from 'vue';

    import { useRoute } from 'vue-router';
    const route = useRoute()

    import { useDocumetStore } from '@/store/DocumentStore';
    const documentStore = useDocumetStore()

    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()

    const tela = ref(false)

    onMounted( async () => {
        await documentStore.getDoc(route.params.id)
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

<style scoped>
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

</style>