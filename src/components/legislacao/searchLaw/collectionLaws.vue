<template>
    <div class="mb-10">
        <h5 class="mb-3 text-h6">Coleção de Normas</h5>
        <v-row class="mb-5">
         <v-col cols="12" md="4" v-for="item, i in collectionStore.readCollections" :key="i">
           <v-card
             color="success"
             :subtitle="item.description"
             :title="item.title"
             to="`/text/${item.id}`"
           ></v-card>
         </v-col>
       </v-row>
        <v-btn block>Ver todas</v-btn>
    </div>
</template>

<script setup>
    import { useCollectionStore } from '@/store/CollectionStore';
    const collectionStore = useCollectionStore()

    collectionStore.getCollections()

</script>

<style lang="scss" scoped>

</style>