<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <v-btn variant="text" prepend-icon="mdi-arrow-left" class="ml-n4" @click="$router.push('/legesporlei')">voltar</v-btn>
             <CollectionLaws :type="'complete'" />
        </div>
    </section>
</template>

<script setup>
    import CollectionLaws from '@/components/legislacao/searchLaw/collectionLaws.vue';

    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()
</script>

<style scoped>

</style>