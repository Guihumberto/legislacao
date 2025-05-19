<template>
    <v-card color="blue-lighten-5" variant="flat">
        <v-card-text v-if="!confirm">
            <h1 class="text-h6 mb-5 d-flex align-center">
                <v-icon size="1.5rem" class="mr-2">mdi-newspaper-variant-outline</v-icon>
                Publicar em Novidades - Últimas Atualizações
            </h1>
            <v-form @submit.prevent="confirmText()" ref="form">
                <v-text-field
                    label="Título"
                    density="compact"
                    variant="outlined"
                    v-model="formPublish.title"
                    :rules="[rules.required]"
                ></v-text-field>
                <v-textarea
                    label="Texto"
                    density="compact"
                    variant="outlined"
                    v-model="formPublish.text"
                   :rules="[rules.required]"
                ></v-textarea>
                <v-btn @click="$router.push('/importar')" class="mt-5 mr-2" variant="text" color="grey">cancelar</v-btn>
                <v-btn type="submit" class="mt-5" color="success">Avançar</v-btn>
            </v-form>
        </v-card-text>
        <v-card-text v-else>
            <div class="pa-2 border">
                <div class="pa-2 mb-5">
                    <h3 class="text-h5 mb-5">{{ formPublish.title }}</h3>
                    <p v-html="formPublish.text"></p>
                    <br>
                    <p>{{ formPublish.name_law }}</p>
                    Link: <router-link :to="`/text/${formPublish.id_law}`">Acessar norma</router-link>
                </div>
                <div v-if="!saveConfirm">
                    <v-btn @click="confirm = false" variant="text" class="mr-2">Voltar</v-btn>
                    <v-btn variant="flat" :disabled="publishStore.readLoad" color="primary" :loading="publishStore.readLoad" @click="savePublish">Salvar</v-btn>
                </div>
                <v-alert v-else type="success" text="Publicação salva!">
                    <template v-slot:append>
                        <router-link to="/legesporlei?section=news">Ver Publicação</router-link>
                    </template>
                </v-alert>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup>
    import { ref } from 'vue';

    import { usePublishStore } from '@/store/publishStore';
    const publishStore = usePublishStore()

    const form = ref(null)
    const confirm = ref(false)

    const props = defineProps({
        law: Object
    })

    const formPublish = ref({
        title: null,
        text: null,
        id_law: null,
        dateCreate: null, 
        created_by: null,
        name_law: null
    })

    const rules = {
        required: value => !!value || "campo obrigatório", 
        minfield: (v) => (v||'').length >= 3 || "Mínimo 4 caracteres",
    }

    const confirmText = async () => {
        const { valid } = await form.value.validate()

        if(valid) {
            formPublish.value.id_law = props.law.id
            formPublish.value.dateCreate = Date.now()
            formPublish.value.name_law = props.law.title

            confirm.value = true
        }
    }

    const saveConfirm = ref(false)

    const savePublish = async () => {
        await publishStore.savePublicacoes(formPublish.value);
        saveConfirm.value = true
    }

</script>

<style scoped>

</style>