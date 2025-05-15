<template>
    <div class="wrapper">
        <section class="conteudo" ref="topUp">
            <div class="law" ref="lawRef">
                <div class="sizeLoad" v-if="forumStore.readLoad">
                    <v-progress-circular
                        :size="50"
                        color="primary"
                        indeterminate
                    ></v-progress-circular>
                </div>
                <div v-else>
                    <v-btn variant="tonal" @click="$route.query.permission ? $router.push('/permissoes') : $router.push('/myforuns')" class="btn">Voltar</v-btn>   
                    <v-btn class="ml-2" color="success" @click="sidelaw = !sidelaw" variant="flat">Opções</v-btn>    
                    
                    <DadosGrupo />
        
                    <v-card class="my-5">
                        <v-card-text>
                            <div>
                                <div :class="lawWidth < 600 ? 'formResize' : 'form'">
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
                            </div>
                            <div>
                                <div class="filterCheckbox" :class="{'d-flex flex-column align-start': lawWidth < 600}">
                                    <v-checkbox v-model="withComments" label="Somente com comentários" hide-details></v-checkbox>
                                    <v-checkbox v-model="withTags" label="Filtrar por Tags" :disabled="!listTags.length" hide-details></v-checkbox>
                                    <v-checkbox v-model="withMarks" label="Filtrar Marcados" hide-details></v-checkbox>
                                </div>

                                <!-- <v-expand-transition>      
                                    <v-card v-if="withComments" variant="outlined">
                                        <v-card-text>
                                            <p class="mb-2">Filtre por comentários dos usuários</p>
                                            <v-responsive class="overflow-y-auto" max-height="500">
                                                <v-select
                                                    multiple
                                                    v-model="usersCommentsFilter"
                                                    :items="commentStore.readUsersComments"
                                                    item-title="key"
                                                    item-value="key"
                                                    variant="outlined"
                                                    label="Usuários"
                                                    density="compact"
                                                    class="pt-2"
                                                    clearable
                                                    prepend-inner-icon="mdi-chat"
                                                ></v-select>
                                            </v-responsive>
                                        </v-card-text>
                                    </v-card>
                                </v-expand-transition> -->
                                
                                <v-expand-transition>      
                                    <v-card v-if="listTags.length && withTags" variant="outlined" class="mt-2">
                                        <v-card-text>
                                            <p class="mb-2">Filtre por tags</p>
                                            <v-responsive class="overflow-y-auto" max-height="500">
                                                <v-chip-group filter column multiple v-model="tagsFilter" active-class="primary" >
                                                    <v-chip v-for="item, i in listTags" :value="item" :key="item">{{ item }}</v-chip>
                                                </v-chip-group>
                                            </v-responsive>
                                        </v-card-text>
                                    </v-card>
                                </v-expand-transition>
                                <div class="text-right mt-2">
                                    <v-btn @click="closeAllComments()" density="compact" variant="text">Fechar todos os comentários</v-btn>
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
        
                    <Pagination :totalPage="totalPage" :pagination="pagination" />

                    <div class="bg-white">
                        <div class="px-5 py-3" v-for="item, i in listTextLaw" :key="i" :class="{ selected: item.art == $route.query.art && item.estrutura == false}" >
                            <div class="corner-wrapper">
                                <div :class="{ triangle: item?.tags.length }"></div>
                            </div>
                                <TextDispositivo ref="textDispositivoRef"  :dispositivo="item" :search="search" @open="sidelaw = true" @update-dispositivo="updateDispositivo" :listTags="listTags" :usersCommentsFilter="usersCommentsFilter" />
                        </div>
                    </div>
        
                    <Pagination :totalPage="totalPage" :pagination="pagination" />
                </div>
            </div>
        </section>
        <transition name="fade">
            <div class="chat" :style="{ width: rightWidth + 'px' }" v-if="!xs && sidelaw">
                <div class="resizer" @mousedown="startResize('right')"></div>
                <Home @close="sidelaw = false" />
            </div>
        </transition>
    </div>
</template>

