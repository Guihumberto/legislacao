<template>
    <section>
        <v-btn-toggle v-model="viewMode" mandatory class="mr-2" density="compact">
            <v-btn value="1">
                <v-icon>mdi-format-list-bulleted</v-icon>
                <span class="d-none d-sm-inline ml-1">Assuntos Relevantes</span>
            </v-btn>
            <v-btn value="2">
                <v-icon>mdi-gavel</v-icon>
                <span class="d-none d-sm-inline ml-1">Questões</span>
            </v-btn>
            <v-btn value="3">
                <v-icon>mdi-gavel</v-icon>
                <span class="d-none d-sm-inline ml-1">Guia de Estudos</span>
            </v-btn>
            <v-btn value="4">
                <v-icon>mdi-gavel</v-icon>
                <span class="d-none d-sm-inline ml-1">Resumo</span>
            </v-btn>
        </v-btn-toggle>
    </section>
</template>

<script setup>
    import { ref } from 'vue';
    const viewMode = ref('full');
   
</script>

<style scoped>

</style>