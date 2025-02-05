<template>
    <div class="text-center">
        <v-btn 
            @click="dialog = true"
             color="grey" variant="text" icon="mdi-pencil"
        >
        </v-btn>

        <v-dialog
        v-model="dialog"
        width="auto"
        >
        <v-card
            width="600"
            v-if="edit?.idU"
        >
            <v-card-title  class="py-0 bg-primary d-flex justify-space-between align-center">
                <div>
                    <v-icon class="mr-2">mdi-pencil</v-icon>Editar Publicação
                </div>
                <v-btn variant="text" icon="mdi-close" @click="dialog = false, saveConfirm = false, confirm = false"></v-btn>
            </v-card-title>
            <v-card-text v-if="!confirm">
                <v-form @submit.prevent="confirmText()" ref="form" class="mt-5">
                    <v-text-field
                        label="Título"
                        density="compact"
                        variant="outlined"
                        v-model="edit.title"
                        :rules="[rules.required]"
                    ></v-text-field>
                    <v-textarea
                        label="Texto"
                        density="compact"
                        variant="outlined"
                        v-model="edit.text"
                    :rules="[rules.required]"
                    ></v-textarea>
                    <div class="text-right">
                        <v-btn @click="dialog = false" class="mt-5 mr-2" variant="text" color="grey">cancelar</v-btn>
                        <v-btn type="submit" class="mt-5" color="success">Avançar</v-btn>
                    </div>
                </v-form>
            </v-card-text>
            <v-card-text v-else>
            <div class="pa-2 border">
                <div class="pa-2 mb-5">
                    <h3 class="text-h5 mb-5">{{ edit.title }}</h3>
                    <p v-html="edit.text"></p>
                    <br>
                    <p>{{ edit.name_law }}</p>
                    Link: <router-link :to="`/text/${edit.id_law}`">Acessar norma</router-link>
                </div>
                <div v-if="!saveConfirm" class="text-right">
                    <v-btn @click="confirm = false" variant="text" class="mr-2">Voltar</v-btn>
                    <v-btn variant="flat" :disabled="publishStore.readLoad" color="primary" :loading="publishStore.readLoad" @click="savePublish">Salvar</v-btn>
                </div>
                <v-alert v-else type="success" text="Publicação salva!">
                    <template v-slot:append>
                        <v-btn @click="dialog = false, saveConfirm = false, confirm = false" class="mr-1" variant="text">Fechar</v-btn>
                        <v-btn @click="$router.push('/legesporlei?section=news')" variant="flat">Ver Publicação</v-btn>
                    </template>
                </v-alert>
            </div>
        </v-card-text>
        </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    import { usePublishStore } from '@/store/publishStore';
    const publishStore = usePublishStore()

    const dialog = ref(false)
    const form = ref(null)
    const confirm = ref(false)

    const rules = {
        required: value => !!value || "campo obrigatório", 
        minfield: (v) => (v||'').length >= 3 || "Mínimo 4 caracteres",
    }

    const props = defineProps({
        edit: Object
    })

    const confirmText = async () => {
        const { valid } = await form.value.validate()

        if(valid) {
            confirm.value = true
        }
    }

    const saveConfirm = ref(false)

    const savePublish = async () => {
        await publishStore.editPublicacoes(props.edit);
        saveConfirm.value = true
    }
</script>

<style scoped>

</style>