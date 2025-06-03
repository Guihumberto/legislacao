<template>
    <div>
        <v-btn
            @click="dialog = true"
            variant="text"
            color="primary"
        >Abrir</v-btn>
        <v-dialog v-model="dialog" max-width="1000">
            <v-card color="blue-grey-lighten-5">
                <v-card-title class="bg-primary d-flex align-center justify-space-between"> 
                    <div class="d-flex align-center ga-2">
                        <v-icon size="1.5rem">{{ conteudo.icon }}</v-icon> 
                        {{ conteudo.disciplina }} 
                    </div>
                    <v-btn density="compact" icon="mdi-close" variant="text" @click="dialog = false"></v-btn>
                </v-card-title>
                <v-card-subtitle class="text-h5 pa-2 ml-9"> {{ conteudo.title }}</v-card-subtitle>
                <v-card-text>
                    Filtros - Formas de vizualização - ir para normas - ver os artigos
                </v-card-text>
                <v-card-text class="overflow-auto" style="max-height: 800px;">
                    <v-card v-for="item, i in conteudo.artigos" :key="i" class="mb-2">
                        <v-card-title>{{ item.title }}</v-card-title>
                        <v-card-subtitle>{{ item.normas }} </v-card-subtitle>
                        <v-card-text>
                            Artigos Importantes
                            <v-chip-group>
                                <v-chip v-for="art, a in item.artigos">{{ art }}</v-chip>
                            </v-chip-group>
                        </v-card-text>
                    </v-card>
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

    const dialog = ref(false)
    
    const props = defineProps({
        conteudo: {
            type: Object,
            default: {
                id: null
            },
        },
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