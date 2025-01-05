<template>
    <section>
        <div class="container">
            <div class="d-flex justify-space-between mt-2 align-center">
                <div>
                    <router-link class="text-black" to="/">Legislação</router-link> <br>
                    <small>Busca da lei por ano, fonte ou texto.</small>
                </div>
                <div class="d-flex align-center">
                    <router-link to="/leges" class="linkTO"> Ir para busca por termo</router-link>
                    <help title="ajuda" :idHelp="2" class="ml-2 contador" />
                    <menuOpt class="contador" />
                </div>
            </div>
            <div v-if="load" class="load">
                <v-progress-circular
                        :size="50"
                        color="primary"
                        indeterminate
                    ></v-progress-circular>
            </div>
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
                        ></v-text-field>
                        <div class="autocompletes">
                            <v-autocomplete
                                clearable
                                chips
                                label="Fonte"
                                density="compact"
                                :items="generalStore.readTipos"
                                item-value="nome"
                                item-title="mudar"
                                multiple
                                variant="outlined"
                                v-model="search.fonte"
                                closable-chips
                                prepend-inner-icon="mdi-alpha-f-box"
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
                            ></v-autocomplete>
                        </div>
                        <div class="text-right">
                            <v-btn color="success" variant="flat" type="submit">Buscar</v-btn>
                        </div>
                    </v-form>
                </div>
                <SearchLaw :resultsSearch="resultsSearch" :load="loadSearch" :searchActive="searchActive" />
                <MainLaws />
                <CollectionLaws />
                <ListLaws />
            </div>
        </div>
    </section>
</template>

<script setup>
    import { ref } from 'vue'

    import { useGeneralStore } from '@/store/GeneralStore'
    const generalStore = useGeneralStore()  

    import { useLawStore } from '@/store/LawsStore'
    const lawStore = useLawStore()      

    import { useRoute } from 'vue-router'
    const route = useRoute()

    import help from "./dialogs/help.vue"
    import menuOpt from "./elements/menu.vue"
    import MainLaws from './searchLaw/mainLaws.vue'
    import SearchLaw from './searchLaw/searchLaw.vue'
    import CollectionLaws from './searchLaw/collectionLaws.vue'
    import ListLaws from './searchLaw/listLaws.vue'

    
    const search =ref ({
        text: '',
        years: [],
        fonte: []
    })

    const rules = {
        required: value => !!value || "campo obrigatório", 
        minfield: (v) => (v||'').length == 11 || "CPF possui 11 dígitos",
    }

    const loadSearch = ref(false)
    const resultsSearch = ref([])
    const load = ref(false)
    const searchActive = ref(false)

    const props = defineProps({
        laws: Array
    })

  
    const searchForLaw = async() => {
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
.load{
    height: 60vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.content{
    animation: slideTopSearch 1.5s ease-in;
    margin: 1rem 0;
    padding: 2rem 5rem;
    border: 1px solid grey;
    border-radius: 12px;
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
.legislacao, .allLaws{
    animation: slideTopSearch .5s ease-in;
}
@keyframes slideTopSearch {
    0%{
        opacity: 0;
    }
    100%{
        opacity: 1;
    }
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
    .contador{
        display: none;
    }
}
</style>
