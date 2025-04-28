<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <h1 class="text-h5 d-flex align-center"> 
                <v-icon color="#030131" size="1.7rem" class="mr-1">mdi-newspaper-variant-outline</v-icon>
                Publicações em Destaque
            </h1>
            <ListNewsLaws />
        </div>
    </section>
</template>

<script setup>
    import ListNewsLaws from '@/components/Admin/Publish/listNewsLaws.vue';

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