<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container sizeLoad': 'container2 sizeLoad'" v-if="pageStore.readLoad">
            <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
            ></v-progress-circular>
        </div>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'" v-else>
            <v-btn variant="tonal" @click="$router.push('/leges')" class="mb-2 btn">Voltar</v-btn>
            <v-btn variant="tonal" @click="$router.push(`/text/${route.params.id}?search=leges`)" class="mb-2 mx-2 btn" color="primary">MODO TEXTO</v-btn>
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
                            @keydown.enter="filterJustArt(search)"
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
    </section>
</template>

<script setup>
    import { ref, computed, watch } from "vue";
    import Pagination from "@/components/legislacao/avancadoText/pagination.vue";
    import TextDispositivo from "@/components/legislacao/avancadoText/textDispositivo.vue";
   0
    import { usePageStore } from "@/store/PageStore";
    const pageStore = usePageStore()
   
    import { useSnackStore } from "@/store/snackStore";
    const snackStore = useSnackStore()
   
    import { useRoute } from "vue-router";
    const route = useRoute()

    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()


    const textLaws = ref([])
    const hiddenCabecalho = ref(false)
    const search = ref(null)
    const artsFilterActive = ref(false)
    const pagination = ref({
        page: 1,
        perPage: 15
    })
    const artIndice = ref(null)
    const artsFilter = ref([])

    const divisores = ['art.', 'livro', 'título', 'titulo', 'capítulo'];
    
    const arrayTextLawEstrutura = [   'Art.', 'Arts.','§', 'Parágrafo único', 'Paragrafo unico.',
        'I -', 'I-', 'II -', 'II-', 'III', 'IV -', 'V -', 'VI -', 
        'VII -', 'VIII -', 'IX', 'X', 'X-', 'X - ',
        'XX', 'XXX', 'XL', 'L -', 'L-', 'LX', 'LI -',  'LI-', 'LII', 'LIV -', 'LIV-', 'LV', 'LIX',
        'a)', 'b)', 'c)', 'd)', 'e)', 'f)', 'g)', 'h)', 'i)', 'j)', 'k)', 'l)', 'm)', 'n)', 'o)',
        'p)', 'q)', 'r)', 's)', 't)', 'u)', 'v)', 'x)', 'y)', 'w)', 'z)',
        '1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.',  '11.', '12.', '13.', '14.', '15.', '16.', '17.', '18.', '19.', '20.',  '21.', '22.', '23.', '24.', '25.', '26.', '27.', '28.', '29.', '30.',
        '1-', '2-','3-', '4-', '5-','6-',  '7-', '8-','9-', '10-', 
        '1 -', '2 -','3 -', '4 -', '5 -','6 -', '7 -', '8 -','9 -', '10 -'  
    ]
    
    const arrayEstrturaONly =  ['LIVRO ', 'TÍTULO ', 'CAPÍTULO ', 'SEÇÃO ', 'SUBSEÇÃO ']

    const referencias = arrayEstrturaONly.concat(arrayTextLawEstrutura)

    watch(search, (newConfirm) => {
        pagination.value.page = 1 
    })

    watch(() => pagination.perPage, (newVal, oldVal) => {
        pagination.value.page = 1;
      }, { deep: true }
    );

    const textoInicital = computed(() => {
        const list = textLaws.value.map(x => x._source)
            .sort((a, b) => a.num_page - b.num_page)
            .map(x => x.text_page)
            .join('\n')
            .replaceAll('–', '-')
            .split(/(\r\n|\n|\r)/gm)
            .filter((i) => i )
            .filter(i => i != '\n' )
            .map(item => item.trim())
        
        const divisorIndex = list.findIndex(str => 
            divisores.some(divisor => str.toLowerCase().startsWith(divisor.toLowerCase()))
        )

        if (divisorIndex !== -1) {
            const textoincial = list.slice(0, divisorIndex);
            const legislacao = list.slice(divisorIndex);

            return { textoincial, legislacao }
;
        } else {
                console.log('Nenhum divisor encontrado');
        }
            
        return list
    })

    const listPage = computed(() => {
        const list = textoInicital.value.legislacao

        const novoArray = [];
        let elementoAtual = '';

        if(Array.isArray(list)) {
            list.forEach((str, index) => {
                const eReferencia = referencias.some(ref => str.toLowerCase().startsWith(ref.toLowerCase()));
    
                if (eReferencia && elementoAtual) {
                    // Adiciona o elemento acumulado ao novo array
                    novoArray.push(elementoAtual.trim());
                    // Reinicia o acumulador com o elemento atual
                    elementoAtual = str;
                } else {
                    elementoAtual += (elementoAtual ? ' ' : '') + str;
                }
    
                // Adiciona o último elemento acumulado ao final do loop
                if (index === list.length - 1 && elementoAtual) {
                    novoArray.push(elementoAtual.trim());
                }
            });
        }

        return novoArray
    })

    const listFinal = computed(() => {
        const strings = listPage.value

        let ultimoArt = null; // Armazena o último artigo encontrado

        const novoArray = strings.map((item, index) => {
            const artMatch = item.toLowerCase().startsWith('art.');
            const estruturaMatch = arrayEstrturaONly.some(ref => item.toUpperCase().startsWith(ref.toUpperCase()));

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
    })

    const listTextLaw = computed(() => {
        let list = listFinal.value

        if(search.value){
            let searchb = search.value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            //retirar caracteres especiais
            let exp = new RegExp(searchb.trim().replace(/[\[\]!'@><|//\\&*()_+=]/g, ""), "i")
            //fazer o filtro
            let filtro =  list.filter(item => exp.test(item.textlaw.normalize('NFD').replace(/[\u0300-\u036f]/g, "") ) || exp.test( item.art ))

            list = filtro
        } 

        if(artsFilterActive.value){
            let novoFiltro = []

            if(artsFilter.value.length){
                list.forEach(item => {
                    artsFilter.value.forEach( art => {
                        if(art == item.art){
                            novoFiltro.push(item)
                        }
                    })
                })
            }
            list = novoFiltro
        }

        let page = pagination.value.page - 1
        let start = page * pagination.value.perPage
        let end = start + pagination.value.perPage

        return list.slice(start, end)

    })

    const totalPage = computed(() => {
        let total = listFinal.value.length

        if(search.value){
            let searchb = search.value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            //retirar caracteres especiais
            let exp = new RegExp(searchb.trim().replace(/[\[\]!'@><|//\\&*()_+=]/g, ""), "i")
            //fazer o filtro
            let filtro =  listFinal.value.filter(item => exp.test(item.textlaw.normalize('NFD').replace(/[\u0300-\u036f]/g, "") ) || exp.test( item.art ))

            total = filtro.length
        } 

        if(artsFilterActive.value){
            let novoFiltro = []

            if(artsFilter.value.length){
                listFinal.value.forEach(item => {
                    artsFilter.value.forEach( art => {
                        if(art == item.art){
                            novoFiltro.push(item)
                        }
                    })
                })
            }
            total = novoFiltro.length
        }

        return Math.ceil(total/pagination.value.perPage)
    })

    const cabecalho = computed(() => {
        return textoInicital.value.textoincial.join('<br>')
    })

    const lastArt = computed(() => {
        const law = listFinal.value.map(x => x.art)
        const lastArt = Math.max(...law)
        return lastArt
    })

    const suggestArtBtn = computed(() => {
        if(search.value){
            return !!search.value.replace(/[^0-9]/g,'')
        }
        return false
    })

    const getAll = async() => {
        await pageStore.getAllPages(route.params.id)
        textLaws.value = pageStore.readAllPages
    }

    const filterJustArt = (item) => {
        const art = item.replace(/[^0-9,]/g,'')
        const hasComma = art.includes(",");

        if(hasComma && art){   
            const list = art.split(",").forEach(x => filterArts(x))
        } else {
            filterArts(art)
        }
    }

    const filterArts = (art) => {
        if(art <= lastArt.value){
            artIndice.value = ''
            search.value = ''
            let findArt = artsFilter.value.find( x => x == art ) 
            if(!findArt){
                art > 0 ? artsFilter.value.push(art) : snackStore.activeSnack("Artigo não encontrado.", "error")
            }
            
            if(artsFilter.value.length > 0) {
                artsFilterActive.value = true
            } else {
                artsFilterActive.value = false
            } 
        } else {
           snackStore.activeSnack("Artigo não encontrado.", "error")
        }
    }

    const clearAllArtsFilter = () => {
        artsFilter.value = []
        artsFilterActive.value = false
    }

    const artFilterRemove = (art) => {
        let artRemove = artsFilter.value.findIndex( i => i == art)
        artsFilter.value.splice(artRemove, 1)
        
        if(!artsFilter.value.length > 0) {
            artsFilterActive.value = false
        }
    }

    const pageFilter = (item) => {
        let art = artsFilter.value[0]
        if(item) {
            art == lastArt.value ? art : art++  
            
        } else {
            art == 1 ? art : art--
        }   
        artsFilter.value = []
        artsFilter.value.push(art)
    }

    getAll()

</script>

<style lang="scss" scoped>
.sizeLoad{
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

    .content {
        box-shadow: none;
        margin: 0;
    }
}

</style>