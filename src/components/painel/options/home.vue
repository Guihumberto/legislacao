<template>
    <section>
        <v-btn-toggle v-model="options" mandatory class="mr-2" density="compact" color="primary">
            <v-btn value="1">
                <v-icon>mdi-alert-box-outline</v-icon>
                <span class="d-none d-sm-inline ml-1">Assuntos Relevantes</span>
            </v-btn>
            <v-btn value="2">
                <v-icon>mdi-format-list-checks</v-icon>
                <span class="d-none d-sm-inline ml-1">Questões</span>
            </v-btn>
            <v-btn value="3">
                <v-icon>mdi-chart-sankey-variant</v-icon>
                <span class="d-none d-sm-inline ml-1">Guia de Estudos</span>
            </v-btn>
            <v-btn value="4">
                <v-icon>mdi-text-box-edit-outline</v-icon>
                <span class="d-none d-sm-inline ml-1">Resumo</span>
            </v-btn>
        </v-btn-toggle>
    </section>
</template>

<script setup>
    import { inject, ref } from 'vue';
    const options = inject('options');
   
</script>

<style scoped>

</style>