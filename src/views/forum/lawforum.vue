<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <v-tabs
                class="mb-2"
                v-if="mdAndDown"
                v-model="tab"
                align-tabs="center"
                color="deep-purple-accent-4"
            >
                <v-tab :value="1">Norma</v-tab>
                <v-tab :value="2">Ferramentas</v-tab>
            </v-tabs>

            <section 
                ref="leftPanel" class="panel conteudo overflow-y-auto" 
                :style="mdAndDown ? '': { width: leftWidth + 'px' }"
                v-if="mdAndDown && tab == 1 || !mdAndDown"
            >
                <div class="law" ref="lawRef">
                    <div class="sizeLoad" v-if="forumStore.readLoad">
                        <v-progress-circular
                            :size="50"
                            color="primary"
                            indeterminate
                        ></v-progress-circular>
                    </div>
                    <div v-else>
                        <v-btn 
                            variant="tonal" 
                            @click="$route.query.permission ? $router.push('/permissoes') : $router.push('/myforuns')" 
                            prepend-icon="mdi-arrow-left"
                            class="btn">Voltar</v-btn>   
                        <v-btn 
                            class="ml-2" 
                            color="success" 
                            v-if="!mdAndDown"
                            @click="sidelaw = !sidelaw" variant="flat">Ferramentas de Estudo</v-btn>    
                        
                        <DadosGrupo />
            
                        <v-card class="my-5">
                            <v-card-text>
                                <div>
                                    <div :class="leftWidth < 600 ? 'formResize' : 'form'">
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
                                                v-if="safeArtsFilterActive && safeArtsFilter.length > 0 && isComponentMounted"
                                                :key="safeArtsFilter.length"
                                         >
                                            <v-chip 
                                                @click="pageFilter(false)" 
                                                variant="text" v-if="safeArtsFilter.length === 1"
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
                                                @click="clearAllArtsFilter" v-if="safeArtsFilter.length > 1" text color="error">
                                                Limpar Filtro
                                            </v-btn>
                                            <v-chip 
                                                @click="pageFilter(true)" 
                                                variant="text" v-if="safeArtsFilter.length === 1">
                                                    <v-icon>mdi-arrow-right-drop-circle-outline</v-icon>
                                            </v-chip>
                                        </v-chip-group>
                                    </div>
                                </div>
                                <div>
                                    <div class="filterCheckbox" :class="{'d-flex flex-column align-start': leftWidth < 600}">
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
                                        <IndiceLaw :estrutura="estrutura" @goTo="filterArts($event, true)" />
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
                                    <TextDispositivo ref="textDispositivoRef" :dispositivo="item" :search="search" @open="sidelaw = true" @update-dispositivo="updateDispositivo" :listTags="listTags" :usersCommentsFilter="usersCommentsFilter" />
                            </div>
                        </div>
            
                        <Pagination :totalPage="totalPage" :pagination="pagination" />
                    </div>
                </div>
            </section>
            <!-- barra ed ajuste -->
            <div 
                v-if="sidelaw && !mdAndDown"
                ref="divider" 
                class="panel-divider"
                @mousedown="startResize"
                @mouseover="onDividerHover"
                @mouseleave="onDividerLeave"
                >
                <v-icon
                    :color="isDragging || isHovering ? 'primary' : 'grey'"
                    icon="mdi-drag-vertical"
                ></v-icon>
            </div>
            <!-- menu de opcoes -->
            <transition name="fade">
                <div 
                    ref="rightPanel" 
                    class="panel right-panel overflow-y-auto chat" 
                    :style="mdAndDown ? '': { width: rightWidth + 'px' }" v-show="!xs && sidelaw || mdAndDown && tab == 2"
                    v-if="mdAndDown && tab == 2 || !mdAndDown"
                >
                    <Home @close="sidelaw = false, tab = 1" class="chat-content" />
                </div>
            </transition>
        </div>
    </section>
</template>

