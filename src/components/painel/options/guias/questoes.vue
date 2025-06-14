<template>
    <v-btn icon="mdi-arrow-left" variant="text" @click="$emit('back')"></v-btn>
    <div class="w-100 border rounded-lg">
        <h1>Questões</h1>

        <v-form v-if="false" @submit.prevent="submitForm" ref="formref" style="margin: 2rem;">
            <v-text-field
                label="Título da Revisão"
                variant="outlined"
                density="compact"
                v-model="form.title"
                clearable
                :rules="[rules.required]"
            ></v-text-field>

            <v-textarea
                label="Array de questões"
                density="compact"
                variant="outlined"
                v-model="form.listaQuestoes"
                :rules="[rules.required]"
            ></v-textarea>

            <div class="mt-5">
                <v-btn type="submit" color="success" variant="outlined">Salvar</v-btn>
            </div>

        </v-form>

        <div v-if="selected.conteudo" class="ma-5">
            <div v-if="!concluido && !error">
                <div class="mb-5">
                    {{ topicoRead }}
                </div>
                <div>
                    <v-textarea
                        label="Assuntos ou exemplo de questões"
                        v-model="listQuestoesErradas"
                        placeholder="Não é obrigatóriio, mas ajuda a gerar melhores questões focando no que você errou"
                        density="compact"
                        maxlength="1000"
                        variant="outlined"
                        counter
                    ></v-textarea>
                </div>
                <v-btn 
                    @click="gerarQuestoes" 
                    :loading="load" :disabled="load" variant="flat" color="primary">Gerar Questões por IA
                </v-btn>
            </div>
            <div v-else>
                <v-alert v-if="concluido" type="success" text="Questões geradas com sucesso!" class="ma-5"></v-alert>
                <v-alert v-if="error" type="error" text="erro na operação!" class="ma-5"></v-alert>
            </div>
        </div>
        <v-alert type="info" v-else text="Selecione um Tópico do edital." class="ma-5"></v-alert>


        <div v-if="listImport.length > 0" class="mt-5">
            <h5>Lista de questões</h5>
            {{ form.title }}
            <div v-for="(item, index) in listImport" :key="index" class="pa-2 mb-2 border rounded-lg">
                <div class="pa-1 border rounded-lg bg-primary mb-2">
                    <b>{{ item.banca }}</b> - {{ item.concurso }} - {{ item.cargo }} - {{ item.tipo }}
                </div>
                <b>{{ index + 1 }}) </b>{{ item.pergunta }} <br><br>
                {{ item.resposta }} - {{ item.id_art }} <br>
                {{ item.justificativa }} <br>
            </div>
        </div>
       
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue';

    import { useOptionsStore } from '@/store/concursos/OptionsStore';
    const optionsStore = useOptionsStore();

    const props = defineProps({
        selected: {
            type: Object,
            default: {
                id: null
            },
        },
    })

    const formref = ref(null)
    const form = ref({
        title: `Questões: ${props.selected?.conteudo}` || '',
        listaQuestoes: '',
    })

    const emit = defineEmits(['back', 'submit'])

    const rules = {
        required: (value) => !!value || 'Campo obrigatório.',
    }

    const typeGuide = 'questoes'
    const icon = 'mdi-list-status'
    const listImport = ref([])

    const topicoRead = computed(() => {
        const obj = props.selected
        let resultado = `${obj.disciplina}: ${obj.numero} ${obj.conteudo}`;

        function processaSubtopicos(subtopicos) {
                let partes = [];
                for (const sub of subtopicos || []) {
                    partes.push(`${sub.numero} ${sub.conteudo}`);
                    if (sub.subtopicos && sub.subtopicos.length > 0) {
                        partes = partes.concat(processaSubtopicos(sub.subtopicos));
                    }
                }
                return partes;
        }

        const linhas = processaSubtopicos(obj.subtopicos);
        return resultado + '. ' + linhas.join(' ');
    })

    const listQuestoesErradas = ref(null)
    const load = ref(false)
    const concluido = ref(false)
    const error = ref(false)

    const gerarQuestoes = async () => {
        if (!listQuestoesErradas.value) listQuestoesErradas.value = ''
        load.value = true
        const texto = `Com base na disciplina: ${topicoRead.value} e nas questões que mais tive dificuldades ${listQuestoesErradas.value}, se for informado,
            com foco na banca ${props.selected.banca}, use como base as questoes dos concursos dos ultimos 5 anos.
            As questões devem ser escrito em português brasileiro, com um estilo voltado para estudos para concursos públicos..
            Não fuja do assunto. Se houver poucas referencias de questões na banca mencionada, utilize outras bancas relevantes como FGV, FCC, CESGRANRIO, VUNESP, ETC.
            fazendo as adaptações para o estilo verdadeiro/falso
        `

        const questoes = await optionsStore.gerarQuestoes(texto)
        

        form.value = {
            title: `Questões 1: ${props.selected?.conteudo}`,
            listaQuestoes: questoes,
        }

        await submitForm()
        load.value = false
    }

    const submitForm = async () => {
        // const { valid } = await formref.value.validate()
        // if(form.value.text.length == 0) return
        // if (!valid) return

        const jsonString = JSON.stringify(form.value.listaQuestoes);
        const resp = isValidJsonString(jsonString)

        if(!resp) {
            error.value = true
            return
        }

        listImport.value = resp.map(obj => ({
            ...obj,
            tipo: "c/e"
        }))

        const objeto = {
            title: form.value.title,
            questoes: [ ...listImport.value ],
            typeGuide,
            icon,
            disciplina: props.selected.disciplina,
            conteudo: props.selected.conteudo,
            numero: props.selected.numero,
            id_concurso: props.selected.id_concurso,
        }
        emit('submit', objeto)
        clearFields()
        concluido.value = true
    }

    const clearFields = () => {
        form.value.title = ''
        form.value.listaQuestoes = ''
        listImport.value = []
    }

    const isValidJsonString = (str) => {
        try {
            const parsed = JSON.parse(str);
            return parsed
        } catch (e) {
            return false;
        }
    }
</script>

<style scoped>


</style>