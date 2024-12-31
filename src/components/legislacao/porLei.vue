<template>
    <section>
        <div class="container">    
            <div class="d-flex justify-space-between mt-2 align-center">
                <div>
                    <router-link class="text-black" to="/">Legislação</router-link> <br>
                    <small>Busca da lei por ano, fonte ou texto.</small>
                </div>
                <div class="d-flex align-center">
                    <router-link to="/leges" class="linkTO">Busca por termo</router-link>
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
                                :items="fontes"
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
                                :items="periodo"
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
                <div class="d-flex justify-end">
                    <small>Total de normas: {{ totalLaws }} com {{ totalPages }} páginas</small>
                </div>
                <div class="allLaws">
                    <v-expansion-panels v-if="orgLaws.length">
                        <v-expansion-panel
                            v-for="tipo, t in orgLaws.sort(orderTipo)" :key="t"
                        >
                        <v-expansion-panel-title 
                            expand-icon="mdi-plus" collapse-icon="mdi-minus">
                            {{ nomeTipo(tipo.tipo) }}
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-expansion-panels variant="popout">
                                <v-expansion-panel
                                    v-for="ano, a in tipo.subcategorias.sort(order)" :key="a" >
                                    <v-expansion-panel-title>{{ ano.ano }} ({{ ano.norma.length }}) </v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                        <div class="even-columns">
                                            <div   v-for="law, l in ano.norma.sort(orderName)" :key="l">
                                                <a class="openLaw" :href="`text/${law.id}?search=leges`" target="_blank">{{ law.title }}</a>
                                            </div>
                                        </div>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>
            
                        </v-expansion-panel-text>
            
                        </v-expansion-panel>
                    </v-expansion-panels>
                    <v-alert variant="tonal" type="warning" v-else>
                        <p>Carregando...</p>
                    </v-alert>
                    <div class="text-right mt-5">
                        <v-btn :loading="readLoad" @click="changeNroLaws()" variant="flat" color="primary">baixar todas</v-btn>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import { useGeneralStore } from '@/store/GeneralStore'
    const generalStore = useGeneralStore()  

    import { useLawStore } from '@/store/LawsStore'
    const lawStore = useLawStore()  

    import { useConsultaStore } from '@/store/ConsultaStore'
    const consultaStore = useConsultaStore()  

    import help from "./dialogs/help.vue"
    import menuOpt from "./elements/menu.vue"
    import MainLaws from './searchLaw/mainLaws.vue'
    import SearchLaw from './searchLaw/searchLaw.vue'
    import CollectionLaws from './searchLaw/collectionLaws.vue'
    
    export default {
        components:{
            help, menuOpt, MainLaws, SearchLaw, CollectionLaws
        },
        data(){
            return{ 
                search:{
                    text: '',
                    years: [],
                    fonte: []
                },
                rules:{
                    required: (value) => !!value || "Campo obrigatório",
                    minname: (v) => (v||'').length >= 4 || "Mínimo 4 caracteres",
                },
                loadSearch: false,
                reverse: false,
                resultsSearch: [], 
                load: false,
                searchActive: false
            }
        },
        props:{
            laws: Array
        },
        computed:{
            orgLaws(){
                let list = this.listAllLaws.map(x => x._source)

                if(this.search.text){
                    let search = this.search.text.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace('.', '')
                    //retirar caracteres especiais
                    let exp = new RegExp(search.trim().replace(/[\[\]!'@><|//\\&*()_+=]/g, ""), "i")
                    //fazer o filtro
                    list =  list.filter(item => exp.test(item.title.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace('.', '') ) )
                }

                if(this.search.years.length){
                    list = list.filter(x => this.search.years.includes(x.ano))
                }

                if(this.search.fonte.length){
                    list = list.filter(x => this.search.fonte.includes(x.tipo))
                }

                const classificacao = list.reduce((acumulador, item) => {
                // Verifica se a categoria já existe no acumulador
                const categoriaExistente = acumulador.find(c => c.tipo === item.tipo);

                if (categoriaExistente) {
                    // Se a categoria já existe, verifica se a subcategoria já existe
                    const subcategoriaExistente = categoriaExistente.subcategorias.find(s => s.ano === item.ano);

                    if (subcategoriaExistente) {
                        // Se a subcategoria já existe, adicione o valor
                        subcategoriaExistente.norma.push({id: item.id, page: item.total_pages, title: item.title, path: item.path, revogado: item.revogado});
                    } else {
                        // Se a subcategoria não existe, crie uma nova subcategoria
                        categoriaExistente.subcategorias.push({
                            ano: item.ano,
                            norma: [{id: item.id, page: item.total_pages, title: item.title, path: item.path, revogado: item.revogado}],
                        });
                    }
                } else {
                    // Se a categoria não existe, crie uma nova categoria com a subcategoria
                    acumulador.push({
                        tipo: item.tipo,
                        subcategorias: [{
                            ano: item.ano,
                            norma: [{id: item.id, page: item.total_pages, title: item.title, path: item.path, revogado: item.revogado}],
                        }],
                    });
                }

                return acumulador;
                }, []);

                return classificacao
            },
            periodo(){
                return generalStore.readPeriodo
            },
            fontes(){
                const list = generalStore.readTipos
                return list
            },
            listAllLaws(){
                return lawStore.listAllLaws
            },  
            totalLaws(){
                return lawStore.readTotalLaws
            },
            totalPages(){
                return consultaStore.readTotalPages
            },
            readLoad(){
                return lawStore.readLoad
            }
        },
        methods:{
            async searchForLaw(){
                this.resultsSearch = []
                this.loadSearch = true
                
                try {
                    this.resultsSearch = await lawStore.getSearchPorlei(this.search);
                    this.searchActive = true
                } catch (error) {
                    console.log("erro searchForLaw");
                    this.resultsSearch = []
                } finally{
                    this.loadSearch = false
                }
            },
            async changeNroLaws(){
                lawStore.changeNroLaws()
            },
            nomeTipo(item){
                let nome = generalStore.fonteNome(item)
                return nome.mudar
            },
            order(a, b){
                return this.reverse
                    ? a.ano -  b.ano
                    : b.ano -  a.ano
            },
            orderName(a, b){
                return this.reverse
                    ? a.title -  b.title
                    : b.title -  a.title
            },
            orderTipo(a, b){
                return this.reverse
                    ? a.tipo -  b.tipo
                    : b.tipo -  a.tipo
            },
        }
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
