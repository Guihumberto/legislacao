<template>
    <v-btn icon="mdi-arrow-left" variant="text" @click="$emit('back')"></v-btn>
    <div class="w-100 border rounded-lg">
        <h1>Resumo</h1>
        
        <v-form @submit.prevent="submitForm" ref="formref" style="margin: 2rem;" v-if="false">
            <v-text-field
                label="Título da Revisão"
                variant="outlined"
                density="compact"
                v-model="form.title"
                clearable
                :rules="[rules.required]"
            ></v-text-field>

            <ComentEdit
                label="Texto da Revisão"
                v-model="form.text"
                :disabled="false"
                :loading="false"
                class="mt-5"
                :max-length="100000"
            />

            <div class="mt-5">
                <v-btn type="submit" color="success" variant="flat">Salvar</v-btn>
            </div>
        </v-form>
        <div v-if="selected.conteudo" class="ma-5">
            <div class="mb-5">
                {{ topicoRead }}
            </div>
            <v-btn @click="gerarResumo" :loading="load" :disabled="load" variant="flat" color="primary">Gerar Resumo por IA</v-btn>
        </div>
        <v-alert type="info" v-else text="Selecione um Tópico do edital." class="ma-5"></v-alert>

    </div>
</template>

<script setup>
    import { ref, computed } from 'vue';

    //components
    import ComentEdit from '@/components/legislacao/forum/comentarios/comentEdit.vue';

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
        title: `Resumo: ${props.selected?.conteudo}` || '',
        text: '',
    })

    const emit = defineEmits(['back', 'submit'])

    const rules = {
        required: (value) => !!value || 'Campo obrigatório.',
    }

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

    const typeGuide = 'resumo'
    const icon = 'mdi-file-document-outline'

    const load = ref(false)

    const gerarResumo = async () => {
        load.value = true
        const texto = `Gere uma revisão com os assuntos mais importantes desse assunto: ${topicoRead.value},
            com foco na banca ${props.selected.banca}, use como base as questoes dos concursos dos ultimos 5 anos.
            O resumo deve ser escrito em português brasileiro, com um estilo formal e profissional.
            Use pareto para destacar os assuntos mais importantes, liste conceitos e classificações importantes, pegadinhas das questoes que tentam confundir o candidato,
            e também os assuntos que mais caem. Se tiver base em legislação cite os os artigos e jurisprudencias relacionadas.
            Nãoo fuja do assunto. Se houver poucas referencias, utilize outras bancas relevantes coo FGV, FCC, CESGRANRIO, VUNESP, ETC.
        `

        const resumo = await optionsStore.gerarResumo(texto)

        form.value = {
            title: `Resumo: ${props.selected?.conteudo}`,
            text: resumo,
        }
        // await submitForm()
        load.value = false
    }

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
   
</script>

<style scoped>

</style>