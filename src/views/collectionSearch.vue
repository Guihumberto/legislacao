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
            <v-btn variant="tonal" @click="$router.push(`/avancado/${id}`)" class="mb-2 ml-2 btn" color="primary">MODO AVANÇADO</v-btn>
            <div class="border pa-5 mt-2" id="top">
                <h2 class="text-h5">Lista de normas adicionadas</h2>
                <div class="py-5">
                    <v-list class="pa-0 border bg-transparent">
                        <v-list-item 
                            v-for="ind, x in collectionList" :key="x" 
                            :subtitle="`${ind.tipo} - ${ind.ano}`"
                            link
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
            <v-card class="my-5" variant="flat">
                <v-card-text>
                    Busca
                </v-card-text>
            </v-card>
            <div class="border pa-5 mb-2 bg-white pagina" v-for="item, i in listPage" :key="i">
                <div class="font-weight-bold d-flex justify-space-between header">
                    <p>{{ item.page_to_norma.title }} | {{ item.ano }}</p> 
                    <p>Página: {{ item.num_page }}/{{ listPage.length }} </p>
                </div>
                <div class="corpo">
                    <p v-html="item.text_page"></p> 
                </div>
            </div>
            <!-- <div class="bg-white">
                <div class="px-5 py-3" v-for="item, i in listFinal" :key="i">
                        <TextDispositivo :dispositivo="item.texto" :search="search" />
                </div>
            </div> -->
        </div>
       
    </section>
</template>

<script>
    import api from "@/services/api"
    import { useUserAreaStore } from "@/store/AreaUserStore" 
    const userAreaStore = useUserAreaStore()

    export default {
        data(){
            return{
                id: this.$route.params.id,
                textLaws: [],
                load: false
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
                        header: '',
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

                        objeto.header = textoincial
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
            voltar(){
                this.$router.push("/legesporlei");
            }
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