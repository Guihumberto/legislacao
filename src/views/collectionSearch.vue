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
            <div>
                <v-btn variant="tonal" @click="voltar" class="btn mr-2">Voltar</v-btn>
                <v-btn :color="avancado ? 'primary': ''" variant="tonal" @click="avancado = !avancado" :prepend-icon="avancado ? 'mdi-text-search':'mdi-close'">MODO AVANÇADO</v-btn>
            </div>
            <div class="border pa-5 mt-2" id="top">
                <h2 class="text-h5">Lista de normas adicionadas</h2>
                <div class="py-5">
                    <v-list class="pa-0 border bg-transparent">
                        <v-list-item 
                            v-for="ind, x in collectionList" :key="x" 
                            :subtitle="`${ind.tipo} - ${ind.ano}`"
                            :color="selectedLaw == ind.id ? 'primary':''"
                            @click="filterLaw(ind.id)"
                            
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
            <v-card class="my-5" variant="flat" v-if="avancado">
                <v-card-text>
                    <div class="form">
                        <v-text-field
                            variant="outlined"
                            density="compact"
                            label="Busca"
                            append-inner-icon="mdi-magnify"
                            v-model.trim="search"
                            @keydown.enter="filterJustArt(search.replace(/[^0-9]/g,''))"
                            :messages="search && !artsFilterActive && listTextLaw.length ? `dispositivos encontrados ${listTextLaw.length}` : ''"
                            clearable
                        ></v-text-field>
                    </div>
                    <div v-if="suggestArtBtn">
                        <v-chip 
                            @click="filterJustArt(search.replace(/[^0-9]/g,''))"
                            >
                            Art. {{search.replace(/[^0-9]/g,'')}}
                        </v-chip>
                    </div>
                    <div>
                        <v-chip-group
                            v-if="artsFilterActive"
                        >
                            <v-chip 
                                @click="pageFilter(false)" 
                                variant="text" v-if="artsFilter.length == 1"
                                exact-active-class="0"
                            >
                                <v-icon>mdi-arrow-left-drop-circle-outline</v-icon>
                            </v-chip>
                            <v-chip
                                v-for=" tag in artsFilter.sort((a, b) => a - b)" :key="tag"
                                @click:close="artFilterRemove(tag)"
                                closable
                                >
                                    art. {{tag}}
                            </v-chip>
                            <v-btn 
                                variant="text" 
                                @click="clearAllArtsFilter()" v-if="artsFilter.length > 1" text color="error">
                                Limpar Filtro
                            </v-btn>
                            <v-chip 
                                @click="pageFilter(true)" 
                                variant="text" v-if="artsFilter.length == 1">
                                    <v-icon>mdi-arrow-right-drop-circle-outline</v-icon>
                            </v-chip>
                        </v-chip-group>
                    </div>
                </v-card-text>
            </v-card>
            <Pagination :totalPage="totalPage" :pagination="pagination" v-if="false" />
            <div class="bg-white" v-if="avancado">
                <div v-for="lei, l in collectionList" :key="l">
                    <h1 class="text-h5 bg-primary px-2">{{ lei.title }}</h1>
                    <div class="px-5 py-3" v-for="item, i in listTextLaw.filter(x => x.id == lei.id)" :key="i">
                        <TextDispositivo :dispositivo="item" :search="search" v-if="avancado" />
                    </div>
                </div>
            </div>
            <div class="border pa-5 mb-2 bg-white pagina mt-5" v-for="item, i in listPage" :key="i" v-else>
                <div class="font-weight-bold d-flex justify-space-between header">
                    <p>{{ item.page_to_norma.title }} | {{ item.ano }}</p> 
                    <p>Página: {{ item.num_page }}/{{ listPage.length }} </p>
                </div>
                <div class="corpo">
                    <p v-html="item.text_page"></p> 
                </div>
            </div>
            <Pagination :totalPage="totalPage" :pagination="pagination" v-if="false" />
        </div>       
    </section>
</template>

