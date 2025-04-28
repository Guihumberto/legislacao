<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'" id="container" ref="targetSection">   
            <HeaderSearch  />
            <div class="content" ref="el1">
                <v-form @submit.prevent="searchEnv(1)" ref="form">
                    <div class="line1">
                        <v-text-field
                            density="compact"
                            class="textSearch"
                            clearable
                            label="Busca"
                            placeholder="Digite um ou mais termos ou frase exata"
                            prepend-inner-icon="mdi-magnify"
                            variant="outlined"
                            v-model="search.text"
                            :rules="[rules.required, rules.minname]"
                            @input="fetchSuggestions"
                            @keydown.down="navigateList('down')"
                            @keydown.up="navigateList('up')"
                            @keydown.enter.prevent="actionEnterBusca()"
                            @focus="showAutosuggest = true"
                        >
                        </v-text-field>
                        <div v-if="showAutosuggest">
                            <v-card class="autosuggestion" v-if="getAutosuggestion.length ||  generalStore.readListReduzida.length">
                                <v-card-text>
                                    <v-list>
                                        <v-list-item
                                            v-if="!getAutosuggestion.length"
                                            :active="i == focusedIndex"
                                             @click="includeTextSearchAutoSuggest(item)"
                                             density="compact" link v-for="item, i in generalStore.readListReduzida.slice(0, 5)" :key="item"
                                        >
                                            <template v-slot:prepend>
                                                <v-icon>
                                                    mdi-history
                                                </v-icon>
                                            </template>
                                            <p>{{ item }}</p>
                                        </v-list-item>
                                        <v-list-item 
                                            :active="i == focusedIndex"
                                            @click="includeTextSearchAutoSuggest(item._source.name)"
                                            density="compact" link v-for="item, i in getAutosuggestion" :key="i">
                                            <template v-slot:prepend>
                                                <v-icon>
                                                    mdi-magnify
                                                </v-icon>
                                            </template>
                                            <p>{{ item._source.name }}</p>
                                        </v-list-item>
                                        <div class="d-flex justify-end align-center">
                                            <v-btn flat @click="showAutosuggest = false">Fechar</v-btn>
                                        </div>
                                    </v-list>
                                </v-card-text>
                            </v-card>
                        </div>
                        <!-- <boxAutoSuggestion :search="search.text" :autosuggestion="getAutosuggestion" @close="autosuggestion = []" /> -->
                    </div>
                    <div class="d-flex justify-end align-center mb-2">
                        <div ref="el2">
                            <v-btn @click="filtrosavacados = !filtrosavacados" 
                                variant="text" class="pa-0 mr-2 text-capitalize btn-hover" color="grey"
                                density="compact"> <v-icon>mdi-filter-outline</v-icon>{{ reqRead }}
                            </v-btn>
                        </div>
                        <div ref="el3">
                            <ConfigSearch />
                        </div>
                    </div>
                    <v-expand-transition>
                        <div v-if="filtrosavacados">
                            <div class="autocompletes">
                                <v-autocomplete
                                    class="fonteSearch"
                                    density="compact"
                                    clearable
                                    chips
                                    label="Fonte da norma"
                                    :items="computedFontes"
                                    item-value="nome"
                                    item-title="mudar"
                                    multiple
                                    variant="outlined"
                                    v-model="search.fonte"
                                    closable-chips
                                    placeholder="Todas as fontes"
                                    @update:modelValue="toggleAllFontes"
                                >
                                    <template v-slot:item="{ props, item }">
                                        <v-list-item v-bind="props">
                                            <template v-if="item.raw.nome !== 'all'" v-slot:prepend>
                                                <v-checkbox 
                                                    color="primary" class="px-2" hide-details v-model="search.fonte" :value="item.raw.nome" density="compact">
                                                </v-checkbox>
                                            </template>
                                        </v-list-item>
                                    </template>
                                </v-autocomplete>
                                
                                <v-autocomplete
                                    v-model="search.years"
                                    @update:modelValue="toggleAllYears"
                                    class="periodoSearch"
                                    density="compact"
                                    clearable
                                    chips
                                    label="Período"
                                    :items="computedYears"
                                    multiple
                                    variant="outlined"
                                    closable-chips
                                    placeholder="Todo o período"
                                >
                                    <template v-slot:item="{ props, item }">
                                        <v-list-item v-bind="props">
                                            <template v-if="!computedListOptions.includes(item.value)" v-slot:prepend>
                                                <v-checkbox 
                                                    color="primary" class="px-2" 
                                                    hide-details v-model="search.years" :value="item.value" density="compact">
                                                </v-checkbox>
                                            </template>
                                        </v-list-item>
                                    </template>
                            </v-autocomplete>
                            </div>
                            <div v-if="search.fonte == 'diario'">
                                <div class="autocompletes">
                                    <v-autocomplete
                                        class="fonteSearch"
                                        density="compact"
                                        clearable
                                        chips
                                        label="Caderno"
                                        :items="['Executivo']"
                                        item-value="nome"
                                        item-title="mudar"
                                        multiple
                                        variant="outlined"
                                        v-model="search.notebook"
                                        closable-chips
                                        placeholder="Todas os Cadernos"
                                    ></v-autocomplete>
                                    <v-autocomplete
                                        class="periodoSearch"
                                        density="compact"
                                        clearable
                                        chips
                                        label="Estado"
                                        :items="['Maranhão']"
                                        multiple
                                        variant="outlined"
                                        v-model="search.estado"
                                        closable-chips
                                        placeholder="Todo os Estados"
                                    ></v-autocomplete>
                                    <v-autocomplete
                                        class="periodoSearch"
                                        density="compact"
                                        clearable
                                        chips
                                        label="Mês"
                                        :items="['Dezembro']"
                                        multiple
                                        variant="outlined"
                                        v-model="search.mes"
                                        closable-chips
                                        placeholder="Todos os Meses"
                                    ></v-autocomplete>
                                </div>
                            </div>
                            <!-- <div class="radios">
                                <v-radio-group inline :color="color" v-model="search.semantic" class="radiosGroup">
                                    <div class="border px-2 pt-2 radioDiv">
                                        <v-radio 
                                            density="compact"
                                            class="mr-2"
                                            v-for="item, i in semantic" :key="i" 
                                            :disabled="item.disabled"
                                            :label="item.name" :value="item.id">
                                        </v-radio>
                                    </div>
                                </v-radio-group>
                            </div> -->
                            <div class="radios">
                                <v-radio-group :color="color" class="radiosGroup">
                                    <v-tooltip text="Filtros não habilitado"  location="top">
                                        <template v-slot:activator="{ props }">
                                            <div class="border px-2 py-2 radioDiv" v-bind="props">
                                                <v-radio 
                                                    density="compact"
                                                    disabled
                                                    label="Incluir normas revogadas" value="item.ido">
                                                </v-radio>
                                                <v-radio 
                                                    density="compact"
                                                    disabled
                                                    label="Incluir normas não Eficaz" value="item.ide">
                                                </v-radio>
                                            </div>
                                        </template>
                                    </v-tooltip>
                                </v-radio-group>
                            </div>
                        </div>
                    </v-expand-transition>
                    <div class="text-center">
                        <v-btn width="250px" class="text-capitalize" flat  type="submit" :color="color" :loading="load" :disabled="load">Pesquisar</v-btn>
                    </div>
                </v-form>
            </div>
            <div class="resultsSearch" id="results" v-if="searchOn && search.semantic == 1">
                <div class="d-flex justify-space-between align-center">
                    <h2 class="my-3 text-h5">Resultados</h2>
                    <v-tabs
                        v-model="tab"
                        align-tabs="end"
                        color="deep-purple-accent-4"
                    >
                        <v-tab v-for="item in tab_name" :value="item" :text="item" :key="item">
                            <template v-slot:append>
                                <v-expand-transition>
                                    <v-badge v-if="item == 'Normas' &&  resultsSearchNormas?.total?.value" color="error">
                                        <v-icon icon="mdi-file-document" size="x-large"></v-icon>
                                    </v-badge>
                                </v-expand-transition>
                            </template>
                        </v-tab>
                    </v-tabs>
                </div>
                <div v-if="tab == 'Arcádio'">
                    <ArcadioIA :respArcadio="respArcadio" />
                </div>
                <div v-if="tab == 'Páginas'">
                    <div class="text-center my-10 py-10" v-if="load">
                        <v-progress-circular
                            :size="50"
                            color="primary"
                            indeterminate
                        ></v-progress-circular>
                    </div>
                    <div v-else>
                        <TermsSignificantSearch :terms="search.text" :firstSearch="firstSearch" @addSearch="addSearch" @renewSearchText="renewSearchText" />
                        <v-card variant="flat" class="border my-5"  v-if="resultsSearch.length"> 
                            <v-card-text>
                                <div class="facetas">
                                    <div class="d-flex align-center">
                                        Fonte:
                                        <v-chip-group
                                            class="ml-2"
                                            v-model="facetas.fonte"
                                            selected-class="text-primary"
                                            multiple
                                        >
                                            <v-chip
                                                v-for="f, fi in resultSearchFonte" :key="fi"
                                                :text="generalStore.fonteNome(f).mudar"
                                                :disabled="!disableFacetaFonte(f)"
                                                :value="f"
                                                variant="outlined"
                                                filter
                                                density="compact"
                                            ></v-chip>
                                        </v-chip-group>
                                    </div>
                                    <v-divider class="my-1"></v-divider>
                                    <div class="d-flex align-center">
                                        Ano:
                                        <v-chip-group
                                            class="ml-2"
                                            v-model="facetas.ano"
                                            selected-class="text-primary"
                                            multiple
                                        >
                                            <v-chip
                                                v-for="ano in resultSearchAno" :key="ano"
                                                :text="ano.toString()"
                                                :value="ano"
                                                variant="outlined"
                                                :disabled="!disableFacetaAno(ano)"
                                                filter
                                                density="compact"
                                            ></v-chip>
                                        </v-chip-group>
                                    </div>
                                    
                                    <v-expand-transition>
                                        <v-btn 
                                            v-if="facetas.fonte.length || facetas.ano.length" 
                                            variant="outlined" color="primary" class="text-lowercase" 
                                            @click="searchForFacetas()"
                                            density="compact">Utilizar Facetas selecionadas como filtro</v-btn>
                                    </v-expand-transition>
                                  
                                    <v-select
                                        v-model="facetas.norma"
                                        :items="resultSearchNorma"
                                        item-title="nome"
                                        item-value="id_law"
                                        label="Filtro de Normas"
                                        multiple
                                        variant="outlined"
                                        density="compact"
                                        class="mt-3"
                                        clearable
                                        hide-details
                                        focused
                                        color="success"
                                    >
                                        <template v-slot:selection="{ item, index }">
                                            <v-chip v-if="index < 2" density="compact">
                                                   <small>{{ item.title }}</small>
                                            </v-chip>
                                            <span v-if="index === 2" class="text-grey text-caption align-self-center">
                                                + outros {{ facetas.norma.length - 2 }}
                                            </span>
                                        </template>
                                    </v-select>
                                    <!-- <div class="d-flex align-center">
                                        Norma: 
                                        <v-chip-group
                                            class="ml-2"
                                            v-model="facetas.norma"
                                            selected-class="text-primary"
                                            column=""
                                            multiple
                                        >
                                            <v-chip
                                                v-for="norma, n in resultSearchNorma" :key="n"
                                                :text="norma.nome.toString()"
                                                :value="norma.id_law"
                                                variant="outlined"
                                                filter
                                                density="compact"
                                            ></v-chip>
                                        </v-chip-group>
                                    </div> -->
                                    <div v-if="facetas.norma.length">
                                        <v-form @submit.prevent="searchRestritLaw()" ref="formRestrit">
                                            <v-text-field
                                                label="Busca dentro da norma"
                                                variant="outlined"
                                                density="compact"
                                                class="mt-5"
                                                focused
                                                color="primary"
                                                placeholder="Pesquise dentro da norma selecionada"
                                                v-model="searchRestrit"
                                                :rules="[rules.minname, rules.required]"
                                                style="max-width: 500px;"
                                                clearable
                                            >
                                                <template v-slot:append>
                                                    <v-tooltip width="200" text="Busca dentro das normas selecionadas">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn v-bind="props" type="submit" density="comfortable" variant="text" icon="mdi-magnify"></v-btn>
                                                        </template>
                                                    </v-tooltip>
                                                </template>
                                            </v-text-field>
                                        </v-form>
                                        <v-alert v-if="erroSearchInToSearch" type="error" variant="text">
                                            <p>{{ erroSearchInToSearch }}</p>
                                        </v-alert>
                                    </div>
                                    <v-expand-transition>
                                        <div v-if="facetas.ano.length || facetas.fonte.length || facetas.norma.length">
                                            <p class="py-3">Total de páginas filtradas: {{ resultsSearchFilter.length }}</p>
                                        </div>
                                    </v-expand-transition>
                                </div>
                                <div class="d-flex justify-space-between align-center">
                                    <div class="d-flex justify-center align-center">
                                        <p class="py-3">Total de páginas encontradas: {{ totalDocs }}</p>
                                        <v-btn 
                                                v-if="resultsSearch.length" 
                                                @click="clearSearch" 
                                                variant="text" size="small" color="primary"
                                                title="limpa os resultados da busca"
                                                class="ml-1"
                                            >Limpar</v-btn>
                                    </div>
                                   
                                    <div class="btns2">
                                        <v-tooltip text="Ativar/desativar a visualização da página">
                                            <template v-slot:activator="{ props }">
                                                <v-btn
                                                    v-bind="props"
                                                    variant="outlined"
                                                    color="grey"
                                                    size="small"
                                                    class="mr-2"
                                                    @click="viewPreview = !viewPreview"
                                                    title="Mudar visualização"
                                                    v-if="!viewsAggs"
                                                ><v-icon>{{viewPreview ?'mdi-eye-outline':'mdi-eye-off-outline'}}</v-icon> </v-btn>
                                            </template>
                                        </v-tooltip>
                                        <v-tooltip max-width="250" :text=" viewsAggs ? 'Altera para visualização de uma página' : 'Alterar para visualização das páginas agregadas por norma'">
                                            <template v-slot:activator="{ props }">
                                                <v-btn
                                                    v-bind="props"
                                                    variant="outlined"
                                                    color="grey"
                                                    size="small"
                                                    class="mr-2"
                                                    @click="viewsAggs = !viewsAggs"
                                                    title="Mudar visualização"
                                                ><v-icon>{{viewsAggs ?'mdi-file-document-multiple-outline':'mdi-file'}}</v-icon> </v-btn>
                                            </template>
                                        </v-tooltip>                                
                                    </div>
                                </div>
                               
                            </v-card-text>
                        </v-card>
                        <div v-if="resultsSearchFilter.length" class="searchResult">
                            <aggs :searchResults="resultsSearch" v-if="viewsAggs" class="aggsResult"/>
                            <div class="lineResult" v-else>
                                <div 
                                    v-for="res, r in resultsSearchFilter" :key="r"
                                    class="allresultslist"    
                                >
                                    <div class="oneresult">
                                        <div class="titles">
                                            <div class="addplustitle">
                                                <v-tooltip text="inserir página">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn 
                                                            :color="docExiste(res._id)?'red':'green'" variant="plain" 
                                                            :icon="docExiste(res._id)?'mdi-minus-circle':'mdi-plus-circle'" 
                                                            :title="docExiste(res._id)?'excluir página': 'adicionar página'"
                                                            @click="inserirDoc(res)"
                                                        ></v-btn>
                                                    </template>
                                                </v-tooltip>
                                            </div>
                                            <div class="resulttitle">
                                                <FavLaws :law="res" @filter-law="filterlawActive" />
                                                <small class="ml-2">
                                                    Pág: {{ res._source.num_page }} | 
                                                    {{ generalStore.fonteNome(res._source.tipo).mudar }} | 
                                                    {{ res._source.ano }} | <v-icon :color="useRelevancia(res._score).color" 
                                                    :icon="useRelevancia(res._score).icon" :title="`${useRelevancia(res._score).title} - ${res._score}`" /> 
                                                    <v-chip v-if="res._source.revogado" density="compact" color="warning">Norma Revogada</v-chip>
                                                </small>
                                            </div>
                                        </div>   
                                        <div class="btns pr-1">
                                            <menuCopy :page="res._id" @copyLink="snackStore.activeSnack('Link copiado para área de transferência.')"  />
                                            <Favorito :page="res" />
                                            <v-btn title="ver todo o documento" variant="tonal" size="small" color="red" @click="openLaw(res)">PDF</v-btn>
                                        </div>
                                    </div>
                                    <v-expand-transition>
                                        <resumoSearch 
                                            v-if="viewPreview" :id="res._id" :text="res._source.text_page" :page="{ id: res._id, ...res._source}" 
                                            :searchP="search.text"  />
                                    </v-expand-transition>
                                </div>
                                <div class="pagination" v-if="!facetas.ano.length && !facetas.fonte.length && !facetas.norma.length">
                                    <v-pagination 
                                        density="compact"
                                        v-if="totalDocs > 20"
                                        class="my-5" 
                                        :total-visible="5"
                                        :length="Math.ceil(totalDocs/pagination.qtd)"
                                        v-model="pagination.page"
                                        @click="pagination.inicio=pagination.page*pagination.qtd-pagination.qtd, searchEnv(3)"
                                    ></v-pagination>
                                    <v-select
                                         v-if="totalDocs > 10"
                                        label="Quantidade"
                                        density="compact"
                                        :items="[5, 10, 20, 30, 40, 50]"
                                        style="width: 100px;"
                                        v-model="pagination.qtd"
                                        variant="outlined"
                                        hide-details="true"
                                    ></v-select>
                                </div>
                            </div>
                        </div>
                        <SearchFail v-else :result="result" @searchAgain="searchAgain" />
                    </div>
                </div>
                <div v-if="tab == 'Normas'">
                    <SearchLaw 
                        @clear="clearSearch()"
                        :resultsSearch="resultsSearchNormas" :load="lawStore.readLoadSearch" :searchActive="searchOn" type="search" />
                </div>
            </div>
            <resultSemantic :listSearch="generalStore.readSemanticList" v-if="search.semantic == 2" />
            <div v-if="document.length" class="fixed-element">
                <docs :docs="document" />
                <v-btn color="error" variant="text" prepend-icon="mdi-delete" @click="document=[]"> Excluir</v-btn>
                <DocumentSave v-if="!!loginStore.readLogin.cpf" :document="document" @fecharDoc="fecharDocuments" :textsearch="search.text" />
            </div>
        </div>
    </section>
