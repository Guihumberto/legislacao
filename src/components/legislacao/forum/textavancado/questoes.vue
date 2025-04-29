<template>
    <div>
        <div class="mt-2 d-flex ga-2 align-center pa-2">
            <v-icon>mdi-check-all</v-icon>
                <h1 class="text-h5">Questões</h1>
        </div>
        <v-alert variant="outlined" class="my-2">
            <p v-if="!$route.query.art">Selecione o artigo para gerar questões.</p>
            <div v-else>
                <p class="pa-2 bg-grey">Seleção: art. {{ $route.query.art }}</p>
                <div class="text-center">
                    <p class="my-2 text-overline">Gere questões a partir do artigo selecionado.</p>
                    <v-btn :disabled="load" :loading="load" color="primary" @click="gerarQuestoes">Gerar Questões</v-btn>
                </div>
            </div>
        </v-alert>

        <v-card variant="outlined" color="grey" v-if="questoesStore.readQuestoes.length">
            <v-card-title class="d-flex align-center justify-space-between flex-wrap">
                <div>
                    Artigo 1 - Lei XXXX-20XX
                </div>
                <div>
                    <small> XX certas - XX erradas - XX resolvidas - total XX</small>
                </div>
            </v-card-title>
            <v-card-text class="text-black">
                <div v-for="item, i in questoesStore.readQuestoes" :key="item.id" class="mb-5">
                    <div class="mb-2 pa-2 bg-grey-lighten-2 d-flex ga-1 justify-space-between">
                        <div class="d-flex ga-1 align-center">
                            <!-- <v-chip color="primary" density="compact" :title="item.id">cod</v-chip>   -->
                            <h3>Questão {{ i + 1 }}</h3> 
                        </div>
                        <div class="d-flex ga-1 align-center">
                            <h3>Gerada por IA</h3>
                            <h3>2025</h3>
                        </div>
                    </div>
                    <div class="px-1">
                        <p>{{ item.pergunta }}
                        </p>
                        <Questoes_alternative :aleternativa="item" />
                    </div>
                  
                </div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch } from 'vue';

    import { useQuestoesStore } from '@/store/forum/QuestoesStore';
    const questoesStore = useQuestoesStore()

    import Questoes_alternative from './questoes_alternative.vue';

    import { useRoute } from 'vue-router';
    const route = useRoute()

    const load = ref(false)

    watch(
        () => route.query.art,
        (newId, oldId) => getQuestoes()
        
    )

    const getQuestoes = async () => {
        await questoesStore.getQuestoes({id_law: route.params.id, id_art: route.query.art})
    }

    const gerarQuestoes = async () => {
        load.value = true
        await questoesStore.gerarQuestoes({id_law: route.params.id, id_art: route.query.art})
        load.value = false
    }

    onMounted(async() => {
        await getQuestoes()
    })  

</script>

<style scoped>

</style>