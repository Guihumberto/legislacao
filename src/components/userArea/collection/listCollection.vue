<template>
    <loading v-if="userAreaStore.readLoad" />
    <div v-else>
        <v-expand-transition>
            <v-expansion-panels class="expansion" flat>
                <div class="w-100 ml-5">
                    <v-list-subheader v-if="userAreaStore.readCollection.length">Quantidade de documentos: {{ userAreaStore.readTotalCollection }}</v-list-subheader>
                </div>
              <v-expansion-panel
                v-for="item, i in userAreaStore.readCollection"
                :key="i"
              >
                  <v-expansion-panel-title expand-icon="mdi-menu-down">
                      <div class="d-flex justify-space-between w-100">
                          <h5 class="text-h6">{{ item.title }}</h5>
                          <v-btn variant="outlined" color="primary" @click.stop="openCollection(item)">abrir</v-btn>
                      </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text class="border">
                      <pre class="mb-2">{{ item.description }}</pre>
                      <small>Criado em: {{ useDateNow(item.dateCreated) }}</small>
                      <div class="d-flex justify-space-between align-center">
                          <div class="d-flex align-center justify-space-between w-100 px-2 bg-grey-lighten-2" v-if="idDelete != item.id">
                            <v-tooltip text="Publicar coleção">
                                <template v-slot:activator="{ props }">
                                    <v-switch 
                                        v-bind="props"
                                        color="success" 
                                        :loading="userAreaStore.readLoadLocal"
                                        @update:model-value="editIdCollection(item)" v-model="item.publish" hide-details label="Publicar">
                                    </v-switch>
                                </template>
                            </v-tooltip>
    
                            <v-tooltip text="Excluir coleção">
                                <template v-slot:activator="{ props }">
                                    <v-btn 
                                        v-bind="props"
                                        @click="deleteCollection(item)"
                                        variant="text" color="red" icon="mdi-delete" class="mr-2"
                                    ></v-btn>
                                </template>
                            </v-tooltip>
                             
                          </div>
                          <v-card variant="outlined" color="error" class="delete d-flex py-2 align-center justify-space-between w-100 px-2" v-else>
                            <p>Deseja realmente apagar esta coleção?</p>
                            <v-spacer></v-spacer>
                            <div class="action">
                                <v-btn variant="text" @click="idDelete = null">Cancelar</v-btn>
                                <v-btn variant="flat" color="red" @click="deleteCollectionElastic(item)">Apagar</v-btn>
                            </div>
                        </v-card>
                          
                      </div>
                      <v-list>
                          <v-list-item 
                              v-for="ind, x in item.laws" :key="x" 
                              :subtitle="`${ind.tipo} - ${ind.ano}`"
                              link
                          >
                              <template v-slot:prepend>
                                  <v-icon icon="mdi-file-document"></v-icon>
                              </template>
                              <span>{{ ind.title }} - total pag. {{ ind.total_pages }}</span>
                              <template v-slot:append>
                                  {{ x + 1 }}
                              </template>
                          </v-list-item>
                      </v-list>
                  </v-expansion-panel-text>
              </v-expansion-panel>
          </v-expansion-panels>
        </v-expand-transition>
        <v-pagination 
                 :length="Math.ceil(userAreaStore.readTotalCollection/userAreaStore.readPagination.perPage)"
                 v-model="userAreaStore.pagination.page"
                 density="compact"
                 class="mt-5"
                 v-if="userAreaStore.readCollection.length"
        ></v-pagination>
        <v-alert class="mt-5" v-if="!userAreaStore.readCollection.length" type="warning" variant="outlined" text="Não há coleção de normas salvas."></v-alert> 
        <LoadEmbbedings />
    </div>
</template>
<script setup>   
    import { ref, provide, watch, onMounted } from 'vue';
    import { useUserAreaStore } from '@/store/AreaUserStore';
    import { useRouter, useRoute } from 'vue-router';
    import { useDateNow } from '@/composables/dateFormat';

    import loading from './../load.vue';
    import LoadEmbbedings from './loadEmbbedings.vue';
    
    const userAreaStore = useUserAreaStore()
    
    const router = useRouter()
    const route = useRoute()

    const openCollection = async (item) => {
        const objeto = {
            name: Date.now(),
            law: item.laws
        }
        await userAreaStore.printAndViewTemp(objeto)
        router.push(`/collection_search/${item.id}`)
    }

    const editIdCollection =  (item) => {
        setTimeout(() => {
            userAreaStore.editCollection(item)
        }, 1000)
    }

    const idDelete = ref(null)

    const deleteCollection = (item) => {
        idDelete.value = item.id
    } 

    const deleteCollectionElastic = (item) => {
        item.active = false
        userAreaStore.editCollection(item)
        idDelete.value = null
    }

    watch(
        () => userAreaStore.pagination.page,
            (newValue, oldValue) => {
                userAreaStore.pagination.start = userAreaStore.pagination.page * userAreaStore.readPagination.perPage - userAreaStore.readPagination.perPage + 1
                userAreaStore.getCollection()
                router.push(`documents?tab=${route.query.tab}&page=${userAreaStore.pagination.page}`)
            }
    );

    onMounted(() => {
        if(route.query.page){
            // userAreaStore.pagination.page = parseInt(route.query.page)
            // userAreaStore.pagination.start = userAreaStore.pagination.page * userAreaStore.readPagination.perPage - userAreaStore.readPagination.perPage + 1
            // userAreaStore.getCollection()
        }
    })

    

    provide('dialog', userAreaStore.readLoadSaveEmbbeding)

</script>
<style scoped>
    .expansion{
        animation: aparecer .5s ease-in forwards;
        opacity: 0;
    }
    .delete .action{
        animation: aumentar .5s ease;
    }
    @keyframes aumentar {
        0%{
            opacity: 0;
            transform: translateX(-300px);
        }
        100%{
            opacity: 1;
            transform: translateX(0);
        }
    }
</style>