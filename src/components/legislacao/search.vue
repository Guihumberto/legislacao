<template>
    <section>
        <div class="container" id="container">   
            <div class="headSearch">
                <div>
                    <router-link class="text-black" to="/">{{ reqRead }}</router-link> 
                    <contador class="contador" />
                </div> 
                <div class="d-flex align-center">
                    <router-link to="/legesporlei" class="linkTO">Busca por Norma</router-link>
                    <help title="ajuda" :idHelp="1" class="ml-2 contador" />
                    <menuOpt class="contador" />
                </div>
            </div>
            <div class="headSearchTwo my-5">
                <h2>Busca na legislação</h2>
                <small>Busca por termos, frases, fontes e periodos.</small>
            </div>
            <div class="content">
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
                        >
                            <template v-slot:append>
                                    <v-tooltip text="Usa o conectivo 'E' na busca realizada, retornando apenas as páginas que tiverem todos os termos digitados, reduzindo a quantidade de resultados.">
                                        <template v-slot:activator="{ props }">
                                            <v-checkbox 
                                                :disabled="search.termo == 1 || search.semantic == 2"
                                                density="compact"
                                                v-bind="props"
                                                class="checkboxx contador"
                                                label="Precisão" color="red-darken-3" 
                                                v-model="search.precision"
                                                hide-details="true"
                                            ></v-checkbox>
                                        </template>
                                    </v-tooltip>
                            </template>
                        </v-text-field>
                        <v-card class="autosuggestion" v-if="getAutosuggestion.length">
                            <v-card-text>
                                <v-list>
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
                                        <v-btn flat @click="autosuggestion = []">Fechar</v-btn>
                                    </div>
                                </v-list>
                            </v-card-text>
                        </v-card>
                        <!-- <boxAutoSuggestion :search="search.text" :autosuggestion="getAutosuggestion" @close="autosuggestion = []" /> -->
                    </div>
                    <v-btn @click="filtrosavacados = !filtrosavacados" 
                        variant="text" class="pa-0 ma-0 text-capitalize mb-2" 
                        density="compact"> <v-icon>mdi-filter-outline</v-icon>Filtros
                    </v-btn>
                    <v-expand-transition>
                        <div v-if="filtrosavacados">
                            <div class="radios">
                                <v-radio-group :disabled="search.semantic == 2" inline color="indigo" v-model="search.termo" class="radiosGroup">
                                    <div class="border px-2 pt-2 radioDiv">
                                        <v-radio 
                                            density="compact"
                                            @click="search.precision = false"
                                            v-for="item, i in termos" :key="i" 
                                            :label="item.name" :value="item.id">
                                        </v-radio>
                                    </div>
                                </v-radio-group>
                                <v-radio-group inline color="red" v-model="search.semantic" class="radiosGroup">
                                    <div class="border px-2 pt-2 radioDiv">
                                        <v-radio 
                                            density="compact"
                                            @click="search.precision = false"
                                            class="mr-2"
                                            v-for="item, i in semantic" :key="i" 
                                            :label="item.name" :value="item.id">
                                        </v-radio>
                                    </div>
                                </v-radio-group>
                            </div>
                            <div class="autocompletes">
                                <v-autocomplete
                                    class="fonteSearch"
                                    density="compact"
                                    clearable
                                    chips
                                    label="Fonte da norma"
                                    :items="fontes"
                                    item-value="nome"
                                    item-title="mudar"
                                    multiple
                                    variant="outlined"
                                    v-model="search.fonte"
                                    closable-chips
                                    placeholder="Todas as fontes"
                                ></v-autocomplete>
                                <v-autocomplete
                                    class="periodoSearch"
                                    density="compact"
                                    clearable
                                    chips
                                    label="Período"
                                    :items="periodo"
                                    multiple
                                    variant="outlined"
                                    v-model="search.years"
                                    closable-chips
                                    placeholder="Todo o período"
                                ></v-autocomplete>
                            </div>
                        </div>
                    </v-expand-transition>
                    <div class="text-center">
                        <v-btn width="250px" class="text-capitalize" flat  type="submit" color="indigo">Pesquisar</v-btn>
                    </div>
                </v-form>
            </div>
            <div class="resultsSearch" id="results" v-if="searchOn && search.semantic == 1">
                <h2 class="my-3">Resultados</h2>
                <div class="text-center" v-if="load">
                    <v-progress-circular
                        :size="50"
                        color="primary"
                        indeterminate
                    ></v-progress-circular>
                </div>
                <div v-else>
                    <div class="border my-5 pa-2"  v-if="resultsSearch.length"> 
                        <div class="facetas">
                            <div class="d-flex align-center">
                                <h2 class="text-overline mr-1">Fonte: </h2>
                                <v-chip-group
                                    v-model="facetas.fonte"
                                    selected-class="text-primary"
                                    multiple
                                >
                                    <v-chip
                                        v-for="f in resultSearchFonte" :key="f"
                                        :text="f"
                                        :value="f"
                                        variant="outlined"
                                        filter
                                        density="compact"
                                    ></v-chip>
                                </v-chip-group>
                            </div>
                            <div class="d-flex align-center">
                                <h2 class="text-overline mr-1">Ano: </h2>
                                <v-chip-group
                                    v-model="facetas.ano"
                                    selected-class="text-primary"
                                    multiple
                                >
                                    <v-chip
                                        v-for="ano in resultSearchAno" :key="ano"
                                        :text="ano"
                                        :value="ano"
                                        variant="outlined"
                                        filter
                                        density="compact"
                                    ></v-chip>
                                </v-chip-group>
                            </div>
                        </div>
                        <div class="d-flex justify-space-between align-center">
                            <div class="d-flex justify-center align-center">
                                <p class="py-3">Total de páginas encontradas: {{ this.totalDocs }}</p>
                                <v-btn 
                                        v-if="resultsSearch.length" 
                                        @click="resultsSearch = [], searchOn = false, limpar()" 
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
                                <v-tooltip text="altera para uma página ou para todas as páginas agregadas por norma">
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
                    </div>
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
                                                        :icon="docExiste(res._id)?'mdi-delete':'mdi-plus-circle'" 
                                                        :title="docExiste(res._id)?'excluir página': 'adicionar página'"
                                                        class="ml-n1 mr-n2"
                                                        @click="inserirDoc(res)"
                                                    ></v-btn>
                                                </template>
                                            </v-tooltip>
                                        </div>
                                        <div class="resulttitle">
                                            <p>{{res._source.page_to_norma.title}}</p>
                                            <small>Pág: {{ res._source.num_page }} | {{ res._source.tipo }} | {{ res._source.ano }} | <v-icon :color="relevancia(res._score).color" :icon="relevancia(res._score).icon" :title="`${relevancia(res._score).title} - ${res._score}`" /> </small>
                                        </div>
                                    </div>   
                                    <div class="btns pr-1">
                                        <menuCopy :page="res._id" @copyLink="snackCopy()"  />
                                        <v-btn title="ver todo o documento" variant="tonal" size="small" color="red" @click="openLaw(res)">PDF</v-btn>
                                    </div>
                                </div>
                                <v-expand-transition>
                                    <resumoSearch v-if="viewPreview" :id="res._id" :text="res._source.text_page" :page="res._source" :searchP="search.text" />
                                </v-expand-transition>
                            </div>
                            <div class="pagination">
                               
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
                    <div v-else>
                        <v-alert variant="tonal" type="warning">
                            <p>{{ result }}</p>
                        </v-alert>
                        <v-list>
                            <p>Precisa de ajuda para melhorar suas buscas?  <router-link to="/help" class="linkTO">Ajuda</router-link></p>
                            <small class="mb-2">Você também pode tentar fazer estas pesquisas:</small>
                            <v-list-item link  @click="searchAgain('Substituição tributária', 1)">
                                <template v-slot:prepend>
                                    <v-icon>mdi-magnify</v-icon>
                                </template>
                                Substituição tributária
                            </v-list-item>
                        </v-list>
                    </div>
                </div>
            </div>
            <resultSemantic :listSearch="semanticResult" v-if="search.semantic == 2" />
            <!-- <news /> -->
            <v-snackbar
                v-model="snack.snackbar"
                :timeout="snack.timeout"
            >
                {{ snack.text }}
                <template v-slot:actions>
                    <v-btn
                    color="blue"
                    variant="text"
                    @click="snack.snackbar = false"
                    >
                    X
                    </v-btn>
                </template>
            </v-snackbar>
            <div v-if="document.length" class="fixed-element">
                <docs :docs="document" />
                <v-btn color="error" variant="text" @click="document=[]">
                    <v-icon>mdi-delete</v-icon> Excluir</v-btn>
            </div>
        </div>
    </section>
