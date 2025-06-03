<template>
    <div>
        <v-btn
            @click="dialog = true"
            variant="text"
            color="primary"
        >Abrir</v-btn>
        <v-dialog v-model="dialog" max-width="800">
            <v-card>
                <v-card-title class="bg-primary d-flex align-center justify-space-between"> 
                    <div class="d-flex align-center ga-2">
                        <v-icon size="1.5rem">{{ conteudo.icon }}</v-icon> 
                        {{ conteudo.disciplina }} 
                    </div>
                    <v-btn density="compact" icon="mdi-close" variant="text" @click="dialog = false"></v-btn>
                </v-card-title>
                <v-card-text class="overflow-auto" style="max-height: 800px;">
                    <!-- <div v-for="item, i in conteudo.questoes" :key="item.id" class="mb-5">
                        <div class="mb-2 pa-2 bg-grey-lighten-2 d-flex ga-1 justify-space-between">
                            <div class="d-flex ga-1 align-center">
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
                    </div> -->
                    <CardQuestoes 
                        :listQuestoes="conteudo.questoes"
                        :questoesGravadas="questoesGravadas"
                        @evaluate="handleEvaluation"
                        @cardChange="handleCardChange"
                        @complete="handleComplete"
                    />
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue';

    import { useOptionsStore } from '@/store/concursos/OptionsStore';
    const optionsStore = useOptionsStore()

    import Questoes_alternative from './questoes_alternative.vue';
    import CardQuestoes from './cardQuestoes.vue';

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
    const handleEvaluation = async (data) => {
         const objeto = {
            ...props.conteudo,
            questoesUserMark: [ ...data ]
        }

        await optionsStore.updateQuestoes(objeto)
        // console.log(`Card ${data.cardIndex + 1}: ${data.result}`)
        // console.log('Pergunta:', data.question)
        // console.log('Timestamp:', data.timestamp)
    }

  

    const handleCardChange = (data) => {
        // console.log('Card atual:', data.currentIndex + 1)
        // console.log('Progresso:', data.progress + '%')
    }

    const handleComplete = (stats) => {
        console.log('Sessão completa!')
        console.log('Estatísticas finais:', stats)
        // alert(`Parabéns! Você completou todas as Questões!
        // Acertos: ${stats.correct}
        // Parciais: ${stats.partial}  
        // Erros: ${stats.wrong}
        // Precisão: ${stats.accuracy}%`)
    }

    const questoesGravadas = computed(() => {
        const select = optionsStore.readQuestoesControle.find(item => item.guia_id === props.conteudo.id)
        return select ? select?.questoesUserMark : []
    })
  
</script>

<style scoped>
.text{
    margin: 1rem 2rem;
    line-height: 1.8;
    background: rgb(245, 243, 243);
    padding: 1rem;
}
</style>