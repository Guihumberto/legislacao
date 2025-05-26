<template>
    <v-btn icon="mdi-arrow-left" variant="text" @click="$emit('back')"></v-btn>
    <div class="w-100 border rounded-lg">
        <h1>Flashcards</h1>

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
                label="Array de flashcards"
                density="compact"
                variant="outlined"
                v-model="form.listaFlahscards"
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
            <h5>Lista de Flahscards</h5>
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
       
    </div>
</template>

<script setup>
    import { ref } from 'vue';

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
        title: `Flashcards: ${props.selected?.numero} - ${props.selected?.conteudo}` || '',
        listaFlahscards: '',
        nivel: 'medio'
    })

    const emit = defineEmits(['back', 'submit'])

    const rules = {
        required: (value) => !!value || 'Campo obrigatório.',
    }

    const typeGuide = 'flahscards'
    const icon = 'mdi-card-text-outline'
    const listImport = ref([])
    const nivel = [
        'facil',
        'medio',
        'dificil'
    ]

    const submitForm = async () => {
        const { valid } = await formref.value.validate()
        // if(form.value.text.length == 0) return
        if (!valid) return

        const resp = isValidJsonString(form.value.listaFlahscards)
        listImport.value = resp.map(obj => ({
            ...obj,
            // nivel: form.value.nivel
        }))

        const objeto = {
            title: form.value.title,
            flahscards: [ ...listImport.value ],
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
        form.value.listaFlahscards = ''
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