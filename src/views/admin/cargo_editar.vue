<template>
  <section>
        <div class="container2">
          <v-container>
              <h1 class="text-h5 my-5">Lista de Concursos</h1>
              <div class="d-flex justify-space-between">
                <v-btn variant="outlined" prepend-icon="mdi-arrow-left" @click="$router.push('/admin/list_cargo_editar/')">Voltar</v-btn>
              
              </div>
              <v-divider class="my-5"></v-divider>

              <div>
                {{ editalStore.readEdital }}

                <br> <br>
                <p>listar conteudo</p>
              </div>
             
              <Loading v-if="editalStore.getLoading"></loading>
          </v-container>
        </div>
  </section>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { useRoute } from 'vue-router';

    import { useConteudoEditalStore } from '@/store/concursos/ConteudoEditalStore';
    const editalStore = useConteudoEditalStore();

    import Loading from '@/components/partiaslLayout/loading.vue';

    const route = useRoute();

    onMounted(() => {
        editalStore.getEdital(route.params.id);
    });

</script>

<style scoped>

</style>