<template>
    <div class="wrapper2">
        <section class="conteudo" ref="topUp">
            <div class="py-5">
                <v-card max-width="900px" class="mx-auto">
                    <v-card-text>
                        <div class="d-flex justify-space-between">
                            <div class="d-flex ga-1 flex-wrap">
                                <div v-for="tab, t in tabs" :key="t">
                                    <v-tooltip :text="tab.name" location="top">
                                        <template v-slot:activator="{ props }">
                                        <v-btn  v-bind="props" :color="tabSelected == tab.id ? 'success' : 'grey'" @click="tabSelected = tab.id"  :icon="tab.icon"></v-btn>
                                        </template>
                                    </v-tooltip>
                                </div>
                            </div>
                            <v-btn variant="text" @click="$emit('close')">Fechar</v-btn>
                        </div>
                        <!-- leis -->
                        <div v-if="tabSelected == 1">
                            <v-chip-group class="my-2">
                                <v-chip v-for="item, i in mainLaws" :key="i" @click="openLaw(item.id)">{{ item.name }}</v-chip>
                            </v-chip-group>
    
                            <v-form @submit.prevent="searchLaw">
                                <v-text-field
                                    label="Pesquisar"
                                    density="compact"
                                    variant="outlined"
                                    prepend-inner-icon="mdi-magnify"
                                    placeholder="Digite o nome da lei"
                                    v-model="textSerch.text"
                                    clearable
                                >
                                    <template v-slot:append>
                                        <v-btn type="submit" color="success">Buscar</v-btn>
                                    </template>
                                </v-text-field>
                                <v-btn v-if="listLaws.length" variant="text" @click="listLaws = []">limpar</v-btn>
                            </v-form>
                        </div>
                        
                    </v-card-text>
                    <v-card-text v-if="listLaws.length">
                        <v-list>
                            <v-list-item link v-for="item, i in listLaws" @click="openLaw(item.id)">{{ item.title }}</v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
                <Law_split v-if="tabSelected == 1" ref="childRef"  />
                <Marcados v-if="tabSelected == 2" />
                <Comentarios v-if="tabSelected == 3" />
                <Vinculos v-if="tabSelected == 4" />
                <Questoes v-if="tabSelected == 5" />
                <MindMapAll v-if="tabSelected == 6" :mapasMentais="mapaMentalStore.readMapaMental" />
            </div>
        </section>
    </div>
</template>

<script setup>
    import { ref, watch, inject, nextTick } from "vue";

    import { useMapaMentalStore } from '@/store/concursos/MapasMentaisStore';
    const mapaMentalStore = useMapaMentalStore()

    import { useRoute } from 'vue-router';
    const route = useRoute()

    import { useLawStore } from "@/store/LawsStore"
    const lawStore = useLawStore()

    import Law_split from "./law_split.vue";
    import Comentarios from "./comentarios.vue";
    import Marcados from "./marcados.vue";
    import Questoes from "./questoes.vue";
    import Vinculos from "./vinculos.vue";
    import MindMapAll from "./mindMapAll.vue";

    const tabSelected = ref(1)
    
    const mainLaws = [
        {id: 1742907731755, name: 'CF 88'},
        {id: 1742907901454, name: 'CTN'},
        {id: 71587, name: 'Lei 7.799'}
    ]

    const tabs = [
        {
            id: 1,
            name: 'Leis',
            icon: 'mdi-bookshelf'
        },
        {
            id: 2,
            name: 'Marcados',
            icon: 'mdi-marker'
        },
        {
            id: 3,
            name: 'Comentários',
            icon: 'mdi-chat'
        },
        {
            id: 4,
            name: 'Vínculos',
            icon: 'mdi-link-box'
        },
        {
            id: 5,
            name: 'Questões',
            icon: 'mdi-order-bool-ascending-variant'
        },
        {
            id: 6,
            name: 'Mapas mentais',
            icon: 'mdi-sitemap'
        }
    ]

    const childRef = ref(null)

    const openLaw = (id) => {
        if (childRef.value) {
            childRef.value.getAll(id, textSerch.value.text)
            listLaws.value = []
        }
    }

    const textSerch = ref({
        text: '',
        years: [],
        fonte: [],
        termo: 2,
        semantic: 1,
        precision: false,
        notebook: 'Executivo',
        estado: 'Maranhão',
        mes: 'Dezembro',
        assertividade: 2,
        enableFuzzy:true
    })
    const listLaws = ref([])

    const searchLaw = async() => {
        try {
            listLaws.value = []
            const resp = await lawStore.getSearchPorlei(textSerch.value);
            listLaws.value = resp.hits.map( x =>  x._source)
        } catch (error) {
            console.log("erro resultsSearchNormas");
            listLaws.value = []
        } 
    }

    // watch(() => route.query.art, (newId, oldId) => tabSelected.value = 5 )

    const textoVincular = inject('textoVincular')

    watch(() => textoVincular.value, async (newId, oldId) => {
        if(textoVincular.value.idLaw){
           tabSelected.value = 1
           await nextTick()
           textSerch.value.text = ''
           openLaw(textoVincular.value.idLaw)
           return
        }
        if(textoVincular.value.item){
            tabSelected.value = 1
            await nextTick()
            textSerch.value.fonte = ['leis-federais']
            textSerch.value.text = textoVincular.value.item
            searchLaw()
            return
        }
    })

</script>

<style lang="scss" scoped>
.wrapper22{
    display: flex;
    font-family: Arial, sans-serif;
}

.conteudo {
    padding: 0 20px;
    background-color: #f4f4f4;
    min-height: 97.2vh;
}

</style>