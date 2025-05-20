<template>
   <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <div class="d-flex align-center justify-space-between mt-5">
                <v-btn @click="$router.push('/areauser')" variant="text" prepend-icon="mdi-arrow-left">Voltar</v-btn>
                <h1 class="text-h5 d-flex align-center"> <v-icon color="#030131" size="1.7rem" class="mr-1">mdi-account</v-icon>Concurso</h1>
                <v-btn icon="mdi-information" variant="text"></v-btn>
            </div>
            <v-divider class="my-5"></v-divider>
        </div>
    </section>
</template>

<script setup>
    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()
 
</script>

<style scoped>

</style>