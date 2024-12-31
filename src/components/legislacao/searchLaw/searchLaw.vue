<template>
    <v-expand-transition>
        <div v-if="load">
            Carregando...
        </div>
        <div class="mb-5" v-if="resultsSearch?.total?.value">
            <v-list class="ma-0 pa-0">
                <v-list-subheader>Resultado da Busca</v-list-subheader>
                <div class="ml-4 d-flex align-center">
                    <small>Total de normas encontradas: {{ resultsSearch.total.value }}</small>
                    <v-btn variant="text" color="info" @click="resultsSearch = []">Limpar</v-btn>
                </div>
                <v-list-item 
                    v-for="item, i in resultsSearch.hits.map(x => x._source)" :key="i"
                    link
                    @click.stop="router.push(`text/${item.id}`)"
                >
                {{ item.title }} <br>
                <small>{{ nomeTipo(item.tipo) }}</small>

                <template v-slot:prepend>
                    <v-tooltip text="inserir norma">
                        <template v-slot:activator="{ props }">
                            <v-btn 
                                :color="docExiste(item.id)?'red':'green'" variant="plain" 
                                :icon="docExiste(item.id)?'mdi-delete':'mdi-plus-circle'" 
                                :title="docExiste(item.id)?'excluir norma': 'adicionar norma'"
                                class="ml-n1 mr-n2"
                                @click.stop="inserirDoc(item)"
                                :disabled="!loginStore.readLogin.cpf"
                            ></v-btn>
                        </template>
                    </v-tooltip>
                </template>
                <template v-slot:append>
                    <PageOne :law="item" />
                </template>
                </v-list-item>
            </v-list>
        </div>
        <v-alert v-else-if="!load && !resultsSearch?.total?.value && searchActive" type="warning" variant="outlined" class="mb-5">
            não foi encontrado resultados para essa busca
        </v-alert>
    </v-expand-transition>
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
    <div v-if="document.length" class="fixed-element">
        <CollectionDialog :docs="document" @apagarDocs="document = []"/>   
        <v-btn color="error" variant="text" prepend-icon="mdi-delete" @click="document=[]"> Excluir</v-btn>
        <!-- <DocumentSave v-if="readLogin" :document="document" @fecharDoc="document=[]" /> -->
    </div>
</template>

<script setup>
    import { useRouter } from 'vue-router';
    import PageOne from './pageOne.vue';
    import { ref } from 'vue';
    import CollectionDialog from '../collection/CollectionDialog.vue';
    
    import { useLoginStore } from '@/store/LoginStore';
    const loginStore = useLoginStore()

    import { useGeneralStore } from '@/store/GeneralStore'
    const generalStore = useGeneralStore()  

    const router = useRouter()

    const props = defineProps({
        resultsSearch: Object, 
        load: Boolean,
        searchActive: Boolean
    })

    const document = ref([])

    const snack = ref ({
        snackbar: false,
        text: 'Nova página adicionada ao documento.',
        timeout: 2000
    })

    const inserirDoc = (item) => {
        const res = docExiste(item.id)
        if(res){
            document.value = document.value.filter(x => x.id != res)
            snack.value.text = "Norma Removida da coleção."
            snack.value.snackbar = true
        }else {
            const objeto = (({ description_norm, description_norm_vector, fonte, page_to_norma, path, data_include, ...rest }) => rest)(item)
            document.value.push(objeto)
            snack.value.text = 'Norma adicionada a Coleção.',
            snack.value.snackbar = true
        }
    }   
    const docExiste = (item) => {
        let ids = document.value.map(x => x.id)
        let find = ids.find(x => x == item)
        return !!find
        ? find
        : false
    }

    const nomeTipo = (item) => {
        let nome = generalStore.fonteNome(item)
        return nome.mudar
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