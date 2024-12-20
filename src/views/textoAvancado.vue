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
            <v-btn variant="tonal" @click="voltar" class="mb-2 btn">Voltar</v-btn>
            <v-btn variant="tonal" @click="$router.push(`/text/${id}`)" class="mb-2 mx-2 btn" color="primary">MODO TEXTO</v-btn>
            <v-btn variant="text" @click="hiddenCabecalho = !hiddenCabecalho" class="mb-2 btn">ocultar cabeçalho</v-btn>

            <div>
                <v-expand-transition>
                    <div v-if="hiddenCabecalho" class="border px-5 py-3 mb-2">
                        <p v-html="cabecalho"></p>
                    </div>
                </v-expand-transition>
            </div>

            <v-card class="my-5">
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

            <Pagination :totalPage="totalPage" :pagination="pagination" />

            <div class="bg-white">
                <div class="px-5 py-3" v-for="item, i in listTextLaw" :key="i">
                        <TextDispositivo :dispositivo="item" :search="search" />
                </div>
            </div>

            <Pagination :totalPage="totalPage" :pagination="pagination" />
           
        </div>
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
    </section>
</template>

<script>
    import Pagination from "@/components/legislacao/avancadoText/pagination.vue";
    import TextDispositivo from "@/components/legislacao/avancadoText/textDispositivo.vue";
    import api from "@/services/api"

    export default {
        data(){
            return{
                id: this.$route.params.id,
                textLaws: [],
                load: false,
                art: 0,
                order: 0,
                part1: '',
                keyEstrutura: false,
                orderEstrutura: 1000,
                textWork: [],
                hiddenCabecalho: false,
                search: null,
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
        components:{
            TextDispositivo, Pagination
        },
        watch:{
            'pagination.perPage': {
                handler(newVal, oldVal) {
                    this.pagination.page = 1
                },
                deep: true
            },
            search(ante, depois) { this.pagination.page = 1 }
        },
        computed:{
            textoInicital(){
                const list = this.textLaws.map(x => x._source)
                    .sort((a, b) => a.num_page - b.num_page)
                    .map(x => x.text_page)
                    .join('\n')
                    .replaceAll('–', '-')
                    .split(/(\r\n|\n|\r)/gm)
                    .filter((i) => i )
                    .filter(i => i != '\n' )
                    .map(item => item.trim())
                
                const divisorIndex = list.findIndex(str => 
                    this.divisores.some(divisor => str.toLowerCase().startsWith(divisor.toLowerCase()))
                );

                if (divisorIndex !== -1) {
                    const textoincial = list.slice(0, divisorIndex);
                    const legislacao = list.slice(divisorIndex);

                    return { textoincial, legislacao }
;
                } else {
                        console.log('Nenhum divisor encontrado');
                }
                    
                return list
            },
            listPage2(){
                const list = this.listPage

                list.map(item => {
                    let count = 0
                    this.arrayTextLawEstrutura.forEach( i => item.startsWith(i) ? count++ : count)
                    let value = count > 0  ? false : true
                    let art = 0
                    let order = 0

                    if(item.toLowerCase().startsWith('art.')){                   
                        let test = item.substr(5, 5)                            
                        let nTest = test.replace(/[^0-9]/g,'').length

                        if(nTest >= 4 ){
                            art = item.trim().substr(5, 5).replace(/[^0-9]/g,'');
                            this.art = parseInt(art)
                            this.order = 10
                        } else {
                            art = item.trim().substr(4, 5).replace(/[^0-9]/g,'');
                            this.art = parseInt(art)
                            this.order = 10
                        }
                    }

                    if(!value && !item.toLowerCase().startsWith('art.') ){
                        this.order++
                    }

                    if(value){
                        this.order = `${this.order}.1`
                        if(item.toLowerCase().startsWith('livro')){
                            this.order = 2
                        }
                        if(item.toLowerCase().startsWith('título')){
                            this.order = 3
                        }
                        if(item.toLowerCase().startsWith('capítulo')){
                            this.order = 4
                        }
                        if(item.toLowerCase().startsWith('seção')){
                            this.order = 5
                        }
                        if(item.toLowerCase().startsWith('subseção')){
                            this.order = 6
                        }
                        if(value){
                            let textEstruturaComplete = ""
                            let artEstrutura = ""
                            let orderEstrutura = ""

                            this.keyEstrutura ? artEstrutura = this.art : artEstrutura = this.art++
                            this.keyEstrutura = true

                            if(this.order == 0.1){
                                textEstruturaComplete = item
                                artEstrutura = 1
                                orderEstrutura  = 1
                            }

                            if(this.order == 2 || this.order == 2.1){
                                orderEstrutura  = 2
                                this.order == 2 ? this.part1 = item : ''
                                this.order == 2.1 ? textEstruturaComplete = this.part1 + ' - ' + item : ''
                            }

                            if(this.order == 3 || this.order == 3.1){
                                orderEstrutura  = 3
                                this.order == 3 ? this.part1 = item : ''
                                this.order == 3.1 ? textEstruturaComplete = this.part1 + ' - ' + item : ''
                            }

                            if(this.order == 4 || this.order == 4.1){
                                orderEstrutura  = 4
                                this.order == 4 ? this.part1 = item : ''
                                this.order == 4.1 ? textEstruturaComplete = this.part1 + ' - ' + item : ''
                            }

                            if(this.order == 5 || this.order == 5.1){
                                orderEstrutura  = 5
                                this.order == 5 ? this.part1 = item : ''
                                this.order == 5.1 ? textEstruturaComplete = this.part1 + ' - ' + item : ''
                            }

                            if(this.order == 6 || this.order == 6.1){
                                orderEstrutura  = 6
                                this.order == 6 ? this.part1 = item : ''
                                this.order == 6.1 ? textEstruturaComplete = this.part1 + ' - ' + item : ''
                            }
                            


                            if(!orderEstrutura) {
                                artEstrutura = this.art--
                                artEstrutura--
                                this.keyEstrutura = false
                                orderEstrutura = this.orderEstrutura++
                                this.order = orderEstrutura
                                value = false
                                textEstruturaComplete = item
                            }

                            if(textEstruturaComplete){
                                let text = {
                                    // id: shortid.generate(),
                                    art: artEstrutura,
                                    order: orderEstrutura,
                                    estrutura:value,
                                    textLaw: textEstruturaComplete
                                }
                                this.textWork.push(text)
                                this.part1 = ''
                            }

                        } else {
                            this.keyEstrutura = false
                            //salvar texto da lei (caput + dispositivos)
                            let text = {
                                // id: shortid.generate(),
                                art: this.art,
                                order: this.order,
                                estrutura:value,
                                textLaw: item
                            }
                            this.textWork.push(text)
                            this.part1 = ''
                        }

                    }
                })

                this.art = 0 

                return list
            },
            listPage(){
                const list = this.textoInicital.legislacao

                const novoArray = [];
                let elementoAtual = '';

                list.forEach((str, index) => {
                    const eReferencia = this.referencias.some(ref => str.toLowerCase().startsWith(ref.toLowerCase()));

                    if (eReferencia && elementoAtual) {
                        // Adiciona o elemento acumulado ao novo array
                        novoArray.push(elementoAtual.trim());
                        // Reinicia o acumulador com o elemento atual
                        elementoAtual = str;
                    } else {
                        // Acumula o texto
                        elementoAtual += (elementoAtual ? ' ' : '') + str;
                    }

                    // Adiciona o último elemento acumulado ao final do loop
                    if (index === list.length - 1 && elementoAtual) {
                        novoArray.push(elementoAtual.trim());
                    }
                });

                return novoArray
            },
            listFinal(){
                const strings = this.listPage

                let ultimoArt = null; // Armazena o último artigo encontrado

                const novoArray = strings.map((item, index) => {
                    const artMatch = item.toLowerCase().startsWith('art.');
                    const estruturaMatch = this.arrayEstrturaONly.some(ref => item.toUpperCase().startsWith(ref.toUpperCase()));

                    // Determina o próximo artigo subsequente para `estrutura`
                    if (estruturaMatch) {
                        const proximoArt = strings
                        .slice(index + 1) // Pega os elementos subsequentes
                        .find(str => str.toLowerCase().startsWith('art.')) // Encontra o próximo "art."
                        ?.slice(4, 12).match(/\d+/)?.[0]; // Extrai o número

                        if (proximoArt) {
                        ultimoArt = parseInt(proximoArt) || null; // Atualiza o último artigo com o subsequente
                        }
                    }

                    // Atualiza o último artigo encontrado diretamente
                    if (artMatch) {
                        ultimoArt = parseInt(item.slice(4, 12).match(/\d+/)?.[0]) || null;
                    }

                    return {
                        art: ultimoArt, // O último artigo atualizado
                        order: index + 1, // Ordem no array
                        estrutura: estruturaMatch, // True se for estrutura
                        textlaw: item // Texto original
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

                return list.slice(start, end)

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
            cabecalho(){
                return this.textoInicital.textoincial.join('<br>')
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
                const law = this.listFinal
                const lastArt = law[law.length -1]
                return 254
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
            voltar(){
                this.$router.push("/leges");
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
.form{
    width: 50%;
}
@media (max-width:900px){
    .form{
        width: 100%;
    }
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