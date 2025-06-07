<template>
   <section>
        <div class="container2">
          <v-container>
              <h1 class="text-h5 my-5">Lista de Concursos</h1>
              <div class="d-flex justify-space-between">
                <v-btn variant="outlined" prepend-icon="mdi-arrow-left" @click="$router.push('/admin/list_cargo_editar/')">Voltar</v-btn>
              </div>
              <v-divider class="my-5"></v-divider>

              <v-card class="pa-4" elevation="2" v-if="!editalStore.getLoading">
                <v-card-title class="text-h5 mb-4">
                  Edital/Cargo
                </v-card-title>

                <v-card-text>
                  <v-row>
                    <!-- ID (não editável) -->
                    <v-col cols="12" md="6">
                      <v-card 
                        variant="outlined" 
                        class="pa-3 mb-2"
                        color="grey-lighten-2"
                      >
                        <div class="text-caption text-grey-darken-1 mb-1">ID</div>
                        <div class="text-body-1">{{ formData.id }}</div>
                      </v-card>
                    </v-col>

                    <!-- Cargo -->
                    <v-col cols="12" md="6">
                      <v-card 
                        variant="outlined" 
                        class="pa-3 mb-2 cursor-pointer hover-card"
                        :class="{ 'editing': editingField === 'cargo' }"
                        @click="startEditing('cargo')"
                      >
                        <div class="text-caption text-grey-darken-1 mb-1">Cargo</div>
                        <div v-if="editingField !== 'cargo'" class="text-body-1">
                          {{ formData.cargo }}
                        </div>
                        <v-text-field
                          v-else
                          v-model="formData.cargo"
                          density="compact"
                          hide-details
                          autofocus
                          @blur="stopEditing"
                          @keydown.enter="stopEditing"
                          @keydown.esc="cancelEditing"
                        />
                      </v-card>
                    </v-col>

                    <!-- Banca -->
                    <v-col cols="12" md="6">
                      <v-card 
                        variant="outlined" 
                        class="pa-3 mb-2 cursor-pointer hover-card"
                        :class="{ 'editing': editingField === 'banca' }"
                        @click="startEditing('banca')"
                      >
                        <div class="text-caption text-grey-darken-1 mb-1">Banca</div>
                        <div v-if="editingField !== 'banca'" class="text-body-1">
                          {{ formData.banca }}
                        </div>
                        <v-text-field
                          v-else
                          v-model="formData.banca"
                          density="compact"
                          hide-details
                          autofocus
                          @blur="stopEditing"
                          @keydown.enter="stopEditing"
                          @keydown.esc="cancelEditing"
                        />
                      </v-card>
                    </v-col>

                    <!-- Ano -->
                    <v-col cols="12" md="6">
                      <v-card 
                        variant="outlined" 
                        class="pa-3 mb-2 cursor-pointer hover-card"
                        :class="{ 'editing': editingField === 'ano' }"
                        @click="startEditing('ano')"
                      >
                        <div class="text-caption text-grey-darken-1 mb-1">Ano</div>
                        <div v-if="editingField !== 'ano'" class="text-body-1">
                          {{ formData.ano }}
                        </div>
                        <v-text-field
                          v-else
                          v-model.number="formData.ano"
                          type="number"
                          density="compact"
                          hide-details
                          autofocus
                          @blur="stopEditing"
                          @keydown.enter="stopEditing"
                          @keydown.esc="cancelEditing"
                        />
                      </v-card>
                    </v-col>

                    <!-- Concurso -->
                    <v-col cols="12">
                      <v-card 
                        variant="outlined" 
                        class="pa-3 mb-2 cursor-pointer hover-card"
                        :class="{ 'editing': editingField === 'concurso' }"
                        @click="startEditing('concurso')"
                      >
                        <div class="text-caption text-grey-darken-1 mb-1">Concurso</div>
                        <div v-if="editingField !== 'concurso'" class="text-body-1">
                          {{ formData.concurso }}
                        </div>
                        <v-text-field
                          v-else
                          v-model="formData.concurso"
                          density="compact"
                          hide-details
                          autofocus
                          @blur="stopEditing"
                          @keydown.enter="stopEditing"
                          @keydown.esc="cancelEditing"
                        />
                      </v-card>
                    </v-col>

                    <!-- Descrição -->
                    <v-col cols="12">
                      <v-card 
                        variant="outlined" 
                        class="pa-3 mb-2 cursor-pointer hover-card"
                        :class="{ 'editing': editingField === 'describe' }"
                        @click="startEditing('describe')"
                      >
                        <div class="text-caption text-grey-darken-1 mb-1">Descrição</div>
                        <div v-if="editingField !== 'describe'" class="text-body-1">
                          {{ formData.describe }}
                        </div>
                        <v-textarea
                          v-else
                          v-model="formData.describe"
                          density="compact"
                          hide-details
                          auto-grow
                          rows="2"
                          autofocus
                          @blur="stopEditing"
                          @keydown.ctrl.enter="stopEditing"
                          @keydown.esc="cancelEditing"
                        />
                      </v-card>
                    </v-col>

                    <!-- Criado por (não editável) -->
                    <v-col cols="12" md="6">
                      <v-card 
                        variant="outlined" 
                        class="pa-3 mb-2"
                        color="grey-lighten-2"
                      >
                        <div class="text-caption text-grey-darken-1 mb-1">Criado por</div>
                        <div class="text-body-1">{{ formData.created_by }}</div>
                      </v-card>
                    </v-col>

                    <!-- Data de inclusão (não editável) -->
                    <v-col cols="12" md="6">
                      <v-card 
                        variant="outlined" 
                        class="pa-3 mb-2"
                        color="grey-lighten-2"
                      >
                        <div class="text-caption text-grey-darken-1 mb-1">Data de Inclusão</div>
                        <div class="text-body-1">{{ formData.data_include }}</div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-card-actions class="pt-4">
                  <v-spacer />
                  <v-btn 
                    color="primary" 
                    variant="elevated"
                    @click="saveChanges"
                    :disabled="!hasChanges"
                  >
                    <v-icon start>mdi-content-save</v-icon>
                    Salvar Alterações
                  </v-btn>
                </v-card-actions>
              </v-card>

              <div>
                <EditarConteudo 
                  :conteudo="editalStore.getConteudoEdital" 
                  @update:disciplinas="updateConteudo"
                  v-if="!editalStore.getLoading" />
              </div>
              <Loading v-if="editalStore.getLoading"></loading>
          </v-container>
        </div>
  </section>
