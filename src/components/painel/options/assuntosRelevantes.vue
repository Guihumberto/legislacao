<template>
    <section>
        <div>
            <div v-if="revisaoStore.readRevisao?.resumo_geral && !edit" class="mt-5">
                <v-chip-group>
                    <v-chip v-for="item, i in revisaoStore.readRevisao.top_relevante">{{ item }}</v-chip>
                </v-chip-group>
                <div class="bg-white pa-10 text-left text" v-html="revisaoStore.readRevisao.resumo_geral">
                </div>
                <div class="mt-5" v-if="usermaster">
                    <v-btn prepend-icon="mdi-pencil" color="warning" variant="flat" @click="editarResumo">Editar</v-btn>
                </div>
            </div>
            <div v-else class="mt-5">
                <v-form @submit.prevent="onSubmit" ref="form" v-if="usermaster">
                    <v-text-field
                        label="Ponto chave"
                        density="compact"
                        variant="outlined"
                        v-model="campos.pontosChaves"
                        :rules="[rules.required]"
                    ></v-text-field>
                    <ComentEdit 
                        label="Resumo"
                        v-model="campos.resumoTexto"
                        :disabled="load"
                        :loading="load"
                        class="mt-5"
                        :max-length="5000"
                    />
                    <div class="mt-5">
                        <v-btn v-if="edit" class="mr-2" variant="flat" @click="edit = false">Cancelar</v-btn>
                        <v-btn v-if="edit" type="submit" variant="flat" color="warning">Editar</v-btn>
                        <v-btn v-else type="submit" variant="flat" color="primary">Salvar</v-btn>
                    </div>
                </v-form>
            </div>
            <v-alert class="mt-5" v-if="!select" type="info" variant="outlined" text="Selecione uma disciplina!"></v-alert>
        </div>
    </section>
</template>

<script setup>
    import { ref, watch } from 'vue';
    import { useRevisaoStore } from '@/store/concursos/EditalRevisao';
    const revisaoStore = useRevisaoStore()

    import ComentEdit from '@/components/legislacao/forum/comentarios/comentEdit.vue';

    const props = defineProps({
        select: Object,
        usermaster: Boolean,
    })

    const rules = ref({
        required: (value) => !!value || "Campo obrigatório",
        minname: (v) => (v||'').length >= 3 || "Mínimo 3 caracteres",
    })

    const edit = ref(false);
    const form = ref(null);
    const load = ref(false);    
    const campos = ref({
        pontosChaves: '',
        resumoTexto: '',
    })

    const onSubmit = async () => {
        const { valid } = await form.value.validate()

        const art = campos.value.pontosChaves.replace(/[^0-9,]/g,'')
        const hasComma = art.includes(",");

        if(hasComma && art){   
            campos.value.pontosChaves = art.split(",")
        } 

        const revisao = {
            ...props.select,
            ...campos.value,
        }

        if(valid) {
            load.value = true
            await revisaoStore.createRevisao(revisao)
            clearCampos()
            if(edit.value) {
                edit.value = false
                revisaoStore.getRevisao(props.select)
            }
            load.value = false
        }
    }

    const editarResumo = () => {
        edit.value = true
        campos.value = {
            pontosChaves: revisaoStore.readRevisao.top_relevante.join(","),
            resumoTexto: revisaoStore.readRevisao.resumo_geral,
        }
    }

    const clearCampos = () => {
        campos.value = {
            pontosChaves: '',
            resumoTexto: '',
        }
    }

    watch(
    () => props.select, (val) => { 
        revisaoStore.getRevisao(props.select)
        edit.value = false
        clearCampos()
    })

   
</script>

<style scoped>
.text{
    line-height: 2;
}
.text ul,
.text ol {
  padding-left: 1.5rem; /* ou use margin-left */
  margin-bottom: 1rem;  /* opcional, para espaçamento inferior */
}


</style>