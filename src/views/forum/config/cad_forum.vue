<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <div class="d-flex justify-space-between align-center">
                <h1 class="text-h5 d-flex align-center"> <v-icon color="#030131" size="1.7rem" class="mr-1">mdi-tools</v-icon>Cadastro</h1>
            </div>
            <div>
                <v-form @submit.prevent="importar" ref="form" class="mt-4">
                    <v-select
                        label="Nome"
                        density="compact"
                        variant="outlined"
                        v-model="lawSelect"
                        :items="forumStore.readMyGroup"
                        item-title="title"
                        item-value="id"
                        :rules="[rules.required]"
                    >
                    </v-select>
                    <v-textarea
                        label="Array de questões"
                        density="compact"
                        variant="outlined"
                        v-model="listaQuestoes"
                        :rules="[rules.required]"
                    ></v-textarea>
                    <div class="d-flex ga-2">
                        <v-btn type="submit" class="mt-4" color="primary">Importar</v-btn>
                        <v-btn type="submit" class="mt-4" color="success" @click="saveQuestoes">Salvar</v-btn>
                    </div>
                </v-form>
            </div>

            <div class="pa-5">
                gerar tags importante em lote <br>
                gerar vinculos com sumulas e julgados <br>
                gerar comentarios em lote <br>
                filtrar por comentário feito - apenas meus comentários <br>
                filtrar pelo artigo selecionado na busca
            </div>

            <div v-if="listImport.length > 0" class="mt-5">
                <div v-for="(item, index) in listImport" :key="index" class="pa-2 mb-2 border rounded-lg">
                    <div class="pa-1 border rounded-lg bg-primary mb-2">
                        <b>{{ item.id_law }}</b> - {{ item.date_created }} - {{ item.created_by }} - {{ item.tipo }}
                    </div>
                    <b>{{ index + 1 }}) </b>{{ item.pergunta }} <br><br>
                    {{ item.resposta }} - {{ item.id_art }} <br>
                    {{ item.justificativa }} <br>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>

    import { ref } from 'vue';
    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()

    import { useForumStore } from '@/store/ForumStore'
    const forumStore = useForumStore()    
    
    import { useQuestoesStore } from '@/store/forum/QuestoesStore';
    const questoesStore = useQuestoesStore()

    const lawSelect = ref(null)
    const listaQuestoes = ref(null)
    const listImport = ref([])
    const form = ref(null)

    const rules = {
        required: value => !!value || 'Campo obrigatório',
    }

    const objeto = {
        pergunta: "O texto sugere que a instalação de obras ou atividades potencialmente causadoras de degradação do meio ambiente não necessita de estudo prévio de impacto ambiental?",
        resposta: "falso",
        justificativa: "No inciso IV, o texto exige, na forma da lei, para instalação de obra ou atividade potencialmente causadora de significativa degradação do meio ambiente, um estudo prévio de impacto ambiental.",
        id_art: "225",
        id_law: "j9VRlpYBHUN660Nlh4Ik",
        tipo: "c/e",
        date_created: 1746457555094,
        created_by: "admin"
    }

    const importar = async () => {
        const { valid } = await form.value.validate()
        if (valid) {
            const resp = isValidJsonString(listaQuestoes.value)
            listImport.value = resp.map(obj => ({
                ...obj,
                id_law: lawSelect.value,
                tipo: "c/e",
                date_created: Date.now(),
                created_by: "admin"
            }))
        }
    }

    const isValidJsonString = (str) => {
        try {
            const parsed = JSON.parse(str);
            return parsed
        } catch (e) {
            return false;
        }
    }

    const load = ref(false)

    const saveQuestoes = async () => {
        load.value = true
        const resp = await questoesStore.saveQuestoesLawManual(listImport.value)
        console.log('resp', resp);
        listImport.value = []
        listaQuestoes.value = null
        lawSelect.value = null
        load.value = false
    }

</script>

<style scoped>

</style>