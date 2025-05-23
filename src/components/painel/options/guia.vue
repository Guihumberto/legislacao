<template>
    <section>
        <div>
            <h1>Guia De estudo</h1>
        </div>
        <div class="d-flex justify-center">
            <v-chip-group v-model="select" active-class="primary--text" column>
                <v-chip v-for="type, t in typesGuia">{{ type.title }}</v-chip>
            </v-chip-group>
        </div>
        <div class="mt-5 border rounded-lg" style="min-height: 54vh;">
        </div>
    </section>
</template>

<script setup>
   import { ref } from 'vue';

   const select = ref('')
   const typesGuia = [
        {
            id: 1,
            title: 'Questões',
            icon: 'mdi-file-document-outline',
            color: 'grey',
        },
        {
            id: 2,
            title: 'Resumo',
            icon: 'mdi-file-document-outline',
            color: 'grey',
        },
        {
            id: 3,
            title: 'Flashcards',
            icon: 'mdi-file-document-outline',
            color: 'grey',
        },
        {
            id: 4,
            title: 'Súmulas',
            icon: 'mdi-file-document-outline',
            color: 'grey',
        },
        {
            id: 5,
            title: 'Jurisprudências',
            icon: 'mdi-file-document-outline',
            color: 'grey',
        },
        {
            id: 6,
            title: 'Artigos relevantes',
            icon: 'mdi-file-document-outline',
            color: 'grey',
        }
   ]
</script>

<style scoped>

</style>