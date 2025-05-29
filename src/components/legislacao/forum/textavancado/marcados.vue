<template>
    <div class="wrapper">
        <section class="conteudo" ref="topUp">
            <div class="mt-2 d-flex ga-2 align-center pa-2">
                <v-icon>mdi-marker</v-icon>
                <h1 class="text-h5">Marcados</h1>
            </div>
            <v-divider></v-divider>
            <div v-for="text in listTextLaw" :key="text.id">
                <v-tooltip :text="`Artigo ${text.art}`">
                    <template v-slot:activator="{ props }">
                        <p  v-bind="props"  class="pa-2" v-html="text.textlaw"></p>
                    </template>
                </v-tooltip>
            </div>
        </section>
    </div>
</template>

<script setup>
    import { computed, inject } from 'vue';

    const textLaw = inject('listFinal')

    const contemEstilo = /<b>|<strong>|<u>|<ins>|<s>|<strike>|<del>|style\s*=\s*["'].*color\s*:|<span[^>]*color\s*:/i;

    const listTextLaw = (computed(() => {
        const filtrados = textLaw.value.filter(item => contemEstilo.test(item.textlaw));
        return filtrados
    }))

</script>

<style scoped>
    .wrapper{
        display: flex;
        justify-content: center;
        height: 100%;
        font-family: Arial, sans-serif;
    }

    .conteudo {
        margin-top: 1rem;
        padding: 0 20px;
        background-color: #fffdfd;
        max-width: 900px;
    }

</style>