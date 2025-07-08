<template>
     <div class="wrapper">
        <section class="conteudo" ref="topUp" :class="rightWidth > 500 ? 'conteudo1' : 'conteudo2'">
            <div class="mt-2 d-flex ga-2 align-center pa-2">
                <v-icon>mdi-check-all</v-icon>
                    <h1 class="text-h5">Questões</h1>
            </div>
            <v-alert variant="outlined" class="my-2">
                <p v-if="!listArtsFilter.length">Selecione o artigo para gerar questões.</p>
                <div v-else>
                    <p class="selectArt" ref="elemento">Artigo<span v-if="listArtsFilter.length > 1">s</span> selecionado<span v-if="listArtsFilter.length > 1">s</span></p>
                    <div class="d-flex justify-center align-center">
                        <v-chip-group
                            multiple
                            v-model="artsFilter"
                            column
                        >
                            <v-chip class="text-primary" v-for="art, a in listArtsFilter" :key="art" :value="art">{{art}}</v-chip>
                        </v-chip-group> 
                    </div>
                    <div class="text-center">
                        <p class="my-2 text-overline">Gere questões a partir do artigo selecionado.</p>
                        <v-btn :disabled="load" :loading="load" color="primary" @click="gerarQuestoes">Gerar Questões</v-btn>
                    </div>
                </div>
            </v-alert>

            <v-card class="my-2" variant="flat" v-if="listArtsFilter.length" >
                <v-card-text>
                    <h6>Artigo<span v-if="listArtsFilter.length > 1">s</span> Filtrado<span v-if="listArtsFilter.length > 1">s</span></h6>
                    <v-chip-group
                        multiple
                        v-model="artsFilter"
                        color="primary"
                        column
                    >
                        <v-chip v-for="art, a in listArtsFilter" :key="art" :value="art">{{art}}</v-chip>
                    </v-chip-group>
                </v-card-text>
            </v-card>

            <Loading class="my-10" v-if="loadQuestoes" />
            <LoadingQuestoesFrases v-if="load" :messages="messages"/>

            <v-card variant="outlined" v-if="questoesStore.readTotalQuestoes && !loadQuestoes" class="appear">
                <v-card-title class="d-flex align-start justify-space-between flex-column">
                    <div class="px-1 d-flex justify-space-between align-center w-100">
                        <div class="text-wrap mr-5">
                            <span v-if="$route.query.art">Artigo {{ $route.query.art }} - </span>{{ forumStore.readGroupForum._source.title }} 
                        </div>
                        <div class="pa-1 bg-primary rounded">Total: {{ questoesStore.readTotalRespQuestoes }}/{{ questoesStore.readTotalQuestoes }}</div>
                    </div>
                    <div class="px-1">
                        <small> 
                            <b> <v-icon size="1.2rem">mdi-filter</v-icon> Filtro:</b> {{ infoHeader.acertos }} certa{{ insertWordS(infoHeader.acertos) }} - {{ infoHeader.erros }} errada{{ insertWordS(infoHeader.erros) }} - 
                            <span class="text-success">{{ infoHeader.respondidas }} resolvida{{ insertWordS(infoHeader.respondidas) }} </span>
                        do total de {{ infoHeader.total }}</small>
                    </div>
                    <div class="w-100 border rounded-lg pa-2 ">
                        <div class="w-100 d-flex ga-1">
                            <v-select
                                label="Filtro"
                                :items="typeRespQuestions"
                                item-title="name"
                                item-value="id"
                                v-model="formQuestions.typeRespQuestions"
                                variant="outlined"
                                density="compact"
                                hide-details 
                                class="w-100"
                            ></v-select>
                            <div class="d-flex ga-1 w-100">
                                <v-select
                                    label="Ano"
                                    :items="listAnos"
                                    v-model="formQuestions.ano"
                                    multiple
                                    variant="outlined"
                                    density="compact"
                                    hide-details 
                                    clearable
                                    class="w-50"
                                ></v-select>
                                <v-select
                                    label="Banca"
                                    :items="listBancas"
                                    v-model="formQuestions.banca"
                                    multiple
                                    variant="outlined"
                                    density="compact"
                                    hide-details 
                                    clearable
                                    class="w-50"     
                                ></v-select>
                            </div>
                        </div>
                        <v-checkbox
                            label="Apenas favoritas"
                            density="compact"
                            v-model="formQuestions.favoritas"
                            hide-details
                        ></v-checkbox>
                    </div>
                </v-card-title>
                <v-card-text class="text-black">
                    <div v-for="item, i in listQuestoes" :key="item.id" class="mb-5">
                        <div class="mb-2 pa-2 bg-grey-lighten-2 d-flex ga-1 justify-space-between">
                            <div class="d-flex ga-1 align-center">
                                <!-- <v-chip color="primary" density="compact" :title="item.id">cod</v-chip>   -->
                                <h3 class="d-flex align-center ga-1"> <v-icon size="1.4rem">mdi-checkbox-marked-circle-outline</v-icon> Questão {{ i + 1 }}</h3> 
                            </div>
                            <div class="d-flex ga-1 align-center">
                                <h3 v-if="item?.banca ">{{ item.banca }}</h3>
                                <h3 v-if="item?.ano ">{{ item.ano }}</h3>
                                <FavQuestoes :questao="item" />
                            </div>
                        </div>
                        <div class="px-1">
                            <p>{{ item.pergunta }}
                            </p>
                            <Questoes_alternative :aleternativa="item" />
                        </div>
                    </div>
                    <div class="my-2 text-center">
                        <v-btn v-if="countZeroList < 2" variant="outlined" prepend-icon="mdi-plus" @click="getQuestoes">Mostrar mais</v-btn>
                        <v-alert v-else type="warning" variant="outlined" text="Não há mais questões para serem exibidas.">
                            <template v-slot:append>
                                <v-btn variant="outlined" append-icon="mdi-update" @click="reiniciarBusca">
                                    reiniciar
                                </v-btn>
                            </template>
                        </v-alert>
                    </div>
                </v-card-text>
            </v-card>

            <v-alert v-if="!questoesStore.readTotalQuestoes" variant="outlined" type="info" 
                text="Ainda não há questões vinculadas a artigos para esta norma. Selecione um artigo para gerar ou buscar questões."
            >
            </v-alert>
        </section>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch, inject, computed } from 'vue';
    import { useForumStore } from '@/store/ForumStore';
    import { useQuestoesStore } from '@/store/forum/QuestoesStore';
    import { useFavQuestoesStore } from '@/store/forum/favQuestionStore';
    import Questoes_alternative from './questoes_alternative.vue';
    import Loading from '../loading.vue';
    import { useRoute } from 'vue-router';
    import FavQuestoes from './favQuestoes.vue';
    import LoadingQuestoesFrases from './loadingMessages.vue';

    const forumStore = useForumStore()
    const questoesStore = useQuestoesStore()
    const favQuestoesStores = useFavQuestoesStore()
    const route = useRoute()
    const load = ref(false)
    const elemento = ref(null)
    const listArtsFilter = inject('listArtsFilter')

    const artsFilter = ref([])
    const rightWidth = inject('rightWidth')

    const formQuestions = ref({
        typeRespQuestions: 1,
        banca: [],
        ano: [],
        favoritas: false,
    })

    const typeRespQuestions = [
        {id: 1, name: 'Todas'},
        {id: 2, name: 'Apenas não respondidas'},
        {id: 3, name: 'Apenas respondidas'},
        {id: 4, name: 'Apenas as que errei'},
        {id: 5, name: 'Apenas as que acertei'},
    ]

    const messages = [
        'Aguarde, estamos gerando suas questões.',
        'Você poderá treinar com questões focadas no(s) artigo(s) selecionado(s).',
        'Estamos quase terminando.',
        'Você poderá favoritar as questões para ter acesso mais rápido.',
        'A resolução das questões ficam salvas para consultas posteriores.',
        'Todas as questões são comentadas.',
    ]

    const listQuestoes = computed(() => {
        let list = questoesStore.readQuestoesMoreResp

        if(formQuestions.value.typeRespQuestions == 1)  list = questoesStore.readQuestoesMoreResp
        if(formQuestions.value.typeRespQuestions == 2)  list = list.filter(item => !item.timestamp)
        if(formQuestions.value.typeRespQuestions == 3)  list = list.filter(item => item.timestamp)
        if(formQuestions.value.typeRespQuestions == 4)  list = list.filter(item => item.timestamp && item.resposta != item.id_resposta)
        if(formQuestions.value.typeRespQuestions == 5)  list = list.filter(item => item.timestamp && item.resposta == item.id_resposta)
        if(formQuestions.value.banca.length)  list = list.filter(item => formQuestions.value.banca.includes(item.banca))
        if(formQuestions.value.ano.length)  list = list.filter(item => formQuestions.value.ano.includes(Number(item.ano)))

        if(formQuestions.value.favoritas)  list = list.filter(item => favQuestoes.value.includes(item.id))
        
        return list
    })

    const listQuestoesRefBancaAno = computed(() => {
        let list = questoesStore.readQuestoesMoreResp

        if(formQuestions.value.typeRespQuestions == 1)  list = questoesStore.readQuestoesMoreResp
        if(formQuestions.value.typeRespQuestions == 2)  list = list.filter(item => !item.timestamp)
        if(formQuestions.value.typeRespQuestions == 3)  list = list.filter(item => item.timestamp)
        if(formQuestions.value.typeRespQuestions == 4)  list = list.filter(item => item.timestamp && item.resposta != item.id_resposta)
        if(formQuestions.value.typeRespQuestions == 5)  list = list.filter(item => item.timestamp && item.resposta == item.id_resposta)    

        return list
    })

    const favQuestoes = computed(() => {
        return favQuestoesStores.readFavorites.filter(x => x.fav).map( x => x.id_question)
    })

    const infoHeader = computed(() => {
        const list = listQuestoes.value
        const info = {
            total: list.length,
            acertos: list.filter(item => item.timestamp && item.resposta == item.id_resposta).length,
            erros: list.filter(item => item.timestamp && item.resposta != item.id_resposta).length,
            nao_respondidas: list.filter(item => !item.timestamp).length,
            respondidas: list.filter(item => item.timestamp).length,
        }
        return info
    })

    const listBancas = computed(() => {
        const list = questoesStore.readListBancas?.map(item => item.key.toUpperCase())
        const unique = [...new Set(list)]
        return unique 
    }) 

    const listAnos = computed(() => {
        const list = questoesStore.readListAnos?.map(item => item.key).sort((a, b) => b - a)
        return list
    })

    const insertWordS = (num) => {
        if(num > 1) return 's'
        return ''
    }   

    watch(() => route.query.art, (newId, oldId) => {
            getQuestoes()
            if(elemento.value) elemento.value.classList.add('selectArtAnimar')
            setTimeout(() => {
                elemento.value?.classList?.remove('selectArtAnimar')
            }, 1000)
        } 
    )

    watch(listArtsFilter, (newId, oldId) => {
        getQuestoes()
    });

    watch(() => artsFilter.value, (newId, oldId) => {
            getQuestoes()
        }
    )

    const loadQuestoes = ref(false)

    const countZeroList = ref(0)

    const setZeroList = (num) => {
        if(!num) countZeroList.value++
        if(num) countZeroList.value = 0
    }

    const clearFormSearch = () => {
        formQuestions.value = {
            typeRespQuestions: 1,
            banca: [],
            ano: [],
            favoritas: false,
        }
    }

    const reiniciarBusca = () => {
        clearFormSearch()
        getQuestoes()
    }

    const getQuestoes = async () => {
        loadQuestoes.value = true
        if(listArtsFilter.value.length) {
            await getQuestoesFilter()
        } else {
            await questoesStore.getQuestoes({ id_origin_law: forumStore.readGroupForum._source.idLaw, id_law: route.params.id, id_art: route.query.art }, formQuestions.value)
        }
        loadQuestoes.value = false
        setZeroList(questoesStore.readQuestoesMoreResp.length)

    }

    const getQuestoesFilter = async () => {
        if(!artsFilter.value.length && listArtsFilter.value.length) await questoesStore.getQuestoes({ id_origin_law: forumStore.readGroupForum._source.idLaw, id_law: route.params.id, id_art: listArtsFilter.value}, formQuestions.value)
        if(artsFilter.value.length) await questoesStore.getQuestoes({ id_origin_law: forumStore.readGroupForum._source.idLaw, id_law: route.params.id, id_art: artsFilter.value}, formQuestions.value)
    }

    const gerarQuestoes = async () => {
        load.value = true
        loadQuestoes.value = true
        await questoesStore.gerarQuestoes({ id_origin_law: forumStore.readGroupForum._source.idLaw, id_law: route.params.id, id_art: listArtsFilter.value[0], listArts: listArtsFilter.value})
        await getQuestoesFilter()
        loadQuestoes.value = false
        load.value = false
    }


    onMounted(async() => {
        loadQuestoes.value = true
        await questoesStore.totasisQuestoesLaw({ id_law: route.params.id, id_origin_law:forumStore.readGroupForum._source.idLaw })
        await getQuestoes()
        loadQuestoes.value = false
        questoesStore.getLists()
    })  

