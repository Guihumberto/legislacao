<template>
    <v-expand-transition>
        <div v-if="load">
            Carregando...
        </div>
        <div class="mb-5" v-if="resultsSearch?.total?.value">
            <v-card variant="flat" class="border my-5">
                <v-card-text>
                    <div class="d-flex align-center">
                        Fonte: 
                        <v-chip-group filter
                            class="ml-2"
                            v-model="facetas.fonte"
                            selected-class="text-primary"
                            multiple
                        >
                            <v-chip
                                v-for="f, fi in resultSearchFonte" :key="fi"
                                :text="generalStore.fonteNome(f).mudar"
                                :value="f"
                                variant="outlined"
                                filter
                                density="compact"
                            ></v-chip>
                        </v-chip-group>
                    </div>
                    <div class="d-flex align-center">
                        Ano: 
                        <v-chip-group
                            class="ml-2"
                            v-model="facetas.ano"
                            selected-class="text-primary"
                            multiple
                        >
                            <v-chip
                                v-for="ano in resultSearchAno" :key="ano"
                                :text="ano.toString()"
                                :value="ano"
                                variant="outlined"
                                :disabled="!disableFacetaAno(ano)"
                                filter
                                density="compact"
                            ></v-chip>
                        </v-chip-group>
                    </div>
                    <div class="d-flex align-center">
                        <p>Total de normas encontradas: {{ resultsSearch.total.value }}</p>
                        <v-btn variant="text" color="info" @click="limpar()">Limpar</v-btn>
                    </div>
                </v-card-text>
            </v-card>
            <v-list class="ma-0 pa-0 bg-transparent">
                <v-list-subheader v-if="type != 'search'"><v-icon>mdi-magnify</v-icon>Resultado da Busca</v-list-subheader>
                <v-list-item 
                    v-for="item, i in resultsSearchFilter" :key="i"
                    link class="py-3 bg-grey-lighten-4"
                    @click.stop="router.push(`text/${item.id}?search=${type}`)"
                >
                {{ item.title }} <br>

                <small>{{ generalStore.fonteNome(item.tipo).mudar }} 
                <v-chip v-if="item.revogado" density="compact" color="warning"> Norma Revogada</v-chip></small>

                <template v-slot:prepend>
                    <v-tooltip text="inserir norma">
                        <template v-slot:activator="{ props }">
                            <v-btn 
                                :color="docExiste(item.id)?'red':'green'" variant="plain" 
                                :icon="docExiste(item.id)?'mdi-minus-circle':'mdi-plus-circle'" 
                                :title="docExiste(item.id)?'excluir norma': 'adicionar norma'"
                                @click.stop="inserirDoc(item)"
                                :disabled="!loginStore.readLogin.cpf"
                            ></v-btn>
                        </template>
                    </v-tooltip>
                </template>
                <template v-slot:append>
                    <v-tooltip width="200" :text="true ? 'Dê dois cliques para desfavoritar a Norma' : 'Dê dois cliques para favoritar a Norma'">
                        <template v-slot:activator="{ props }">
                            <v-btn 
                                @click.stop="saveFavoritos(item)" 
                                variant="text" :color="isFav(item).exist ? 'primary' : 'grey'" icon=" mdi-star"></v-btn>
                            </template>
                    </v-tooltip>
                    <PageOne :law="item" />
                </template>
                </v-list-item>
            </v-list>
        </div>
        <v-alert v-else-if="!load && !resultsSearch?.total?.value && searchActive" type="warning" variant="outlined" class="mb-5">
            não foram encontrados resultados para essa busca
        </v-alert>
    </v-expand-transition>
    <div v-if="document.length" class="fixed-element">
        <CollectionDialog :docs="document" @apagarDocs="fecharDocuments"/>   
        <v-btn color="error" variant="text" prepend-icon="mdi-delete" @click="document=[]"> Excluir</v-btn>
        <!-- <DocumentSave v-if="readLogin" :document="document" @fecharDoc="document=[]" /> -->
    </div>
</template>

