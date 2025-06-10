<template>
    <v-btn icon="mdi-arrow-left" variant="text" @click="$emit('back')"></v-btn>
    <div class="w-100 border rounded-lg">
        <h1>Mapa Mental</h1>

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
   
</script>

<style scoped>

</style>