<script setup>
    import { ref, computed, watch, onMounted, provide, onBeforeUnmount, nextTick  } from "vue";
    import { useDisplay } from 'vuetify'
    const { mobile, xs, sm, md, lg, xl, xxl, name, mdAndDown  } = useDisplay()

    import Pagination from "@/components/legislacao/avancadoText/pagination.vue";
    import TextDispositivo from "@/components/legislacao/forum/textDispositivo.vue";
    import DadosGrupo from "@/components/legislacao/forum/dadosGrupo.vue";
    import Home from "@/components/legislacao/forum/textavancado/home.vue";

    import { useMapaMentalStore } from '@/store/concursos/MapasMentaisStore';
    import { useForumStore } from "@/store/ForumStore";
    import { useSnackStore } from "@/store/snackStore";
    import { useRoute, useRouter } from "vue-router";
    import { useGeralStore } from '@/store/GeralStore';

    const mapaMentalStore = useMapaMentalStore()
    const forumStore = useForumStore()
    const snackStore = useSnackStore()
    const route = useRoute()
    const router = useRouter()
    const geralStore = useGeralStore()

    const tab = ref(1)
    const isComponentMounted = ref(false)
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
        if (leftPanel.value) {
            leftPanel.value.scrollTo({
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
        forumStore.updateItemsAcumulados()
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

    const estrutura = computed(() => {
        const list = listFinal.value.filter(x => x.estrutura)
        return list
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

    const filterJustArt = async (item) => {
        // Verificar se o componente ainda está montado
        if (!isComponentMounted.value) {
            console.warn('Componente desmontado, cancelando operação');
            return;
        }

        if (!item || typeof item !== 'string') {
            console.warn('Item inválido para filtro:', item);
            return;
        }

        try {
            const art = item.replace(/[^0-9,]/g, '');
            const hasComma = art.includes(",");

            if (hasComma && art) {
                const artList = art.split(",").filter(x => x.trim() !== '');
                
                // Processar em lotes para evitar bloqueio
                for (const artItem of artList) {
                    if (!isComponentMounted.value) break; // Verificar antes de cada iteração
                    await nextTick(); // Permitir que o Vue processe outras tarefas
                    filterArts(artItem.trim());
                }
            } else if (art) {
                filterArts(art);
            }
        } catch (error) {
            console.error('Erro em filterJustArt:', error);
            if (snackStore?.activeSnack) {
                snackStore.activeSnack("Erro ao processar filtro.", "error");
            }
        }
    }

    const filterArts = (art, indice = false) => {
        if(indice) clearAllArtsFilter()
        // Verificação prioritária do ciclo de vida
        if (!isComponentMounted.value) {
            console.warn('Componente desmontado, cancelando filterArts');
            return;
        }

        try {
            if (!art || isNaN(art)) {
                console.warn('Artigo inválido:', art);
                return;
            }

            const artNumber = parseInt(art);
            
            // Verificações de segurança com guards
            if (!lastArt?.value || artNumber > lastArt.value) {
                if (snackStore?.activeSnack) {
                    snackStore.activeSnack("Artigo não encontrado.", "error");
                }
                return;
            }

            // Limpar campos apenas se o componente ainda estiver ativo
            if (isComponentMounted.value) {
                if (artIndice?.value !== undefined) artIndice.value = '';
                if (search?.value !== undefined) search.value = '';
            }

            // Verificar se artsFilter existe e componente está ativo
            if (!artsFilter?.value || !isComponentMounted.value) {
                console.error('artsFilter não disponível ou componente desmontado');
                return;
            }

            const findArt = artsFilter.value.find(x => x == artNumber);

            if (!findArt && artNumber > 0) {
                artsFilter.value.push(artNumber);
            } else if (!findArt) {
                if (snackStore?.activeSnack) {
                    snackStore.activeSnack("Artigo não encontrado.", "error");
                }
                return;
            }

            // Atualizar estado apenas se componente ativo
            if (isComponentMounted.value && artsFilterActive?.value !== undefined) {
                artsFilterActive.value = artsFilter.value.length > 0;
            }

            // Chamar roteamento com delay para evitar conflitos
            if (isComponentMounted.value && typeof routeFilterPagesAndArts === 'function') {
                nextTick(() => {
                    if (isComponentMounted.value) {
                        routeFilterPagesAndArts();
                    }
                });
            }

        } catch (error) {
            console.error('Erro em filterArts:', error);
            if (snackStore?.activeSnack && isComponentMounted.value) {
                snackStore.activeSnack("Erro ao filtrar artigo.", "error");
            }
        }
    }

    const routeFilterPagesAndArts = () => {
        if( artsFilterActive.value){
            const { page, arts, perPage, ...outrosParams } = route.query
            router.push({
                path: route.path,        // mantém o caminho atual
                query: {
                    ...outrosParams,      
                    page: pagination.value.page,      
                    perPage: pagination.value.perPage,      
                    arts: [...artsFilter.value]       
                }
            })
        } else {
            const { page, arts, perPage, ...outrosParams } = route.query
            router.push({
                path: route.path,
                query: {
                    ...outrosParams,      
                    page: pagination.value.page,      
                    perPage: pagination.value.perPage
                }
            })
        }
        forumStore.updateItemsAcumulados()
    }

    const extractArtsFromQuery = () => {
        const queryArts = route.query.arts
        if (queryArts) {
            artsFilterActive.value = true
            // Se arts for um array (múltiplos valores)
            if (Array.isArray(queryArts)) {
                artsFilter.value = queryArts.map(art => parseInt(art))
            } 
            // Se arts for uma string (um único valor)
            else {
                artsFilter.value = [parseInt(queryArts)]
            } 
        } else {
            artsFilter.value = []
        }
    }

    const clearAllArtsFilter = () => {
        if (!isComponentMounted.value) return;
        
        try {
            if (artsFilter?.value) {
                artsFilter.value = [];
            }
            if (artsFilterActive?.value !== undefined) {
                artsFilterActive.value = false;
            }
            
            if (typeof routeFilterPagesAndArts === 'function') {
                nextTick(() => {
                    if (isComponentMounted.value) {
                        routeFilterPagesAndArts();
                    }
                });
            }
        } catch (error) {
            console.error('Erro ao limpar filtros:', error);
        }
    }

    const artFilterRemove = (tag) => {
        if (!isComponentMounted.value) return;
        
        try {
            if (!artsFilter?.value) return;
            
            const index = artsFilter.value.findIndex(art => art == tag);
            if (index > -1) {
                artsFilter.value.splice(index, 1);
            }
            
            if (artsFilterActive?.value !== undefined) {
                artsFilterActive.value = artsFilter.value.length > 0;
            }
            
            if (typeof routeFilterPagesAndArts === 'function') {
                nextTick(() => {
                    if (isComponentMounted.value) {
                        routeFilterPagesAndArts();
                    }
                });
            }
        } catch (error) {
            console.error('Erro ao remover filtro:', error);
        }
    }

    const pageFilter = (item) => {
        if (!isComponentMounted.value) {
            console.warn('Componente desmontado, cancelando pageFilter');
            return;
        }

        try {
            if (!artsFilter?.value || artsFilter.value.length === 0) {
                console.warn('Nenhum filtro de artigo ativo');
                return;
            }

            let art = artsFilter.value[0];
            
            if (!lastArt?.value) {
                console.error('lastArt não está definido');
                return;
            }

            if (item) {
                if (art < lastArt.value) {
                    art++;
                }
            } else {
                if (art > 1) {
                    art--;
                }
            }

            // Só atualizar se componente ainda estiver ativo
            if (isComponentMounted.value) {
                artsFilter.value = [art];

                if (router && route) {
                    router.push({
                        query: {
                            ...route.query,
                            page: 1
                        }
                    });
                }

                if (pagination?.value) {
                    pagination.value.page = 1;
                }

                // Usar nextTick para operações que podem causar re-renderização
                nextTick(() => {
                    if (isComponentMounted.value) {
                        if (typeof closeAllComments === 'function') {
                            closeAllComments();
                        }
                        
                        if (typeof routeFilterPagesAndArts === 'function') {
                            routeFilterPagesAndArts();
                        }
                    }
                });
            }

        } catch (error) {
            console.error('Erro em pageFilter:', error);
            if (snackStore?.activeSnack && isComponentMounted.value) {
                snackStore.activeSnack("Erro ao navegar entre artigos.", "error");
            }
        }
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
    import IndiceLaw from "@/components/legislacao/forum/foruns/indiceLaw.vue";
    const commentStore = useCommentStore()
    
    const usersCommentsFilter = ref([])

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

    //receber dados do filho
    const textoVincular = ref({
        item: null,
        arts: [],
        idLaw: null
    })

    const vincularDispositivo = (item, arts = [], idLaw = null) => {
      textoVincular.value = {
        item,
        arts,
        idLaw
      }
      sidelaw.value = true
    };

    provide('vincularDispositivo', vincularDispositivo);
    provide('textoVincular', textoVincular);

    const leftPanel = ref(null);
    const rightPanel = ref(null);
    const divider = ref(null);

    // Estado do componente
    const containerWidth = ref(0);
    const leftWidth = ref(0);
    const isDragging = ref(false);
    const isHovering = ref(false);
    const startX = ref(0);
    const startLeftWidth = ref(0);

    watch(sidelaw, (newSidebar) => {
       if(!sidelaw.value) leftWidth.value = 20000
       if(sidelaw.value) leftWidth.value = containerWidth.value / 2 - 10; // Dividir ao meio inicialmente
    })

    // Largura do painel direito calculada
    const rightWidth = computed(() => {
        return containerWidth.value - leftWidth.value - 10; // 10px é a largura do divisor
    });

    provide('rightWidth', rightWidth)

    // Iniciar o redimensionamento
    const startResize = (e) => {
        isDragging.value = true;
        startX.value = e.clientX;
        startLeftWidth.value = leftWidth.value;
        
        // Adicionar evento de mousemove ao documento
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
        
        // Alterar o cursor durante o arrasto
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none'; // Impedir seleção de texto durante o arrasto
    };

    // Fazer o redimensionamento
    const resize = (e) => {
        if (!isDragging.value) return;
        
        const delta = e.clientX - startX.value;
        let newLeftWidth = startLeftWidth.value + delta;
        
        // Limites para o redimensionamento
        const minWidth = 100; // Largura mínima para cada painel
        const maxWidth = containerWidth.value - minWidth - 10; // Largura máxima considerando o divisor
        
        if (newLeftWidth < minWidth) {
            newLeftWidth = minWidth;
        } else if (newLeftWidth > maxWidth) {
            newLeftWidth = maxWidth;
        }
        
        leftWidth.value = newLeftWidth;
    };

    // Parar o redimensionamento
    const stopResize = () => {
        isDragging.value = false;
        
        // Remover eventos de documento
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
        
        // Restaurar o cursor
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    };

    // Manipuladores para estilização do divisor
    const onDividerHover = () => {
        isHovering.value = true;
        document.body.style.cursor = 'col-resize';
    };

    const onDividerLeave = () => {
        if (!isDragging.value) {
            isHovering.value = false;
            document.body.style.cursor = '';
        }
    };

    // Inicializar as dimensões
    const initDimensions = () => {
        if (leftPanel.value && rightPanel.value) {
            const container = leftPanel.value.parentElement;
            containerWidth.value = container.clientWidth;
            if(sidelaw.value) {
                leftWidth.value = containerWidth.value / 2 - 10; // Dividir ao meio inicialmente  
                return
            } 
              leftWidth.value = 1200;
        }
    };

    // Atualizar dimensões no redimensionamento da janela
    const handleResize = () => {
        initDimensions();
    };
    
    onMounted( async () => {
        isComponentMounted.value = true;
        initDimensions();
        window.addEventListener('resize', handleResize);
        await getGroup()
        await getAll()
        route.query.page ? pagination.value.page = Number(route.query.page)  : ''
        geralStore.changeHeaderNoShow(false)
        commentStore.getUsersCommentsLaw(route.params.id)
        extractArtsFromQuery()
        mapaMentalStore.getMapasMentais()
    })

    onBeforeUnmount(() => {
        isComponentMounted.value = false;
        window.removeEventListener('resize', handleResize);
    })

    const safeArtsFilter = computed(() => {
        if (!isComponentMounted.value || !artsFilter?.value) {
            return [];
        }
        return artsFilter.value;
    })

    const safeArtsFilterActive = computed(() => {
        if (!isComponentMounted.value || !artsFilterActive?.value) {
            return false;
        }
        return artsFilterActive.value;
    })
  

</script>

<style lang="scss" scoped>
    .container {
        display: flex;
        justify-content: center;
        width: 100%;
        overflow: hidden;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        height: calc(100vh - 137px);
    }

    .container2{
        display: flex;
        justify-content: center;
        width: 100%;
        overflow: hidden;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        height: calc(100vh - 16px);
    }
    
    .conteudo {
        padding: 20px;
        background-color: #f4f4f4;
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
        background-color: #fff;
        border-left: 1px solid #ccc;
        display: flex;
        flex-direction: column;
        overflow: auto;
        position: relative;
    }

    .sizeLoad{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50vh;
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

    .panel {
        height: 100%;
        overflow: hidden;
    }
    .panel-content {
        padding: 16px;
        height: 100%;
    }

    .panel-divider {
        width: 10px;
        height: 100%;
        background-color: #fff;
        cursor: col-resize;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
    }
    .panel-divider:hover {
        background-color: #e0e0e0;
    }
    .right-panel{
        transition: 1s ease-in-out;
    }

    @media (max-width:1279px){
        .container, .container2{
            flex-direction: column;
            align-items: center;
            overflow-x: hidden;
        }
        .panel, .conteudo{
            width: 100%;
        }
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