<template>
    <section>
        <div class="container">
            <h1 class="text-h5">Documentos</h1>
            <div class="text-right mb-2">
                <AddFolderFavortite />
            </div>
            <v-alert v-if="userAreaStore.readLoad">Carregando..</v-alert>
            <ListDocuments v-else-if="userAreaStore.readDocumentos.length" />
            <v-alert v-else type="warning" variant="outlined" text="Não há documentos salvos."></v-alert>
            <h1 class="text-h5 my-10">Coleção de normas</h1>
            <v-alert v-if="userAreaStore.readLoad">Carregando..</v-alert>
            <ListCollection v-else-if="userAreaStore.readCollection.length" />
            <v-alert class="mt-5" v-else type="warning" variant="outlined" text="Não há coleção de normas salvas."></v-alert>
        </div>
    </section>
</template>

<script setup>
    import AddFolderFavortite from '@/components/userArea/addFolder.vue';
    import ListCollection from '@/components/userArea/collection/listCollection.vue';
    import ListDocuments from '@/components/userArea/listDocuments.vue';

    import { useUserAreaStore } from '@/store/AreaUserStore';
    const userAreaStore = useUserAreaStore()

    userAreaStore.getCollection()
    userAreaStore.getDocs()

</script>

<style scoped>
</style>