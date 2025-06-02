<template>
    <section>
        <div class="mt-5 ">
            <h2 class="title"> <v-icon size="2rem" >mdi-chart-sankey-variant</v-icon> Guia de estudos</h2>
            <p class="font-weight-bold">{{ selected?.disciplina }}</p>
            <p>{{ selected.numero }} - {{ selected?.conteudo }}</p>
        </div>
        <v-expand-transition>
            <v-card class="content" v-if="!selectGuia && usermaster">
                <div class="cards-container">
                    <div class="pa-2" v-for="item,i in typesGuia" :key="i" style="max-width: 350px;">
                        <v-card class="text-left" variant="outlined" color="grey" hover>
                            <v-card-title class="text-black d-flex align-center ga-2">
                                    <v-icon size="1.5rem">{{ item.icon }}</v-icon>
                                    {{ item.title }}
                            </v-card-title>
                            <v-card-text >
                                Crie revisão dos pontos relevantes desse assunto
                            </v-card-text>
                            <v-card-actions>
                                <v-btn variant="outlined" block color="black" @click="selectGuia = item.id">Gerar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </div>
                </div>
            </v-card>
        </v-expand-transition>
        <v-expand-transition>
            <div class="content" v-if="selectGuia">
                <Resumo @back="selectGuia = ''" v-if="selectGuia == 2" :selected="selected" @submit="submitForm" />
                <Questoes @back="selectGuia = ''" v-if="selectGuia == 1" :selected="selected" @submit="submitForm" />
                <Flashcards @back="selectGuia = ''" v-if="selectGuia == 3" :selected="selected" @submit="submitForm" />
                <Sumulas @back="selectGuia = ''" v-if="selectGuia == 4" :selected="selected" @submit="submitForm" />
                <Jurisprudencia @back="selectGuia = ''" v-if="selectGuia == 5" :selected="selected" @submit="submitForm" />
                <Artigos @back="selectGuia = ''" v-if="selectGuia == 6" :selected="selected" @submit="submitForm" />
            </div>
        </v-expand-transition>
        <v-expand-transition>
            <v-list class="pa-5 text-left" v-if="!loading && optionsStore.readRevisao.length">
                <div class="d-flex align-center justify-space-between">
                    <p>Disciplina: {{ selectDisciplina?.disciplina || "Todas" }}</p>
                    <v-btn variant="text" class="text-lowercase" @click="$emit('clearDisciplina')">Mostrar todas</v-btn>
                </div>
                <v-select
                    :items="itemsTypeGuia"
                    label="Tipo de Guia"
                    variant="outlined"
                    density="compact"
                    clearable
                    class="mt-5 w-50"
                    v-model="filter.typeGuia"
                    hide-details
                ></v-select>

                <v-checkbox color="error" class="ml-n2" label="ocultar concluídos" v-model="filter.hiddenConcluidos" hide-details></v-checkbox>

                <v-list-item v-for="item, i in listResumo" :key="i" :prepend-icon="item.icon" border class="mb-2 list-item-hover" link>
                    <v-list-item-title :class="{ 'text-decoration-line-through' : item.concluido }"> {{ item.title }} </v-list-item-title>
                    <v-list-item-subtitle> {{ item.conteudo }} </v-list-item-subtitle>
                    <template v-slot:append>
                    {{ item.id }}
                        <Revisao v-if="item.typeGuide == 'resumo'" :conteudo="item" />
                        <QuestoesDialog v-if="item.typeGuide == 'questoes'" :conteudo="item" />
                        <FlashcardsDialog v-if="item.typeGuide == 'flahscards'" :conteudo="item" />
                        <SumulasDialog v-if="item.typeGuide == 'sumulas'" :conteudo="item" />
                        <JurisprudenciaDialog v-if="item.typeGuide == 'jurisprudencia'" :conteudo="item" />
                        <ArtigosDialog v-if="item.typeGuide == 'artigos'" :conteudo="item" />
                        <v-tooltip :text="item.concluido ? 'Desmarcar a atividade.' : 'Marcar como concluído'">
                            <template v-slot:activator="{ props }">
                                 <v-btn 
                                    :loading="loadConcluir"
                                    :disabled="loadConcluir"
                                    v-bind="props" variant="text" :color="item.concluido ? 'error' : 'success'" 
                                    :icon="item.concluido ? 'mdi-close-box-outline' : 'mdi-checkbox-marked-circle-outline'" density="compact" class="hover-button"
                                    @click="concluirGuia(item)"
                                ></v-btn>
                            </template>
                        </v-tooltip>
                    </template>
                </v-list-item>
                <v-alert v-if="!listResumo.length" type="info" variant="outlined" text="Não há revisoes criadas neste filtro."></v-alert>
            </v-list>
            <v-alert v-if="!loading && !optionsStore.readRevisao.length" text="Ainda não foram criadas revisões para este tópico"></v-alert>
        </v-expand-transition>
    </section>
</template>

