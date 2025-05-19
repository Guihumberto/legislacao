<template>
    <div class="my-10 card" v-if="lawStore.readMainLaws.length">
      <h5 class="mb-5 text-h6">Acessadas frequentemente</h5>
      <v-alert v-if="lawStore.readLoad">
        carregando...
      </v-alert>
      <v-row class="mb-5" v-else>
        <v-col cols="12" md="4" v-for="item, i in lawStore.readMainLaws" :key="i">
          <v-card
            color="blue-grey-lighten-4"
            variant="flat"
            :subtitle="nomeTipo(item.tipo)"
            :title="item.title"
            :to="`/text/${item.id}?search=leges`"
          ></v-card>
        </v-col>
      </v-row>
  </div>
</template>

<script setup>
    import { useGeneralStore } from '@/store/GeneralStore'
    const generalStore = useGeneralStore() 

    import { useLawStore } from '@/store/LawsStore';
    const lawStore = useLawStore()

    const nomeTipo = (item) => {
                let nome = generalStore.fonteNome(item)
                return nome.mudar
    }

</script>

<style scoped>
  div h5 {
    color: #39393a;
    border-left: 8px solid #0063AA;
    padding-left: .5rem;
  }

  .card{
    animation: aparecer 1s ease-in;
    transition: 1s ease;
  }
</style>