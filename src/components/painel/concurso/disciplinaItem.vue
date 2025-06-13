<template>
    <v-expansion-panel-title @click="$emit('envSelecDisci', disciplinaItem)">
        <div class="w-100 d-flex justify-space-between align-center">
            <b>{{ disciplinaItem.disciplina }}</b>
            <div>

                <v-tooltip text="Filtrar pelas Relevantes" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn 
                            density="compact"
                            v-if="disciplinaItem?.top_relevante"
                            v-bind="props" variant="text" :color="filter.relevante ? 'primary' : 'grey'" icon="mdi-filter" @click.stop="filter.relevante = !filter.relevante"></v-btn>
                    </template>
                </v-tooltip>     
                <v-tooltip text="Analisar disciplina por pontos mais cobrados" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn 
                            density="compact"
                            v-bind="props" variant="text" color="primary" icon="mdi-chart-line" @click.stop="$emit('envSelectItem', 'disciplina', disciplinaItem)"></v-btn>
                    </template>
                </v-tooltip>
            </div>
        </div>
    </v-expansion-panel-title>
    <v-expansion-panel-text>     
        <v-list density="compact">
            <template v-for="(topico, topicoIndex) in disciplinaItem.topicos" :key="topicoIndex">
                <!-- Tópicos 1 - -->
                <v-list-item
                    @mouseover="hoverTopico = topicoIndex"
                    @mouseleave="hoverTopico = null"
                    @click="$emit('envSelectItem', 'topico', disciplinaItem, topico)"
                    link
                    :class="topico.normas && topico.normas.length ? 'bg-light-blue-lighten-5' : ''"
                >
                    <v-list-item-title>
                        <p :class="topico?.checked ? 'riscado' : ''">{{ topico.numero + ' ' + topico.conteudo }}</p>
                    </v-list-item-title>
                    <template v-slot:append  v-if="hoverTopico === topicoIndex"> 
                        <v-btn :color="topico?.checked ? 'error':'success'" variant="text" density="compact">
                            <v-icon @click.stop="concluirTarefa(topico)">{{ topico?.checked ? 'mdi-close':'mdi-check-all'}}</v-icon>
                        </v-btn>
                    </template>
                </v-list-item>
                
                <v-list-item link
                    @mouseover="hoverSubTopico = subtopicoIndex+subtopico.numero"
                    @mouseleave="hoverSubTopico = null"
                    @click="$emit('envSelectItem','subtopico', disciplinaItem, topico, subtopico)"
                    v-for="(subtopico, subtopicoIndex) in topico.subtopicos"
                    :key="subtopicoIndex"
                    :class="[
                        'pl-10',
                        subtopico.normas && subtopico.normas.length ? 'bg-light-blue-lighten-5' : '',
                    ]"
                >
                    <v-list-item-title>
                        <p :class="subtopico?.checked ? 'riscado' : ''">{{ subtopico.numero + ' ' + subtopico.conteudo }}</p>
                    </v-list-item-title>
                    <template v-slot:append  v-if="hoverSubTopico == subtopicoIndex+subtopico.numero">
                        <div>
                            <v-btn 
                                @click.stop="concluirTarefa(subtopico, topico)" 
                                :color="subtopico?.checked ? 'error':'success'" variant="text" density="compact"><v-icon>{{ subtopico?.checked ? 'mdi-close':'mdi-check'}}</v-icon></v-btn>
                        </div>
                    </template>
                    
                    <template v-for="(subSubtopico, subSubtopicoIndex) in subtopico.subtopicos" :key="'sub-'+ subSubtopicoIndex">
                            <v-list-item link
                                @mouseover="hoverSubSubTopico = subSubtopicoIndex+subSubtopico.numero"
                                @mouseleave="hoverSubSubTopico = null"
                                @click="$emit('envSelectItem', 'subsubtopico', disciplinaItem, topico, subtopico, subSubtopico)"
                                :class="[
                                    'pl-16',
                                    subSubtopico.normas && subSubtopico.normas.length ? 'bg-light-blue-lighten-5' : ''
                                ]"
                            >
                                <v-list-item-title>
                                    <p :class="subSubtopico?.checked ? 'riscado' : ''">{{ subSubtopico.numero + ' ' + subSubtopico.conteudo }}</p>
                                </v-list-item-title>
                                <template v-slot:append v-if="hoverSubSubTopico === subSubtopicoIndex+subSubtopico.numero">
                                    <v-btn 
                                        @click.stop="concluirTarefa(subSubtopico, topico, subtopico)" 
                                        :color="subSubtopico?.checked ? 'error':'success'" variant="text" density="compact">
                                        <v-icon>{{ subSubtopico?.checked ? 'mdi-close':'mdi-check'}}</v-icon>
                                    </v-btn>
                                </template>
                            </v-list-item>
                    </template>
                </v-list-item>
                
            </template>
        </v-list>
    </v-expansion-panel-text>
