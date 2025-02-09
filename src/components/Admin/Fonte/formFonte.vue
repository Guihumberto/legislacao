<template>
     <v-col :cols=" xs ? 5 : 3">
        <div class="text-left pa-3 bg-grey">
            {{ fonte.key }} ({{ fonte.doc_count }})
        </div>
    </v-col>
    <v-col :cols=" xs ? 4 : 4">
        <v-text-field
            label="Nome na lista"
            variant="outlined"
            density="compact"
            v-model="form.mudar"
            :rules="[rules.required, rules.minname]"
            :disabled="isDisabled"
            clearable
        ></v-text-field>
    </v-col>
    <v-col :cols=" xs ? 3 : 2">
        <v-text-field
            label="Sigla"
            variant="outlined"
            density="compact"
            v-model="form.sigla"
            :rules="[rules.required, rules.minname]"
            :disabled="isDisabled"
            clearable
        ></v-text-field>
    </v-col>
    <v-col cols="2" v-if="!exist">
        <v-btn 
            :loading="generalStore.readLoad" variant="flat" color="success" @click="salvar(fonte.key)" :disabled="!form.sigla || !form.mudar">Salvar</v-btn>
    </v-col>
    <v-col cols="3" v-else :class="xs ? 'd-none':''">
        <div v-if="!idEdit">
              <v-tooltip text="Editar Fonte">
                <template v-slot:activator="{ props }">
                    <v-btn 
                        v-bind="props"
                        icon="mdi-pencil" variant="text" density="comfortable" class="ml-2" color="grey" @click="idEdit = exist.id"
                        ></v-btn>
                </template>
              </v-tooltip>
              <v-tooltip text="Restringir acesso público">
                <template v-slot:activator="{ props }">
                    <v-btn 
                        v-bind="props"
                        :icon=" exist.restrict ? 'mdi-lock' : 'mdi-account-group'" 
                        variant="text" density="comfortable" class="ml-2" :color="exist.restrict ? 'error' : 'success'"
                        :loading="generalStore.readLoad"
                        @click="changeRestrict(exist)"
                    ></v-btn>
                </template>
            </v-tooltip>
      </div>
        <div v-else>
            <v-btn density="compact" variant="text" @click="cancelar">cancelar</v-btn>
            <v-btn variant="flat" color="warning" @click="salvar(fonte.key)">Editar</v-btn>
        </div>
    </v-col>
</template>

<script setup>
    import { onMounted, ref, computed } from 'vue';

    import { useDisplay } from 'vuetify'
    const { xs } = useDisplay()

    import { useGeneralStore } from '@/store/GeneralStore';
    const generalStore = useGeneralStore()

    const idEdit = ref(null)

    const form = ref({
        mudar: null,
        sigla: null
    })

    const rules = ref({
        required: (value) => !!value || "Campo obrigatório",
        minname: (v) => (v||'').length >= 3 || "Mínimo 3 caracteres",
    })

    const props = defineProps({
        fonte: Object,
        exist: Object,
    })

    const emits = defineEmits([
        'saveFonte'
    ])

    onMounted(() => {
        if(props.exist){
            form.value.mudar = props.exist?.mudar
            form.value.sigla = props.exist?.sigla
        }
    })

    
    const salvar = async (item) => {
        const objeto = {
            nome: item,
            mudar: form.value.mudar,
            sigla: form.value.sigla,
            restrict: false
        }

        if(props.exist?.id) {
            objeto.id = props.exist.id
            idEdit.value = null
        } 

        emits('saveFonte', objeto)
    }

    const changeRestrict = (exist) => {
        exist.restrict = !exist.restrict
        emits('saveFonte', exist)
    }

    const cancelar = () => {
        idEdit.value = null
        form.value.mudar = props.exist.mudar
        form.value.sigla = props.exist.sigla
    }

    const isDisabled = computed(() => {
        if(props.exist?.mudar && !idEdit.value) return true
        
        return false
    })

</script>

<style scoped>

</style>