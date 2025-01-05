<template>
    <section>
        <div class="container">
            <h1 class="text-h5">Importar Normas</h1>
            <Formulario />
        </div>
    </section>
</template>

<script setup>
    import Formulario from '@/components/Admin/Indexar/formulario.vue';

</script>

<style scoped>
    .listFolder{
        display: flex;
        flex-direction: column;
        justify-self: start;
    }
</style>