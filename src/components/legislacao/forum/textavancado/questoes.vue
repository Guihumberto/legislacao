<template>
    <div>
        <div class="mt-2 d-flex ga-2 align-center pa-2">
            <v-icon>mdi-check-all</v-icon>
                <h1 class="text-h5">Questões</h1>
        </div>
        <v-alert variant="outlined" class="my-2">
            <p v-if="!$route.query.art">Selecione o artigo para gerar questões.</p>
            <div v-else>
                <p class="selectArt" ref="elemento">Art. {{ $route.query.art }} foi selecionado</p>
                <div class="text-center">
                    <p class="my-2 text-overline">Gere questões a partir do artigo selecionado.</p>
                    <v-btn :disabled="load" :loading="load" color="primary" @click="gerarQuestoes">Gerar Questões</v-btn>
                </div>
            </div>
        </v-alert>

        <v-card class="my-2" variant="flat" v-if="listArtsFilter.length" >
            <v-card-text>
                <v-chip-group
                    multiple
                    v-model="artsFilter"
                    color="primary"
                    column
                >
                    <v-chip v-for="art, a in listArtsFilter" :key="art" :value="art">{{art}}</v-chip>
                </v-chip-group>
            </v-card-text>
        </v-card>

        <Loading class="mt-10" v-if="loadQuestoes" />

        <v-card variant="outlined" v-if="questoesStore.readQuestoesMoreResp.length && !loadQuestoes" class="appear">
            <v-card-title class="d-flex align-start justify-space-between flex-column">
                <div>
                    Artigo {{ $route.query.art }} -{{ forumStore.readGroupForum._source.title }}
                </div>
                <div>
                    <small> 
                        XX certas - XX erradas - 
                        <span class="text-success">{{ questoesStore.readQuestoesResp.length }} resolvida(s) </span>
                       do total de {{ questoesStore.readTotalQuestoes }}</small>
                </div>
                <div class="border rounded-lg px-2">
                    <v-checkbox hide-details label="Apenas não respondidas" v-model="formQuestions.noResponse"></v-checkbox>
                </div>
            </v-card-title>
            <v-card-text class="text-black">
                <div v-for="item, i in listQuestoes" :key="item.id" class="mb-5">
                    <div class="mb-2 pa-2 bg-grey-lighten-2 d-flex ga-1 justify-space-between">
                        <div class="d-flex ga-1 align-center">
                            <!-- <v-chip color="primary" density="compact" :title="item.id">cod</v-chip>   -->
                            <h3>Questão {{ i + 1 }}</h3> 
                        </div>
                        <div class="d-flex ga-1 align-center">
                            <h3 v-if="item?.banca ">{{ item.banca }}</h3>
                            <h3 v-else>Gerada por IA</h3>
                            <h3 v-if="item?.ano ">{{ item.ano }}</h3>
                            <h3 v-else>2025</h3>
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
    import { ref, onMounted, watch, inject, computed } from 'vue';

    import { useForumStore } from '@/store/ForumStore';
    const forumStore = useForumStore()

    import { useQuestoesStore } from '@/store/forum/QuestoesStore';
    const questoesStore = useQuestoesStore()

    import Questoes_alternative from './questoes_alternative.vue';
    import Loading from '../loading.vue';

    import { useRoute } from 'vue-router';
    const route = useRoute()

    const load = ref(false)
    const elemento = ref(null)

    const listArtsFilter = inject('listArtsFilter')
    const artsFilter = ref([])

    const formQuestions = ref({
        noResponse: false
    })

    const listQuestoes = computed(() => {
        let list = questoesStore.readQuestoesMoreResp
        if(formQuestions.value.noResponse) {
            list = list.filter(item => !item.timestamp)
        }
        return list
    })

    watch(() => route.query.art, (newId, oldId) => {
            getQuestoes()
            if(elemento.value) elemento.value.classList.add('selectArtAnimar')
            setTimeout(() => {
                elemento.value.classList.remove('selectArtAnimar')
            }, 1000)
        } 
    )

    watch(listArtsFilter, (newId, oldId) => {
        getQuestoes()
    });

    watch(() => artsFilter.value, (newId, oldId) => {
            getQuestoes()
        }
    )

    const loadQuestoes = ref(false)

    const getQuestoes = async () => {
        loadQuestoes.value = true
        if(listArtsFilter.value.length) {
            await getQuestoesFilter()
        } else {
            await questoesStore.getQuestoes({id_law: route.params.id, id_art: route.query.art})
        }
        loadQuestoes.value = false
    }

    const getQuestoesFilter = async () => {
        if(!artsFilter.value.length && listArtsFilter.value.length) await questoesStore.getQuestoes({id_law: route.params.id, id_art: listArtsFilter.value})
        if(artsFilter.value.length) await questoesStore.getQuestoes({id_law: route.params.id, id_art: artsFilter.value})
    }

    const gerarQuestoes = async () => {
        loadQuestoes.value = true
        await questoesStore.gerarQuestoes({id_law: route.params.id, id_art: route.query.art})
        loadQuestoes.value = false
    }

    onMounted(async() => {
        await getQuestoes()
    })  

</script>

<style scoped>
.selectArt {
    font-size: 1.2em;
    font-weight: 500;
    background: rgb(197, 245, 197);
    padding: 1rem;
    text-align: center;
    border-radius: 12px;
}
.selectArtAnimar {
    animation: aumentar 0.5s ease-in-out;
}

@keyframes aumentar {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

.appear{
    animation: aparecer 1s ease-in-out;
}

</style>