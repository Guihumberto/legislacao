<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <v-btn variant="outlined" prepend-icon="mdi-arrow-left" class="mb-5" @click="$router.push('/laws')">Voltar</v-btn>
            <h1 class="text-h5 d-flex align-center mb-5"> <v-icon color="#030131" size="1.7rem" class="mr-1">mdi-tools</v-icon>Editar Normas</h1>
            <div class="mt-5">
                <v-form @submit.prevent="handleSubmit">
                    <!-- Campo Título -->
                    <div class="mb-4">
                    <div v-if="!editing.title" @click="startEdit('title')" class="editable-field">
                        <v-icon size="small" class="mr-2">mdi-pencil-outline</v-icon>
                        <strong class="mr-5">Título:</strong> {{ formData.title }}
                    </div>
                    <v-text-field
                        v-else
                        v-model="formData.title"
                        label="Título"
                        variant="outlined"
                        density="compact"
                        @blur="saveField('title')"
                        @keyup.enter="saveField('title')"
                        @keyup.escape="cancelEdit('title')"
                        ref="titleField"
                        :loading="saving.title"
                    >
                        <template #append>
                        <v-btn
                            icon="mdi-check"
                            size="small"
                            color="success"
                            variant="text"
                            @click="saveField('title')"
                            :loading="saving.title"
                        />
                        <v-btn
                            icon="mdi-close"
                            size="small"
                            color="error"
                            variant="text"
                            @click="cancelEdit('title')"
                        />
                        </template>
                    </v-text-field>
                    </div>

                    <!-- Campo Ano -->
                    <div class="mb-4">
                    <div v-if="!editing.ano" @click="startEdit('ano')" class="editable-field">
                        <v-icon size="small" class="mr-2">mdi-pencil-outline</v-icon>
                         <strong class="mr-5">Ano:</strong> {{ formData.ano }}
                    </div>
                    <v-text-field
                        v-else
                        v-model="formData.ano"
                        label="Ano"
                        type="number"
                        variant="outlined"
                        density="compact"
                        @blur="saveField('ano')"
                        @keyup.enter="saveField('ano')"
                        @keyup.escape="cancelEdit('ano')"
                        ref="anoField"
                        :loading="saving.ano"
                    >
                        <template #append>
                        <v-btn
                            icon="mdi-check"
                            size="small"
                            color="success"
                            variant="text"
                            @click="saveField('ano')"
                            :loading="saving.ano"
                        />
                        <v-btn
                            icon="mdi-close"
                            size="small"
                            color="error"
                            variant="text"
                            @click="cancelEdit('ano')"
                        />
                        </template>
                    </v-text-field>
                    </div>

                    <!-- Campo Tipo -->
                    <div class="mb-4">
                    <div v-if="!editing.tipo" @click="startEdit('tipo')" class="editable-field">
                        <v-icon size="small" class="mr-2">mdi-pencil-outline</v-icon>
                         <strong class="mr-5">Tipo:</strong> {{ formData.tipo }}
                    </div>
                    <v-select
                        v-else
                        v-model="formData.tipo"
                        :items="tipoOptions"
                        label="Tipo"
                        variant="outlined"
                        density="compact"
                        @blur="saveField('tipo')"
                        @keyup.escape="cancelEdit('tipo')"
                        ref="tipoField"
                        :loading="saving.tipo"
                    >
                        <template #append>
                        <v-btn
                            icon="mdi-check"
                            size="small"
                            color="success"
                            variant="text"
                            @click="saveField('tipo')"
                            :loading="saving.tipo"
                        />
                        <v-btn
                            icon="mdi-close"
                            size="small"
                            color="error"
                            variant="text"
                            @click="cancelEdit('tipo')"
                        />
                        </template>
                    </v-select>
                    </div>

                    <!-- Campo Descrição -->
                    <div class="mb-4">
                    <div v-if="!editing.description_norm" @click="startEdit('description_norm')" class="editable-field">
                        <v-icon size="small" class="mr-2">mdi-pencil-outline</v-icon>
                         <strong class="mr-5">Descrição:</strong> {{ formData.description_norm }}
                    </div>
                    <v-textarea
                        v-else
                        v-model="formData.description_norm"
                        label="Descrição"
                        variant="outlined"
                        density="compact"
                        rows="3"
                        @blur="saveField('description_norm')"
                        @keyup.escape="cancelEdit('description_norm')"
                        ref="descriptionField"
                        :loading="saving.description_norm"
                    >
                        <template #append>
                        <v-btn
                            icon="mdi-check"
                            size="small"
                            color="success"
                            variant="text"
                            @click="saveField('description_norm')"
                            :loading="saving.description_norm"
                        />
                        <v-btn
                            icon="mdi-close"
                            size="small"
                            color="error"
                            variant="text"
                            @click="cancelEdit('description_norm')"
                        />
                        </template>
                    </v-textarea>
                    </div>

                    <!-- Campo Sigiloso -->
                    <div class="mb-4">
                    <div v-if="!editing.sigiloso" @click="startEdit('sigiloso')" class="editable-field">
                        <v-icon size="small" class="mr-2">mdi-pencil-outline</v-icon>
                         <strong class="mr-5">Sigiloso:</strong> {{ formData.sigiloso ? 'Sim' : 'Não' }}
                    </div>
                    <div v-else class="d-flex align-center">
                        <v-switch
                        v-model="formData.sigiloso"
                        label="Sigiloso"
                        color="primary"
                        density="compact"
                        ref="sigilosoField"
                        :loading="saving.sigiloso"
                        />
                        <v-btn
                        icon="mdi-check"
                        size="small"
                        color="success"
                        variant="text"
                        @click="saveField('sigiloso')"
                        :loading="saving.sigiloso"
                        class="ml-2"
                        />
                        <v-btn
                        icon="mdi-close"
                        size="small"
                        color="error"
                        variant="text"
                        @click="cancelEdit('sigiloso')"
                        />
                    </div>
                    </div>

                    <!-- Campo Revogado -->
                    <div class="mb-4">
                    <div v-if="!editing.revogado" @click="startEdit('revogado')" class="editable-field">
                        <v-icon size="small" class="mr-2">mdi-pencil-outline</v-icon>
                         <strong class="mr-5">Revogado:</strong> {{ formData.revogado ? 'Sim' : 'Não' }}
                    </div>
                    <div v-else class="d-flex align-center">
                        <v-switch
                        v-model="formData.revogado"
                        label="Revogado"
                        color="primary"
                        density="compact"
                        ref="revogadoField"
                        :loading="saving.revogado"
                        />
                        <v-btn
                        icon="mdi-check"
                        size="small"
                        color="success"
                        variant="text"
                        @click="saveField('revogado')"
                        :loading="saving.revogado"
                        class="ml-2"
                        />
                        <v-btn
                        icon="mdi-close"
                        size="small"
                        color="error"
                        variant="text"
                        @click="cancelEdit('revogado')"
                        />
                    </div>
                    </div>

                    <!-- Campo Eficaz -->
                    <div class="mb-4">
                    <div v-if="!editing.eficaz" @click="startEdit('eficaz')" class="editable-field">
                        <v-icon size="small" class="mr-2">mdi-pencil-outline</v-icon>
                         <strong class="mr-5">Eficaz:</strong> {{ formData.eficaz ? 'Sim' : 'Não' }}
                    </div>
                    <div v-else class="d-flex align-center">
                        <v-switch
                        v-model="formData.eficaz"
                        label="Eficaz"
                        color="primary"
                        density="compact"
                        ref="eficazField"
                        :loading="saving.eficaz"
                        />
                        <v-btn
                        icon="mdi-check"
                        size="small"
                        color="success"
                        variant="text"
                        @click="saveField('eficaz')"
                        :loading="saving.eficaz"
                        class="ml-2"
                        />
                        <v-btn
                        icon="mdi-close"
                        size="small"
                        color="error"
                        variant="text"
                        @click="cancelEdit('eficaz')"
                        />
                    </div>
                    </div>

                    <!-- Botões de ação -->
                    <div class="text-center mt-6">
                    <v-btn
                        prepend-icon="mdi-content-save"
                        variant="outlined"
                        color="success"
                        class="mr-3"
                        @click="saveAllChanges"
                        :loading="savingAll"
                        :disabled="!hasChanges"
                    >
                        Salvar Todas as Alterações
                    </v-btn>
                    
                    <v-btn
                        prepend-icon="mdi-refresh"
                        variant="outlined"
                        color="warning"
                        @click="resetForm"
                        :disabled="!hasChanges"
                    >
                        Resetar
                    </v-btn>
                    </div>

                    <!-- Indicador de alterações -->
                    <v-alert
                    v-if="hasChanges"
                    type="info"
                    variant="tonal"
                    class="mt-4"
                    icon="mdi-information"
                    >
                    Você tem alterações não salvas. Clique em "Salvar Todas as Alterações" para persistir.
                    </v-alert>
                </v-form>
            </div>
        </div>
    </section>
