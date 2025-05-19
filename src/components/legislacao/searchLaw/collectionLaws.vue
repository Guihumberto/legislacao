<template>
    <div class="mt-10" :class=" type == 'resumo' ? 'card' : 'cardComplete'">
        <h5 class="mb-5 text-h6" v-if="collectionStore.readCollections.length">Coleção de Normas</h5>
        <v-alert v-if="collectionStore.readLoad">
          carregando...
        </v-alert>
        <v-row class="mb-5" v-else>
         <v-col cols="12" md="4" v-for="item, i in collectionStore.readCollections" :key="i">
           <v-card
             color="brown-lighten-4"
             variant="flat"
             :subtitle="item.description"
             :title="item.title"
             @click="printAndView(item)"
           ></v-card>
         </v-col>
       </v-row>
       <div class="text-center" v-if="collectionStore.readCollections.length > 5">
         <v-btn variant="text" color="primary" @click="$router.push('/collection_list')" v-if="type == 'resumo'">Ver mais</v-btn>
         <v-pagination
            v-else
            length="1"
            page="1"
         ></v-pagination>
       </div>
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

    const props = defineProps({
      type: String
    })

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
}

.card{
  animation: aparecer 1s ease-in forwards;
  animation-delay: 1s;
  transition: .5s ease;
  opacity: 0;
}

.cardComplete{
  animation: aparecer 1.5s ease-in forwards;
  transition: .5s ease;
  opacity: 0;
}

</style>