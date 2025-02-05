<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <h1 class="text-h5 d-flex align-center"> <v-icon color="#030131" size="1.7rem" class="mr-1">mdi-format-list-bulleted-square</v-icon>Fonte das Normas</h1>
            <ListFontes />
        </div>
    </section>
</template>

<script setup>
    import ListFontes from '@/components/Admin/Fonte/ListFontes.vue';

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