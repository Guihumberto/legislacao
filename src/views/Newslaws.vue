<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <v-btn variant="text" prepend-icon="mdi-arrow-left" class="ml-n4" @click="$router.push('/legesporlei?news=news')">voltar</v-btn>
            <NewsLaws :type="'complete'" />
        </div>
    </section>
</template>

<script setup>
    import NewsLaws from '@/components/legislacao/elements/newsLaws.vue';

    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()
</script>

<style scoped>

</style>