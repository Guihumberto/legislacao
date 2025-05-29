<template>
     <div class="wrapper">
        <section class="conteudo" ref="topUp" :class="rightWidth > 900 ? 'conteudo1' : 'conteudo2'">
            <div class="mt-2 d-flex ga-2 align-center pa-2">
                <v-icon>mdi-link-variant</v-icon>
                    <h1 class="text-h5">Vínculos</h1>
            </div>
            <p>Selecione o Dispositivo</p>
        </section>
    </div>
</template>

<script setup>
    import { inject } from 'vue';
    const rightWidth = inject('rightWidth')
</script>

<style scoped>
    .wrapper{
        display: flex;
        justify-content: center;
        min-height: 50vh;
        font-family: Arial, sans-serif;
        padding-bottom: 2rem;
    }

    .conteudo {
        margin-top: 1rem;
        padding: 0 20px;
        background-color: #fffdfd;
    }

    .conteudo1 {
        width: 900px;
    }

    .conteudo2 {
        max-width: 900px;
    }

</style>