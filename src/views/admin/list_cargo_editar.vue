<template>
  <section>
        <div class="container2">
          <v-container>
              <h1 class="text-h5 my-5">Lista de Concursos</h1>
              <div class="d-flex justify-space-between">
                <v-btn variant="outlined" prepend-icon="mdi-arrow-left" @click="$router.push('/home/admin/')">Voltar</v-btn>
                <v-btn @click="$router.push('/admin/edital_cadastro')" prepend-icon="mdi-account-plus" color="success" variant="flat">Adicionar Cargo</v-btn>
              </div>
              <v-divider class="my-5"></v-divider>
              <v-list v-if="!editalStore.getLoading">
                <v-list-item prepend-icon="mdi-account-tie" :to="`/admin/cargo_editar/${item.id}`" v-for="item, in editalStore.readGetAllEditais" :title="item.cargo" :subtitle="item.concurso">
                </v-list-item>
              </v-list>
              <Loading v-if="editalStore.getLoading"></loading>
          </v-container>
        </div>
  </section>
</template>

<script setup>
    import { onMounted } from 'vue';

    import { useConteudoEditalStore } from '@/store/concursos/ConteudoEditalStore';
    const editalStore = useConteudoEditalStore();
    
    import Loading from '@/components/partiaslLayout/loading.vue';

    onMounted(() => {
        editalStore.getAllEditais();
    });

</script>

<style scoped>

</style>