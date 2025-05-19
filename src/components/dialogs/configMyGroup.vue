<template>
        <v-btn variant="text"  icon="mdi-tools" @click="dialog = true"></v-btn>
        <v-dialog
            v-model="dialog"
            width="auto"
        >
            <v-card
                max-width="500"
                prepend-icon="mdi-tools"
                text="Configure seus grupos."
                title="Configurações dos Grupos"
            >
                <v-card-text>
                    <v-list class="pa-0" v-if="groupsList.length">
                        <transition-group name="fade">
                            <v-list-item v-for="item, i in groupsList" :key="item.id" prepend-icon="mdi-forum" link :class="idDelete == item.id ? 'bg-red' : ''">
                                {{ item.title }}
                                <template v-slot:append>
                                    <div v-if="idDelete != item.id">
                                        <v-btn density="compact" variant="text" icon="mdi-delete" color="red" @click.stop="idDelete = item.id"></v-btn>
                                    </div>
                                    <div v-else>
                                        <v-btn variant="text" @click="idDelete = null">Cancelar</v-btn>
                                        <v-btn :loading="load" variant="outlined" @click="deleteItem(item.id)">Excluir</v-btn>
                                    </div>
                                </template>
                            </v-list-item>
                        </transition-group>
                    </v-list>
                    <v-alert v-else variant="outlined" type="info" text="Você não administra nenhum grupo."></v-alert>
                </v-card-text>
                <template v-slot:actions>
                <v-btn
                    class="ms-auto"
                    text="Fechar"
                    @click="dialog = false"
                ></v-btn>
                </template>
            </v-card>
        </v-dialog>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  
  import { useForumStore } from '@/store/ForumStore'
  const forumStore = useForumStore()

  const dialog = ref(false)
  const idDelete = ref(null)
  const load = ref(false)

  const props = defineProps({
    groups: Array
  })

  const cpf = ref('')   

  onMounted(() => {
        const data = sessionStorage.getItem('userData') || localStorage.getItem('userData');
        if (data) {
            cpf.value = JSON.parse(data).cpf
        }
    })

  const groupsList = computed(() => {
        console.log('teste validacao', cpf.value);
        return props.groups.filter( x => x.created_by == cpf.value)
  })


  const deleteItem = async (id) => {
    load.value = true
    await forumStore.deleteMygroup(id)
    console.log('delete', id);
    load.value = false
    idDelete.value = null

    if(route.params.id == id) router.push('/leges')
  }

</script>

<style scoped>

</style>