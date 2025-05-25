<template>
    <v-btn icon="mdi-arrow-left" variant="text" @click="$emit('back')"></v-btn>
    <div class="w-100 border rounded-lg">
        <h1>Questões</h1>

       <v-form @submit.prevent="submitForm" ref="formref" style="margin: 2rem;">
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
    import { ref } from 'vue';

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
        title: props.selected?.conteudo || '',
        listaQuestoes: '',
    })

    

    const emit = defineEmits(['back', 'submit'])

    const rules = {
        required: (value) => !!value || 'Campo obrigatório.',
    }

    const typeGuide = 'questoes'
    const icon = 'mdi-list-status'
    const listImport = ref([])

    const submitForm = async () => {
        const { valid } = await formref.value.validate()
        // if(form.value.text.length == 0) return
        if (!valid) return

        const resp = isValidJsonString(form.value.listaQuestoes)
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