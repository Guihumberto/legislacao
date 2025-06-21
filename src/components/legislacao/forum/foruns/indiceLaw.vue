<template>
    <v-btn variant="text" prepend-icon="mdi-view-list" @click="dialog = true">índice</v-btn>
    <v-dialog v-model="dialog" width="800">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center bg-primary">
                <div class="d-flex align-center ga-2">
                    <v-icon size="1.5rem">mdi-view-list</v-icon>
                    Índice
                </div>
                <v-btn variant="text" icon="mdi-close" @click="dialog = false"></v-btn>
            </v-card-title>
            <v-card-text class="overflow-y-auto" style="max-height: 600px;">
                <v-list class="pa-0">
                    <v-list-item class="py-0" :title="item.text" v-for="(item, index) in estruturaMap" :key="index" @click="scrollTo(item)">

                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref, computed } from 'vue';
    const dialog = ref(false);

    const props = defineProps({
        estrutura: {
            type: Array,
            default: []
        }
    })

    const estruturaMap = computed(() => {
        const list = props.estrutura.map( x => ({ text: x.textlaw, art: x.art }))
        return list
    })

    const emits = defineEmits(['goTo'])

    const scrollTo = (item) => {
        emits('goTo', item.art)
        dialog.value = false
    }

</script>

<style scoped>

</style>