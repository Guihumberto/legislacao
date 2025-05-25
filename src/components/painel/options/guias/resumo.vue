<template>
    <v-btn icon="mdi-arrow-left" variant="text" @click="$emit('back')"></v-btn>
    <div class="w-100 border rounded-lg">
        <h1>Resumo</h1>

        <v-form @submit.prevent="submitForm" ref="formref" style="margin: 2rem;">
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
                <v-btn type="submit" color="success" variant="outlined">Salvar</v-btn>
            </div>
        </v-form>
        <div class="mt-5 mx-10">
            <div v-for="item, i in optionsStore.readRevisao" :key="id">
                {{ item.title }}
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

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
        title: props.selected?.conteudo || '',
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
   
</script>

<style scoped>

</style>