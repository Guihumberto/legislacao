<template>
    <v-btn
        color="white"
        variant="outlined"
        @click="dialog = !dialog"
    >coleção de normas ({{ docs.length }})</v-btn>
    <v-dialog v-model="dialog">
        <div class="mx-auto">
            <v-card width="800">
                <v-card-title class="bg-blue d-flex justify-space-between align-center">
                    <div class="d-flex ga-2">
                        <v-icon>mdi-plus</v-icon>Adicionar a Coleção de Normas
                    </div>
                    <v-btn @click="dialog = false" variant="text" density="comfortable" icon="mdi-close"></v-btn>
                </v-card-title>
                <v-card-text>
                    <div class="border pa-5 mt-2">
                        <p>Salvar Coleção de normas</p>
                        <v-form @submit.prevent="saveCollection()" class="mt-5" ref="form">
                            <v-text-field
                                label="Nome da Coleção"
                                variant="outlined"
                                density="compact"
                                v-model="collection.title"
                                placeholder="Digite o nome da coleção"
                                :rules="[rules.minfield, rules.required]"
                                color="success"
                                focused
                            ></v-text-field>
                            <v-textarea
                                class="mt-5"
                                label="Descrição"
                                variant="outlined"
                                v-model="collection.description"
                                color="success"
                                placeholder="Digite em poucas palavras o tópico relavante dessa coleção"
                            ></v-textarea>
                            <div class="d-flex justify-space-between align-center">
                                <div>
                                    <v-btn @click="dialog = false" variant="text" color="grey">cancelar</v-btn>
                                    <v-btn 
                                        @click="printAndView()" 
                                        variant="text" prepend-icon="mdi-printer">Imprimir</v-btn>
                                </div>
                                <div class="d-flex justify-space-end align-center">
                                    <v-switch
                                        label="Publicar"
                                        v-model="collection.publish"
                                        hide-details
                                        color="success"
                                        class="mr-2"
                                        density="compact"
                                    ></v-switch>
                                    <v-btn variant="flat" color="success" type="submit">Salvar</v-btn>
                                </div>
                            </div>
                        </v-form>
                    </div>
                    <div class="border pa-5 mt-2" id="top">
                        <h2 class="text-h5">Lista de normas adicionadas</h2>
                        <div class="py-5">
                            <v-list>
                                <v-list-item 
                                    v-for="ind, x in docs" :key="x" 
                                    :subtitle="`${ind.tipo} - ${ind.ano}`"
                                    link
                                >
                                    <template v-slot:prepend>
                                        <v-icon icon="mdi-file-document"></v-icon>
                                    </template>
                                    <span>{{ ind.title }} - total pag. {{ ind.total_pages }}</span>
                                    <template v-slot:append>
                                        {{ x + 1 }}
                                    </template>
                                </v-list-item>
                            </v-list>
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </div>
    </v-dialog>
</template>

<script setup>
    import { ref } from 'vue';
    import { useUserAreaStore } from '@/store/AreaUserStore'
    const userAreaStore = useUserAreaStore()
    import { useRouter } from 'vue-router';
    const router = useRouter()
   

    const dialog = ref(false)

    const form = ref(null)

    const collection = ref({
        title: null, 
        description: null,
        publish: false,
        active: true,
        laws: []
    })

    const rules = {
        required: value => !!value || "campo obrigatório", 
        minfield: (v) => (v||'').length >= 3 || "Mínimo 4 caracteres",
    }

    const props = defineProps({
        docs: Array
    })

    const emits = defineEmits(['apagarDocs'])

    const printAndView = async () => {
        const objeto = {
            name: Date.now(),
            law: props.docs
        }
        await userAreaStore.printAndViewTemp(objeto)
        router.push(`collection_search/${objeto.name}`)
    }

    const clearCollection = () => {
        collection.value = {
            title: null, 
            description: null,
            publish: false,
            active: true
        }
    }

    const saveCollection = async () => {
        const { valid } = await form.value.validate()
        if(valid) {
            collection.value.laws = props.docs
            userAreaStore.saveCollection(collection.value)
            clearCollection()
            emits('apagarDocs')
            dialog.value = false
        }
    }


</script>

<style lang="scss" scoped>

</style>