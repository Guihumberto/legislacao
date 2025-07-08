<template>
      <v-btn @click="dialog = true" variant="tonal" color="primary" prepend-icon="mdi-download-box" text="IMPORTAR NORMA" :disabled="!loginStore.readLogin?.cpf"></v-btn>
  
      <v-dialog
        v-model="dialog"
        width="auto"
        persistent
      >
        <v-card
          max-width="400"
          prepend-icon="mdi-download-box"
          text="Ao importar uma norma é possível inserir comentários nos dispositivos, fazer ou responder a perguntas, explicar artigos, resolver questões, criar resumos e muito mais."
          title="Importar norma"
        >
            <v-card-text>
                <div class="mb-5">
                  <h5 class="mb-5 pa-2 bg-primary border rounded-lg">{{ title }}</h5>
                  <v-alert v-if="info.import" variant="outlined" color="error" text="Esta norma já foi importada para sua área do usuário." class="mb-5">
                     <template v-slot:append>
                          <v-btn @click="$router.push(`/avancado/forumlaw/${info.id}?det=false`)" variant="flat" color="primary">Acessar</v-btn>
                      </template>
                  </v-alert>
                  <v-btn v-if="!start" color="success" @click="importarLaw" block :loading="load">importar</v-btn>
                </div>

                <v-form @submit.prevent="createForum" ref="formref" v-if="showForms">
                  <v-btn v-if="groupsForum.total" variant="outlined" class="mb-4" @click="showForms = false">Voltar</v-btn>
                  <v-text-field
                    label="Nome da Norma"
                    density="compact"
                    variant="outlined"
                    placeholder="Nomei seu forum de discussão"
                    :rules="[rules.required, rules.minname]"
                    clearable
                    v-model="form.title"
                  ></v-text-field>

                  <v-textarea
                    label="Descrição"
                    density="compact"
                    variant="outlined"
                    placeholder="Fale sobre os objetivos desse estudo (opcional)"
                    v-model="form.description"
                  ></v-textarea>

                  <v-tooltip text="Ao abrir para não parcipantes será possível que outras pessoas vejam suas anotações e comentários." location="top" width="300">
                    <template v-slot:activator="{ props }">
                       <v-checkbox
                        v-bind="props"
                        density="compact"
                        label="Abrir para não participantes do grupo"
                        hide-details
                        v-model="form.open"
                      ></v-checkbox>
                    </template>
                  </v-tooltip>

                  <div class="mt-5 text-center">
                     <v-btn variant="text" class="mr-2" @click="start = false, showForms = false">cancelar</v-btn>
                    <v-btn color="primary" type="submit" >Criar Forum</v-btn>
                  </div>
                </v-form>

                <!-- confirmação -->
                <div class="mt-5" v-if="confirm">
                  <div v-if="forumStore.readLoad">
                    Criando forum de discussão... Aguarde!
                  </div>
                  <div v-else>
                    <v-alert v-if="error == 201" type="success" text="Forum de discussão criado">
                      <template v-slot:append>
                        <v-btn @click="$router.push(`forumlaw/${idU}`)" variant="text" color="primary" block>Entrar</v-btn>
                      </template>
                    </v-alert>
                    <v-alert v-else type="error" text="Ocorreu um erro!"></v-alert>
                  </div>
                </div>

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
    import { inject, ref, watch, computed, onMounted } from 'vue'
    import debounce from 'lodash.debounce'
    import { useRoute } from 'vue-router'
    import { useForumStore } from '@/store/ForumStore'
    import { useLoginStore } from '@/store/LoginStore';

    const route = useRoute()
    const forumStore = useForumStore()
    const loginStore = useLoginStore()
    const textlaw = inject('textlaw')

    const props = defineProps({
      title: String
    })
    
    const idLaw = route.params.id
    const dialog = ref(false)
    const start = ref(false)
    const confirm = ref(false)
    const load = ref(false)
    const error = ref(null)

    const info = computed(() => {
        const find = forumStore.readMyGroup.find(item => item.idLaw == idLaw)
        return find
        ? { type: 'success', text: 'Você já importou esta norma!', import: true, id: find.id }
        : { type: 'warning', text: 'Você ainda não importou esta norma!', import: false, id: false }
    })

    const form = ref({
      idLaw: route.params.id, 
      title: null,
      nameLaw: null,
      description: null,
      group: [],
      open: false,
      active: true
    })

    const rules = ref({
        required: (value) => !!value || "Campo obrigatório",
        minname: (v) => (v||'').length >= 3 || "Mínimo 3 caracteres",
    })

    const groupsForum = ref({
      total: 0,
      _source: []
    })

    const showForms = ref(false)

    const actionShowForm = () => {
      if(!groupsForum.value.total) showForms.value = true
    }

    const atribuirName = () => {
      form.value.title = props.title
      form.value.nameLaw = props.title
    }

    const importarLaw = () => {
      atribuirName()
      showForms.value = true
      start.value = true
    }

    const startForum = async () => {
      load.value = true
      const resp = await forumStore.forumExist(route.params.id)
      groupsForum.value = { total: resp.total, _source: resp._source }
      start.value = true
      actionShowForm()
      load.value = false
    }

    const formref = ref(null)
    const idU = ref(null)

    const createForum = async () => {
      const { valid } = await formref.value.validate()
      if(valid){
        showForms.value = false
        confirm.value = true
        const resp = await forumStore.createForum(form.value, textlaw.value)
        if(selectedUser.value.length) saveGroup({ id: resp.id, ...form.value })
        error.value = resp.code
        idU.value = resp.id
      }
    }

    const saveGroup = async (item) => {
      for (const cpf of selectedUser.value) {
        await forumStore.sendSolicitation(item, false, cpf);
      }
    }

    const solicitationGetIn = (item) => {
      console.log('pedir para participar do grupo');
    }

    const search = ref('')
    const selectedUser = ref([])
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

    watch(selectedUser, (vale) => {
      search.value = ''
    })

    onMounted(() => {
      atribuirName()
    })

  </script>