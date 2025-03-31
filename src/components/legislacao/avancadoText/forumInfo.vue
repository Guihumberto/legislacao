<template>
      <v-btn @click="dialog = true" class="text-lowercase" variant="text" prepend-icon="mdi-forum" text="Abrir Discurssão"></v-btn>
  
      <v-dialog
        v-model="dialog"
        width="auto"
        persistent
      >
        <v-card
          max-width="400"
          prepend-icon="mdi-forum"
          text="A partir da norma, crie um grupo para comentar os dispositivos, fazer ou responder a perguntas, explicar artigos entre outras coisas."
          title="Abrir Discussão"
        >
            <v-card-text>
                <div class="mb-5">
                  <h5 class="mb-5">{{ title }}</h5>
                  <v-btn v-if="!start" color="success" @click="startForum" block :loading="load">Iniciar</v-btn>
                </div>

                <div class="mb-5" v-if="groupsForum.total && !showForms && !confirm">
                  <v-alert type="info" text="Já existe grupo criado para esta norma."></v-alert>
                  <!-- existe grupo -->
                  <div class="mt-5" v-if="!showGroup">
                    <p>O que deseja fazer?</p>
                    <div class="d-flex justify-center ga-1 mt-2">
                      <div class="border pa-2 text-center" @click="showGroup = true">
                        Pedir para <br>  participar do grupo <br>  existente
                      </div>
                      <div class="border pa-2 d-flex align-center" @click="showForms = true">
                        Criar novo Grupo
                      </div>
                    </div>
                  </div>
                  <!-- mostrar grupo -->
                  <div v-if="showGroup">
                    <v-btn @click="showGroup = false">Voltar</v-btn>
                    <v-list class="pa-0" density="compact">
                      <v-list-item link v-for="item, i in 5" :key="i" @click="solicitationGetIn(item)">Grupos/responsavel</v-list-item>
                    </v-list>
                  </div>
                </div>

                <v-form @submit.prevent="createForum" ref="formref" v-if="showForms">
                  <v-btn v-if="groupsForum.total" variant="outlined" class="mb-4" @click="showForms = false">Voltar</v-btn>
                  <v-text-field
                    label="Nome do Forum"
                    density="compact"
                    variant="outlined"
                    placeholder="Nomei seu forum de discussão"
                    :rules="[rules.required, rules.minname]"
                    clearable
                    v-model="form.title"
                  ></v-text-field>
                  <v-autocomplete
                    label="Grupo"
                    density="compact"
                    variant="outlined"
                    class="my-2"
                    clearable
                    placeholder="Adicione pessoas ao seus grupo"
                    v-model="form.group"
                  ></v-autocomplete>
                  <v-textarea
                    label="Descrição do grupo"
                    density="compact"
                    variant="outlined"
                    placeholder="Fale sobre os objetivos dessa discussão"
                    clearable
                    v-model="form.description"
                  ></v-textarea>
                  <v-checkbox
                    density="compact"
                    label="Abrir para não participantes do grupo"
                    hide-details
                    v-model="form.open"
                  ></v-checkbox>
                  <div class="mt-5 text-center">
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
    import { inject, ref } from 'vue'

    import { useRoute } from 'vue-router'
    const route = useRoute()

    import { useForumStore } from '@/store/ForumStore'
    const forumStore = useForumStore()

    const textlaw = inject('textlaw')

    const props = defineProps({
      title: String
    })
  
    const dialog = ref(false)
    const start = ref(false)
    const confirm = ref(false)
    const load = ref(false)
    const error = ref(null)

    const form = ref({
      idLaw: route.params.id, 
      title: null,
      description: null,
      group: [],
      open: false
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
        error.value = resp.code
        idU.value = resp.id
      }
    }

    const solicitationGetIn = (item) => {
      console.log('pedir para participar do grupo');
    }

  </script>