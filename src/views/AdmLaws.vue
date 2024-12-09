<template>
    <section>
        <div class="container">
            <h1 class="text-h5">Configurar Normas</h1>
            <Buscar />
            <NormasList />
            <Pagination />
        </div>
    </section>
</template>

<script setup>
import Buscar from '@/components/Admin/Normas/buscar.vue';
import NormasList from '@/components/Admin/Normas/NormasList.vue';
import Pagination from '@/components/Admin/Normas/pagination.vue';


</script>

<style scoped>
    section .container{
        min-height: calc(100vh - 400px);
    }
    .listFolder{
        display: flex;
        flex-direction: column;
        justify-self: start;
    }
</style>