</template>

<script setup>
  import { ref, reactive, computed, onMounted } from 'vue'

  import { useRoute } from 'vue-router';

  import { useConteudoEditalStore } from '@/store/concursos/ConteudoEditalStore';
  const editalStore = useConteudoEditalStore();

  import Loading from '@/components/partiaslLayout/loading.vue';
  import EditarConteudo from '@/components/painel/admin/cargoEditar/editarConteudo.vue';

  const route = useRoute();

  const initialData = ref({
    cargo: '',
    banca: '',
    ano: '',
    concurso: '',
    describe: '',
    created_by: '',
    data_include: '',
  })

  // Emits
  const emit = defineEmits(['save', 'fieldChanged'])

  // Estado reativo
  const formData = reactive({ ...initialData.value })
  const originalData = ref({ ...initialData.value })
  const editingField = ref(null)
  const previousValue = ref(null)

  // Campos editáveis
  const editableFields = ['cargo', 'banca', 'ano', 'concurso', 'describe']

  // Computed
  const hasChanges = computed(() => {
    return JSON.stringify(formData) !== JSON.stringify(originalData.value)
  })

  // Métodos
  const startEditing = (field) => {
    if (!editableFields.includes(field)) return
    
    editingField.value = field
    previousValue.value = formData[field]
  }

  const stopEditing = () => {
    if (editingField.value) {
      const field = editingField.value
      const newValue = formData[field]
      
      // Emitir evento de mudança de campo
      if (newValue !== previousValue.value) {
        emit('fieldChanged', {
          field,
          oldValue: previousValue.value,
          newValue
        })
      }
      
      editingField.value = null
      previousValue.value = null
    }
  }

  const cancelEditing = () => {
    if (editingField.value && previousValue.value !== null) {
      formData[editingField.value] = previousValue.value
      editingField.value = null
      previousValue.value = null
    }
  }

  const saveChanges = async () => {
    if (editingField.value) {
      stopEditing()
    }

    await editalStore.updateEdital(formData);
    
    originalData.value = { ...formData }

  }

  const updateConteudo = async (conteudo) => {
    await editalStore.updateConteudoEdital(conteudo);
  }

  onMounted(async () => {
    await editalStore.getConteudoEEditalEdit(route.params.id);
    initialData.value = { ...editalStore.readEdital }
    Object.assign(formData, initialData.value)
    originalData.value = { ...initialData.value }
  })

</script>

<style scoped>
  .cursor-pointer {
    cursor: pointer;
  }

  .hover-card {
    transition: all 0.2s ease-in-out;
  }

  .hover-card:hover {
    background-color: rgba(var(--v-theme-primary), 0.04);
    transform: translateY(-1px);
  }

  .editing {
    background-color: rgba(var(--v-theme-primary), 0.08);
    border-color: rgb(var(--v-theme-primary)) !important;
    border-width: 2px !important;
  }
</style>