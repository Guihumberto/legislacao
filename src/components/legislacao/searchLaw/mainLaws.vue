<template>
  <h5 class="mb-3 text-h6">Acessadas frequentemente</h5>
    <v-row class="mb-5">
      <v-col cols="12" md="4" v-for="item, i in resultsSearch.map(x => x._source)" :key="i">
        <v-card

           color="primary"
          :subtitle="nomeTipo(item.tipo)"
          :title="item.title"
          :to="`/text/${item.id}?search=leges`"
        ></v-card>
      </v-col>
    </v-row>
</template>

<script setup>
    import api from "@/services/api"
    import { ref } from "vue";

    import { useGeneralStore } from '@/store/GeneralStore'
    const generalStore = useGeneralStore() 

    const resultsSearch = ref([])

    const getLaws = async () => {
        const response = await api.post("laws_v3/_search", {
            from: 0,
            size: 6,
            query:{
                match:{
                    "description_norm": "7.799 2002"
                }
            }
        })
        resultsSearch.value = response.data.hits.hits;
    }

    const nomeTipo = (item) => {
                let nome = generalStore.fonteNome(item)
                return nome.mudar
    }

    getLaws()


</script>