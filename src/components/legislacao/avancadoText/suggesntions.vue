<template>
    <v-card class="mt-2">
        <v-card-title class="text-center">Visão Geral</v-card-title>
        <v-card-text class="mt-5">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga cupiditate voluptate, 
            libero iste quasi obcaecati autem, fugit ut rem sit dolores laborum eum expedita ullam tempore earum praesentium tempora accusamus.
            </p>
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

const emits = defineEmits(['question'])

const goQuestion = (question) => {
    emits('question', question)
}

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

</script>

<style scoped>

</style>