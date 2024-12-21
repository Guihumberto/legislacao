<template>
    <v-expand-transition>
        <div v-if="load">
            Carregando...
        </div>
        <div class="mb-5" v-if="resultsSearch.length">
            <v-list class="ma-0 pa-0">
                <v-list-subheader>Resultado da Busca</v-list-subheader>
                <v-list-item 
                    v-for="item, i in resultsSearch.map(x => x._source)" :key="i"
                    link
                    @click.stop="router.push(`text/${item.id}`)"
                >
                {{ item.title }} <br>
                <small>{{item.tipo}}</small>

                <template v-slot:prepend>
                    <v-tooltip text="inserir norma">
                        <template v-slot:activator="{ props }">
                            <v-btn 
                                :color="docExiste(item.id)?'red':'green'" variant="plain" 
                                :icon="docExiste(item.id)?'mdi-delete':'mdi-plus-circle'" 
                                :title="docExiste(item.id)?'excluir norma': 'adicionar norma'"
                                class="ml-n1 mr-n2"
                                @click.stop="inserirDoc(item)"
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

    const router = useRouter()

    const props = defineProps({
        resultsSearch: Array, 
        load: Boolean
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
            document.value.push(item)
            snack.value.text = 'Norma adicionada a Coleação.',
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
   
</script>

<style scoped>
    .fixed-element {
        position: fixed;
        text-align: center;
        bottom: 0; /* Ajuste conforme necessário */
        right: 80%; /* Centraliza horizontalmente */
        border-radius: 12px 12px 0 0;
        color: #fff;
        background-color: #2cba16; /* Fundo para visualizar melhor */
        padding: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1); /* Sombra opcional */
        z-index: 1000; /* Certifique-se de que está acima de outros elementos */
        animation: slideTopDocument .5s ease-in;
    }
</style>