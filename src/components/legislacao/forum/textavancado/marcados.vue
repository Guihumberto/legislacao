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
     .wrapper {
        display: flex;
        justify-content: center; /* Isso centraliza o 'conteudo' se ele não ocupar 100% da largura do 'wrapper' */
        min-height: 50vh;
        font-family: Arial, sans-serif;
        padding-bottom: 2rem;
        /* Se você quer que o conteúdo ocupe toda a altura do wrapper, adicione: */
        align-items: stretch;
    }

    .conteudo {
        margin-top: 1rem;
        padding: 0 20px;
        background-color: #fffdfd;
        flex-grow: 1; /* Permite que o 'conteudo' se expanda */
        /* 'box-sizing: border-box;' é bom para evitar problemas com padding e largura */
        box-sizing: border-box;
    }

    /* Se a ideia é que 'conteudo1' e 'conteudo2' limitem a largura máxima, mantenha assim: */
    .conteudo1 {
        max-width: 900px; /* Altere de 'width' para 'max-width' para que ele cresça até 900px */
    }

    .conteudo2 {
        max-width: 900px;
    }

</style>