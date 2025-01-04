<template>
     <section>
        <div class="container">
            <div v-if="LawsStore.readLoad" class="load">
                <v-progress-circular
                        :size="50"
                        color="primary"
                        indeterminate
                    ></v-progress-circular>
            </div>
            <v-card
                class="mx-auto"
                variant="outlined"
                color="grey"
                v-else
            >
                <v-toolbar color="#050451">

                    <v-toolbar-title>Adicionados recentemente</v-toolbar-title>

                    <v-spacer></v-spacer>

                    <v-btn variant="text" icon="mdi-magnify"></v-btn>
                </v-toolbar>

                <v-list
                    lines="two"
                    class="pa-0"
                >
                  <v-list-item 
                    link 
                    v-for="item, i in allLaw" :key="i"
                  >
                    <template v-slot:prepend>
                      <v-avatar color="grey-lighten-1">
                        <v-icon color="white">mdi-file</v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title>
                      {{ item._source.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ item._source.data_include }}
                    </v-list-item-subtitle>
                    <template v-slot:append>
                      <a class="openLaw" :href="`text/${item._source.id}?search=leges`" target="_blank"><v-icon color="primary" class="border">mdi-arrow-right</v-icon></a>
                    </template>
                  </v-list-item>
                  <v-list-item>
                    <v-btn disabled block variant="text" color="primary">Ver mais</v-btn>
                  </v-list-item>
                </v-list>
            </v-card>
        </div>
    </section>
</template>

<script setup>
  import { useLawStore } from '@/store/LawsStore';
  import { onMounted, ref } from 'vue';
  const LawsStore = useLawStore()

  const allLaw = ref(false)

  onMounted(async() => {
      const resp = await LawsStore.asyncGetLastLawsAdd()
      allLaw.value = resp
  })
 
</script>

<style scoped>
.load{
    height: 60vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
