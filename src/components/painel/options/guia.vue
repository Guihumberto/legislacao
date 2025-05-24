<template>
    <section>
        <div class="mt-5">
            <h1 class="text-h4">Guia de estudos</h1>
            <p class="font-weight-bold">{{ selected?.disciplina }}</p>
            <p>{{ selected.numero }} - {{ selected?.conteudo }}</p>
        </div>
        <div class="mt-5">
            <div class="pa-2 mx-auto" v-for="item,i in typesGuia" :key="i" style="max-width: 500px;">
                <v-card class="text-left" variant="outlined" color="grey">
                    <v-card-title class="text-black d-flex align-center ga-2">
                          <v-icon size="1.5rem">{{ item.icon }}</v-icon>
                           {{ item.title }}
                    </v-card-title>
                    <v-card-text >
                        Crie revisão dos pontos relevantes desse assunto
                    </v-card-text>
                    <v-card-actions>
                        <v-btn variant="outlined" block color="black" @click="generateReview">Gerar</v-btn>
                    </v-card-actions>
                </v-card>
            </div>
        </div>
    </section>
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
        usermaster: {
            type: Boolean,
            default: true,
        },
    })

   const selectGuia = ref('')
   const typesGuia = [
        {
            id: 1,
            title: 'Gerar Questões',
            subtitle: 'Crie revisão dos pontos relevantes desse assunto',
            icon: 'mdi-list-status',
            color: 'grey',
        },
        {
            id: 2,
            title: 'Gerar Revisão',
            subtitle: 'Crie revisão dos pontos relevantes desse assunto',
            icon: 'mdi-file-document-outline',
            color: 'grey',
        },
        {
            id: 3,
            title: 'Gerar Flashcards',
            subtitle: 'Crie revisão dos pontos relevantes desse assunto',
            icon: 'mdi-card-text-outline',
            color: 'grey',
        },
        {
            id: 4,
            title: 'Procurar Súmulas',
            subtitle: 'Crie revisão school pontos relevantes desse assunto',
            icon: 'mdi-account-school',
            color: 'grey',
        },
        {
            id: 5,
            title: 'Procurar Jurisprudências',
            subtitle: 'Crie revisão dos pontos relevantes desse assunto',
            icon: 'mdi-gavel',
            color: 'grey',
        },
        {
            id: 6,
            title: 'Procurar Artigos relevantes',
            subtitle: 'Crie revisão dos pontos relevantes desse assunto',
            icon: 'mdi-numeric-5-box-multiple-outline',
            color: 'grey',
        },
   ]
</script>

<style scoped>

</style>