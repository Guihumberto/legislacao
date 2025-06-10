<template>
     <div class="wrapper">
        <section class="conteudo" ref="topUp" :class="rightWidth > 900 ? 'conteudo1' : 'conteudo2'">
            <div class="mt-2 d-flex ga-2 align-center pa-2">
                <v-icon>mdi-sitemap</v-icon>
                    <h1 class="text-h5">Mapas Mentais</h1>
            </div>
            <p>Selecione o Dispositivo</p>
            <MindMap :data="mindMapData" v-if="mindMapData" />
        </section>
    </div>
</template>

<script setup>
    import { inject, onMounted, ref, watch } from 'vue';

    import { useRoute, useRouter } from "vue-router";
    const route = useRoute()
    const router = useRouter()

    import MindMap from './mindMap.vue';
    const rightWidth = inject('rightWidth')

    const props = defineProps({
        mapasMentais: {
            type: Array,
            required: true
        }
    })

    const artsFilter = ref([])
    const mindMapData = ref(null)

    const getMindMapArt = async() => {
        const arts = extractArtsFromQuery()
        if(arts[0]){
            mindMapData.value = props.mapasMentais.find(x => x.art == arts[0])
        }
    }

    const extractArtsFromQuery = () => {
        const queryArts = route.query.arts
        if (queryArts) {
            // Se arts for um array (múltiplos valores)
            if (Array.isArray(queryArts)) {
               return queryArts.map(art => parseInt(art))
            } 
            // Se arts for uma string (um único valor)
            else {
                return [parseInt(queryArts)]
            } 
        } else {
           return []
        }
    }

    watch(
        () => route.query.arts,
        () => {
            getMindMapArt()
        }
    )

    onMounted(async() => {
        await getMindMapArt()
    })

</script>

<style scoped>
    .wrapper {
        display: flex;
        justify-content: center; /* Isso centraliza o 'conteudo' se ele não ocupar 100% da largura do 'wrapper' */
        min-height: 50vh;
        font-family: Arial, sans-serif;
        padding-bottom: 2rem;
        /* Se você quer que o conteúdo ocupe toda a altura do wrapper, adicione: */
        align-items: stretch;
    }

    .conteudo {
        margin-top: 1rem;
        padding: 0 20px;
        background-color: #fffdfd;
        flex-grow: 1; /* Permite que o 'conteudo' se expanda */
        /* 'box-sizing: border-box;' é bom para evitar problemas com padding e largura */
        box-sizing: border-box;
    }

    /* Se a ideia é que 'conteudo1' e 'conteudo2' limitem a largura máxima, mantenha assim: */
    .conteudo1 {
        max-width: 900px; /* Altere de 'width' para 'max-width' para que ele cresça até 900px */
    }

    .conteudo2 {
        max-width: 900px;
    }
</style>