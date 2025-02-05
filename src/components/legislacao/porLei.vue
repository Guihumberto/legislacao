<template>
    <section>
        <div class="container">
            <HeaderSearch />
            <loading v-if="load"/>
            <div class="legislacao  my-5" v-else>
                <div class="content">
                    <v-form @submit.prevent="searchForLaw()" ref="form">
                        <v-text-field
                            label="Buscar"
                            placeholder="Digite o nome ou número da norma"
                            variant="outlined"
                            density="compact"
                            prepend-inner-icon="mdi-magnify"
                            v-model.trim="search.text"
                            clearable
                            @input="fetchSuggestions"
                            @keydown.down="navigateList('down')"
                            @keydown.up="navigateList('up')"
                            @keydown.enter.prevent="actionEnterBusca()"
                        ></v-text-field>

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

                        <div class="autocompletes">
                            <v-autocomplete
                                clearable
                                chips
                                label="Fonte"
                                density="compact"
                                :items="generalStore.readTiposRestrict"
                                item-value="nome"
                                item-title="mudar"
                                multiple
                                variant="outlined"
                                v-model="search.fonte"
                                closable-chips
                                prepend-inner-icon="mdi-alpha-f-box"
                                class="autocomplete"
                            ></v-autocomplete>
                            <v-autocomplete
                                prepend-inner-icon="mdi-calendar"
                                clearable
                                chips
                                label="Período"
                                density="compact"
                                :items="generalStore.readPeriodo"
                                multiple
                                variant="outlined"
                                v-model="search.years"
                                closable-chips
                                class="autocomplete"
                            ></v-autocomplete>
                        </div>
                        <div class="text-red">
                            {{ text_validation }}
                        </div>
                        <div class="text-right">
                            <v-btn variant="text" class="mr-2" @click="limparForms()">Limpar</v-btn>
                            <v-btn color="success" variant="flat" type="submit">Buscar</v-btn>
                        </div>
                    </v-form>
                </div>
                <SearchLaw :resultsSearch="resultsSearch" :load="loadSearch" :searchActive="searchActive" type="leges" />
                <MainLaws />
                <CollectionLaws :type="'resumo'" />
                <ListLaws />
            </div>
        </div>
    </section>
</template>

<script setup>
    import { ref, computed } from 'vue'

    import { useGeneralStore } from '@/store/GeneralStore'
    const generalStore = useGeneralStore()  

    import { useLawStore } from '@/store/LawsStore'
    const lawStore = useLawStore()      

    import { useRoute, useRouter } from 'vue-router'
    const route = useRoute()
    const router = useRouter()

    import { useSnackStore } from '@/store/snackStore'
    const snackStore = useSnackStore()

    import { useUserAreaStore } from '@/store/AreaUserStore'
    const areaStore = useUserAreaStore()

    import { useAutoSuggestionStore } from "@/store/AutoSuggestions"
    const autoSuggestionStore = useAutoSuggestionStore()

    import MainLaws from './searchLaw/mainLaws.vue'
    import SearchLaw from './searchLaw/searchLaw.vue'
    import CollectionLaws from './searchLaw/collectionLaws.vue'
    import ListLaws from './searchLaw/listLaws.vue'
    import loading from '../partiaslLayout/loading.vue'
    import HeaderSearch from './elements/headerSearch.vue'

    const search =ref ({
        text: '',
        years: [],
        fonte: []
    })

    const limparForms = () => {
        search.value = {
            text: '',
            years: [],
            fonte: []
        } 
    }

    const text_validation = ref(null)
    const loadSearch = ref(false)
    const resultsSearch = ref([])
    const load = ref(false)
    const searchActive = ref(false)

    const autosuggestion = ref([])
    const focusedIndex = ref(0)
    const selected = ref(null)

    const props = defineProps({
        laws: Array
    })
  
    const searchForLaw = async() => {
        router.push(`legesporlei?text_search=${search.value.text}&years=${search.value.years}&tipo=${search.value.fonte}`)
        text_validation.value = null
        const valid = validacao()
        if(valid) return

        resultsSearch.value = []
        loadSearch.value = true
        
        try {
            resultsSearch.value = await lawStore.getSearchPorlei(search.value);
            searchActive.value = true
        } catch (error) {
            console.log("erro searchForLaw");
            resultsSearch.value = []
        } finally{
            loadSearch.value = false
            areaStore.saveHistory(search.value)
        }
    }

    const validacao = () => {
        if(!search.value.text && !search.value.fonte.length && !search.value.years.length ){
            snackStore.activeSnack('Digite um nome ou nro para buscar e/ou selecione o ano e fonte', 'error')
            text_validation.value = "Digite o número ou nome de uma norma ou assunto."
            return true
        }

        if(!search.value.text && !search.value.fonte.length && search.value.years.length ){
            snackStore.activeSnack('Fonte e Ano devem ser selecionadas em conjunto caso o campo "Buscar" esteja em branco ', 'error')
            text_validation.value = "Selecione ao menos uma fonte."
            return true
        }

        if(!search.value.text && search.value.fonte.length && !search.value.years.length ){
            snackStore.activeSnack('Fonte e Ano devem ser selecionadas em conjunto caso o campo "Buscar" esteja em branco', 'error')
            text_validation.value = "Selecione ao menos um período."
            return true
        }
    }

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

    const fetchSuggestions = async() => {
        if (search.value.text.length > 2) {
             await autoSuggestionStore.fetchSuggestions(search.value.text)
             autosuggestion.value = autoSuggestionStore.autosuggestion
        } else {
            autosuggestion.value = []
        }
    }

    const actionEnterBusca = () => {
        if(getAutosuggestion.value.length) {
            selectItem()
        } else {
            searchForLaw()
        }
    }

    const includeTextSearchAutoSuggest = (item) => {
        let copy = item
        search.value.text = copy
        autosuggestion.value = []
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

    
    if(route.query.text_search){
        search.value.text = route.query.text_search
        searchForLaw()
    }

</script>

<style lang="scss" scoped>
.container{
    min-height: calc(100vh - 820px);
}
.content{
    animation: aparecer 1.5s ease-in;
    margin: 1rem 0;
    padding: 2rem 5rem;
    border: 1px solid rgb(204, 203, 203);
    border-radius: 4px;
    transition: 1s ease;
}
.oneresult{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.even-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.openLaw{
    color: grey;
    text-decoration: none;
    transition: .5s;
}
.openLaw:hover{
    color: black;
    font-weight: 600;
}
.openLaw::before{
    content: "- ";
}
.radios, .autocompletes{
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 1rem;
}
.legislacao, .allLaws{
    animation: aparecer .5s ease-in;
}
.autocomplete{
    flex: 1;
}

@media (max-width: 500px) {
    .content{
        padding: 1rem;
    }
    .radios{
        flex-direction: column;
        align-items: baseline;
        gap: 0;
    }
    .autocompletes{
        flex-direction: column;
        gap: 0;
    }
    .even-columns {
        display: grid;
        grid-template-columns: 1fr;
    }
}
</style>
