<template>
    <div v-if="forumStore.readGroupForum._id" class="mt-5">
        <div class="wrapper">
            <div class="d-flex justify-space-between">
                <div>
                    <b>{{ forumStore.readGroupForum._source.title }}</b> <br>
                    {{ forumStore.readGroupForum._source.description }} <br><br>
                </div>
                <v-btn variant="text" @click="showDet = !showDet" :icon="showDet ? 'mdi-eye' : 'mdi-eye-off'"></v-btn>
            </div>
            <v-expand-transition>
                <div v-if="showDet">
                    <p :class="forumStore.readGroupForum._source.open ? 'text-success' :'text-red'" v-text="forumStore.readGroupForum._source.open ? 'Aberto para comentários':'Fechado comentários para não participantes do grupo'"></p>
                    <small>Data de Criação do grupo: {{ forumStore.readGroupForum._source.data_include }}</small> <br><br>
                    <v-list class="pa-0 border mb-2 bg-transparent" density="compact" v-if="forumStore.readGroupForum._source.group.length">
                        <v-list-subheader>Participantes</v-list-subheader>
                        <v-list-item v-for="item, i in forumStore.readNameGorup">{{ item.name }}</v-list-item>
                    </v-list>
                    
                    <v-btn 
                        color="success"
                        variant="outlined" prepend-icon="mdi-account-plus" 
                        v-if="loginStore.readLogin.cpf == forumStore.readGroupForum._source.created_by" 
                        @click="getSolipendentes">Incluir novos participantes</v-btn>

                    <transition name="fade">
                        <div class="mt-2" v-if="addParticipante">
                            <v-form @submit.prevent="addSaveParticipante" ref="form">
                                <v-autocomplete
                                    v-model="selectedUser"
                                    variant="outlined"
                                    density="compact"
                                    :items="userOptions"
                                    :loading="loading"
                                    v-model:search="search"
                                    label="Buscar usuário"
                                    item-title="name"
                                    item-value="cpf"
                                    hide-details
                                    :rules="[ rules.required, rules.minfield ]"
                                    clearable
                                />
                                <v-btn class="mt-5" color="primary" type="submit" prepend-icon="mdi-email">Enviar Convite</v-btn>
                            </v-form>

                            <v-list class="pa-0 mt-5" density="compact" v-if="forumStore.readSolicitationPendentes.length">
                                <v-list-subheader>Convites enviados pendentes</v-list-subheader>
                                <v-list-item link v-for="item, i in forumStore.readSolicitationPendentes" :key="i">
                                    {{ item.idUser }}
                                    <template v-slot:append>
                                        <v-btn variant="text" disabled>
                                            cancelar
                                        </v-btn>
                                    </template>
                                </v-list-item>
                            </v-list>
                        </div>
                    </transition>
                    <div v-if="!isComment">
                        <v-btn 
                            variant="flat" 
                            prepend-icon="mdi-email" color="success" 
                            v-if="!isExistSolicitation" 
                            @click="sendSolicitation" :loading="loading" :disabled="loading">Pedir para participar do grupo</v-btn>
                        <v-alert v-else type="info" text="Seu convite foi enviado, aguarde sua liberação pelo administrador do grupo.">
                            <template v-slot:append>
                                <v-btn disabled @click="editSolicitation(false)">Cancelar o pedido</v-btn>
                            </template>
                        </v-alert>
                    </div>
                </div>
            </v-expand-transition>
        </div>
    </div>
</template>

<script setup>
    import { computed, onMounted, ref, watch } from 'vue';

    import debounce from 'lodash.debounce'

    import { useForumStore } from '@/store/ForumStore';
    const forumStore = useForumStore()
    
    import { useLoginStore } from '@/store/LoginStore';
    const loginStore = useLoginStore()
    
    import { useRouter, useRoute } from 'vue-router';
    const route = useRoute()
    const router = useRouter()

    const addParticipante = ref(false)
    const form = ref(null)
    const showDet = ref(true)

    watch(() => showDet.value, () => {
        router.push({
            query: {
                ...route.query,
                det: showDet.value
            }
        })
    })

    const rules = {
        required: value => !!value || "campo obrigatório", 
        minfield: (v) => (v||'').length >= 3 || "Mínimo 4 caracteres",
    }

    onMounted( async () => {
        await forumStore.getSolicitations()
        route.query.det == 'true' ? showDet.value = true : showDet.value = false
    })

    const isComment = computed(() => {
        const cpf = loginStore.readLogin.cpf
        const grupo = forumStore.readGroupForum._source
        const participantes = [ ...grupo.group, grupo.created_by ]

        return grupo.open
        ? true
        : !!participantes.find( x => x == cpf)

    })

    const sendSolicitation = async (cancelar = true) => {
        loading.value = true
        await forumStore.sendSolicitation({ id: forumStore.readGroupForum._id, ...forumStore.readGroupForum._source }, true)
        loading.value = false
    }

    const isExistSolicitation = computed(() => {
        const list = forumStore.readSolicitation.find( x => x.idGroup == forumStore.readGroupForum._id)
        return !!list
    })

    const editSolicitation = (cancelar) => {
        console.log('edit', cancelar);
    }

    const addSaveParticipante = async () => {
          const { valid } = await form.value.validate()

          if(valid) {
            await forumStore.sendSolicitation({ id: forumStore.readGroupForum._id, ...forumStore.readGroupForum._source }, false, selectedUser.value)
            search.value = ''
            selectedUser.value = null
          }     
    }

    const search = ref('')
    const selectedUser = ref(null)
    const userOptions = ref([])
    const loading = ref(false)

    const fetchUsers = async (query) => {
        if (!query) {
            userOptions.value = []
            return
        }
        
        loading.value = true

        try {
            const resp = await loginStore.searchTimeRealUser(query)
            userOptions.value = resp
        } catch (error) {
            console.error('Erro ao buscar usuários:', error)
            userOptions.value = []
        } finally {
            loading.value = false
        }
    }

    // Usar debounce para evitar chamadas a cada tecla
    const debouncedFetch = debounce((val) => {
        fetchUsers(val)
    }, 300)

    // Assiste mudanças no input de busca
    watch(search, (val) => {
        debouncedFetch(val)
    })

    const getSolipendentes = async () => {
        addParticipante.value = !addParticipante.value
        console.log('res');
        await forumStore.getSolicitationPendentes(forumStore.readGroupForum._id)
    }

</script>

<style scoped>
.wrapper{
    padding: 1rem;
    border: 1px solid rgb(207, 203, 203);
    border-radius: 8px;
    transition: 1s ease;
}
</style>