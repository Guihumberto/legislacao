<template>
    <v-btn @click="dialog = !dialog" color="error" variant="text" density="compact" prepend-icon="mdi-information">Relatar Erro</v-btn>
    <v-dialog v-model="dialog">
        <v-card width="500" class="mx-auto">
            <v-card-title class="bg-error d-flex align-center justify-space-between">
                Relatar Erro
                <v-btn @click="dialog = false" variant="text" icon="mdi-close" density="compact"></v-btn>
            </v-card-title>
            <v-card-text>
                <v-form @submit.prevent="sendError" ref="formerror" v-if="!resp">
                    <v-select
                        variant="outlined"
                        label="Tipo de erro"
                        v-model="form.typeError"
                        :items="listErrors"
                        item-title="name"
                        item-value="id"
                        density="compact"
                        class="mb-2"
                        :rules="[rules.required]"
                        clearable
                        :disabled="load"
                    ></v-select>
                    <v-textarea
                        variant="outlined"
                        label="Descreva o erro"
                        v-model="form.descriptionError"
                        density="compact"
                        class="mb-2"
                        v-if="form.typeError == 4"
                        :rules="[rules.required]"
                        :disabled="load"
                    ></v-textarea>
                    <div class="text-right">
                        <v-btn :disabled="load" class="mr-2" variant="text" @click="dialog = false">Fechar</v-btn>
                        <v-btn :loading="load" :disabled="load" type="submit" color="error">Enviar</v-btn>
                    </div>
                </v-form>
                <v-alert variant="outlined" :type="resp == 'created' ? 'info' : 'error'" v-if="resp"  :text="resp == 'created' ? 'Erro relatado com sucesso' : 'Algo deu errado!'" class="mt-2">
                    <template v-slot:append>
                        <v-btn v-if="resp == 'created'" variant="outlined" @click="dialog = false">Fechar</v-btn>
                        <v-btn v-else variant="outlined" @click="resp = null">Tentar Novamente</v-btn>
                    </template>
                </v-alert>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref } from 'vue';

    import { useQuestoesStore } from '@/store/forum/QuestoesStore';
    const questaoStore = useQuestoesStore()

    const props = defineProps({
        questao: {
            type: Object,
            required: true
        }
    })

    const dialog = ref(false)
    const load = ref(false)
    const resp = ref(null)

    const form = ref({
        typeError: null,
        descriptionError: null
    })

    const formerror = ref(null)
    const rules = ref({
        required: (value) => !!value || "Campo obrigatório",
        minname: (v) => (v||'').length >= 3 || "Mínimo 3 caracteres",
    })

    const listErrors = ref([
        {
            name: 'Gabarito Invertido',
            id: 1
        },
        {
            name: 'Justificativa Incorreta',
            id: 2
        },
        {
            name: 'Artigo não correponde a questão',
            id: 3
        },
        {
            name: 'Outro',
            id: 4
        },
    ])

    const sendError = async () => {
        const { valid } = await formerror.value.validate()
        if(valid){
                load.value = true
                const objeto = {
                    ...props.questao,
                    ...form.value
                }

                const response = await questaoStore.relatarErrorQUestao(objeto);
                resp.value = response?.result || response

                form.value = {
                    typeError: null,
                    descriptionError: null
                }
                load.value = false
        }
    }

</script>

<style scoped>

</style>