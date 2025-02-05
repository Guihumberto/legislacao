<template>
    <div>
        <v-btn @click="dialog = true" variant="text" icon="mdi-robot-outline" color="info" title="Resumo IA"></v-btn>
        <v-dialog v-model="dialog">
            <v-card max-width="800" class="mx-auto" min-height="200">
                <v-card-title class="bg-red d-flex align-center justify-space-between">
                    <div class="d-flex">
                        <v-icon class="mr-2">mdi-robot</v-icon> <h1 class="text-h5">Resumo IA</h1>
                    </div>
                    <v-btn icon="mdi-close" variant="text" @click="dialog=false"></v-btn>
                </v-card-title>
                <v-card-text class="text-center">
                    <div v-if="!summary">
                        <v-alert text="Crie um resumo a partir da página selecionada com uma lista de palavras-chaves." type="info" variant="text"></v-alert>
                        <v-btn @click="fetchSuggestions" color="info" prepend-icon="mdi-robot" :loading="load" :disabled="load">Criar resumo IA</v-btn>
                    </div>

                    <v-alert type="error" variant="outlined" v-if="erros" class="my-5">
                        <div v-if="erros == 503">
                            <p >Aguarde enquanto o modelo é está sendo carregado...</p>
                            <p v-if="timeLeft > 0">Tempo restante: {{ timeLeft }} segundos</p>
                            <p @click="fetchSuggestions" v-else>Pronto!!</p>
                        </div>
                        <p v-else>{{ erros }}</p>
                    </v-alert>

                    <div class="border pa-5 bg-pink-lighten-5" v-if="summary">
                        <p>{{ summary }}</p>
                    </div>
                    <v-sheet
                        class="mx-auto mt-5"
                        elevation="2"
                        max-width="500"
                        rounded="xl"
                        v-if="readKeywords.length"
                    >
                        <v-sheet
                        class="pa-2 border-b bg-pink-lighten-4"
                        rounded="t-xl"
                        >
                            Palavras Chaves
                        </v-sheet>

                        <div class="pa-1 d-flex justify-center">
                            <v-chip-group
                                column
                            >
                                <v-chip
                                v-for="tag in readKeywords"
                                :key="tag"
                                >
                                    {{ tag.word }}
                                </v-chip>
                            </v-chip-group>
                        </div>
                    </v-sheet>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>

</template>

<script setup>
    import { ref, computed, onUnmounted } from 'vue';
    import api from '@/services/api_hf'

    const dialog = ref(false)
    const load = ref(false)
    const erros = ref(null)

    const summary = ref(null)
    const keywords = ref([])

    const timeLeft = ref(20); // Tempo inicial
    const timerRunning = ref(false); // Controle do estado do cronômetro

    const startTimer = () => {
      if (timerRunning.value) return; // Evita múltiplas execuções
      timerRunning.value = true;
      timeLeft.value = 20; // Reinicia o tempo
      let intervalId = setInterval(() => {
        if (timeLeft.value > 0) {
          timeLeft.value -= 1; // Decrementa o tempo
        } else {
          clearInterval(intervalId); // Para o cronômetro
          timerRunning.value = false;
        }
      }, 1000); // Atualiza a cada 1 segundo
    };
    
    const props = defineProps({
        text: String
    })

    const fetchSuggestions = async () => {
        erros.value = null
        try {
            load.value = true
            const resp = await api.post('facebook/bart-large-cnn', {
                inputs: props.text
            })
             summary.value = resp.data[0].summary_text

             const sumRep = await api.post('dslim/bert-base-NER', {
                inputs: props.text
             })
             console.log(sumRep);
             keywords.value = sumRep.data

        } catch (error) {
            if (error.response) {
                erros.value = error.response.status
                if(erros.valeu == 503) startTimer()
                console.log('Código de status:', error.response.status);
                console.log('Dados do erro:', error.response.data);
                console.log('Cabeçalhos do erro:', error.response.headers);
            } else if (error.request) {
                erros.value = error.request
                console.log('Nenhuma resposta recebida:', error.request);
            } else {
                erros.value = error.message
                console.log('Erro na configuração da solicitação:', error.message);
            }
        } finally {
            load.value = false
        } 
    }

    const readKeywords = computed(() => {
        try {
            const list = keywords.value.filter(x => x.score > 0.9)
            const uniqueWordsArray = Array.from(
                new Set(
                    list
                    .filter(obj => obj.word.length > 2) 
                    .map(obj => obj.word)
                )
            ).map(word => ({ word }))

            return uniqueWordsArray

        } catch (error) {
            return []
        }
    })

</script>

<style lang="scss" scoped>

</style>