</template>

<script>
    import api from "@/services/api"

    import page from "@/components/legislacao/dialogs/page"
    import allPages from "@/components/legislacao/dialogs/allPages"
    import docs from "@/components/legislacao/dialogs/document"
    import aggs from "@/components/legislacao/buscas/searchAggs"
    import help from "./dialogs/help.vue"
    import menuCopy from '@/components/legislacao/dialogs/menuCopy.vue'
    import resumoSearch from '@/components/legislacao/elements/resumoSearch'
    import news from "@/components/legislacao/dialogs/news.vue"
    import menuOpt from "@/components/legislacao/elements/menu.vue"
    import contador from "@/components/legislacao/elements/contador.vue"
    import resultSemantic from "@/components/legislacao/elements/resultSemantic.vue"

    import { useGeneralStore } from '@/store/GeneralStore'
    import { useGeralStore } from '@/store/GeralStore'
    const generalStore = useGeneralStore()  
    const geralStore = useGeralStore()

    export default {
        components:{
            page,
            allPages,
            docs,
            aggs,
            help,
            menuCopy,
            resumoSearch,
            news,
            menuOpt,
            contador,
            resultSemantic
        },
        data(){
            return{
                search:{
                    text: '',
                    years: [],
                    fonte: [],
                    termo: 2,
                    semantic: 1,
                    precision: false
                },
                filtrosavacados: false,
                searchOn: false,
                termos:[
                    {id:2, name: "Qualquer palavra"},
                    {id:1, name: "Frase Exata"}
                ],
                semantic:[
                    {id:1, name: "Palavras-chave"},
                    {id:2, name: "Semântica"}
                ],
                rules:{
                    required: (value) => !!value || "Campo obrigatório",
                    minname: (v) => (v||'').length >= 4 || "Mínimo 4 caracteres",
                },
                laws: [],
                resultsSearch: [],
                load: false,
                document: [],
                viewsAggs: false,
                pagination:{
                    inicio: 0,
                    qtd: 5,
                    page: 1
                },
                totalDocs: 0,
                snack: {
                    snackbar: false,
                    text: 'Nova página adicionada ao documento.',
                    timeout: 2000
                },
                viewPreview: true,
                result: "Sua pesquisa não encontrou nenhum documento correspondente",
                autosuggestion: [],
                termsSearch: [],
                focusedIndex: 0,
                selected: null,
                facetas:{
                    ano: [],
                    fonte: []
                },
            }
        },
        watch:{
            'pagination.qtd': {
                handler(newVal, oldVal) {
                    this.searchEnv(1) 
                    this.pagination.page = 1
                },
                deep: true
            }
        },
        computed:{
            reqRead(){
                let reqq = generalStore.readReq
                if(reqq){
                    this.recActive()
                }
                return "Home"
            },
            periodo(){
                return generalStore.readPeriodo
            },
            fontes(){
                const list = generalStore.readTipos
                return list
            },
            semanticResult(){
                return generalStore.readSemanticList
            },
            getAutosuggestion(){
                let list = this.autosuggestion[0]
                if(typeof list === 'object'){
                    if(list.options){
                        return list.options
                    }
                } else {
                    return []
                }
            },
            resultSearch(){
                return generalStore.readResultSearch.map(x => x._source)
            },
            resultSearchAno(){
                const list = this.resultSearch.map(x => x.ano)
                const listAnos = [...new Set(list)].sort((a, b) => a - b)
                return listAnos
            },
            resultSearchFonte(){
                const list = this.resultSearch.map(x => x.tipo)
                const listAnos = [...new Set(list)].sort((a, b) => a.localeCompare(b))
                return listAnos
            },
            resultsSearchFilter(){
                let list = this.resultsSearch

                if(this.facetas.ano.length){
                    list = list.filter(x => this.facetas.ano.includes(x._source.ano))
                }

                if(this.facetas.fonte.length){
                    list = list.filter(x => this.facetas.fonte.includes(x._source.tipo))
                }

                return list
            }
        },
        methods:{
            async fetchSuggestions(){
                if (this.search.text.length > 2) {
                    try{
                        const response = await api.post("autocomplete/_search", {
                            "suggest":{
                                "name_suggestion" :{
                                    "prefix" : this.search.text,
                                        "completion" : {
                                            "field": "suggest"
                                        }
                                }
                            }
                        })
                        this.autosuggestion = response.data.suggest.name_suggestion;
                    } catch(e){
                        console.log('erro auto sugestion')
                    }
                }
            },
            actionEnterBusca(){
                if(this.getAutosuggestion.length) {
                    this.selectItem()
                } else {
                    this.searchEnv(1)
                    console.log("teste");
                }
            },
            includeTextSearchAutoSuggest(item){
                let copy = item
                this.search.text = copy
                this.autosuggestion = []

                // this.termsSearch.push(item)
                // let terms = this.termsSearch.join(' ')
                // if(this.termsSearch.length){
                //     this.search.text = terms
                // }
            },
            navigateList(direction) {
                if (direction === 'down') {
                    this.focusedIndex = (this.focusedIndex + 1) % this.getAutosuggestion.length;
                } else if (direction === 'up') {
                    this.focusedIndex = (this.focusedIndex - 1 + this.getAutosuggestion.length) % this.getAutosuggestion.length;
                }
            },
            selectItem() {
                if (this.focusedIndex >= 0) {
                    this.selected = this.getAutosuggestion[this.focusedIndex];
                    this.includeTextSearchAutoSuggest(this.selected.text)
                }
            },
            async searchEnv(envSolici=1){
                this.$router.push(`leges?search=${this.search.text}&years=${this.search.years}&fonte=${this.search.fonte}&termo=${this.search.termo}&precision=${this.search.precision}`)
                const { valid } = await this.$refs.form.validate()
                if(valid){
                    geralStore.changeHeaderNoShow(false)
                    this.facetasClear()
                    this.autosuggestion = []
                    if(envSolici==1) generalStore.addListSearch(this.search)
                    this.salvaNoBanco()
                    this.resultsSearch = []
                    this.searchOn = true
                    this.load = true
                    if(envSolici == 1){
                        this.pagination.page = 1
                        this.pagination.inicio = 0
                    } 
                    if(this.search.semantic == 1) {
                        try {
                            this.load = true
                            if(this.search.years.length && this.search.fonte.length && !this.search.precision && this.search.termo == 2){
                                console.log("teste 1");
                                const response = await api.post("pages_v2/_search", {
                                    from: this.pagination.inicio,
                                    size: this.pagination.qtd,
                                    query: {
                                        "bool": {
                                            "must": [
                                                {
                                                    "match": {
                                                        "text_page": this.search.text
                                                    }
                                                },
                                                {
                                                    "terms": {
                                                        "tipo": this.search.fonte
                                                    }
                                                },
                                                {
                                                    "terms": {
                                                        "ano": this.search.years
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                })
                                this.resultsSearch = response.data.hits.hits;
                                this.totalDocs = response.data.hits.total.value;
                            } else if(this.search.years.length && !this.search.fonte.length && !this.search.precision && this.search.termo == 2){
                                console.log("teste 2");
                                const response = await api.post("pages_v2/_search", {
                                    from: this.pagination.inicio,
                                    size: this.pagination.qtd,
                                    query: {
                                        "bool": {
                                            "must": [
                                                {
                                                    "match": {
                                                        "text_page": this.search.text
                                                    }
                                                },
                                                {
                                                    "terms": {
                                                        "ano": this.search.years
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                })
                                this.resultsSearch = response.data.hits.hits;
                                this.totalDocs = response.data.hits.total.value;
                            } else if(!this.search.years.length && this.search.fonte.length && !this.search.precision && this.search.termo == 2){
                                console.log("teste 3");
                                const response = await api.post("pages_v2/_search", {
                                    from: this.pagination.inicio,
                                    size: this.pagination.qtd,
                                    query: {
                                        "bool": {
                                            "must": [
                                                {
                                                    "match": {
                                                        "text_page": this.search.text
                                                    }
                                                },
                                                {
                                                    "terms": {
                                                        "tipo": this.search.fonte
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                })
                                this.resultsSearch = response.data.hits.hits;
                                this.totalDocs = response.data.hits.total.value;
                            } else if(this.search.years.length && this.search.fonte.length && this.search.precision && this.search.termo == 2){
                                console.log("teste 4");
                                const response = await api.post("pages_v2/_search", {
                                    from: this.pagination.inicio,
                                    size: this.pagination.qtd,
                                    query: {
                                        "bool": {
                                            "must": [
                                                {
                                                    "match": {
                                                        text_page: {query: this.search.text, operator: "and"}
                                                    }
                                                },
                                                {
                                                    "terms": {
                                                        "tipo": this.search.fonte
                                                    }
                                                },
                                                {
                                                    "terms": {
                                                        "ano": this.search.years
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                })
                                this.resultsSearch = response.data.hits.hits;
                                this.totalDocs = response.data.hits.total.value;
                            } else if(this.search.years.length && !this.search.fonte.length && this.search.precision && this.search.termo == 2){
                                console.log("teste 5");
                                const response = await api.post("pages_v2/_search", {
                                    from: this.pagination.inicio,
                                    size: this.pagination.qtd,
                                    query: {
                                        "bool": {
                                            "must": [
                                                {
                                                    "match": {
                                                        text_page: {query: this.search.text, operator: "and"}
                                                    }
                                                },
                                                {
                                                    "terms": {
                                                        "ano": this.search.years
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                })
                                this.resultsSearch = response.data.hits.hits;
                                this.totalDocs = response.data.hits.total.value;
                            } else if(!this.search.years.length && this.search.fonte.length && this.search.precision && this.search.termo == 2){
                                console.log("teste 6");
                                const response = await api.post("pages_v2/_search", {
                                    from: this.pagination.inicio,
                                    size: this.pagination.qtd,
                                    query: {
                                        "bool": {
                                            "must": [
                                                {
                                                    "match": {
                                                        text_page: {query: this.search.text, operator: "and"}
                                                    }
                                                },
                                                {
                                                    "terms": {
                                                        "tipo": this.search.fonte
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                })
                                this.resultsSearch = response.data.hits.hits;
                                this.totalDocs = response.data.hits.total.value;
                            } else if(this.search.years.length && this.search.fonte.length && !this.search.precision && this.search.termo == 1){
                                console.log("teste 7");
                                const response = await api.post("pages_v2/_search", {
                                    from: this.pagination.inicio,
                                    size: this.pagination.qtd,
                                    query: {
                                        "bool": {
                                            "must": [
                                                {
                                                    "match_phrase": {
                                                        "text_page": this.search.text
                                                    }
                                                },
                                                {
                                                    "terms": {
                                                        "tipo": this.search.fonte
                                                    }
                                                },
                                                {
                                                    "terms": {
                                                        "ano": this.search.years
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                })
                                this.resultsSearch = response.data.hits.hits;
                                this.totalDocs = response.data.hits.total.value;
                            } else if(this.search.years.length && !this.search.fonte.length && !this.search.precision && this.search.termo == 1){
                                console.log("teste 8");
                                const response = await api.post("pages_v2/_search", {
                                    from: this.pagination.inicio,
                                    size: this.pagination.qtd,
                                    query: {
                                        "bool": {
                                            "must": [
                                                {
                                                    "match_phrase": {
                                                        "text_page": this.search.text
                                                    }
                                                },
                                                {
                                                    "terms": {
                                                        "ano": this.search.years
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                })
                                this.resultsSearch = response.data.hits.hits;
                                this.totalDocs = response.data.hits.total.value;
                            } else if(!this.search.years.length && this.search.fonte.length && !this.search.precision && this.search.termo == 1){
                                console.log("teste 9");
                                const response = await api.post("pages_v2/_search", {
                                    from: this.pagination.inicio,
                                    size: this.pagination.qtd,
                                    query: {
                                        "bool": {
                                            "must": [
                                                {
                                                    "match_phrase": {
                                                        "text_page": this.search.text
                                                    }
                                                },
                                                {
                                                    "terms": {
                                                        "tipo": this.search.fonte
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                })
                                this.resultsSearch = response.data.hits.hits;
                                this.totalDocs = response.data.hits.total.value;
                            } else if(this.search.years.length && this.search.fonte.length && this.search.precision  && this.search.termo == 1){
                                console.log("teste 10");
                                const response = await api.post("pages_v2/_search", {
                                    from: this.pagination.inicio,
                                    size: this.pagination.qtd,
                                    query: {
                                        "bool": {
                                            "must": [
                                                {
                                                    "match_phrase": {
                                                        text_page: {query: this.search.text, operator: "and"}
                                                    }
                                                },
                                                {
                                                    "terms": {
                                                        "tipo": this.search.fonte
                                                    }
                                                },
                                                {
                                                    "terms": {
                                                        "ano": this.search.years
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                })
                                this.resultsSearch = response.data.hits.hits;
                                this.totalDocs = response.data.hits.total.value;
                            } else if(this.search.years.length && !this.search.fonte.length && this.search.precision  && this.search.termo == 1){
                                console.log("teste 11");
                                const response = await api.post("pages_v2/_search", {
                                    from: this.pagination.inicio,
                                    size: this.pagination.qtd,
                                    query: {
                                        "bool": {
                                            "must": [
                                                {
                                                    "match_phrase": {
                                                        text_page: {query: this.search.text, operator: "and"}
                                                    }
                                                },
                                                {
                                                    "terms": {
                                                        "ano": this.search.years
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                })
                                this.resultsSearch = response.data.hits.hits;
                                this.totalDocs = response.data.hits.total.value;
                            } else if(!this.search.years.length && this.search.fonte.length && this.search.precision  && this.search.termo == 1){
                                console.log("teste 12");
                                const response = await api.post("pages_v2/_search", {
                                    from: this.pagination.inicio,
                                    size: this.pagination.qtd,
                                    query: {
                                        "bool": {
                                            "must": [
                                                {
                                                    "match_phrase": {
                                                        text_page: {query: this.search.text, operator: "and"}
                                                    }
                                                },
                                                {
                                                    "terms": {
                                                        "tipo": this.search.fonte
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                })
                                this.resultsSearch = response.data.hits.hits;
                                this.totalDocs = response.data.hits.total.value;
                            } else if(this.search.termo == 2 && !this.search.precision) {
                                console.log("teste 13");
                                const response = await api.post("pages_v2/_search", {
                                    from: this.pagination.inicio,
                                    size: this.pagination.qtd,
                                    query: {
                                        match: {
                                            "text_page": {
                                                "query": this.search.text,
                                                "fuzziness": "AUTO",
                                                "minimum_should_match": "75%"
                                            }
                                        }
                                        // fuzzy:{
                                        //     text_page: {
                                        //         value: this.search.text, 
                                        //         fuzziness: "AUTO"
                                        //     }
                                        // }
                                    }
                                })
                                this.resultsSearch = response.data.hits.hits;
                                this.totalDocs = response.data.hits.total.value;
                            } else if(this.search.termo == 2 && this.search.precision){
                                console.log("teste 14");
                                const response = await api.post("pages_v2/_search", {
                                    from: this.pagination.inicio,
                                    size: this.pagination.qtd,
                                    query: {
                                        match: {
                                            text_page: {query: this.search.text, operator: "and"}
                                        }
                                    }
                                })
                                this.resultsSearch = response.data.hits.hits;
                                this.totalDocs = response.data.hits.total.value;
                            } else if(this.search.termo == 1 && this.search.precision){
                                console.log("teste 15");
                                const response = await api.post("pages_v2/_search", {
                                    from: this.pagination.inicio,
                                    size: this.pagination.qtd,
                                    query: {
                                        match_phrase: {
                                            text_page:{
                                                query: this.search.text
                                            }
                                        }
                                    }
                                })
                                this.resultsSearch = response.data.hits.hits;
                                this.totalDocs = response.data.hits.total.value;
                            } else if(this.search.termo == 1 && !this.search.precision){
                                console.log("teste 16");
                                const response = await api.post("pages_v2/_search", {
                                    query: {
                                        match_phrase: {
                                            text_page:{
                                                query: this.search.text,
                                                slop: 1
                                            }
                                        }
                                    }
                                })
                                this.resultsSearch = response.data.hits.hits;
                                this.totalDocs = response.data.hits.total.value;
                            } else {
                                console.log("teste 17");
                                const response = await api.post("pages_v2/_search", {
                                    from: 0,
                                    size: 100,
                                    query: {
                                        match_phrase: {
                                            text_page:{
                                                query: this.search.text
                                            }
                                        }
                                    }
                                })
                                this.resultsSearch = response.data.hits.hits;
                                this.totalDocs = response.data.hits.total.value;
                            }
                        } catch (error) {
                            console.log("erro digitar", error);
                            this.snack.snackbar = true
                            this.snack.text = 'Sem conexão com a base de dados.'
                            this.result = 'Sem conexão com a base de dados.'
                        }finally{
                            this.load = false
                            const element = document.getElementById('results')
                            element.scrollIntoView({behavior: "smooth"})
                            generalStore.copyResults(this.resultsSearch)
                        }
                    } else {
                        this.load = false
                        generalStore.semanticSearch(this.search.text)
                    }
                   
                }
            },
            async getAll(){
                const response = await api.post("laws_v3/_search", {
                    "aggs": {
                        "by_tipys": {
                        "terms": {
                            "field": "tipo",
                            "size": 100
                        }
                        }
                    }
                })
                this.laws = response.data.aggregations.by_tipys.buckets;
            },
            inserirDoc(item){
                const res = this.docExiste(item._id)
                if(res){
                    this.document = this.document.filter(x => x._id != res)
                    this.snack.text = "Página Removida."
                    this.snack.snackbar = true
                }else {
                    this.document.push(item)
                    this.snack.text = 'Nova página adicionada ao documento.',
                    this.snack.snackbar = true
                }
            },
            docExiste(item){
                let ids = this.document.map(x => x._id)
                let find = ids.find(x => x == item)
                return !!find
                ? find
                : false
            },
            recActive(){     
                let reqSearch = generalStore.readSearch
                this.search = { ...reqSearch}
                this.searchEnv(2)
                this.search.semantic = 1
                generalStore.reqChange(false)
            },
            openLaw(item){
                let link = item._source.page_to_norma.parent
                window.open(`text/${link}`, '_blank');
            },
            async salvaNoBanco(){
                try {
                    const response = await api.post("searchs_todo/_doc", {
                        "text_search": this.search.text,
                        "years": this.search.years,
                        "sources": this.search.fonte,
                        "precision": this.search.precision,
                        "termos":  this.search.termo
                    })
                } catch (error) {
                    console.log("error search todo salvar no banco");
                }
            },
            nomeTipo(item){
                let nome = generalStore.fonteNome(item)
                return nome.mudar
            },
            deslocarTela(item){
                const element = document.getElementById(item)
                element.scrollIntoView({behavior: "smooth"})
            },
            relevancia(item){
                    if(item > 5){ 
                        return {color: "blue", icon: "mdi-chevron-double-up", title:"Muito relevante"};
                    } else if(item > 1){
                        return {color: "blue", icon: "mdi-chevron-up", title:"Relevante"};
                    } else if(item == 1){
                        return {color: "grey", icon: "mdi-square", title:"Moderado"};
                    } else if(item < 1){
                        return {color: "red", icon: "mdi-chevron-down", title:"Pouco relevante"};
                    } else {
                        return {color: "grey", icon: "mdi-square", title:"moderado"}
                    }
            },
            limpar(){
                generalStore.copyResults([])
            },
            snackCopy(){
                console.log("snack dada");
                this.snack = {
                    snackbar: true,
                    text: 'Link copiado para área de transferência.',
                    timeout: 2000
                }
            },
            searchAgain(item, i){
                const req = true
                generalStore.reqChange(req, i)
                this.$router.push(`leges?search=${item}`)
            },
            openPage(item){
                window.open(`help/${item}`, '_blank');
            },
            facetasClear(){
                this.facetas = {
                    ano: [],
                    fonte: []
                }
            }
        },
        created(){
            this.limpar()
        },
        mounted(){
            this.deslocarTela("pri-hea")
        }
    }
</script>

<style  scoped>
section{
    transition: all .8s ease;
}
.container{
    min-height: calc(100vh - 408px);
}
.headSearch{
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: slideTopSearch .5s ease-in;
}
.headSearchTwo{
    animation: slideTopSearch 1s ease-in;
}
.content{
    animation: slideTopSearch 1.5s ease-in;
    padding: 2rem 5rem;
    border: 1px solid rgb(234, 228, 228);
    border-radius: 12px;
    transition: 1s ease;
}
.line1{
    position: relative;
    display: flex;
    flex-direction: column;
}
.autosuggestion{
    position: absolute;
    top: 3rem;
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
.lineResult{
    animation: slideTopSearch .5s ease-in;
}
.aggsResult{
    animation: slideTopSearch .5s ease-in;
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
}
@keyframes slideTopDocument {
    0%{
        transform: translateY(300px);
    }
    100%{
        transform: translateY(0);
    }
}
@keyframes slideTopSearch {
    0%{
        opacity: 0;
    }
    100%{
        opacity: 1;
    }
}
.oneresult{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgb(247, 247, 250);
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
.linkTO{
    padding: .5rem;
    font-weight: 500;
    color: rgb(160, 195, 107);
    transition: .5s;
}
.linkTO:hover{
    color: rgb(120, 144, 83);
    background: rgb(227, 235, 216);
}
.spaceFooter{
    display: none;
}
.pagination{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
        display: flex;
        margin-left: 0;
        width: 760px;
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
    .contador{
        display: none;
    }
    /* .v-input--density-compact {
        --v-input-control-height: 10px;
        --v-input-padding-top: 5px;
        --v-field-padding-bottom: 5px;
    } */
}
</style>
