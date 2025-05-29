<template>
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title class="bg-error d-flex ga-2 align-center"><v-icon>mdi-delete</v-icon>Excluir Edital</v-card-title>
            <v-card-text>
                <div class="border rounded-lg p-5 text-center pa-2 mb-5">
                    <p class="font-weight-bold">{{ deleteItem }}</p>
                </div>
                <p class="mb-2"><span class="font-weight-bold">Atenção:</span> todas as informações gravadas serão perdidas.</p>
                <p>Tem certeza que deseja excluir este edital?</p>
                <div class="d-flex justify-center ga-2 mt-10">
                    <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
                    <v-btn variant="flat" color="error" @click="$emit('delete')">Excluir</v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { computed, inject } from 'vue'

    const props = defineProps({
        delete: {
            type: Object,
            required: true
        }
    })

    const dialog = inject('dialog')

    const deleteItem = computed(() => {
        return props.delete?.cargo
    })

</script>

<style scoped>

</style>