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
                <v-card-text>
                    <div class="pa-2">
                        <h1 class="text-h5"> {{ conteudo.title }}</h1>
                        <v-form class="mt-5">
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-select
                                        label="Orgão"
                                        :items="listOrgaos"
                                        v-model="selected"
                                        variant="outlined"
                                        density="compact"
                                        hide-details    
                                        clearable
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-btn-toggle
                                        v-model="toggle"
                                        divided
                                        density="compact"
                                        color="primary"
                                    >
                                        <v-btn><v-icon>mdi-view-list</v-icon></v-btn>
                                        <v-btn><v-icon>mdi-card-bulleted-outline</v-icon></v-btn>
                                    </v-btn-toggle>
                                </v-col>
                            </v-row>
                        </v-form>
                    </div>
                </v-card-text>
                <v-card-text class="overflow-auto" style="max-height: 800px;">
                    <v-card v-for="item, i in jurisprudencias" :key="i" class="mb-2" v-if="toggle == 0">
                        <v-card-title>{{ item.orgao }}</v-card-title>
                        <v-card-subtitle>{{ item.title }} - {{ item.tese }}</v-card-subtitle>
                        <v-card-text>
                            <p>{{ item.texto }}</p>	
                        </v-card-text>
                    </v-card>
                    <CardJuris
                        v-if="toggle == 1"
                        :jurisprudencias="jurisprudencias"
                        @toggle-favorite="onToggleFavorite"
                        @share="onShare"
                        @copy="onCopy"
                    />
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import CardJuris from './cardJuris.vue';

    const dialog = ref(false)
    
    const props = defineProps({
        conteudo: {
            type: Object,
            default: {
                id: null
            },
        },
    })

    const selected =  ref('')
    const view = ['list', 'grid']
    const toggle = ref(1)

    const listOrgaos = computed(() => {
        const list =  props.conteudo.jurisprundencias.map(item => item.orgao)
        return [...new Set(list)]
    })

    const jurisprudencias = computed(() => {
        let jurisprudencias = props.conteudo.jurisprundencias
        if(selected.value) {
            jurisprudencias = jurisprudencias.filter(item => item.orgao === selected.value)
        }
        return jurisprudencias
    })

    const onToggleFavorite = (data) => {
        console.log('Favorito alterado:', data)
        // Aqui você pode salvar no backend ou localStorage
    }

    const onShare = (data) => {
        console.log('Compartilhar:', data)
        // Implementar funcionalidade de compartilhamento
        if (Navigator.share) {
                Navigator.share({
                title: data.titulo,
                text: data.texto
            })
        }
    }

    const onCopy = (result) => {
        if (result.success) {
            console.log('Texto copiado com sucesso!')
            // Mostrar snackbar de sucesso
        } else {
            console.error('Erro ao copiar:', result.error)
        }
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