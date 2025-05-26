<template>
    <div>
        <v-btn
            @click="dialog = true"
            variant="text"
            color="primary"
        >Abrir</v-btn>
        <v-dialog v-model="dialog" max-width="1000">
            <v-card>
                <v-card-title class="bg-primary d-flex align-center justify-space-between"> 
                    <div class="d-flex align-center ga-2">
                        <v-icon size="1.5rem">{{ conteudo.icon }}</v-icon> 
                        {{ conteudo.disciplina }} 
                    </div>
                    <v-btn density="compact" icon="mdi-close" variant="text" @click="dialog = false"></v-btn>
                </v-card-title>
                <v-card-text>
                    <div class="bg-blue-grey-lighten-5" >
                        <CardFlashcard 
                            :flashcards="conteudo.flahscards"
                            @evaluate="handleEvaluation"
                            @cardChange="handleCardChange"
                            @complete="handleComplete"
                        />
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import CardFlashcard from './cardFlashcard.vue';

    const dialog = ref(false)
    
    const props = defineProps({
        conteudo: {
            type: Object,
            default: {
                id: null
            },
        },
    })

    // Handlers dos eventos
    const handleEvaluation = (data) => {
        console.log(`Card ${data.cardIndex + 1}: ${data.result}`)
        console.log('Pergunta:', data.question)
        console.log('Timestamp:', data.timestamp)
    }

    const handleCardChange = (data) => {
        console.log('Card atual:', data.currentIndex + 1)
        console.log('Progresso:', data.progress + '%')
    }

    const handleComplete = (stats) => {
        console.log('Sessão completa!')
        console.log('Estatísticas finais:', stats)
        alert(`Parabéns! Você completou todos os flashcards!
        Acertos: ${stats.correct}
        Parciais: ${stats.partial}  
        Erros: ${stats.wrong}
        Precisão: ${stats.accuracy}%`)
    }

</script>

<style scoped>
    .text{
        margin: 1rem 2rem;
        line-height: 1.8;
        background: rgb(245, 243, 243);
        padding: 1rem;
    }
</style>