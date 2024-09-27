<template>
    <section>
        <div class="sizeLoad" v-if="load">
            <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
            ></v-progress-circular>
        </div>
        <div class="container" v-else>
            <v-btn variant="tonal" @click="voltar" class="mb-2">Voltar</v-btn>
            <div class="my-5">
                <titleLaw />
                <timeLineBar :listLaw="lawTimeLine" />
                <div class="mt-10">
                    <h2>Filtros</h2>
                    <div class="border pa-5">
                        <v-text-field
                            variant="outlined"
                            density="compact"
                            label="Busca"
                            v-model.trim="search"
                            @keydown.enter="filterJustArt(search.replace(/[^0-9]/g,''))"
                            clearable
                        ></v-text-field>
                    </div>
                </div>
                <div>
                    <v-chip-group
                        mandatory
                        active-class="primary--text"
                        v-if="artsFilterActive"
                    >
                        <v-chip 
                            @click="pageFilter(false)" 
                            class=" bg-white pa-0" v-if="artsFilter.length == 1"
                            exact-active-class="0"
                        >
                            <v-icon>mdi-arrow-left-drop-circle-outline</v-icon>
                        </v-chip>
                        <v-chip
                            v-for=" tag in artsFilter.sort()" :key="tag"
                            @click:close="artFilterRemove(tag)"
                            closable
                            >
                                art. {{tag}}
                        </v-chip>
                        <v-btn 
                            class="withUppercase" 
                            @click="clearAllArtsFilter()" v-if="artsFilter.length > 1" variant="text" color="error">
                            Limpar Filtro
                        </v-btn>
                        <v-chip 
                            @click="pageFilter(true)" 
                            class="bg-white pa-0" v-if="artsFilter.length == 1">
                                <v-icon>mdi-arrow-right-drop-circle-outline</v-icon>
                        </v-chip>
                    </v-chip-group>
                </div>
                <div class="my-5" v-for="art, i in searchLaw" :key="i">
                    <p v-html="search ? markSearch(art.text) : art.text"></p>
                </div> 
            </div>
        </div>
    </section>
</template>

<script>
     import api from "@/services/api"

     import titleLaw from "../components/legislacao/timeLine/titleLaw"
     import timeLineBar from "../components/legislacao/timeLine/timeLineBar"
     import listLawsChanges from "../components/legislacao/timeLine/listLawsChanges"

    export default {
        components:{
            titleLaw,
            timeLineBar,
            listLawsChanges
        },
        data(){
            return{
                id: this.$route.params.id,
                textLaws: [],
                load: false,
                lawTimeLine:{
                    iDlawMain: '3e138',
                    idsLawsChanges: [
                        '622f4', 'd77b2', '167cf', 
                        '8474b', '88343', 'f60f4', 'dc9a3', 'b73f8', '8acb5', '36a80', 'f2e02', '54d1d', '9defb', 'ead22', '0614b',
                        'd49a1', '20f70', '91dcc', '42cb3', 'b797f', '88f23', 'cf9de', 'f392a', '25551', '8982f', '6f991', 'a5faa', 
                        '3f10c', 'd572b', '704b9', '1ae54', '6f888', '6990c', '00374', '7feee', '4c2fd', '042bc', '5163a', '8cacf', 
                        '668fd', '5c778', '6ba49',
                        '0a1af', 'dd1ee', 'fd1a1', 'e407d', '5481f', '5374e', '444ff', 'c1169', '53368', 'a727d'
                    ],
                    dateCreate: '07/02/2024',
                    dateUpdate: '07/02/2024'
                },
                search: '',
                artIndice: '',
                artsFilter: [],
                artsFilterActive: false,
            }
        },
        computed:{
            listPage(){
                let list = this.textLaws.map(x => x._source)
                let list1 = []

                list.forEach(x => {
                    x.text_page = x.text_page.replace(/\n+/g, '<br>');
                    list1.push(x)
                })
                    
                return list1
            },
            joinPages(){
                let list = this.listPage.map(x => x.text_page).join('')
                
                let listArtigos = list.replace(/\bArt\.\s+/g, '#$# Art. ').split('#$#').filter(x => x.startsWith(" Art."));

                return listArtigos
            },
            orgLawArt(){
                let list = this.joinPages
                let listAll = []

                list.forEach(x => {
                    let artigos = {
                        art: parseInt(x.substring(0, 10).replace(/\D/g, '')),
                        text: x
                    }

                    listAll.push(artigos)
                })

                return listAll
            },
            searchLaw(){
                let list = this.orgLawArt

                if(this.artsFilterActive){
                    let novoFiltro = []

                    if(this.artsFilter){
                        list.forEach(item => {
                            this.artsFilter.forEach( art => {
                                if(art == item.art){
                                    novoFiltro.push(item)
                                }
                            })
                        })
                    }
                    list = novoFiltro
                }

                if(this.search){
                    let search = this.search.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                    //retirar caracteres especiais
                    let exp = new RegExp(search.trim().replace(/[\[\]!'@><|//\\&*()_+=]/g, ""), "i")
                    //fazer o filtro
                    list =  list.filter(item => exp.test(item.text.normalize('NFD').replace(/[\u0300-\u036f]/g, "") ) || exp.test( item.art ))

                } 

                return list
            },
            lastArt(){
                const law = this.orgLawArt
                const lastArt = law[law.length -1]
                return 254
            },
        },
        methods:{
            async getAll(){
                this.load = true
                try {
                    const response = await api.post("pages_v2/_search", {
                        from: 0,
                        size: 5000,
                        "query": {
                            "bool": {
                                "must": [
                                    {
                                    "match": {
                                        "page_to_norma.parent": this.id
                                    }
                                    }
                                ]
                            }
                        }
                    })
                    this.textLaws = response.data.hits.hits
                } catch (error) {
                    console.log("error");
                }finally{
                    this.load = false
                }
            },
            markSearch(item){
                let termoPesquisado = this.search.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
                let pattern = new RegExp(termoPesquisado,"gi");

                return item.replace(pattern, match => `<mark>${match}</mark>`);
            },
            filterJustArt(art){     
                if(art <= this.lastArt){
                    this.artIndice = ''
                    this.search = ''
                    let findArt = this.artsFilter.find( x => x == art ) 
                    
                    if(!findArt){
                        art > 0 ? this.artsFilter.push(art) : console.log("mensagem de erro2");
                    }
                    
                    if(this.artsFilter.length > 0) {
                        this.artsFilterActive = true
                    } else {
                        this.artsFilterActive = false
                    } 
                } else {
                    console.log("mensagem de erro");
                }
            },  
            clearAllArtsFilter(){
                this.artsFilter = []
                this.artsFilterActive = false
            },
            voltar(){
                this.$router.push("/leges");
            },
            pageFilter(item){
                let art = this.artsFilter[0]
                if(item) {
                    art == this.lastArt ? art : art++  
                  
                } else {
                  art == 1 ? art : art--
                }   
                this.artsFilter = []
                this.artsFilter.push(art)
            },
            artFilterRemove(art){
                let artRemove = this.artsFilter.findIndex( i => i == art)
                this.artsFilter.splice(artRemove, 1)
                
                if(!this.artsFilter.length > 0) {
                    this.artsFilterActive = false
                }
            },
        },
        created(){
            this.getAll()
        }
    }
</script>

<style lang="scss" scoped>
.sizeLoad{
    height: 55vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.v-btn.withUppercase{
    text-transform: none !important;
}

</style>