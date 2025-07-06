<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <div class="d-flex justify-space-between mb-5">
                <v-btn variant="outlined" prepend-icon="mdi-arrow-left" @click="$router.push('/home/admin/')">Voltar</v-btn>
            </div>
             <v-card class="main-card" >
                <v-card-text class="pa-8">
                    <div class="section-header" v-if="!load">
                        <div class="title-wrapper">
                            <h2 class="section-title">Cadastro</h2>
                            <p class="section-subtitle">Gerencie suas normas</p>
                        </div>
                        <v-icon color="primary" size="3rem">mdi-book-outline</v-icon>
                    </div>
                    <div>
                        <v-form @submit.prevent="importar" ref="form" class="mt-4" >
                             <v-autocomplete
                                label="Normas"
                                density="compact"
                                variant="outlined"
                                v-model="lawSelect"
                                :items="displayItems"
                                item-title="title"
                                item-value="id"
                                :rules="[rules.required]"
                                :loading="lawStore.readLoadSearch"
                                :search="searchText"
                                :no-filter="true"
                                @update:search="handleSearchInput"
                                clearable
                                no-data-text="Nenhum resultado encontrado"
                            />
        
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
                </v-card-text>
            </v-card>

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
    import { ref, computed, onMounted, watch } from 'vue';
    import { useGeralStore } from '@/store/GeralStore';
    import { useForumStore } from '@/store/ForumStore'
    import { useSnackStore } from '@/store/snackStore';
    import { useQuestoesStore } from '@/store/forum/QuestoesStore';
    import { useLawStore } from '@/store/LawsStore';
    const lawStore = useLawStore()

    const geralStore = useGeralStore()
    const forumStore = useForumStore()    
    const snackStore = useSnackStore()
    const questoesStore = useQuestoesStore()

    const lawSelect = ref(null)
    const searchText = ref('')
    const searchResults = ref([])
    const isSearching = ref(false)

    const listaQuestoes = ref(null)
    const listImport = ref([])
    const form = ref(null)

    const rules = {
        required: value => !!value || 'Campo obrigatório',
    }

    const importar = async () => {
        const { valid } = await form.value.validate()
        if (valid) {
            const resp = isValidJsonString(listaQuestoes.value)
            listImport.value = resp.map(obj => ({
                ...obj,
                id_origin_law: lawSelect.value,
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
    const listLawStore = ref([])

    const listLaws = computed(() => {
        return listLawStore.value
    })

    const displayItems = computed(() => {
        if (isSearching.value && searchResults.value.length > 0) {
            return searchResults.value
        }
        return listLaws.value //forumStore.readMyGroup
    })

    let searchTimeout = null

    watch(searchText, async (newValue) => {
        clearTimeout(searchTimeout)
        
        // Se o texto tem menos de 4 caracteres, limpa a busca
        if (!newValue || newValue.length < 4) {
            isSearching.value = false
            searchResults.value = []
            return
        }
        
        // Debounce de 300ms
        searchTimeout = setTimeout(async () => {
            isSearching.value = true
            try {
                const results = await lawStore.searchLawByText(newValue)
                searchResults.value = results
            } catch (error) {
                console.error('Erro na busca:', error)
                searchResults.value = []
            }
        }, 300)
    })

    const handleSearchInput = (value) => {
        searchText.value = value
    }

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

    onMounted(async () => {
        const resp = await lawStore.searchLawAutocomplete()
        listLawStore.value = resp
    })

</script>

<style scoped>
.main-card {
    margin-top: 2rem;
    animation: fadeInUp 0.8s ease-out 0.2s both;
    border-radius: 16px;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.main-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    animation: slideInRight 0.8s ease-out 0.4s both;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    animation: slideInRight 0.8s ease-out 0.4s both;
}

.title-wrapper {
    flex: 1;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
}

.section-subtitle {
    color: #64748b;
    font-size: 1rem;
    margin: 0;
}

.header-decoration {
    animation: float 3s ease-in-out infinite;
    opacity: 0.7;
}


</style>