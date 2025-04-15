<template>
    <v-card class="mt-2">
        <v-card-title class="text-center">Visão Geral</v-card-title>
        <v-card-text class="mt-5">
            
            <p>{{ overview }} </p>
            <v-btn :loading="loading" v-if="!overview" variant="text" block color="primary" @click="save($route.params.id)" >Salvar</v-btn>
        </v-card-text>
        <v-card-title class="text-center">Sugestão de Perguntas</v-card-title>
        <v-card-text class="mt-5">
            <v-list density="compact" class="ma-0 pa-0">
                <v-list-item 
                    v-for="item, i in questions" :key="i" 
                    prepend-icon="mdi-forum" link :title="item.title" 
                    @click="goQuestion(item)"></v-list-item>
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { onMounted, ref } from 'vue'

import { useRoute } from 'vue-router'
const route = useRoute()

import { useSearchStore } from '@/store/SearchStore'
const searchStore = useSearchStore()

import { usePageStore } from '@/store/PageStore'
const pageStore = usePageStore()

const emits = defineEmits(['question'])

const overview = ref(null)

const goQuestion = (question) => {
    emits('question', question)
}

const loading = ref(false)

const questions = [
    {
        title: 'Do que trata o Art. 1º',
        link: '#'
    },
    {
        title: 'Simplifique esta norma',
        link: '#'
    },
    {
        title: 'Me explique o Art. 2º',
        link: '#'
    },
]

const save = async (id) => {
    const resp = await searchStore.overView(id)
    overview.value = resp
}

onMounted( async () => {
    loading.value = true
    const resp = await pageStore.getPageNorma({id: route.params.id, num_page: 1})
    overview.value = resp.data[0]?.summary || null
    if(!overview.value) save(route.params.id)
    loading.value = false
})

</script>

<style scoped>

</style>