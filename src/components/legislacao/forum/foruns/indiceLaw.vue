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
                <v-list class="pa-0 border rounded-lg">
                    <v-list-item 
                        class="py-0" v-html="item.text" 
                        v-for="(item, index) in estruturaMap" :key="index" @click="scrollTo(item)"
                        :class="[selectItem(item?.art), recuo(item?.text)]"
                    >
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import { useRoute } from 'vue-router';
    const route = useRoute()

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

    const selectItem = (art) => {

        if(!route?.query?.arts) return ''

        if(art == route?.query?.arts[0]) return 'bg-blue-lighten-4 font-weight-bold'
    }
    

    const recuo = (text) => {
        const textoLower = text.toLowerCase()

        if (textoLower.includes('livro')) {
            return 'pl-2 font-weight-bold'
        } else if (textoLower.includes('título')) {
        return 'pl-5 font-weight-medium'
        } else if (textoLower.includes('capítulo')) {
            return 'pl-10 font-weight-regular'
        } else if (textoLower.includes('subseção')) {
            return 'pl-16 font-weight-thin'
        } else if (textoLower.includes('seção')) {
            return 'pl-13 font-weight-light'
        } else {
            return 'pl-0'
        }
    }

</script>

<style scoped>

</style>