<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <div class="d-flex justify-space-between align-center">
                <h1 class="text-h5 d-flex align-center"> <v-icon color="#030131" size="1.7rem" class="mr-1">mdi-tools</v-icon>Cadastro</h1>
            </div>
            <div>
                <v-form @submit.prevent="importar" ref="form" class="mt-4" >
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
                        <v-btn :loading="loadLei" :disabled="loadLei" type="submit" class="mt-4" color="grey" @click="loadLaw">Carregar</v-btn>
                        <v-btn type="submit" class="mt-4" color="primary">Importar</v-btn>
                        <v-btn type="submit" class="mt-4" color="success" @click="saveQuestoes">Salvar</v-btn>
                    </div>
                </v-form>
            </div>

            <div class="pa-5">
                gerar tags importante em lote <br>
                gerar vinculos com sumulas e julgados <br>
                gerar comentarios em lote <br>
                filtrar pelo artigo selecionado na busca
            </div>

            <div v-if="listFinal.length && !loadLei" class="mt-5 border rounded-lg pa-5">
                <h5 class="mb-5">Adicionar Tags em lote para artigo</h5>
                <v-form @submit.prevent="saveTagList" ref="refTag"> 
                    <v-text-field
                        label="Artigos"
                        variant="outlined"
                        density="compact"
                        v-model="artigosList"
                        :rules="[rules.required]"
                        clearable
                    >
                    </v-text-field>
                    <v-autocomplete
                        v-model="tag"
                        v-model:search="searchTag"
                        :items="filteredTags"
                        label="Tag"
                        variant="outlined"
                        density="compact"
                        clearable
                        :loading="loadTag"
                        :disabled="loadTag"
                        hide-no-data
                        hide-details
                        @keydown.enter="saveTagList"
                        :search-input.sync="tag"
                        :rules="[rules.required]"
                         class="mb-5"
                    ></v-autocomplete>
                    <v-btn type="submit" :loading="loadTag" :disabled="loadTag">Salvar</v-btn>
                </v-form>
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
    import { ref, computed } from 'vue';
    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()

    import { useForumStore } from '@/store/ForumStore'
    const forumStore = useForumStore()    

    import { useSnackStore } from '@/store/snackStore';
    const snackStore = useSnackStore()
    
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

    const listFinal = ref([])
    const searchTag = ref('')
    const tag = ref(null)
    const loadLei = ref(false)
    const loadTag = ref(false)
    const artigosList = ref(null)
    const refTag = ref(null)


    const loadLaw = async() => {
        loadLei.value = true
        await forumStore.getAllPages(lawSelect.value)
        listFinal.value = forumStore.readAllPages
        loadLei.value = false
    }

    const filteredTags = computed(() => {
        const list = listFinal.value
        const tags = list.flatMap(x => x.tags.map(tag => tag.toLowerCase()))
        const tagsFlat = tags.flat()
        const tagsUnique = [...new Set(tagsFlat)]
        return tagsUnique
    })

    const saveTagList = async () => {
        const { valid } = await refTag.value.validate()

        loadTag.value = true
        if(searchTag.value) saveTag2()

        const arts = artigosList.value.split(/[, -]/)
        const artsList = [...new Set(arts)].filter(x => x.trim()).map(Number)
        const filterDispostivos = filterArts(artsList)
        await copyTagArg(filterDispostivos)

        snackStore.activeSnack('Tags copiadas!', 'success')
        loadTag.value = false
        tag.value = null
        artigosList.value = null
    }

    const filterArts = (items) => {
        const list = listFinal.value.filter( x => items.includes(x.art))
        return list
    }

    const saveTag2 = () => {
        tag.value = searchTag.value
        searchTag.value = ''
    }

    const copyTagArg = async (list) => {
        try {
            for (const el of list) {
                const exist = el?.tags.find(x => x.toLowerCase().trim() == tag.value.toLowerCase().trim())
                if (!exist && tag.value) {
                    await forumStore.saveTag(tag.value, el.id)
                    el.tags.push(tag.value.toLowerCase().trim())
                }
            }
        } catch (error) {
            console.log('erro ao copiar tags');
        }
    }

</script>

<style scoped>

</style>