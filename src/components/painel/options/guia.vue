<template>
    <section>
        <div class="mt-5 ">
            <h2 class="title"> <v-icon size="2rem" >mdi-chart-sankey-variant</v-icon> Guia de estudos</h2>
            <p class="font-weight-bold">{{ selected?.disciplina }}</p>
            <p>{{ selected.numero }} - {{ selected?.conteudo }}</p>
        </div>
        <v-expand-transition>
            <div class="content" v-if="!selectGuia && usermaster">
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
        </v-expand-transition>
        <v-expand-transition>
            <div class="content" v-if="selectGuia">
                <Resumo @back="selectGuia = ''" v-if="selectGuia == 2" :selected="selected" @submit="submitForm" />
                <Questoes @back="selectGuia = ''" v-if="selectGuia == 1" :selected="selected" @submit="submitForm" />
                <Flashcards @back="selectGuia = ''" v-if="selectGuia == 3" :selected="selected" @submit="submitForm" />
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
                ></v-select>
                <v-list-item v-for="item, i in listResumo" :key="i" :prepend-icon="item.icon" border class="mb-2" link>
                    <v-list-item-title> {{ item.title }} </v-list-item-title>
                     <v-list-item-subtitle> {{ item.conteudo }} </v-list-item-subtitle>
                    <template v-slot:append>
                        <Revisao v-if="item.typeGuide == 'resumo'" :conteudo="item" />
                        <QuestoesDialog v-if="item.typeGuide == 'questoes'" :conteudo="item" />
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

   import { useOptionsStore } from '@/store/concursos/OptionsStore';
   const optionsStore = useOptionsStore();

   //components
   import Resumo from './guias/resumo.vue';
   import Questoes from './guias/questoes.vue';
   import Flashcards from './guias/flashcards.vue';
   import Revisao from './dialog/revisao.vue';
   import QuestoesDialog from './dialog/questoes.vue';

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
        'Flashcards',
        'Súmulas',
        'Jurisprudências',
        'Artigos',
   ]

   const loading = ref(false)

   const submitForm = async (event) => {
        loading.value = true
        await optionsStore.createRevisao(event)
        loading.value = false
   }

   const filter =  ref({
      typeGuia: ''
   })

   const listResumo = computed(() => {
        let list = optionsStore.readRevisao

        if(filter.value.typeGuia){
            list = list.filter(item => item.typeGuide == filter.value.typeGuia)
        }
        if(props.selectDisciplina?.disciplina){
            list = list.filter(item => item.disciplina == props.selectDisciplina.disciplina)
        }

        return list
   })
</script>

<style scoped>
    section {
        margin: 0 auto;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .content {
        max-width: 1200px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        background: #f8f9fa;
        padding: 25px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin-bottom: 30px;
        margin-top: 1rem;
    }
    .title {
        color: #333;
        gap: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>