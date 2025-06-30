<template>
      <section>
        <div class="container2">
            <div class="d-flex justify-space-between">
                <v-btn variant="outlined" prepend-icon="mdi-arrow-left" @click="$router.push('/home/admin/')">Voltar</v-btn>
              </div>
            <h1 class="text-h5 my-5">Lista de Interessados na Aplicação - Pré-cadastro</h1>
            <v-list>
                <v-list-item v-for="item, i in precadstroStore.listPrecadstro" :key="i">
                  {{ i + 1 }} - 
                  {{ item.name }} - {{ item.email }} - {{ item.emailCad }}{{ item.createdAt }}
                </v-list-item>
            </v-list>
        </div>
      </section>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { usePrecadastroStore } from '@/store/concursos/PreCadastroStore';

    const precadstroStore = usePrecadastroStore()

    onMounted( async () => {
      await precadstroStore.fetchPrecadstro()
    })


</script>

<style scoped>

</style>