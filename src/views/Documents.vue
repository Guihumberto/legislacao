<template>
    <section>
        <div class="container">
            <h1 class="text-h5">Documentos</h1>
            <div class="text-right mb-2">
                <AddFolderFavortite />
            </div>
            <ListDocuments v-if="userAreaStore.readDocumentos.length" />
            <v-alert v-else type="warning" variant="outlined" text="Não há documentos salvos."></v-alert>
        </div>
    </section>
</template>

<script setup>
    import AddFolderFavortite from '@/components/userArea/addFolderFavortite.vue';
    import ListDocuments from '@/components/userArea/listDocuments.vue';

    import { useUserAreaStore } from '@/store/AreaUserStore';
    const userAreaStore = useUserAreaStore()

</script>

<style scoped>
    section .container{
        min-height: calc(100vh - 400px);
    }
</style>