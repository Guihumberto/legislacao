<template>
     <div class="wrapper">
        <section class="conteudo" ref="topUp" :class="rightWidth > 900 ? 'conteudo1' : 'conteudo2'">
            <div v-if="!mindMapData">
                <div class="mt-2 d-flex ga-2 align-center pa-2">
                    <v-icon>mdi-sitemap</v-icon>
                        <h1 class="text-h5">Mapas Mentais</h1>
                </div>
                <p v-if="!listArtsSelected.length && !artOneSelect">Selecione o Dispositivo para criar mapas mentais por IA</p>
                <div v-else class="text-center">
                    Artigo<span v-if="listArtsSelected.length > 1">s</span> selecionado<span v-if="listArtsSelected.length > 1">s</span>: 
                    <v-chip v-if="artOneSelect" color="primary">{{ artOneSelect }} </v-chip> 
                    <v-chip v-if="listArtsSelected.length" v-for="item, i in listArtsSelected" :key="i" class="ml-2">{{ item }}</v-chip>
                    <v-form @submit.prevent="submitForm" ref="form">
                            <!-- <v-textarea
                                label="Pergunte ao AI"
                                v-model="mapFormString"
                                :rules="[(v) => !!v || 'Campo obrigatório']"
                                variant="outlined"
                                class="mt-2"
                            >
                            </v-textarea> -->
                            <div class="mt-5 d-flex ga-2 justify-center">
                                <v-btn :loading="load" :disabled="load" @click="submitForm" variant="flat" color="primary" prepend-icon="mdi-robot">Gerar Mapa Mental por IA</v-btn>
                            </div>
                    </v-form>
                </div>

            </div>
            <div v-if="showNoResult">
                <MindMap :data="mindMapData" v-if="mindMapData" />
    
                <div v-for="map, m in listSortedmapasMentais" :key="i" v-else>
                    <MindMap :data="map" />
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
    import { inject, onMounted, ref, watch, computed } from 'vue';
    import { useMapaMentalStore } from '@/store/concursos/MapasMentaisStore';
    import { useForumStore } from '@/store/ForumStore';
    import { useRoute, useRouter } from "vue-router";
    import MindMap from './mindMap.vue';

    const mapaMentalStore = useMapaMentalStore()
    const forumStore = useForumStore()
    const route = useRoute()
    const router = useRouter()
    const rightWidth = inject('rightWidth')

    const props = defineProps({
        mapasMentais: {
            type: Array,
            required: true
        }
    })
    
    const mindMapData = ref(null)
    const showNoResult = ref(true)

    const listSortedmapasMentais = computed(() => {
        return props.mapasMentais.sort((a, b) => a.art - b.art)
    })

    const getMindMapArt = async() => {
        showNoResult.value = true
        const art = artOneSelect.value || listArtsSelected.value[0]
        if(art){
            mindMapData.value = props.mapasMentais.find(x => x.art == parseInt(art))
            if(!mindMapData.value) showNoResult.value = false
        } else {
            mindMapData.value = null
        }
    }

    const artOneSelect = ref(route.query.art)

    const listArtsSelected = computed(() => {
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
    })

    watch(
        () => route.query.arts,
        () => {
            getMindMapArt()
            artOneSelect.value = null
        }
    )

    watch(
        () => route.query.art,
        () => {
            artOneSelect.value = route.query.art
            getMindMapArt()
        }
    )
    
    const mapFormString = ref('')
    const mapForm = ref({})
    const form = ref(null)
    const load = ref(false)

    const submitForm = async () => {
        load.value = true
        // const { valid } = await form.value.validate()
        // if (!valid) return

        let objeto = { id: null, art: null, arts: []}   
        // try {
        //     objeto = JSON.parse(mapFormString.value)
        // } catch (err) {
        //     console.error('Erro ao fazer parse de mapFormString.value:', err)
        //     alert('Erro: o conteúdo do campo deve estar em formato JSON válido.')
        //     return
        // }

        objeto.id = forumStore.readGroupForum._source.idLaw
        objeto.art = artOneSelect.value || listArtsSelected.value[0]
        objeto.arts = listArtsSelected.value

        await mapaMentalStore.createMindMap(objeto)
        getMindMapArt()
        const { art, arts, ...outrosParams } = route.query
        router.push({
            path: route.path, 
            query: {
                ...outrosParams,      
                art: objeto.art,   
                arts: [...objeto.arts]          
            }
        })
        load.value = false
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