<script setup>
    import { useRouter } from 'vue-router';
    import PageOne from './pageOne.vue';
    import { ref, computed, watch, toRefs } from 'vue';
    import CollectionDialog from '../collection/CollectionDialog.vue';
    
    import { useLoginStore } from '@/store/LoginStore';
    const loginStore = useLoginStore()

    import { useGeneralStore } from '@/store/GeneralStore'
    const generalStore = useGeneralStore()  

    import { useUserAreaStore } from '@/store/AreaUserStore';
    const areaUserStore = useUserAreaStore()

    import { useSnackStore } from '@/store/snackStore';
    import { useLawStore } from '@/store/LawsStore';
    const snackStore = useSnackStore()

    const router = useRouter()

    const props = defineProps({
        resultsSearch: Object, 
        load: Boolean,
        searchActive: Boolean,
        type: String
    })

    const document = ref([])

    const inserirDoc = (item) => {
        const res = docExiste(item.id)
        if(res){
            document.value = document.value.filter(x => x.id != res)
            snackStore.activeSnack("Norma Removida da coleção.", "error")

        }else {
            const objeto = (({ description_norm, description_norm_vector, fonte, page_to_norma, path, data_include, ...rest }) => rest)(item)
            document.value.push(objeto)
            snackStore.activeSnack('Norma adicionada a Coleção.', 'success')
        }
    }   
    const docExiste = (item) => {
        let ids = document.value.map(x => x.id)
        let find = ids.find(x => x == item)
        return !!find
        ? find
        : false
    }

    const isFav = (item) => {
        if(loginStore.readLogin.cpf) {
            const isExist = areaUserStore.readFavoritos
                            .find(x => x.id == item.id)
            return {exist: !!isExist, fav: isExist}
        } else {
            return {exist: false, fav: false}
        }
    }

    const saveFavoritos = async (item) => {
        if(loginStore.readLogin.cpf && !areaUserStore.readLoad) {
            const isExist = isFav(item)
            if(isExist.exist){
                await areaUserStore.deleteFav(isExist.fav.idU)
                return
            }
            const { ano, tipo, id, revogado, sigiloso, title, total_pages } = item
            const lawFav = {
                fav: true,
                folder: null, 
                ano,
                tipo, 
                id,
                id_law: id, 
                name_law: title, 
                num_page: null, 
                revogado,
                section: "law", 
                sigiloso
            }
            await areaUserStore.saveFavoritos(lawFav)

            const text = lawFav.fav ? 'Norma adicionada aos favoritos.' : 'Norma removida dos favoritos.'
            const color = lawFav.fav ? 'success' : 'error'
            snackStore.activeSnack(text, color)

        } else {
            snackStore.activeSnack('Necessário estar logado para usar esta funcionalidade.', 'error')   
        }
    }

    const facetas = ref({
        ano: [],
        fonte: []
    })

    const { resultsSearch } = toRefs(props);
    const clearFacetas = () => {
        facetas.value = { ano: [], fonte: [] }
    } 

    const emits = defineEmits(['clear'])

    const limpar = () => {
        emits('clear')
    }

    watch(resultsSearch, (newResult, oldValue) => {
            clearFacetas()
        },  { immediate: true } 
    )

    const lawStore = useLawStore()

    const results= computed(() => {
        return lawStore.readResults.map(x => x._source)
    })

    const resultSearchFonte = computed(() => {
        let list = results.value.map(x => x.tipo)
        const listAnos = [...new Set(list)].sort((a, b) => a.localeCompare(b))
        return listAnos
    })

    const resultSearchAno = computed(() => {
        let list = results.value.map(x => x.ano)
        const listAnos = [...new Set(list)].sort((a, b) => a - b)
        return listAnos
    })

    const filterFacetaFonte = computed(() => {
            const list = resultsSearchFilter.value.map(x => x.ano)
            const listSet = [...new Set(list)]
            return listSet
    })

    const filterFacetaFonteAll = computed(() => {
        let list = props.resultsSearch.hits.map(x => x._source)
        list = list.filter(x => facetas.value.fonte.includes(x.tipo))
                .map(x => x.ano)
        list = [...new Set(list)]
        return list
    })

    const resultsSearchFilter = computed(() => {
        let list = props.resultsSearch.hits.map(x => x._source)

        if(facetas.value.ano.length){
            list = list.filter(x => facetas.value.ano.includes(x.ano))
        }

        if(facetas.value.fonte.length){
            list = list.filter(x => facetas.value.fonte.includes(x.tipo))
        }

        return list
    })

    const disableFacetaAno = (item) => {
        if(facetas.value.fonte.length && facetas.value.ano.length){
            const list = filterFacetaFonteAll.value.includes(item)
            return !!list
        }
        if(facetas.value.fonte.length){
            const list = filterFacetaFonte.value.includes(item)
            return !!list
        }
        if(!facetas.value.ano.length) {
            const list = filterFacetaFonte.value.includes(item)
            return !!list
        }
        return true
    }

    const fecharDocuments = () => {
        document.value = []
        snackStore.activeSnack('Coleção Salva', 'success')
    }
   
</script>

<style scoped>
    .fixed-element {
        position: fixed;
        text-align: center;
        display: flex;
        flex-direction: column;
        bottom: 0; /* Ajuste conforme necessário */
        left: 80%; /* Centraliza horizontalmente */
        border-radius: 12px 12px 0 0;
        color: #fff;
        background-color: #2cba16; /* Fundo para visualizar melhor */
        padding: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1); /* Sombra opcional */
        z-index: 1000; /* Certifique-se de que está acima de outros elementos */
        animation: slideTopDocument .5s ease-in;
        transition: 1s ease;
    }
    @keyframes slideTopDocument {
        0%{
            transform: translateY(300px);
        }
        100%{
            transform: translateY(0);
        }
    }
    @media (max-width: 1200px) {
        .fixed-element{
            left: 50%;
            transform: translateX(-50%);       
        }
    }
</style>