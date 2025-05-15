<template>
    <div class="wrapper">
        <section class="conteudo" ref="topUp">
            <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
                <v-card>
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
            </div>
        </section>
    </div>
</template>

<script setup>
    import { ref, computed, watch, onMounted, provide } from "vue";

    import { useRoute } from 'vue-router';
    const route = useRoute()

    import { useLawStore } from "@/store/LawsStore"
    const lawStore = useLawStore()

    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()

    import Law_split from "./law_split.vue";
    import Comentarios from "./comentarios.vue";
    import Marcados from "./marcados.vue";
    import Questoes from "./questoes.vue";
    import Vinculos from "./vinculos.vue";

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
        }
    ]

    const childRef = ref(null)

    const openLaw = (id) => {
        if (childRef.value) {
            childRef.value.getAll(id)
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

    watch(
        () => route.query.art,
        (newId, oldId) => tabSelected.value = 5
    )


</script>

<style lang="scss" scoped>
.wrapper{
    display: flex;
    height: 100%;
    font-family: Arial, sans-serif;
}

.conteudo {
    flex: 1;
    padding: 0 20px;
    overflow-y: auto;
    background-color: #f4f4f4;
}

.conteudo::-webkit-scrollbar {
  width: 8px; /* largura da barra */
}
.conteudo::-webkit-scrollbar-track {
  background: #f1f1f1; /* trilho da barra */
  border-radius: 4px;
}

.conteudo::-webkit-scrollbar-thumb {
  background-color: #888; /* "botão" da barra */
  border-radius: 4px;
}

.conteudo::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* ao passar o mouse */
}

/* Firefox */
.conteudo {
  scrollbar-width: thin;            /* largura fina */
  scrollbar-color: #888 #f1f1f1;    /* cor do "polegar" e trilho */
}

.container, .container2 {
    width: min(100%, 900px);
}

.chat {
    width: 300px;
    background-color: #fff;
    border-left: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    overflow: auto;
    position: relative;
}

.chat.right {
    border-left: 1px solid #ddd;
}

.resizer {
    width: 5px;
    cursor: ew-resize;
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: #ccc;
    height: 100%;
}

.chat.right .resizer {
    left: 0;
}

.sizeLoad{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
}

.corpo{
    margin: 2rem;
    font-size: 15px;
    line-height: 2.1em
}

.form{
    width: 50%;
}

.fixed {
  position: fixed;
  background: purple;
  width: 100%;
  text-align: center;
  bottom: 0; /* Ajuste conforme necessário */
  z-index: 1000; /* Certifique-se de que está acima de outros elementos */
  animation: slideTopDocument .5s ease-in;
  transition: 1s ease;
}

@media (max-width:900px){
    .form{
        width: 100%;
    }
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