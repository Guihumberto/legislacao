<template>
    <v-btn @click="dialog = true" variant="text" size="small" color="error">Tratar</v-btn>
    <v-dialog v-model="dialog">
        <v-card width="500" class="mx-auto">
            <v-card-title class="bg-error d-flex align-center justify-space-between">
                Tratar Erro
                <v-btn @click="dialog = false" variant="text" icon="mdi-close" density="compact"></v-btn>
            </v-card-title>
            <v-card-text>
                <p v-if="erro.descriptionError">{{ erro.descriptionError }}</p>
                <p>{{ errorMap(erro.typeError) }}</p>
                <p>Usuário: {{ erro.id_user }}</p>
                <p>{{ erro.timestamp }}</p>
                <!-- <v-form @submit.prevent="sendError" ref="formerror" v-if="!resp">
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
                </v-form> -->
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

    const dialog = ref(false)
    const resp = ref(null)

    const tratarErro = () => {
        console.log('tratar erro')
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

</script>

<style scoped>

</style>