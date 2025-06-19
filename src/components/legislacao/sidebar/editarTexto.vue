<template>
    <v-btn variant="flat" color="primary" block @click="dialog = !dialog">Abrir</v-btn>
    <v-dialog v-model="dialog" width="900" persistent>
        <v-card min-height="50vh">
            <v-card-title class="d-flex justify-space-between align-center bg-primary">
                <div class="d-flex align-center ga-2">
                    <v-icon size="1.3rem">mdi-pencil</v-icon>
                    Editar texto
                </div>
                <v-btn variant="text" @click="dialog = false" icon="mdi-close"></v-btn>
            </v-card-title>
            <v-card-text>
                <ComentEdit 
                    label="Texto Editado"
                    v-model="texto"
                    :disabled="false"
                    :loading="false"
                    class="mt-5"
                    :max-length="100000000"
                />
                <div class="d-flex justify-center mt-5 ga-2">
                    <v-btn variant="flat" disabled color="success">Fundamentar decisão</v-btn>
                    <v-btn variant="flat" disabled color="success">Gerar Análise explicativa</v-btn>
                    <v-btn variant="flat" disabled color="success">Gerar resumo</v-btn>
                    <v-btn variant="flat" disabled color="success">Salvar Texto</v-btn>
                </div>
                <div class="mt-5">
                    <v-alert type="info" text="Seus documentos gerados aparecerão aqui"></v-alert>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref, computed } from 'vue';
    const dialog = ref(false)

    import ComentEdit from '@/components/legislacao/forum/comentarios/comentEdit.vue';

    const props = defineProps({
        textoList: Array
    })

    const texto = computed(() => {
        let texto = []
        if(props.textoList.length){
            props.textoList.forEach(item => {
                const text = `<p>${item.texto_selected}</p> <small>${item.nam_law}, pág. ${item.num_page}</small>`
                texto.push(text)
            })
        }
        return texto.join('<br><br>')
    })


</script>

<style scoped>

</style>