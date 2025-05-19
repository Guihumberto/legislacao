<template>
    <div>
        <v-btn @click="dialog = true" variant="text" icon="mdi-robot-outline" color="info" title="Resumo IA"></v-btn>
        <v-dialog v-model="dialog">
            <v-card max-width="800" class="mx-auto" min-height="200">
                <v-card-title class="bg-red d-flex align-center justify-space-between">
                    <div class="d-flex">
                        <v-icon class="mr-2">mdi-robot</v-icon> <h1 class="text-h5">Resumo IA</h1>
                    </div>
                    <v-btn icon="mdi-close" density="compact" variant="text" @click="dialog=false"></v-btn>
                </v-card-title>
                <v-card-text class="text-center overflow-auto">
                    <v-chip>pág. {{ page.num_page }} - {{ page.page_to_norma.title }}</v-chip>
                    <v-sheet class="pa-2 border-1 border-red-lighten-2 mt-5" v-if="relevantTermsLaw.length">
                        <p class="font-weight-bold mb-2">Termos relevantes da Norma</p>
                        <v-chip class="mr-1 mb-1" v-for="item, i in relevantTermsLaw" :key="i">{{ item.key }}</v-chip>
                    </v-sheet>
                    <div v-if="!summary">
                        <v-alert text="Crie um resumo a partir da página selecionada com uma lista de palavras-chaves." type="info" variant="text"></v-alert>
                        <v-btn @click="fetchSuggestions" color="info" prepend-icon="mdi-robot" :loading="load" :disabled="load">Criar resumo IA</v-btn>
                    </div>

                    <v-alert type="error" variant="outlined" v-if="erros" class="my-5">
                        <div v-if="erros == 503">
                            <p>Aguarde enquanto o modelo é está sendo carregado...</p>
                            <p v-if="timeLeft > 0">Tempo restante: {{ timeLeft }} segundos</p>
                            <p @click="fetchSuggestions" v-else>Pronto!!</p>
                        </div>
                        <p v-else>{{ erros }}</p>
                    </v-alert>

                    <!-- resumo -->
                    <div class="border px-5 pt-5 mt-5 bg-pink-lighten-5 rounded" v-if="summary">
                        <h3 class="text-h5 mb-2">Resumo da página</h3>
                        <p class="text-left">{{ summary }}</p>
                        <AvaliarResumo />
                    </div>

                    <!-- palavras chaves -->
                    <v-sheet
                        class="mx-auto my-5"
                        elevation="2"
                        max-width="800"
                        rounded="xl"
                        v-if="keywords.length"
                    >
                        <v-sheet
                            class="pa-2 border-b bg-pink-lighten-4"
                            rounded="t-xl"
                        >
                            Palavras Chaves da Página
                        </v-sheet>

                        <div class="pa-1 d-flex justify-center">
                            <v-chip-group
                                column
                            >
                                <v-chip
                                v-for="tag in keywords"
                                :key="tag"
                                >
                                    {{ tag }}
                                </v-chip>
                            </v-chip-group>
                        </div>
                        <AvaliarResumo />
                    </v-sheet>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>

</template>

<script setup>
    import { ref, computed, onUnmounted } from 'vue';
    import * as sw from "stopword";
    import AvaliarResumo from './avaliarResumo.vue';
    
    import { useAggsStore } from '@/store/AggsStores';
    const aggsStore = useAggsStore()
    
    import { useSearchStore } from '@/store/SearchStore';
    const searchStore = useSearchStore()
    
    import { usePageStore } from '@/store/PageStore';
    const pageStore = usePageStore()
    

    const dialog = ref(false)
    const load = ref(false)
    const erros = ref(null)

    const summary = ref(null)
    const keywords = ref([])
    const relevantTermsLaw = ref([])

    const timeLeft = ref(20); // Tempo inicial
    const timerRunning = ref(false); // Controle do estado do cronômetro

    const props = defineProps({
        text: String,
        page: Object
    })

    const termsRelevantLaw = async() => {
        await aggsStore.getAggsTermsLaw(props.page.page_to_norma.parent)
        relevantTermsLaw.value = aggsStore.readAggsTermsLaw
    }

    const removerStopWords = (texto) => {
        const palavras = texto.split(" "); // Quebra o texto em palavras
        const filtrado = sw.removeStopwords(palavras, sw.pt); // Remove stop words em português
        return filtrado.join(" ");
    }

    const contarTokens = (texto) => {
        const palavras = texto.split(/\s+/); // Divide por espaços
        return Math.round(palavras.length * 1.33); // Aproximadamente 1,33 tokens por palavra em português
    }

    const dividirTexto = (texto, limite = 500) => {
        const palavras = texto.split(" ");
        let partes = [];
        let atual = [];

        let contador = 0;
        for (let palavra of palavras) {
            contador += Math.round(palavra.length / 4); // Aproximação: 1 token ≈ 4 caracteres
            if (contador > limite) {
            partes.push(atual.join(" "));
            atual = [];
            contador = 0;
            }
            atual.push(palavra);
        }
        if (atual.length > 0) partes.push(atual.join(" "));

        return partes;
    }


    const startTimer = () => {
      if (timerRunning.value) return; // Evita múltiplas execuções

      timerRunning.value = true;

      let intervalId = setInterval(() => {
        if (timeLeft.value > 0) {
          timeLeft.value--
        } else {
          clearInterval(intervalId)
          timerRunning.value = false
          fetchSuggestions()
        }
      }, 1000);
    };
    
    const fetchSuggestions = async () => {
        await termsRelevantLaw()
        erros.value = null

        if(props.page.summary || props.page.keywords) {
            summary.value = props.page.summary || null
            keywords.value = props.page.keywords || []
            return
        }

        try {
            load.value = true
            const textoSw = removerStopWords(props.text)

            if (contarTokens(textoSw) <= 500) {

                const resp2 = await searchStore.resumoPage(textoSw)
                summary.value = resp2
                
                const sumRep = await searchStore.palavraChave(textoSw)
                keywords.value = [ ...sumRep.split(',') ]
                return
            }

            const partes = dividirTexto(textoSw, 500);
            let resumos = [];

            for (let parte of partes) {
                try {
                    const resp = await searchStore.resumoPage(parte)

                    resumos.push(resp || "");

                    const sumRep = await await searchStore.palavraChave(parte)
                    keywords.value.push( ...sumRep.split(',') ) 
       
                } catch (erro) {
                    console.error("Erro na requisição:", erro);
                    resumos.push("[Erro ao processar parte do texto]");
                }
            }

            summary.value = resumos.join(" ")

        } catch (error) {
            if (error.response) {
                erros.value = error.response.status
                console.log('Código de status:', error.response.status);
                console.log('Dados do erro:', error.response.data);
                timeLeft.value = Math.ceil(error.response.data.estimated_time)
                console.log('Cabeçalhos do erro:', error.response.headers);
                if(erros.value == 503) startTimer()
            } else if (error.request) {
                erros.value = error.request.status
                console.log('Nenhuma resposta recebida:', error.request);
            } else {
                erros.value = error.message
                console.log('Erro na configuração da solicitação:', error.message);
            }
        } finally {
            load.value = false

            if(summary.value || keywords.value.length) {
                pageStore.saveResumoIA( props.page.id, summary.value, keywords.value )
            }
        } 
    }

    onUnmounted(() => {
        keywords.value = []
        summary.value = null
    })
</script>

<style lang="scss" scoped>

</style>