</template>

<script setup>
    import api from '@/services/api'
    import { ref, computed, watch, onMounted, provide, toRef } from "vue"
    import { useRoute, useRouter } from "vue-router"
    const route = useRoute()
    const router = useRouter()

    import { useRelevancia } from "@/composables/relevanciaClass"

    import abackapi from "@/services/abackapi"
    import docs from "@/components/legislacao/dialogs/document"
    import aggs from "@/components/legislacao/buscas/searchAggs"
    
    import menuCopy from '@/components/legislacao/dialogs/menuCopy.vue'
    import resumoSearch from '@/components/legislacao/elements/resumoSearch'
    import HeaderSearch from "./elements/headerSearch.vue"
   
    import resultSemantic from "@/components/legislacao/elements/resultSemantic.vue"
    import DocumentSave from "./dialogs/documentSave.vue"
    import Favorito from "./dialogs/favorito.vue"
    import FavLaws from "./dialogs/favLaws.vue"
    import SearchFail from "./elements/searchFail.vue"
    import ConfigSearch from "./dialogs/configSearch.vue"
    import SearchLaw from './searchLaw/searchLaw.vue'

    import { useSnackStore } from "@/store/snackStore"
    const snackStore = useSnackStore()

    import { useAccessedNormsStore } from "@/store/NormsAccessedStore"
    const accessedStore = useAccessedNormsStore()

    import { useFavStore } from '@/store/FavStore'
    const favStore = useFavStore()

    import { useSearchStore } from "@/store/SearchStore"
    const searchStore = useSearchStore()

    import { useGeneralStore } from '@/store/GeneralStore'
    import { useGeralStore } from '@/store/GeralStore'
    import { useLawStore } from "@/store/LawsStore"
    import { useLoginStore } from '@/store/LoginStore'
    import { useAutoSuggestionStore } from "@/store/AutoSuggestions"
    import { useUserAreaStore } from "@/store/AreaUserStore"
    const generalStore = useGeneralStore()  
    const geralStore = useGeralStore()
    const lawStore = useLawStore()
    const areaStore = useUserAreaStore()
    const autoSuggestionStore = useAutoSuggestionStore()
    const loginStore = useLoginStore()

    const form = ref(null)
    const search = ref({
        text: '',
        years: [],
        fonte: [],
        termo: 2,
        semantic: 1,
        precision: false,
        notebook: 'Executivo',
        estado: 'Maranhão',
        mes: 'Dezembro',
        assertividade: 2,
        enableFuzzy:true
    })

    const firstSearch = ref('')

    const searchRestrit = ref(null)
    const formRestrit = ref(null)

    provide('search', search)

    const addSearch =(value) => {   
        if(!search.value.text){
            search.value.text = value
        } else {
            if(search.value.text) search.value.text = search.value.text + ' ' + value
        }
    } 

    const renewSearchText = (value) => {
        search.value.text = value
    }

    const tab = ref('Páginas')
    const tab_name = [ 'Arcádio', 'Páginas', 'Normas']
    const color = ref("primary")
    const filtrosavacados = ref(false)
    const searchOn = ref(false)
    const termos = ref([
        {id:2, name: "Qualquer palavra"},
        {id:1, name: "Frase Exata"}
    ])
    const semantic = ref([
        {id:1, name: "Palavras-chave", disabled: false},
        {id:2, name: "Semântica", disabled: true}
    ])
    const rules = ref({
        required: (value) => !!value || "Campo obrigatório",
        minname: (v) => (v||'').length >= 4 || "Mínimo 4 caracteres",
    })
    const resultsSearch = ref([])
    const load = ref(false)
    const document = ref([])
    const viewsAggs = ref(false)
    const pagination = ref({
        inicio: 0,
        qtd: 5,
        page: 1
    })
    const totalDocs = ref(0)

    const resultsSearchNormas = ref([])
    const viewPreview = ref(true)
    const result = ref("Sua pesquisa não encontrou nenhum documento correspondente")
    const autosuggestion = ref([])
    const showAutosuggest = ref(false)
    const focusedIndex = ref(-1)
    const selected = ref(null)
    const facetas = ref({
        ano: [],
        fonte: [],
        norma: []
    })

    const activeArcadioIA = ref(false)
    provide("activeArcadioIA", activeArcadioIA)

    const clearSearch = () => {
        resultsSearch.value = []
        searchOn.value = false
        resultsSearchNormas.value = []
        searchRestrit.value = null
        erroSearchInToSearch.value = null
        searchInToSearch.value = false
        limpar 
    }

    watch(() => pagination.value.qtd, (newVal, oldVal) => {
            searchEnv(1) 
            pagination.value.page = 1
        }, { deep: true }
    )

    watch(() => search.value.assertividade, (newVal, oldVal) => {
            if (newVal === 3) {
                search.value.enableFuzzy = false; // Desativa o switch se o slider assertividade for 3
            }
        }, { deep: true }
    )

    //Fontes e anos auto complete

    const computedAllOption = computed(() => {
        const allSelected = search.value.fonte.length === generalStore.readTiposRestrict.length;
        return {
            nome: 'all',
            mudar: allSelected ? 'Desmarcar Todos' : 'Selecionar Todos',
        };
    });

    const computedListOptions = computed(() => {
        return ['Desmarcar Todos', 'Selecionar Todos']
    })

    const computedFontes = computed(() => {
        return [ computedAllOption.value, ...generalStore.readTiposRestrict ]
    })

    const cumputedAllYears = computed(() => {
        const allSelected = search.value.years.length === generalStore.readPeriodo.length;
        return allSelected 
               ? 'Desmarcar Todos' 
               : 'Selecionar Todos'
    })

    const computedYears = computed(() => {
        return [ cumputedAllYears.value, ...generalStore.readPeriodo]
    })


    const toggleAllFontes = (value) => {
        if (value.includes('all')) {
            if( value.length === 1  || value.length < generalStore.readTiposRestrict.length + 1){
                search.value.fonte =  generalStore.readTiposRestrict.map((item) => item.nome)
            } else {
                search.value.fonte = []
            }
         } 
    }

    const toggleAllYears = (selectedYear) => {
        if (selectedYear.includes('Selecionar Todos')) {
            if(selectedYear.length === 1 || selectedYear.length < computedYears.value.length + 1){
                search.value.years = [...generalStore.readPeriodo];
            } else {
                search.value.years = []
            }
        } else if (selectedYear.includes('Desmarcar Todos')) {
            search.value.years = []
        } else {
            if (selectedYear.length === computedYears.value.length) {
                search.value.years = [...selectedYear, 'Selecionar tudo'];
            } else {
                search.value.years = selectedYear;
            }
        } 
    }


    //Seartch in to Search

    const searchInToSearch = ref(false)
    const erroSearchInToSearch = ref(null)

    const searchRestritLaw = async () => {
        const { valid } = await formRestrit.value.validate()
        if(valid){
            searchInToSearch.value = true
            erroSearchInToSearch.value = null
            try {
                load.value = true
                const response = await api.post('pages_v2/_search', {
                    query: {
                                "bool": {
                                    "must": [
                                        {
                                            "match": {
                                                "text_page": searchRestrit.value
                                            }
                                        },
                                        {
                                            "terms": {
                                                "page_to_norma.parent": facetas.value.norma
                                            }
                                        }
                                    ]
                                }
                            }
                })

                if(response.data.hits.total.value){
                    resultsSearch.value = response.data.hits.hits;
                    totalDocs.value = response.data.hits.total.value;
                } else {
                    erroSearchInToSearch.value = "não foram encontrados resultados para busca dentro da norma"
                }
                
            } catch (error) {
                console.log('error busca');
            } finally {
                load.value = false
            }
         
        }
    }

    const searchForFacetas = () => {
        filtrosavacados.value = true

        search.value.fonte = facetas.value.fonte
        search.value.years = facetas.value.ano
        deslocarTela()
    }

    const reqRead = computed(() => {
        let reqq = generalStore.readReq
        if(reqq){
            recActive()
        }
        return "filtros"
    })

    const getAutosuggestion = computed(() => {
        let list = autosuggestion.value[0]
        if(typeof list === 'object'){
            if(list.options){
                return list.options
            }
        } else {
            return []
        }
    })

    const resultSearch = computed(() => {
        return generalStore.readResultSearch.map(x => x._source)
    })

    const resultSearchAno = computed(() => {
        let list = resultSearch.value.map(x => x.ano)

        // if(this.facetas.fonte.length) list= this.resultsSearchFilter.map(x => x._source.ano)

        const listAnos = [...new Set(list)].sort((a, b) => a - b)

        return listAnos
    })

    const resultSearchFonte = computed(() => {
        let list = resultSearch.value.map(x => x.tipo)
        const listAnos = [...new Set(list)].sort((a, b) => a.localeCompare(b))
        return listAnos
    })

    const resultSearchNorma = computed(() => {
        let list = resultSearch.value.map(x => ({ id_law: x.page_to_norma.parent,  nome: x.page_to_norma.title}))
        const uniqueArray = Array.from(
                new Map(list.map(item => [item.id_law, item])).values()
        );
        return uniqueArray
    })

    const resultsSearchFilter = computed(() => {
        let list = resultsSearch.value

        if(facetas.value.ano.length){
            list = list.filter(x => facetas.value.ano.includes(x._source.ano))
        }

        if(facetas.value.fonte.length){
            list = list.filter(x => facetas.value.fonte.includes(x._source.tipo))
        }

        if(facetas.value.norma.length){
            list = list.filter(x => facetas.value.norma.includes(x._source.page_to_norma.parent))
        }

        return list
    })

    const filterFacetaFonte = computed(() => {
            const list = resultsSearchFilter.value.map(x => x._source.ano)
            const listSet = [...new Set(list)]
            return listSet
    })

    const filterFacetaFonteAll = computed(() => {
        let list = resultsSearch.value
        
        list = list.filter(x => facetas.value.fonte.includes(x._source.tipo))
        list = list.map(x => x._source.ano)
        const listSet = [...new Set(list)]
        return listSet
    })

    const filterFacetaAno = computed(() => {
            const list = resultsSearchFilter.value.map(x => x._source.tipo)
            const listSet = [...new Set(list)]
            return listSet
    })

    const filterFacetaAnoAll = computed(() => {
        let list = resultsSearch.value
        
        list = list.filter(x => facetas.value.ano.includes(x._source.ano))
        list = list.map(x => x._source.tipo)
        const listSet = [...new Set(list)]
        return listSet
    })

    const disableFacetaAno = (item) => {
        if(facetas.value.fonte.length && facetas.value.ano.length){
            const list = filterFacetaFonteAll.value.includes(item)
            return !!list
        }
        if(facetas.value.fonte.length){
            const list = filterFacetaFonte.value.includes(item)
            return !!list
        }
        if(!facetas.value.ano.length) {
            const list = filterFacetaFonte.value.includes(item)
            return !!list
        }
        return true
    }

    const disableFacetaFonte = (item) => {
        if(facetas.value.fonte.length && facetas.value.ano.length){
            const list = filterFacetaAnoAll.value.includes(item)
            return !!list
        }
        if(!facetas.value.fonte.length){
            const list = filterFacetaAno.value.includes(item)
            return !!list
        }
        if(facetas.value.ano.length) {
            const list = filterFacetaAno.value.includes(item)
            return !!list
        }
        return true
    }

    provide('filterLaws', toRef(facetas, 'norma'))

    const filterlawActive = (item) => {
        if(item) facetas.value.norma.push(item)
        if(!item) facetas.value.norma = []
    }

    const fetchSuggestions = async() => {
        if (search.value.text.length > 2) {
             await autoSuggestionStore.fetchSuggestions(search.value.text)
             autosuggestion.value = autoSuggestionStore.autosuggestion
             focusedIndex.value = -1
        } else {
            autosuggestion.value = []
        }
    }

    const actionEnterBusca = () => {
        if(getAutosuggestion.value.length && focusedIndex.value >= 0) {
            selectItem()
        } else {
            searchEnv(1)
        }
        showAutosuggest.value = false
    }

    const includeTextSearchAutoSuggest = (item) => {
        let copy = item
        search.value.text = copy
        autosuggestion.value = []
        showAutosuggest.value = false
    }

    const navigateList = (direction) => {
        if (direction === 'down') {
            focusedIndex.value = (focusedIndex.value + 1) % getAutosuggestion.value.length;
        } else if (direction === 'up') {
            focusedIndex.value = (focusedIndex.value - 1 + getAutosuggestion.value.length) % getAutosuggestion.value.length;
        }
    }

    const selectItem = () => {
        if (focusedIndex.value >= 0) {
            selected.value = getAutosuggestion.value[focusedIndex.value];
            includeTextSearchAutoSuggest(selected.value.text)
        }
    }

    const respArcadio = ref('')

    const searchEnv = async (envSolici=1) => {
        searchInToSearch.value = false
        erroSearchInToSearch.value = null
        showAutosuggest.value = false
        searchRestrit.value = null
        router.push(`leges?search=${search.value.text}&years=${search.value.years}&fonte=${search.value.fonte}&termo=${search.value.termo}&precision=${search.value.precision}`)
        const { valid } = await form.value.validate()
        if(valid){
            geralStore.changeHeaderNoShow(false)
            facetasClear()
            autosuggestion.value = []
            if(envSolici==1) generalStore.addListSearch(search.value)
            salvaNoBanco()
            resultsSearch.value = []
            searchOn.value = true
            load.value = true
            if(envSolici == 1){
                pagination.value.page = 1
                pagination.value.inicio = 0
            } 
            if(search.value.semantic == 1) {
                try {
                    console.log("Backend URL 1:", import.meta.env.VITE_ABACK);
                    console.log("axios URL 1:", abackapi.defaults.baseURL);
                    load.value = true
                    const requestBody = {
                        from: pagination.value.inicio,
                        size: pagination.value.qtd,
                        text: search.value.text, 
                        tiposNormativos: search.value.fonte,  
                        ano: search.value.years, 
                        assertividade: search.value.assertividade, 
                        enableFuzzy: search.value.enableFuzzy 
                    };
                    console.log("Json: ", JSON.stringify(requestBody, null, 2));
                    const response = await abackapi.post("/buscarpaginas", requestBody, {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    console.log(response)
                    resultsSearch.value = response.data.hits.hits;
                    totalDocs.value = response.data.hits.total.value;
                } catch (error) {

                    try {
                        const resp = await searchStore.searchElastic(search.value, pagination.value)
                        resultsSearch.value = resp.data.hits.hits;
                        totalDocs.value = resp.data.hits.total.value;
                    } catch (errorE) {
                        snackStore.activeSnack(error.response.data.errors, "error")
                        result.value = error.response.data.errors
                    }

                }finally{
                    load.value = false
                    deslocarTela('results')
                    generalStore.copyResults(resultsSearch.value)
                    showAutosuggest.value = false
                    searchForLaw()
                    firstSearch.value = search.value.text
                    if(totalDocs.value) accessedStore.getAccessUser(resultsSearch.value.map( x => x._id))
                    if(totalDocs.value) favStore.getAllFavoritos(resultsSearch.value)
                    
                    //chat ia
                    if(activeArcadioIA.value){
                        const resp = await searchStore.searchIaAll(search.value.text)
                        respArcadio.value = resp || 'Não foi possível obter a resposta para essa pergunta'
                    }
                    
                    changeTab()

                }
            } else if (search.value.semantic == 2){
                load.value = false
                generalStore.semanticSearch(search.value.text)
            }
        }
    }

    const changeTab = () => {
        if(activeArcadioIA.value){
            tab.value = 'Arcádio'
            return
        }
        if (!resultsSearch.value.length) {
            tab.value = 'Normas'
        }
    }

    const searchForLaw = async() => {
        try {
            resultsSearchNormas.value = []
            resultsSearchNormas.value = await lawStore.getSearchPorlei(search.value);
            lawStore.copyResults(resultsSearchNormas.value)
        } catch (error) {
            console.log("erro resultsSearchNormas");
            resultsSearchNormas.value = []
        } 
    }

    //document
    provide('document', document)

    const inserirDoc = (item) => {
        const res = docExiste(item._id)
        if(res){
            document.value = document.value.filter(x => x.id != res)
            snackStore.activeSnack("Página Removida.", "error")
        }else {
            const objeto = {
                id: item._id,
                id_law: item._source.page_to_norma.parent,
                name_law: item._source.page_to_norma.title,
                text_page: item._source.text_page,
                ano: item._source.ano,
                tipo: item._source.tipo,
                num_page: item._source.num_page,
                revogado: item._source.revogado,
                sigiloso: item._source.sigiloso
            }
            document.value.push(objeto)
            snackStore.activeSnack('Nova página adicionada ao documento.', 'success')
        }
    }

    const docExiste = (item) => {
        let ids = document.value.map(x => x.id)
        let find = ids.find(x => x == item)
        return !!find
        ? find
        : false
    }

    const recActive = async () => {     
        const reqSearch = await generalStore.readSearch
        search.value = await { ...reqSearch}
        searchEnv(2)
        search.value.semantic = 1
        generalStore.reqChange(false)
    }

    const openLaw = (item) => {
        const link = item._source.page_to_norma.parent
        window.open(`text/${link}?search=search`, '_blank');
    }

    const salvaNoBanco = () => { 
        areaStore.saveHistory(search.value)
    }

    const facetasClear = () => {
        facetas.value = {
            ano: [],
            fonte: [],
            norma: []
        }
    }

    //deslocar tela
    const targetSection = ref(null);

    const deslocarTela = () => {
        targetSection.value.scrollIntoView({behavior: "smooth"})
    }

    const limpar = () => {
        generalStore.copyResults([])
    }

    const searchAgain = (searchb) => {
        router.push(`leges?search=${searchb}`)
        generalStore.reqChangeFromSelectSearch(true, searchb)
    }

    const fecharDocuments = () => {
        document.value = []
        snackStore.activeSnack('Documento Salvo', 'success')
    }

    import { searchInitial } from "@/composables/tutorialSearch";
    import TermsSignificantSearch from './elements/aggs/termsSignificantSearch.vue'
    import ArcadioIA from './dialogs/arcadioIA.vue'

    const el1 = ref(null);
    const el2 = ref(null);
    const el3 = ref(null);
    searchInitial(el1, el2, el3);

    onMounted(() => {
        console.log("Versão 3");
        if(route.query.search){
            searchAgain(route.query.search)
        }

        if(generalStore.readResultSearch.length){
            resultsSearch.value = generalStore.readResultSearch
            resultsSearchNormas.value = lawStore.readResultsLaw
            searchOn.value = true
            deslocarTela()
        }
    })

</script>

<style  scoped>
section{
    transition: all .8s ease;
    background-color: #f9f9f9;
    width: 100%;
}
.content{
    animation: aparecer 1.5s ease-in;
    padding: 2rem 5rem;
    transition: 1s ease;
}
.line1{
    position: relative;
    display: flex;
    flex-direction: column;
}
.autosuggestion{
    position: absolute;
    top: 2.5rem;
    width: 100%;
    z-index: 1;
}
.radios{
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap:1rem
}
.radioDiv{
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.autocompletes{
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 1rem;
}
.fonteSearch, .periodoSearch{
    width: 100%;
}
.lineResult, .aggsResult{
    animation: aparecer .5s ease-in;
}
.titles{
    display: flex;
    align-items: baseline;
}
.fixed-element {
  position: fixed;
  text-align: center;
  bottom: 0; /* Ajuste conforme necessário */
  left: 80%; /* Centraliza horizontalmente */
  border-radius: 12px 12px 0 0;
  color: #fff;
  background-color: #05044A; /* Fundo para visualizar melhor */
  padding: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1); /* Sombra opcional */
  z-index: 1000; /* Certifique-se de que está acima de outros elementos */
  animation: slideTopDocument .5s ease-in;
  transition: 1s ease;
}
@media (max-width: 1200px) {
    .fixed-element{
        left: 50%;
        transform: translateX(-50%);       
    }
}
@keyframes slideTopDocument {
    0%{
        transform: translateY(300px);
    }
    100%{
        transform: translateY(0);
    }
}

.oneresult{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #eceaea;
}
.oneresult .btns{
    display: flex;
    align-items: center;
    gap: .5rem;
}
.title{
    font-size: 1.3rem;
}
.subtitle{
    font-size: .9rem;
}
.spaceFooter{
    display: none;
}
.pagination{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
}
.btn-hover:hover{
    background: rgb(234, 231, 231);
}
@media (max-width: 1020px) {
    .radioDiv{
        margin-right: .5rem;
    }
}
@media (max-width: 780px) {
    .radios{
        flex-direction: column-reverse;
        justify-content: left;
        align-items: flex-start;
        margin-top: 1.5rem;
    }
    .radiosGroup{
        margin: -2rem 0 0 0;
        padding: .5rem 0;
    }
    .radioDiv{
        flex-direction: column;
    }
    .checkboxx{
        margin: -.5rem 0 0 0;
    }
}
@media (max-width: 500px) {
    .content{
        padding: .8rem;
    }
    .line1{
        display: flex;
        flex-direction: column;
        align-items: baseline;
    }
    .line1 .textSearch{
        width: 100%;
    }
    .autocompletes{
        flex-direction: column;
        gap: 0;
    }
    .checkboxx{
        margin-bottom: .5rem;
    }
    .btns2{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: .5rem;
        margin-top: 1rem;
    }
    .oneresult{
        flex-direction: column;
        align-items: baseline;
        gap: .8rem;
    }
    .oneresult .btns{
        align-items: center;
        justify-content: end;
        width: 100%;
        
    }
    .spaceFooter{
        display: block;
    }
    /* .v-input--density-compact {
        --v-input-control-height: 10px;
        --v-input-padding-top: 5px;
        --v-field-padding-bottom: 5px;
    } */
}
</style>
