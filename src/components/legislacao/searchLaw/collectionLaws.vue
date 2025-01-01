<template>
  <v-alert v-if="collectionStore.readLoad">
    carregando...
  </v-alert>
    <div class="my-10" v-else>
        <h5 class="mb-5 text-h6" v-if="collectionStore.readCollections.length">Coleção de Normas</h5>
        <v-row class="mb-5">
         <v-col cols="12" md="4" v-for="item, i in collectionStore.readCollections" :key="i">
           <v-card
             color="green-lighten-3"
             variant="flat"
             :subtitle="item.description"
             :title="item.title"
             @click="printAndView(item)"
           ></v-card>
         </v-col>
       </v-row>
        <v-btn block variant="flat" v-if="false">Ver todas</v-btn>
    </div>
</template>

<script setup>
    import { useRouter } from 'vue-router';
    const router = useRouter()
    import { useUserAreaStore } from '@/store/AreaUserStore'
    const userAreaStore = useUserAreaStore()
    import { useCollectionStore } from '@/store/CollectionStore';
    const collectionStore = useCollectionStore()
    collectionStore.getCollections()

    const printAndView = async (item) => {
        const objeto = {
            name: Date.now(),
            law: item.laws
        }
        await userAreaStore.printAndViewTemp(objeto)
        router.push(`collection_search/${item.id}?search=leges`)
    }
</script>

<style lang="scss" scoped>
div h5 {
  color: #39393a;
  border-left: 8px solid #0063AA;
  padding-left: .5rem;
  background: #ECEFF1;
}

</style>