</template>

<script setup>
    import { ref } from 'vue'
    import { useConteudoEditalStore } from '@/store/concursos/ConteudoEditalStore'
    import { useSnackStore } from "@/store/snackStore";
    const conteudoStore = useConteudoEditalStore()
    const snackStore = useSnackStore()

    const hoverTopico = ref(null)
    const hoverSubTopico = ref(null)
    const hoverSubSubTopico = ref(null)
    const load = ref(false)

    defineEmits(['envSelectItem', 'envSelecDisci']);

    const props = defineProps({
        disciplinaItem: {
            type: Object,
            required: true
        },
        disciplinaIndex: {
            type: Number,
            required: true
        },
        filter: {
            type: Object,
            required: true
        }
    })

    const concluirTarefa = async (item, grupo = null, subGrupo = null) => {
        if(load.value){
            snackStore.activeSnack('Aguarde enquanto salva o item', 'error',)
            return
        } 

        if(props.filter.relevante) {
            snackStore.activeSnack('Tire o filtro para Atualizar', 'error',)
            return
        } 

        const newCheckedValue = !item?.checked
        toggleChecked(item, newCheckedValue, grupo, subGrupo)
        await salvarNoElasticsearch(props.disciplinaItem)
    }

    const toggleChecked = (item, newCheckedValue, grupo = null, subgrupo) => {
        item.checked = newCheckedValue

        if(!newCheckedValue && grupo) {
            grupo.checked = false
            if(subgrupo) subgrupo.checked = false
        } 

        if(newCheckedValue && grupo){
            const finishTopicos = grupo.subtopicos.filter(t => !t.checked).length === 0 
            if(finishTopicos) grupo.checked = true
            if(subgrupo){
                const finishSub = subgrupo.subtopicos.filter(t => !t.checked).length === 0
                if(finishSub) subgrupo.checked = true
                const finishTopicos2 = grupo.subtopicos.filter(t => !t.checked).length === 0 
                if(finishTopicos2) grupo.checked = true
            }
        }

        // Marca/desmarca apenas os subtopicos diretos (1 nível abaixo)
        if (item?.subtopicos && item?.subtopicos?.length) {
            
            item.subtopicos.forEach(sub => {
                sub.checked = newCheckedValue
                // Se tiver subSubtopicos, também marca apenas um nível abaixo
                if (sub.subtopicos && sub.subtopicos.length) {
                    sub.subtopicos.forEach(subsub => {
                        subsub.checked = newCheckedValue
                    })
                }
            })
        }

        // Caso esteja num nível intermediário (ex: subtopico), verificar subSubtopicos
        if (item?.subtopicos?.subtopicos && item?.subtopicos?.subtopicos.length) {
            item.subtopicos.subtopicos.forEach(subsub => {
                subsub.checked = newCheckedValue
            })
        }
    }

    const salvarNoElasticsearch = async (item) => {
       load.value = true
       await conteudoStore.editDisciplinaItem(item)
       load.value = false
    }
    
</script>

<style scoped>
    .riscado {
        text-decoration: line-through;
    }
</style>