<script>
    import Pagination from "@/components/legislacao/avancadoText/pagination.vue";
    import TextDispositivo from "@/components/legislacao/avancadoText/textDispositivo.vue";
    import api from "@/services/api"
    import { useUserAreaStore } from "@/store/AreaUserStore" 
    const userAreaStore = useUserAreaStore()

    export default {
        data(){
            return{
                id: this.$route.params.id,
                textLaws: [],
                selectedLaw: null,
                load: false,
                search: null,
                avancado: false,
                artsFilterActive: false, 
                textLaw:{
                    size: 0
                },
                pagination:{
                    page: 1,
                    perPage: 15
                },
                artIndice: null,
                artsFilter: [],
                snack: {
                    snackbar: false,
                    text: 'Nova página adicionada ao documento.',
                    timeout: 2000
                },
            }
        },
        components: { TextDispositivo, Pagination },
        computed:{
            listPage(){
                let list = this.textLaws.map(x => x._source)
                let list1 = []

                list.forEach(x => {
                    x.text_page = x.text_page.replace(/\n+/g, '<br>');
                    list1.push(x)
                })

                return list1.sort((a, b) => a.num_page - b.num_page)?.sort((a, b) => a.page_to_norma.parent.localeCompare(b.page_to_norma.parent))
            },
            collectionList(){
                return userAreaStore.readTempView.law
            },
            idLawCollection(){
                const idList = this.collectionList.map( x => x.id )
                return idList
            },
            separeteLaws(){
                const listNova = []
                for(let i = 0; i < this.idLawCollection.length; i++){

                    const newlist = this.listPage.filter( x => x.page_to_norma.parent == this.idLawCollection[i])
                    
                    const objeto = {
                        id: newlist[0]?.page_to_norma.parent,
                        texto: []
                    }

                    const list = newlist.map(x => x.text_page)
                                        .join('\n')
                                        .replaceAll('–', '-')
                                        // .split(/(\r\n|\n|\r)/gm)
                                        .split('<br>')
                                        .filter((i) => i )
                                        .filter(i => i != '\n' )
                                        .filter(i => i != '<br>' )
                                        .map(item => item.trim())
                    
                    const divisorIndex = list.findIndex(str => 
                        this.divisores.some(divisor => str.toLowerCase().startsWith(divisor.toLowerCase()))
                    );

                    if (divisorIndex !== -1) {
                        const textoincial = list.slice(0, divisorIndex);
                        const legislacao = list.slice(divisorIndex);
                        objeto.texto = legislacao

                        listNova.push(objeto)
        
                    } else {
                            console.log('Nenhum divisor encontrado');
                    }
                }
                return listNova
            },
            listPage2(){
                const novoArray = [];
                let elementoAtual = '';

                for( let i = 0; i < 2; i++) {
                    const list = this.separeteLaws[i].texto

                    const dados = this.separeteLaws[i]

                    list.forEach((str, index) => {
                        const eReferencia = this.referencias.some(ref => str.toLowerCase().startsWith(ref.toLowerCase()));
    
                        if (eReferencia && elementoAtual) {
                            // Adiciona o elemento acumulado ao novo array
                            novoArray.push({
                                    id: dados.id,
                                    header: dados.header,
                                    texto: elementoAtual.trim()
                            });
                            // Reinicia o acumulador com o elemento atual
                            elementoAtual = str;
                        } else {
                            // Acumula o texto
                            elementoAtual += (elementoAtual ? ' ' : '') + str;
                        }
    
                        // Adiciona o último elemento acumulado ao final do loop
                        if (index === list.length - 1 && elementoAtual) {
                            novoArray.push({
                                    id: dados.id,
                                    header: dados.header,
                                    texto: elementoAtual.trim()
                            });
                        }
                    });
                }

                return novoArray
            }, 
            listFinal(){
                const strings = this.listPage2

                let ultimoArt = null; // Armazena o último artigo encontrado

                const novoArray = strings.map((item, index) => {
                    const artMatch = item.texto.toLowerCase().startsWith('art.');
                    const estruturaMatch = this.arrayEstrturaONly.some(ref => item.texto.toUpperCase().startsWith(ref.toUpperCase()));

                    // Determina o próximo artigo subsequente para `estrutura`
                    if (estruturaMatch) {
                        const proximoArt = strings
                            .slice(index + 1) // Pega os elementos subsequentes
                            .map( y => y.texto)
                            .find(str => str.toLowerCase().startsWith('art.')) // Encontra o próximo "art."
                            ?.slice(4, 12).match(/\d+/)?.[0]; // Extrai o número
                            

                        if (proximoArt) {
                            ultimoArt = parseInt(proximoArt) || null; // Atualiza o último artigo com o subsequente
                        }
                    }

                    // Atualiza o último artigo encontrado diretamente
                    if (artMatch) {
                        ultimoArt = parseInt(item.texto.slice(4, 12).match(/\d+/)?.[0]) || null;
                    }

                    return {
                        id: item.id,
                        art: ultimoArt, // O último artigo atualizado
                        order: index + 1, // Ordem no array
                        estrutura: estruturaMatch, // True se for estrutura
                        textlaw: item.texto // Texto original
                    };
                });
                return novoArray
            },
            listTextLaw(){
                let list = this.listFinal

                if(this.search){
                    let search = this.search.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                    //retirar caracteres especiais
                    let exp = new RegExp(search.trim().replace(/[\[\]!'@><|//\\&*()_+=]/g, ""), "i")
                    //fazer o filtro
                    let filtro =  list.filter(item => exp.test(item.textlaw.normalize('NFD').replace(/[\u0300-\u036f]/g, "") ) || exp.test( item.art ))

                    list = filtro
                } 

                if(this.artsFilterActive){
                    let novoFiltro = []

                    if(this.artsFilter.length){
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

                let page = this.pagination.page - 1
                let start = page * this.pagination.perPage
                let end = start + this.pagination.perPage

                return list //.slice(start, end)

            },
            totalPage(){
                let total = this.listFinal.length

                if(this.search){
                    let search = this.search.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                    //retirar caracteres especiais
                    let exp = new RegExp(search.trim().replace(/[\[\]!'@><|//\\&*()_+=]/g, ""), "i")
                    //fazer o filtro
                    let filtro =  this.listFinal.filter(item => exp.test(item.textlaw.normalize('NFD').replace(/[\u0300-\u036f]/g, "") ) || exp.test( item.art ))

                    total = filtro.length
                } 

                if(this.artsFilterActive){
                    let novoFiltro = []

                    if(this.artsFilter.length){
                        this.listFinal.forEach(item => {
                            this.artsFilter.forEach( art => {
                                if(art == item.art){
                                    novoFiltro.push(item)
                                }
                            })
                        })
                    }
                    total = novoFiltro.length
                }

                return Math.ceil(total/this.pagination.perPage)
            },
            divisores(){
                return ['art.', 'livro'];
            },
            arrayTextLawEstrutura(){
                return [   'Art.', 'Arts.','§', 'Parágrafo único', 'Paragrafo unico.',
                            'I -', 'I-', 'II -', 'II-', 'III', 'IV -', 'V -', 'VI -', 
                            'VII -', 'VIII -', 'IX', 'X', 'X-', 'X - ',
                            'XX', 'XXX', 'XL', 'L -', 'L-', 'LX', 'LI -',  'LI-', 'LII', 'LIV -', 'LIV-', 'LV', 'LIX',
                            'a)', 'b)', 'c)', 'd)', 'e)', 'f)', 'g)', 'h)', 'i)', 'j)', 'k)', 'l)', 'm)', 'n)', 'o)',
                            'p)', 'q)', 'r)', 's)', 't)', 'u)', 'v)', 'x)', 'y)', 'w)', 'z)',
                            '1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.',  '11.', '12.', '13.', '14.', '15.', '16.', '17.', '18.', '19.', '20.',  '21.', '22.', '23.', '24.', '25.', '26.', '27.', '28.', '29.', '30.',
                            '1-', '2-','3-', '4-', '5-','6-',  '7-', '8-','9-', '10-', 
                            '1 -', '2 -','3 -', '4 -', '5 -','6 -', '7 -', '8 -','9 -', '10 -'  
                        ]
            },
            arrayEstrturaONly(){
                return ['LIVRO ', 'TÍTULO ', 'CAPÍTULO ', 'SEÇÃO ', 'SUBSEÇÃO ']
            },
            referencias(){
                return this.arrayEstrturaONly.concat(this.arrayTextLawEstrutura)
            },
            lastArt(){
                const law = this.listFinal.map(x => x.art)
                const lastArt = Math.max(...law)
                return lastArt
            },
            suggestArtBtn(){
                if(this.search){
                    return !!this.search.replace(/[^0-9]/g,'')
                }
                return false
            }
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
                                                "terms": {
                                                    "page_to_norma.parent": this.idLawCollection
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
            filterLaw(id){
                if(id == this.selectedLaw){
                    this.selectedLaw = null
                } else {
                    this.selectedLaw = id
                }
            },
            voltar(){
                this.$router.push("/legesporlei");
            },
            filterJustArt(art){     
                console.log(this.lastArt);
                if(art <= this.lastArt){
                    this.artIndice = ''
                    this.search = ''
                    let findArt = this.artsFilter.find( x => x == art ) 
                    if(!findArt){
                        art > 0 ? this.artsFilter.push(art) : this.snackAction()
                    }
                    
                    if(this.artsFilter.length > 0) {
                        this.artsFilterActive = true
                    } else {
                        this.artsFilterActive = false
                    } 
                } else {
                    this.snackAction()
                }
            },  
            snackAction(){
                this.snack = {
                    snackbar: true,
                    text: 'Artigo nâo encontrado.',
                    timeout: 2000
                }
            },
            clearAllArtsFilter(){
                this.artsFilter = []
                this.artsFilterActive = false
            },
            artFilterRemove(art){
                let artRemove = this.artsFilter.findIndex( i => i == art)
                this.artsFilter.splice(artRemove, 1)
                
                if(!this.artsFilter.length > 0) {
                    this.artsFilterActive = false
                }
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
        },
        created(){
            this.getAll()
        }
    }
</script>

<style lang="scss" scoped>
section {
    min-height: calc(100vh - 466px);
}
.sizeLoad{
    height: 55vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.corpo{
    margin: 2rem;
    font-size: 15px;
    line-height: 2.1em
}
@media print {
    .btn {
        display: none;
    }
    .pagina {
        width: 190mm;
        height: 285mm;
        margin: 0;
    }
    // .pagina .header{
    //     height: 10mm;
    //     margin-bottom: 2rem;
    // }

    .content {
        box-shadow: none;
        margin: 0;
    }
}

</style>