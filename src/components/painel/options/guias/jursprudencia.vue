<template>
    <v-btn icon="mdi-arrow-left" variant="text" @click="$emit('back')"></v-btn>
    <div class="w-100 border rounded-lg">
        <h1>Jurisprudências</h1>

        <v-form @submit.prevent="submitForm2" ref="formref" style="margin: 2rem;" v-if="optionsStore.readUserMaster">
            <v-text-field
                label="Título da Revisão"
                variant="outlined"
                density="compact"
                v-model="form.title"
                clearable
                :rules="[rules.required]"
            ></v-text-field>

            <v-textarea
                label="Array de Jurisprudências"
                density="compact"
                variant="outlined"
                v-model="form.listaJuris"
                :rules="[rules.required]"
            ></v-textarea>

             <v-sheet class="bg-transparent d-flex justify-center">
                <v-chip-group
                    selected-class="text-primary"
                    mandatory
                    v-model="form.nivel"
                >
                    <v-chip
                        v-for="tag, i in nivel"
                        :key="i"
                        :text="tag"
                        :value="tag"
                    ></v-chip>
                </v-chip-group>
            </v-sheet>

            <div class="mt-5">
                <v-btn type="submit" color="success" variant="outlined">Salvar</v-btn>
            </div>

            <div v-if="listImport.length > 0" class="mt-5">
            <h5>Lista de Jurisprudencia</h5>
            {{ form.title }}
            <div v-for="(item, index) in listImport" :key="index" class="pa-2 mb-2 border rounded-lg">
                <div class="pa-1 border rounded-lg mb-2" :class="colorNivel(item.nivel)">
                    <b>{{ item.nivel }}</b>
                </div>
                <div class="font-weight-bold">Pergunta:</div>
                <b>{{ index + 1 }}) </b>{{ item.pergunta }} <br><br>
                <div class="font-weight-bold">Resposta:</div>
                {{ item.resposta }} <br>
            </div>
        </div>

        </v-form>

        <div v-if="selected.conteudo" class="ma-5">
            <div v-if="!concluido && !error">
                <div class="mb-5">
                    {{ topicoRead }}
                </div>
                <v-btn 
                    @click="gerarJurisprudencia" 
                    :loading="load" :disabled="load" variant="flat" color="primary">Buscar Jurisprudência por IA
                </v-btn>
            </div>
            <div v-else>
                <v-alert v-if="concluido" type="success" text="Questões geradas com sucesso!" class="ma-5"></v-alert>
                <v-alert v-if="error" type="error" text="erro na operação!" class="ma-5"></v-alert>
            </div>
        </div>
        <v-alert type="info" v-else text="Selecione um Tópico do edital." class="ma-5"></v-alert>
       
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
        title: `Juris: ${props.selected?.numero} - ${props.selected?.conteudo}` || '',
        listaJuris: '',
        nivel: 'medio'
    })

    const emit = defineEmits(['back', 'submit'])

    const rules = {
        required: (value) => !!value || 'Campo obrigatório.',
    }

    const typeGuide = 'jurisprudencia'
    const icon = 'mdi-gavel'
    const listImport = ref([])
    const nivel = [
        'facil',
        'medio',
        'dificil'
    ]

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

    const load = ref(false)
    const concluido = ref(false)
    const error = ref(false)

    const gerarJurisprudencia = async () => {
        load.value = true

        const texto = `Com base na disciplina: ${topicoRead.value} com foco na banca ${props.selected.banca}, relacione as principais sumulas do STF e STJ e tambem jurisprudências paradigmáticas,
            com foco em concursos públicos dos ultimos 10 anos.
            Não fuja do assunto. Se houver poucas referencias de jurisprudencia na banca mencionada, utilize outras bancas relevantes como FGV, FCC, CESGRANRIO, VUNESP, ETC e as mais recententes com foco no tema mencionado.
        `

        const juris = await optionsStore.gerarJurisprudencia(texto)

         if(juris.length == 0) {
            error.value = true
            return
        }
        
        
        form.value = {
            title: `Jurisprundecia 1: ${props.selected?.conteudo}`,
            listaJuris: juris,
        }

        await submitForm()
        load.value = false
    }

    const submitForm = async () => {
        // const { valid } = await formref.value.validate()
        // if(form.value.text.length == 0) return
        // if (!valid) return

        const jsonString = JSON.stringify(form.value.listaJuris);
        const resp = isValidJsonString(jsonString)

        console.log('resp', resp);

        if(!resp) {
            error.value = true
            return
        }

        listImport.value = resp.map(obj => ({
            ...obj,
        }))

        const objeto = {
            title: form.value.title,
            jurisprundencias: [ ...listImport.value ],
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

    const submitForm2 = async () => {
        const { valid } = await formref.value.validate()
        // if(form.value.text.length == 0) return
        if (!valid) return

        const resp = isValidJsonString(form.value.listaJuris)
        listImport.value = resp.map(obj => ({
            ...obj,
            // nivel: form.value.nivel
        }))

        const objeto = {
            title: form.value.title,
            jurisprundencias: [ ...listImport.value ],
            typeGuide,
            icon,
            disciplina: props.selected.disciplina,
            conteudo: props.selected.conteudo,
            numero: props.selected.numero,
            id_concurso: props.selected.id_concurso,
        }
        emit('submit', objeto)
        clearFields()
    }

    const clearFields = () => {
        form.value.title = ''
        form.value.listaJuris = ''
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

    const colorNivel = (nivel) => {
        switch (nivel) {
            case 'facil':
                return 'bg-blue-lighten-4'
                break;
            case 'medio':
                return 'bg-orange-lighten-2'
                break;
            case 'dificil':
                return 'bg-deep-orange-darken-1'
                break;
        }
    }
</script>

<style scoped>

</style>