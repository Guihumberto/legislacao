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
                <v-card-subtitle class="text-h5 pa-2 ml-9"> {{ conteudo.title }}</v-card-subtitle>
                <v-card-text class="overflow-auto" style="max-height: 800px;">
                   
                     <MindMapComponent 
                        :data="mindMapFromAI" 
                        :loading="isLoading" 
                    />

                </v-card-text>
                <v-card-actions class="d-flex justify-center">
                    <v-btn 
                        @click="$emit('concluir', conteudo)" 
                        :color="conteudo.concluido ? 'error' : 'success'"
                        :prepend-icon="conteudo.concluido ? 'mdi-close-box-outline' : 'mdi-checkbox-marked-circle-outline'"
                    >{{ conteudo.concluido ? 'Desmarcar como Concluído' : 'Concluir Atividade' }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    import MindMapComponent from './cardMapaMental.vue'

    const dialog = ref(false)
    
    const props = defineProps({
        conteudo: {
            type: Object,
            default: {
                id: null
            },
        },
    })

    const mindMapFromAI = {
        title: "Sua Matéria",
        description: "Descrição da matéria",
        icon: "mdi-book",
        children: [
            {
            title: "Tópico Principal",
            description: "Descrição do tópico",
            color: "blue",
            keywords: ["palavra1", "palavra2"],
            children: [
                    {
                        title: "Subtópico",
                        content: "Conteúdo detalhado...",
                        examples: ["Exemplo 1", "Exemplo 2"],
                        keywords: ["conceito", "lei"]
                    }
                ]
            }
        ]
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