</template>

<script setup>
    import { ref, reactive, computed, nextTick, onMounted } from 'vue'
    import { useRoute } from 'vue-router';
    import { useLawStore } from '@/store/LawsStore';
    import { useGeralStore } from '@/store/GeralStore';

    const geralStore = useGeralStore()
    const lawStore = useLawStore()
    const route = useRoute()

    const load = ref(false)
    const idLaw = route.params.id   
    const law = ref({}) 

    const getLaw = async () => {
         const resp = await lawStore.getLawId(idLaw)
         law.value = resp
    }

    const emit = defineEmits(['updated', 'error'])

    // Dados do formulário
    const formData = reactive({
    title: '',
    ano: '',
    tipo: '',
    description_norm: '',
    sigiloso: false,
    revogado: false,
    eficaz: false
    })

    // Dados originais para comparação
    const originalData = ref({})

    // Estados de edição
    const editing = reactive({
    title: false,
    ano: false,
    tipo: false,
    description_norm: false,
    sigiloso: false,
    revogado: false,
    eficaz: false
    })

    // Estados de salvamento
    const saving = reactive({
    title: false,
    ano: false,
    tipo: false,
    description_norm: false,
    sigiloso: false,
    revogado: false,
    eficaz: false
    })

    const savingAll = ref(false)

    // Opções para o campo tipo
    const tipoOptions = [
    'Lei',
    'Decreto',
    'Portaria',
    'Resolução',
    'Instrução Normativa',
    'Medida Provisória'
    ]

    // Referencias dos campos
    const titleField = ref(null)
    const anoField = ref(null)
    const tipoField = ref(null)
    const descriptionField = ref(null)
    const sigilosoField = ref(null)
    const revogadoField = ref(null)
    const eficazField = ref(null)

    // Computed
    const hasChanges = computed(() => {
    return JSON.stringify(formData) !== JSON.stringify(originalData.value)
    })

    // Métodos
    const initializeForm = () => {
    const sourceData = law.value._source
    
    formData.title = sourceData.title || ''
    formData.ano = sourceData.ano || ''
    formData.tipo = sourceData.tipo || ''
    formData.description_norm = sourceData.description_norm || ''
    formData.sigiloso = sourceData.sigiloso || false
    formData.revogado = sourceData.revogado || false
    formData.eficaz = sourceData.eficaz || false
    
    // Salva uma cópia dos dados originais
    originalData.value = { ...formData }
    }

    const startEdit = async (field) => {
    // Cancela outras edições
    Object.keys(editing).forEach(key => {
        if (key !== field) {
        editing[key] = false
        }
    })
    
    editing[field] = true
    
    // Foca no campo após o próximo tick
    await nextTick()
    const fieldRef = getFieldRef(field)
    if (fieldRef && fieldRef.focus) {
        fieldRef.focus()
    }
    }

    const getFieldRef = (field) => {
    const refs = {
        title: titleField.value,
        ano: anoField.value,
        tipo: tipoField.value,
        description_norm: descriptionField.value,
        sigiloso: sigilosoField.value,
        revogado: revogadoField.value,
        eficaz: eficazField.value
    }
    return refs[field]
    }

    const saveField = async (field) => {
    try {
        saving[field] = true
        
        // Simula chamada para API - substitua pela sua lógica
        const updateData = {
        [field]: formData[field]
        }
        
        // Exemplo de chamada para o store
        // await law.valueStore.updateLaw(law.value._id, updateData)
        
        // Simula delay da API
        await new Promise(resolve => setTimeout(resolve, 500))
        
        editing[field] = false
        originalData.value[field] = formData[field]
        
        emit('updated', { field, value: formData[field] })
        
    } catch (error) {
        console.error(`Erro ao salvar ${field}:`, error)
        emit('error', { field, error })
    } finally {
        saving[field] = false
    }
    }

    const cancelEdit = (field) => {
    formData[field] = originalData.value[field]
    editing[field] = false
    }

    const saveAllChanges = async () => {
    try {
        savingAll.value = true
        
        // Identifica apenas os campos que foram alterados
        const changedFields = {}
        Object.keys(formData).forEach(key => {
        if (formData[key] !== originalData.value[key]) {
            changedFields[key] = formData[key]
        }
        })
        
        if (Object.keys(changedFields).length === 0) {
        return
        }
        
        // Simula chamada para API - substitua pela sua lógica
        // await law.valueStore.updateLaw(law.value._id, changedFields)
        
        // Simula delay da API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Atualiza os dados originais
        originalData.value = { ...formData }
        
        // Cancela todas as edições
        Object.keys(editing).forEach(key => {
        editing[key] = false
        })
        
        emit('updated', { fields: changedFields })
        
    } catch (error) {
        console.error('Erro ao salvar alterações:', error)
        emit('error', { error })
    } finally {
        savingAll.value = false
    }
    }

    const resetForm = () => {
    Object.assign(formData, originalData.value)
    Object.keys(editing).forEach(key => {
        editing[key] = false
    })
    }


    onMounted(async() => {
       load.value = true
       await getLaw()
       initializeForm()
       load.value = false
    })

</script>

<style scoped>
    .listFolder{
        display: flex;
        flex-direction: column;
        justify-self: start;
    }
    .editable-field {
        padding: 12px;
        border: 1px solid transparent;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
        min-height: 48px;
        display: flex;
        align-items: center;
    }

    .editable-field:hover {
        background-color: rgba(var(--v-theme-primary), 0.04);
        border-color: rgba(var(--v-theme-primary), 0.2);
    }

    .editable-field .v-icon {
        opacity: 0.6;
        transition: opacity 0.2s ease;
    }

    .editable-field:hover .v-icon {
        opacity: 1;
    }
</style>