<script setup>
    import { ref, computed, watch, onMounted, provide, onBeforeUnmount } from "vue";

    import { useDisplay } from 'vuetify'
    const { xs } = useDisplay()

    const leftWidth = ref(200) // Largura inicial da sidebar esquerda
    const rightWidth = ref(750) // Largura inicial da sidebar direita
    const isResizing = ref(false)
    const activeSidebar = ref(null)

    const startResize = (side) => {
      isResizing.value = true;
      activeSidebar.value = side;

      // Adiciona os eventos de movimento e liberação
      window.addEventListener("mousemove", onResize);
      window.addEventListener("mouseup", stopResize);
    }

    const onResize = (event) => {
        if (isResizing.value && activeSidebar.value) {
          const containerWidth = document.querySelector(".container").offsetWidth;
  
          if (activeSidebar.value === "left") {
            // Calcula a nova largura da sidebar esquerda
            const newLeftWidth = Math.min(Math.max(event.clientX, 100), containerWidth - rightWidth.value - 100);
            leftWidth.value = newLeftWidth;
          } else if (activeSidebar.value === "right") {
            // Calcula a nova largura da sidebar direita
            const newRightWidth = Math.min(
              Math.max(containerWidth - event.clientX, 100),
              containerWidth - leftWidth.value - 100
            );
            rightWidth.value = newRightWidth;
          }
        }
    }
    
    const stopResize = () => {
      isResizing.value = false;
      activeSidebar.value = null;

      // Remove os eventos de movimento e liberação
      window.removeEventListener("mousemove", onResize);
      window.removeEventListener("mouseup", stopResize);
    }

    import Pagination from "@/components/legislacao/avancadoText/pagination.vue";
    import TextDispositivo from "@/components/legislacao/forum/textDispositivo.vue";
    import DadosGrupo from "@/components/legislacao/forum/dadosGrupo.vue";
    import Home from "@/components/legislacao/forum/textavancado/home.vue";
   
    import { useForumStore } from "@/store/ForumStore";
    const forumStore = useForumStore()
   
    import { useSnackStore } from "@/store/snackStore";
    const snackStore = useSnackStore()
   
    import { useRoute, useRouter } from "vue-router";
    const route = useRoute()
    const router = useRouter()

    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()

    const sidelaw = ref(false)
    const search = ref(null)
    const artsFilterActive = ref(false)
    const pagination = ref({
        page: 1,
        perPage: 15
    })
    const artIndice = ref(null)
    const artsFilter = ref([])
    
    const withComments = ref(false)
    const withTags = ref(false)
    const withMarks = ref(false)

    const topUp = ref(null)

    watch(withComments, (newConfirm) => {
        pagination.value.page = 1 
        closeAllComments()
    })

    watch(withMarks, (newConfirm) => {
        pagination.value.page = 1 
        closeAllComments()
    })

    watch(search, (newConfirm) => {
        pagination.value.page = 1 
    })

    watch(() => pagination.perPage, (newVal, oldVal) => {
        pagination.value.page = 1;
      }, { deep: true }
    );

    watch(() => pagination.value.page, (newPage, oldPage) => {
        if (topUp.value) {
            topUp.value.scrollTo({
                top: 0,
                behavior: 'smooth' // Rolagem suave
            });
        }
        router.push({
            query: {
                ...route.query,
                page: newPage
            }
        })
    });

    watch(() => route.params.id, async (newId, oldId) => {
       sidelaw.value = false
       await getGroup()
       getAll()
    });

    watch(sidelaw, (side) => {
        if(!sidelaw.value) router.push({
            query: {
                id: null,
                art: null,
            }
        })
    })

    const contemEstilo = /<b>|<strong>|<u>|<ins>|<s>|<strike>|<del>|style\s*=\s*["'].*color\s*:|<span[^>]*color\s*:/i;

    const stripHtmlTags = (str) => {
        return str.replace(/<[^>]*>/g, '');
    }


    const listTextLaw = computed(() => {
        let list = listFinal.value

        if (search.value) {
            let searchb = search.value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            
            // Remover caracteres especiais do termo buscado
            let cleanedSearch = searchb.trim().replace(/[\[\]!'@><|//\\&*()_+=]/g, "");
            let exp = new RegExp(cleanedSearch, "i");

            // Fazer o filtro, removendo as tags HTML do texto
            let filtro = list.filter(item => {
                const plainText = stripHtmlTags(item.textlaw).normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                return exp.test(plainText) || exp.test(item.art);
            });

            list = filtro;
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

        if(withComments.value){
            list = list.filter(item => item.comments.length)
        }

        if(tagsFilter.value.length){
            list = list.filter(item => item.tags.some(tag => tagsFilter.value.includes(tag.toLowerCase())))
        }

        if(withMarks.value){
            list = list.filter(item => contemEstilo.test(item.textlaw));
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

        if(withComments.value){
            total = listFinal.value.filter(item => item.comments.length).length
        }

        if(tagsFilter.value.length){
            total = listFinal.value.filter(item => item.tags.some(tag => tagsFilter.value.includes(tag.toLowerCase()))).length
        }

        if(withMarks.value){
            total = listFinal.value.filter(item => contemEstilo.test(item.textlaw)).length
        }

        return Math.ceil(total/pagination.value.perPage)
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

    const listFinal = ref([])
    const tagsFilter = ref([])

    const listTags = computed(() => {
        const list = listFinal.value
        const tags = list.flatMap(x => x.tags.map(tag => tag.toLowerCase()))
        const tagsFlat = tags.flat()
        const tagsUnique = [...new Set(tagsFlat)]
        return tagsUnique
    })

    watch(tagsFilter, (newConfirm) => {
        pagination.value.page = 1 
        closeAllComments()
    })

    watch(withTags, (newConfirm) => {
        if(!withTags.value) tagsFilter.value = []
    })

    const getGroup = async () => {
        await forumStore.getGroup(route.params.id)
    }

    const getAll = async() => {
        await forumStore.getAllPages(route.params.id)
        listFinal.value = forumStore.readAllPages
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
        router.push({
            query: {
                ...route.query,
                page: 1
            }
        })
        pagination.value.page = 1
        closeAllComments()
    }

    const updateDispositivo = (event) => {
        const index = listFinal.value.findIndex(x => x.id === event.id)
        if (index !== -1) {
            Object.assign(listFinal.value[index], { tags: event.tags })
        }
    }   

    const textDispositivoRef = ref(null)

    const closeAllComments = () => {
        textDispositivoRef.value.forEach((instancia) => {
            instancia?.closeActiveComment?.()
        })
    }

    provide('listFinal', listFinal)

    //Fitrar por usuários
    import { useCommentStore } from "@/store/CommentStore";
    const commentStore = useCommentStore()
    
    const usersCommentsFilter = ref([])

    const usersComments =  computed(() => {
        return ['Humbert', 'maria']
    })

    //artigos por tag filter

    const listArtsTagsFilter = computed(() => {
        try {
            let list = listFinal.value
            list = list.filter(item => item.tags.some(tag => tagsFilter.value.includes(tag.toLowerCase()))).map( x => x.art)

            if(artsFilterActive.value){
                artsFilter.value.forEach(art => {
                    list.push(art)
                })
            }

            const artUnique = [...new Set(list)]
            return artUnique
        } catch (error) {
            return []
        }
    })

    provide('listArtsFilter', listArtsTagsFilter)

    //risize div law
    const lawRef = ref(null)
    const lawWidth = ref(0)
    const lawHeight = ref(0)
    let observer = null
    
    onMounted( async () => {
        observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                lawWidth.value = entry.contentRect.width
                lawHeight.value = entry.contentRect.height
            }
        })

        if (lawRef.value) {
            observer.observe(lawRef.value)
        }

        await getGroup()
        await getAll()
        route.query.page ? pagination.value.page = Number(route.query.page)  : ''
        geralStore.changeHeaderNoShow(false)
        commentStore.getUsersCommentsLaw(route.params.id)
    })

    onBeforeUnmount(() => {
        if (observer && lawRef.value) {
            observer.unobserve(lawRef.value)
            observer.disconnect()
        }
    })
  

</script>

<style lang="scss" scoped>
.wrapper{
    display: flex;
    height: calc(100vh - 20px); 
    font-family: Arial, sans-serif;
}
.conteudo {
    flex: 1;
    padding: 20px;
    background-color: #f4f4f4;
    overflow-y: auto;
    overflow-x: hidden;
}
.conteudo::-webkit-scrollbar {
  width: 8px; /* largura da barra */
}
.conteudo::-webkit-scrollbar-track {
  background: #f1f1f1; /* trilho da barra */
  border-radius: 4px;
}

.conteudo::-webkit-scrollbar-thumb {
  background-color: #888; /* "botão" da barra */
  border-radius: 4px;
}

.conteudo::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* ao passar o mouse */
}

/* Firefox */
.conteudo {
  scrollbar-width: thin;            /* largura fina */
  scrollbar-color: #888 #f1f1f1;    /* cor do "polegar" e trilho */
}

.law{
    width: min(100%, 1000px);
    margin-inline: auto;
}

.filterCheckbox{
    display: flex;
    align-items: center;
}

.selected{
    background: #DCEDC8;
    transition: all .3s ease-in-out;
}

.chat {
    width: 300px;
    background-color: #fff;
    border-left: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    overflow: auto;
    position: relative;
}

.chat.right {
    border-left: 1px solid #ddd;
}

.resizer {
  width: 5px;
  cursor: ew-resize;
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: #ccc;
  z-index: 10;
}

/* Indicador oval no centro da barra */
.resizer::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 40px;
  background-color: #aaa;
  border-radius: 10px;
  opacity: 0.6;
}

.resizer:hover::before {
  background-color: #888;
  opacity: 1;
}

.chat.right .resizer {
    left: 0;
}

.sizeLoad{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
}

.corpo{
    margin: 2rem;
    font-size: 15px;
    line-height: 2.1em
}

.form{
    width: 50%;
}

.formResize{
    width: 100%;
}

.corner-wrapper {
  height: 0;
  width: 100%;
}

.triangle {
  width: 0;
  height: 0;
  border-left: .5rem solid red;
  border-bottom: .5rem solid transparent;
}

.fixed {
  position: fixed;
  background: purple;
  width: 100%;
  text-align: center;
  bottom: 0; /* Ajuste conforme necessário */
  z-index: 1000; /* Certifique-se de que está acima de outros elementos */
  animation: slideTopDocument .5s ease-in;
  transition: 1s ease;
}

@media (max-width:900px){
    .form{
        width: 100%;
    }
}

@media (max-width:600px){
    .filterCheckbox{
        flex-direction: column;
        align-items: baseline;
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