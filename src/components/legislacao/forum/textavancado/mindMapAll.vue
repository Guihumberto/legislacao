<template>
     <div class="wrapper">
        <section class="conteudo" ref="topUp" :class="rightWidth > 900 ? 'conteudo1' : 'conteudo2'">
            <div v-if="!mindMapData">
                <div class="mt-2 d-flex ga-2 align-center pa-2">
                    <v-icon>mdi-sitemap</v-icon>
                        <h1 class="text-h5">Mapas Mentais</h1>
                </div>
                <p v-if="!route.query.art">Selecione o Dispositivo para criar mapas mentais por IA</p>
                <div v-else class="text-center">
                    Artigo selecionado: {{ route.query.art }}
                   <v-form @submit.prevent="submitForm" ref="form">
                        <v-textarea
                            label="Pergunte ao AI"
                            v-model="mapFormString"
                            :rules="[(v) => !!v || 'Campo obrigatório']"
                            variant="outlined"
                            class="mt-2"
                        >
                        </v-textarea>
                        <div class="mt-5 d-flex ga-2 justify-center">
                            <v-btn variant="text" @click="mapForm = ''">limpar</v-btn>
                            <v-btn type="submit" variant="flat" color="primary" prepend-icon="mdi-robot">Gerar Mapa Mental por IA</v-btn>
                        </div>
                   </v-form>
                </div>

            </div>
            <MindMap :data="mindMapData" v-if="mindMapData" />
        </section>
    </div>
</template>

<script setup>
    import { inject, onMounted, ref, watch } from 'vue';

    import { useMapaMentalStore } from '@/store/concursos/MapasMentaisStore';
    const mapaMentalStore = useMapaMentalStore()

    import { useForumStore } from '@/store/ForumStore';
    const forumStore = useForumStore()

    import { useRoute } from "vue-router";
    const route = useRoute()
 
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
        const art = route.query.art || extractArtsFromQuery(route.query.arts)[0]
        if(art){
            mindMapData.value = props.mapasMentais.find(x => x.art == art)
        } else {
            mindMapData.value = null
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
    
    const mapFormString = ref('')
    const mapForm = ref({})
    const form = ref(null)

    const submitForm = async () => {
        const { valid } = await form.value.validate()
        if (!valid) return

        let objeto
        try {
            objeto = JSON.parse(mapFormString.value)
            objeto.id = forumStore.readGroupForum._source.idLaw
            objeto.art = route.query.art
        } catch (err) {
            console.error('Erro ao fazer parse de mapFormString.value:', err)
            alert('Erro: o conteúdo do campo deve estar em formato JSON válido.')
            return
        }

        objeto.id = forumStore.readGroupForum._source.idLaw
        objeto.art = route.query.art

        await mapaMentalStore.createMindMap(objeto)
    }
    

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