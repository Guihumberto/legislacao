<template>
    <v-btn @click="dialog = true" variant="text" size="small" color="error">Tratar</v-btn>
    <v-dialog v-model="dialog">
        <v-card width="500" class="mx-auto">
            <v-card-title class="bg-primary d-flex align-center justify-space-between">
                Tratar Erro
                <v-btn @click="dialog = false" variant="text" icon="mdi-close" density="compact"></v-btn>
            </v-card-title>
            <v-card-text>
                <p v-if="erro.descriptionError">{{ erro.descriptionError }}</p>
                <p>{{ errorMap(erro.typeError) }}</p>
                <p>Usuário: {{ erro.id_user }}</p>
                <p>{{ erro.timestamp }}</p>
                <v-form @submit.prevent="tratarErro" ref="formerror" v-if="!resp && !deleteId" class="mt-10">
                    <div class="border pa-2 rounded mb-5">
                        {{ questao.pergunta }} <br> <br>
                        Resposta: {{ questao.resposta }}
                        <div class="d-flex justify-center py-5 ga-2">
                            <v-btn :variant="resposta == 'verdadeiro' ? 'flat':'outlined'" :color=" resposta == 'verdadeiro' ? 'success' : ''" @click="resposta = 'verdadeiro'">Verdadeiro</v-btn>
                            <v-btn :variant="resposta == 'falso' ? 'flat':'outlined'" :color=" resposta == 'falso' ? 'error' : ''" @click="resposta = 'falso'">Falso</v-btn>
                        </div>
                    </div>
                    <div class="text-right">
                        <v-btn :disabled="load" variant="text" @click="dialog = false">Fechar</v-btn>
                        <v-btn :loading="load" class="mx-2" :disabled="load || !resposta" type="submit" color="primary">Alterar</v-btn>
                        <v-btn :loading="load" :disabled="load" type="submit" color="error" @click="deleteId = questao.id">Excluir</v-btn>
                    </div>
                </v-form>
                <div class="mt-10 border pa-2 rounded mb-5" v-if="deleteId">
                    <p>Deseja realmente apagar esta questão?</p>
                    <div class="d-flex ga-1 justify-center mt-10">
                        <v-btn variant="text" @click="deleteId = null">cancelar</v-btn>
                        <v-btn variant="flat" color="red" @click="deleteActionId">Apagar</v-btn>
                    </div>
                </div>
                <v-alert variant="outlined" :type="resp == 'created' ? 'success' : 'error'" v-if="resp"  :text="resp == 'created' ? 'Erro relatado com sucesso' : 'Algo deu errado!'" class="mt-2">
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
    import { ref, computed, onMounted } from 'vue';

    import { useQuestoesStore } from '@/store/forum/QuestoesStore';
    const questaoStore = useQuestoesStore()

    const dialog = ref(false)
    const resp = ref(null)
    const load = ref(false)
    const questao = ref(null)
    const resposta = ref(null)
    const deleteId = ref(false)

    const tratarErro = async () => {
        console.log('tratar erro')
    }   

    const deleteActionId = async () => {
        load.value = true
        const objeto = {
            id_questao: deleteId.value,
            id_erro: props.erro.id
        }
        const response = await questaoStore.deleteQuestao(objeto);
        resp.value = response
        load.value = false
        deleteId.value = null
        dialog.value = false
    }

    const props = defineProps({
        erro: {
            type: Object,
            required: true
        }
    })

    const listErrors = [
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
    ]

    const errorMap = (item) => {
        return listErrors.find(e => e.id === item).name
    }

    onMounted(async() => {
        const resp = await questaoStore.getQuestao(props.erro.id_questao)
        questao.value = resp
    })

</script>

<style scoped>

</style>