</script>

<style scoped>
     .wrapper {
        display: flex;
        justify-content: center; /* Isso centraliza o 'conteudo' se ele não ocupar 100% da largura do 'wrapper' */
        min-height: 50vh;
        font-family: Arial, sans-serif;
        padding-bottom: 2rem;
        /* Se você quer que o conteúdo ocupe toda a altura do wrapper, adicione: */
        align-items: stretch;
    }

    .conteudo {
        margin-top: 1rem;
        padding: 0 20px;
        background-color: #fffdfd;
        flex-grow: 1; /* Permite que o 'conteudo' se expanda */
        /* 'box-sizing: border-box;' é bom para evitar problemas com padding e largura */
        box-sizing: border-box;
    }

    /* Se a ideia é que 'conteudo1' e 'conteudo2' limitem a largura máxima, mantenha assim: */
    .conteudo1, .conteudo2 {
        max-width: 900px; 
    }

    .selectArt {
        font-size: 1.2em;
        font-weight: 500;
        background: #DCEDC8;
        padding: 1rem;
        text-align: center;
        border-radius: 12px;
    }
    .selectArtAnimar {
        animation: aumentar 0.5s ease-in-out;
    }

    @keyframes aumentar {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }

    .appear{
        animation: aparecer 1s ease-in-out;
    }

</style>