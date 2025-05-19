<template>
    <v-row>
        <v-col :cols="xs ? 6 : 3">
            <v-text-field
                label="Tipo"
                variant="outlined"
                density="compact"
                v-model="form.nome"
                :rules="[rules.required, rules.minname]"
                clearable
            ></v-text-field>
        </v-col>
        <v-col :cols="xs ? 6 : 3">
            <v-text-field
                label="Nome na lista"
                variant="outlined"
                density="compact"
                v-model="form.mudar"
                :rules="[rules.required, rules.minname]"
                clearable
            ></v-text-field>
        </v-col>
        <v-col :cols="xs ? 6 : 3">
            <v-text-field
                label="Sigla"
                variant="outlined"
                density="compact"
                v-model="form.sigla"
                :rules="[rules.required, rules.minname]"
                clearable
            ></v-text-field>
        </v-col>
        <v-col :cols="xs ? 6 : 3"> 
            <v-btn 
                block
                :loading="generalStore.readLoad" 
                variant="flat" color="success" @click="salvar()" 
                :disabled="!form.sigla || !form.mudar">Salvar</v-btn>
        </v-col>
    </v-row>
</template>

<script setup>
    import { ref } from 'vue';

    import { useDisplay } from 'vuetify'
    const { xs } = useDisplay()

    import { useGeneralStore } from '@/store/GeneralStore';
    const generalStore = useGeneralStore()

    const form = ref({
        nome: null,
        mudar: null,
        sigla: null,
        restrict: false
    })

    const clear = () => {
        form.value.nome = null
        form.value.mudar = null
        form.value.sigla = null
    }

    const rules = ref({
        required: (value) => !!value || "Campo obrigatório",
        minname: (v) => (v||'').length >= 3 || "Mínimo 3 caracteres",
    })

    const emits = defineEmits([
        'saveFonte'
    ])

    const salvar = async () => {
        emits('saveFonte', form.value)
        clear()
    }

</script>

<style scoped>

</style>