<template>
    <section>
        <div>
            <div v-if="revisaoStore.readRevisao?.resumo_geral" class="mt-5">
                <v-chip-group>
                    <v-chip v-for="item, i in revisaoStore.readRevisao.top_relevante">{{ item }}</v-chip>
                </v-chip-group>
                <div class="bg-white pa-10 text-left text" v-html="revisaoStore.readRevisao.resumo_geral">
                </div>
            </div>
            <v-form @submit.prevent="onSubmit" ref="form" v-else>
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
                <v-btn type="submit" class="mt-5" variant="flat" color="primary">Salvar</v-btn>
            </v-form>
        </div>
    </section>
</template>

<script setup>
    import { ref, watch } from 'vue';
    import { useRevisaoStore } from '@/store/concursos/EditalRevisao';
    const revisaoStore = useRevisaoStore()

    import ComentEdit from '@/components/legislacao/forum/comentarios/comentEdit.vue';

    const props = defineProps({
        select: Object
    })

    const rules = ref({
        required: (value) => !!value || "Campo obrigatório",
        minname: (v) => (v||'').length >= 3 || "Mínimo 3 caracteres",
    })

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
            load.value = false
        }
    }

    watch(
    () => props.select, (val) => { 
        revisaoStore.getRevisao(props.select)
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