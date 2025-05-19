<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <h1 class="text-h5 d-flex align-center mb-5"> <v-icon color="#030131" size="1.7rem" class="mr-1">mdi-tools</v-icon>Configurar Normas</h1>
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

    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()


</script>

<style scoped>
    .listFolder{
        display: flex;
        flex-direction: column;
        justify-self: start;
    }
</style>