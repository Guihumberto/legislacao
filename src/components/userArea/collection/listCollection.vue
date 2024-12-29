<template>
      <v-expansion-panels>
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
            <v-expansion-panel-text>
                <p>{{ item.description }}</p>
                <div class="d-flex justify-space-between align-center">
                    <div class="d-flex align-center">
                        <v-btn 
                            @click="deleteCollection(item)"
                            variant="outlined" color="red" prepend-icon="mdi-delete" class="mr-2">Excluir</v-btn>
                        <v-switch 
                            color="success" 
                            @update:model-value="editIdCollection(item)" v-model="item.publish" hide-details label="Publicar">
                        </v-switch>
                    </div>
                    <small>Criado em : {{ item.dateCreated }}</small>
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
    <ComfirmDelete :doc="document" />
</template>
<script setup>   
    import { useUserAreaStore } from '@/store/AreaUserStore';
    import { useRouter } from 'vue-router';
    import ComfirmDelete from '../comfirmDelete.vue';
    import { ref, provide, watch } from 'vue';
    const userAreaStore = useUserAreaStore()
    const router = useRouter()

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

    const document = ref({
        norma: 'teste'
    })
    const dialog = ref(false)
    const confirmacao = ref(false)

    provide('dialog', dialog)
    provide('confirmacao', confirmacao)

    const deleteCollection = (item) => {
        document.value = item
        dialog.value = true
    } 

     watch(confirmacao, (newConfirm) => {
      document.value.active = false
      userAreaStore.editCollection(document.value)
    })

</script>
<style scoped>
</style>