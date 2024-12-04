<template>
    <section>
        <div class="container">
            <h1 class="text-h5">Documentos</h1>
            <div class="text-right mb-2">
                <AddFolderFavortite />
            </div>
            <ListDocuments />
        </div>
    </section>
</template>

<script setup>
import AddFolderFavortite from '@/components/userArea/addFolderFavortite.vue';
import ListDocuments from '@/components/userArea/listDocuments.vue';


</script>

<style scoped>
    section .container{
        min-height: calc(100vh - 400px);
    }
</style>