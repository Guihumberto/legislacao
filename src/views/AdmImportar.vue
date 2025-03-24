<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <h1 class="text-h5 d-flex align-center"> <v-icon color="#030131" size="1.7rem" class="mr-1">mdi-paperclip</v-icon>Importar Normas</h1>
            <Formulario />
            <RecentlyAdded />
        </div>
    </section>
</template>

<script setup>
    import Formulario from '@/components/Admin/Indexar/formulario.vue';
    import RecentlyAdded from '@/components/Admin/Indexar/recentlyAdded.vue';

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