<script setup>
   import { ref, watch, computed } from 'vue';
   import { storeToRefs } from 'pinia'

   import { useOptionsStore } from '@/store/concursos/OptionsStore';
   const optionsStore = useOptionsStore();

   //components
   import Resumo from './guias/resumo.vue';
   import Questoes from './guias/questoes.vue';
   import Flashcards from './guias/flashcards.vue';
   import Revisao from './dialog/revisao.vue';
   import QuestoesDialog from './dialog/questoes.vue';
   import FlashcardsDialog from './dialog/flahscards.vue';
   import Sumulas from './guias/sumulas.vue';
   import Jurisprudencia from './guias/jursprudencia.vue';
   import Artigos from './guias/artigos.vue';
   import SumulasDialog from './dialog/sumulas.vue';
   import JurisprudenciaDialog from './dialog/jurisprundencia.vue';
   import ArtigosDialog from './dialog/artigos.vue';

   const props = defineProps({
        selectDisciplina: {
            type: Object,
            default: {
                id_concurso: null,
                disciplina: null,
            }
        },
        selected: {
            type: Object,
            default: {
                id: null
            },
        },
        usermaster: {
            type: Boolean,
            default: true,
        },
        prompt:{
            type: String,
            default: '',
        }
   })

   watch(() => props.selected, async (newVal) => {
        if(newVal?.id){
            console.log('selecionar conforme disciplina');
        }
   })

   const selectGuia = ref('')
   const typesGuia = [
        {
            id: 1,
            title: 'Gerar Questões',
            subtitle: 'Crie revisão dos pontos relevantes desse assunto',
            icon: 'mdi-list-status',
            color: 'grey',
        },
        {
            id: 2,
            title: 'Gerar Revisão',
            subtitle: 'Crie revisão dos pontos relevantes desse assunto',
            icon: 'mdi-file-document-outline',
            color: 'grey',
        },
        {
            id: 3,
            title: 'Gerar Flashcards',
            subtitle: 'Crie revisão dos pontos relevantes desse assunto',
            icon: 'mdi-card-text-outline',
            color: 'grey',
        },
        {
            id: 4,
            title: 'Procurar Súmulas',
            subtitle: 'Crie revisão school pontos relevantes desse assunto',
            icon: 'mdi-account-school',
            color: 'grey',
        },
        {
            id: 5,
            title: 'Procurar Jurisprudências',
            subtitle: 'Crie revisão dos pontos relevantes desse assunto',
            icon: 'mdi-gavel',
            color: 'grey',
        },
        {
            id: 6,
            title: 'Procurar Artigos relevantes',
            subtitle: 'Crie revisão dos pontos relevantes desse assunto',
            icon: 'mdi-numeric-5-box-multiple-outline',
            color: 'grey',
        },
   ]

   const itemsTypeGuia = [
        'resumo',
        'questoes',
        'flahscards',
        'sumulas',
        'jurisprudencias',
        'artigos',
   ]

   const loading = ref(false)

   const submitForm = async (event) => {
        loading.value = true
        await optionsStore.createRevisao(event)
        loading.value = false
   }

   const filter =  ref({
      typeGuia: '',
      hiddenConcluidos: false
   })

   const { revisao } = storeToRefs(optionsStore)

   const listResumo = computed(() => {
        const guias = revisao.value
        const controle = guias.filter(obj => obj.typeGuide === "controle")
        const respostas = guias.filter(obj => obj.typeGuide !== "controle")

        let list = respostas.map(item => {
            const guiaRelacionada = controle.find(g => g.guia_id === item.id)
            return {
                ...item,
                concluido: guiaRelacionada ? guiaRelacionada.concluido : false
            }
        })

        if(filter.value.typeGuia){
            list = list.filter(item => item.typeGuide == filter.value.typeGuia)
        }
        if(props.selectDisciplina?.disciplina){
            list = list.filter(item => item.disciplina == props.selectDisciplina.disciplina)
        }

        if(filter.value.hiddenConcluidos){
            list = list.filter(item => !item.concluido)
        }

        return list
   })

    const guiasComControle = (guias) => {
        try {
            const controle = guias.filter(obj => obj.typeGuide === "controle")
            const respostas = guias.filter(obj => obj.typeGuide != "controle")

            const resultado = respostas.map(item => {
                const guiaRelacionada = controle.find(g => g.guia_id === item.id);
                return {
                    ...item,
                    concluido: guiaRelacionada ? guiaRelacionada.concluido : false,
                };
            })

            return resultado
            
        } catch (error) {
            return guias
        }
    }

   const loadConcluir = ref(false)

   const concluirGuia = async (item) => {
        loadConcluir.value = true
        await optionsStore.concluirGuia(item)
        loadConcluir.value = false
   }


</script>

<style scoped>
    section {
        margin: 0 auto;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .content {
        max-width: 1400px;
        margin: 2rem auto;
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        position: relative;
        overflow: hidden;
    }
    .content::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="0.5" fill="rgba(255,255,255,0.03)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        pointer-events: none;
    }
    .cards-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: .5rem;
        position: relative;
        z-index: 1;
    }
    .title {
        color: #333;
        gap: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .list-item-hover .hover-button {
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
    }

    .list-item-hover:hover .hover-button {
        opacity: 1;
    }
</style>