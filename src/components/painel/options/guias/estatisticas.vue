<template>
    <v-btn icon="mdi-arrow-left" variant="text" @click="$emit('back')"></v-btn>
    <div class="w-100 border rounded-lg">
        <h1>Estatísticas</h1>
        <div class="px-5">
            <v-text-field
                label="Disciplina"
                density="compact"
                variant="outlined"
                v-model="filter.disciplina"
                clearable
            ></v-text-field>
    
             <v-text-field
                label="Item"
                density="compact"
                variant="outlined"
                v-model="filter.item"
                clearable
            ></v-text-field>

            <v-switch
                label="Mostrar apenas concluídos"
                v-model="filter.concluido"
                density="compact"
                color="success"
                class="ml-1"
            ></v-switch>
        </div>
        

        <v-row class="pa-5">
            <v-col cols="6" v-for="item, i in listAll.filter(x => x.typeGuide == 'flahscards' || x.typeGuide == 'questoes')" :key="i">
                
                <v-card class="mb-2" variant="outlined" min-height="235">
                    <v-card-title>{{ item.numero }} - {{ item.title }}</v-card-title>
                    <v-card-text class="d-flex align-center justify-space-between flex-column">
                      <v-chip :color="concluidoResp(item.concluido).color">{{concluidoResp(item.concluido).text}}</v-chip>
                      
                      <div v-if="item.typeGuide == 'flahscards'">
                            <CardEstatistica 
                                :item="{ 
                                        total: tratarQuestoesFlashCards(item)?.total || 0, 
                                        total_correct: tratarQuestoesFlashCards(item)?.total_correct || 0, 
                                        total_incorrect: tratarQuestoesFlashCards(item)?.total_incorrect || 0,
                                        total_partial: tratarQuestoesFlashCards(item)?.total_partial || 0
                                }" 
                            />
                            <!-- <div class="my-5">
                                total: {{ tratarQuestoesFlashCards(item).total }} <br>
                                erros: {{ tratarQuestoesFlashCards(item).total_incorrect }} <br>
                                <span v-if="tratarQuestoesFlashCards(item)?.total_partial != '0'"></span> Parcial:{{ tratarQuestoesFlashCards(item).total_partial}}
                            </div>
                            <v-btn @click="resumoTexto(tratarQuestoesFlashCards(item).flashcards, item.typeGuide)"><v-icon>mdi-plus</v-icon></v-btn> -->
                      </div>

                      <div v-if="item.typeGuide == 'questoes'">
                        <CardEstatistica 
                            :item="{ 
                                    total: tratarQuestoesFlashCards(item)?.total || 0, 
                                    total_correct: tratarQuestoesFlashCards(item)?.total_correct || 0, 
                                    total_incorrect: tratarQuestoesFlashCards(item)?.total_incorrect || 0
                            }" 
                        />
                        <!-- <div class="my-5">
                            total: {{ tratarQuestoesFlashCards(item).total }} <br>
                            erros: {{ tratarQuestoesFlashCards(item).total_incorrect }} <br>
                            Acertos: {{ tratarQuestoesFlashCards(item).total_correct }} <br>
                        </div>
                        <v-btn @click="resumoTexto(tratarQuestoesFlashCards(item).questoes, item.typeGuide)"><v-icon>mdi-plus</v-icon></v-btn> -->
                      </div>

                      <div v-if="item.typeGuide == 'sumulas'">
                         <div class="my-5">
                             {{ tratarSumulasJuris(item).length }} Súmulas Favoritadas
                         </div>
                         <v-btn @click="resumoTexto(tratarSumulasJuris(item), item.typeGuide)"><v-icon>mdi-plus</v-icon></v-btn>
                      </div>

                      <div v-if="item.typeGuide == 'jurisprudencia'">
                        <div class="my-5">
                            {{ tratarSumulasJuris(item).length }} Jurisprudencias Favoritadas
                        </div>
                         <v-btn @click="resumoTexto(tratarSumulasJuris(item), item.typeGuide)"><v-icon>mdi-plus</v-icon></v-btn>
                      </div>
                      <div v-if="item.typeGuide == 'resumo'">
                        <div class="my-5">
                            {{ item.title }}
                        </div>
                        <v-btn 
                            @click="resumoTexto(item.text, item.typeGuide)">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- <v-row class="pa-5">
            <v-col cols="6" v-for="item, i in listAll" :key="i">
                <v-card class="mb-2" variant="outlined" min-height="235">
                    <v-card-title>{{ item.numero }} - {{ item.title }}</v-card-title>
                    <v-card-text class="d-flex align-center justify-space-between flex-column">
                      <v-chip :color="concluidoResp(item.concluido).color">{{concluidoResp(item.concluido).text}}</v-chip>

                      <div v-if="item.typeGuide == 'sumulas'">
                         <div class="my-5">
                             {{ tratarSumulasJuris(item).length }} Súmulas Favoritadas
                         </div>
                         <v-btn @click="resumoTexto(tratarSumulasJuris(item), item.typeGuide)"><v-icon>mdi-plus</v-icon></v-btn>
                      </div>

                      <div v-if="item.typeGuide == 'jurisprudencia'">
                        <div class="my-5">
                            {{ tratarSumulasJuris(item).length }} Jurisprudencias Favoritadas
                        </div>
                         <v-btn @click="resumoTexto(tratarSumulasJuris(item), item.typeGuide)"><v-icon>mdi-plus</v-icon></v-btn>
                      </div>

                      <div v-if="item.typeGuide == 'resumo'">
                        <div class="my-5">
                            {{ item.title }}
                        </div>
                        <v-btn 
                            @click="resumoTexto(item.text, item.typeGuide)">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row> -->

        <div v-if="textoFinal">
            <div class="overflow-y-auto border rounded-lg ma-5 pa-2" style="max-height: 300px;">
                {{ textoFinal }}
            </div>
            <div class="mb-2 d-flex justify-center">
                <v-btn variant="text" @click="textoRev = []">Limpar</v-btn>
                <v-btn variant="text" @click="copiarTexto">Copiar</v-btn>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, watch } from 'vue';
    import { useOptionsStore } from '@/store/concursos/OptionsStore';
    const optionsStore = useOptionsStore();

    import CardEstatistica  from '@/components/painel/options/guias/cardEstatistica/card.vue'

    const props = defineProps({
        selected: {
            type: Object,
            default: {
                id: null
            },
        },
    })

    const filter = ref({
        disciplina: props.selected?.disciplina || '',
        item: props.selected?.numero || '',
        concluido: true,
    })

    watch(() => props.selected, (newVal, oldPage) => {
        filter.value.disciplina = newVal?.disciplina || ''
        filter.value.item = newVal?.numero || ''
    })

    const formref = ref(null)
    const form = ref({
        title: `Resumo: ${props.selected?.conteudo}` || '',
        text: '',
    })

    const emit = defineEmits(['back', 'submit'])

    const rules = {
        required: (value) => !!value || 'Campo obrigatório.',
    }

    const typeGuide = 'resumo'
    const icon = 'mdi-file-document-outline'


    const submitForm = async () => {
        const { valid } = await formref.value.validate()
        if(form.value.text.length == 0) return
        if (!valid) return

        const objeto = {
            ...form.value,
            typeGuide,
            icon,
            disciplina: props.selected.disciplina,
            conteudo: props.selected.conteudo,
            numero: props.selected.numero,
            id_concurso: props.selected.id_concurso,
        }


        emit('submit', objeto)
    }

    const listResumo = computed(() => {
        const types = ['resumo', 'questoes', 'flahscards', 'sumulas', 'jurisprudencia'] //'artigos'
        let list = optionsStore.readRevisao .filter( x => types.includes(x.typeGuide))

        if(filter.value.disciplina) {
            list = list.filter( x => x.disciplina == filter.value.disciplina)
        }

        if(filter.value.item) {
            list = list.filter( x => x.numero == filter.value.item)
        }

        if(filter.value.concluido) {
            list = list.filter( x => concluidaMap.get(x.id)?.concluido == true)
        }

        return  list
    })

    const listRespostas = computed(() => {
        const types = ['jurisControle', 'sumulasControle', 'flashcardsControle', 'questoesControle']
        return optionsStore.readRevisao .filter( x => types.includes(x.typeGuide))
    })

    const listConcluidas = computed(() => {
        return optionsStore.readRevisao .filter( x => x.typeGuide == 'controle')
    })

    const concluidaMap = new Map(listConcluidas.value.map(item => [item.guia_id, item]));
    const respostaMap = new Map(listRespostas.value.map(item => [item.guia_id, item]));

    const listAll = computed(() => {
            const merged = listResumo.value.map( item => {
                const guia_id = item.id;
                const novaEntrada = { ...item };

                const concluida = concluidaMap.get(guia_id);
                if (concluida) {
                    novaEntrada.concluido = concluida.concluido;
                }

                const resposta = respostaMap.get(guia_id);
                if (resposta) {
                    const {
                        flahscardsreUserMark,
                        questoesUserMark,
                        favoriteJuris,
                        favoriteSumulas
                    } = resposta;

                    Object.assign(novaEntrada, {
                        flahscardsreUserMark,
                        questoesUserMark,
                        favoriteJuris,
                        favoriteSumulas
                    });
                }

                return novaEntrada;
            });
        return merged;
    })

    const concluidoResp = (item) => {
        return item
        ? {color: 'success', text: 'Concluído'}
        : {color: 'error', text: 'Não concluído'}
    }

    const textoRev = ref([])

    const tratarSumulasJuris = (item) => {
        try {
            const favs = item?.favoriteSumulas || item?.favoriteJuris
            const list = item.jurisprundencias || item.sumulas
            return list.filter((item, index )=> favs.includes(index))
        } catch (error) {
            return []
        }
    }

    const tratarQuestoesFlashCards = (item) => {
        try {
            const marks = item?.questoesUserMark || item?.flahscardsreUserMark
            const list = item.questoes || item.flahscards

            const listMerge = list.map((item, index) => {
                const mark = marks.find(mark => mark.id == index)
                return {
                    ...item,
                    response: mark?.resposta || mark?.response || 0
                }
            })

            const data = { 
                total: listMerge.length,
                total_incorrect: listMerge.filter(item => item.response == 'wrong' || item.response == 'errou').length,
                total_correct: listMerge.filter(item => item.response == 'correct' || item.response == 'acertou').length,
                total_partial: listMerge.filter(item => item.response == 'partial').length,
                questoes: listMerge.filter(item => item.response == 'errou'),
                flashcards: listMerge.filter(item => item.response == 'wrong' || item.response == 'partial'),
            }

            return data
        } catch (error) {
            return []
        }
    }

    const resumoTexto = (item, type) => {
        if(type == 'resumo') {
            textoRev.value.push(item)
        }

        if(type == 'questoes') {
            const textoFinal = item.map(item => 
                `Pergunta: ${item.pergunta} Está: ${item.resposta}, porque ${item.justificativa}.`
                ).join('\n\n');
            textoRev.value.push(textoFinal);
        }
        if(type == 'flahscards') {
            const textoFinal = item.map(item => 
                `Pergunta: ${item.pergunta} reposta ${item.resposta}.`
                ).join('\n\n');
            textoRev.value.push(textoFinal);
        }
        if(type == 'sumulas') {
            const textoFinal = item.map(item => 
                `${item.orgao} - ${item.title}: ${item.tese}, porque ${item.texto}.`
                ).join('\n\n');
            textoRev.value.push(textoFinal);
        }
        if(type == 'jurisprudencia') {
            const textoFinal = item.map(item => 
                `${item.orgao} - ${item.title} (${item.acao}): ${item.tese}, porque ${item.texto}.`
                ).join('\n\n');
            textoRev.value.push(textoFinal);
        }
    }

    const textoFinal = computed(() => {
        return textoRev.value.join('\n\n')
    })

    const copiarTexto = () => {
        const inicio = "Você é um professor experiente em concursos públicos na elaboração em flahs cards, olhe esse texto: \n\n"
        const final = "\n\n O texto acima foi o que tive mais dificuldades no meus estudos, representando meus erros e deficiencias. gere 50 flash cards em de json (array de objetos) com o seguinte formato do objeto {pergunta: 'fazer uma pergunta', resposta: 'responder  PERGUNTA e justificar a resposta', nivel: 'classificar em facil, medio ou dificil (sem acentos)'}."
        const textoDef = inicio + textoFinal.value + final
        navigator.clipboard.writeText(textoDef)
    }
   
</script>

<style scoped>

</style>