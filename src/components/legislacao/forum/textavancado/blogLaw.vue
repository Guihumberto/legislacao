<template>
     <div class="wrapper">
        <section class="conteudo" ref="topUp" :class="rightWidth > 900 ? 'conteudo1' : 'conteudo2'">
            <div>
                <div class="mt-2 d-flex ga-2 align-center pa-2">
                    <v-icon>mdi-post-outline</v-icon>
                        <h1 class="text-h5">Blog da Lei</h1>
                </div>
                <p v-if="!listArtsSelected.length && !artOneSelect">Selecione o Dispositivo para criar mapas mentais por IA</p>
                <div v-else class="text-center">
                    Artigo<span v-if="listArtsSelected.length > 1">s</span> selecionado<span v-if="listArtsSelected.length > 1">s</span>: 
                    <v-chip v-if="artOneSelect" color="primary">{{ artOneSelect }} </v-chip> 
                    <v-chip v-if="listArtsSelected.length" v-for="item, i in listArtsSelected" :key="i" class="ml-2">{{ item }}</v-chip>
                   <v-form @submit.prevent="submitForm" ref="form">
                        <v-textarea
                            label="Gerar"
                            v-model="mapFormString"
                            :rules="[(v) => !!v || 'Campo obrigatório']"
                            variant="outlined"
                            class="mt-2"
                        >
                        </v-textarea>
                        <div class="mt-5 d-flex ga-2 justify-center">
                            <v-btn :loading="load" :disabled="load" type="submit" variant="flat" color="primary" prepend-icon="mdi-robot">Gerar Post por IA</v-btn>
                        </div>
                   </v-form>
                </div>
                <div class="mt-5">
                    <MindMapInterativo :dados="mapaMental" />
                </div>
                <div class="mt-5">
                    <Posts :posts="posts" />
                </div>

            </div>
        </section>
    </div>
</template>

<script setup>
    import { inject, onMounted, ref, watch, computed } from 'vue';

    import { useBlogLawStore } from '@/store/forum/blogLawStore'
    const blogLawStore = useBlogLawStore()

    import { useForumStore } from '@/store/ForumStore';
    const forumStore = useForumStore()

    import { useRoute, useRouter } from "vue-router";
    const route = useRoute()
    const router = useRouter()
 
    import Posts from '../blogLaw/post.vue';
    import MindMapInterativo from './mindMaps/mindMapInterativo.vue';
    const rightWidth = inject('rightWidth')
    
    const posts = computed(() => blogLawStore.sortedPosts)
    const getPostLaw = async() => {
        blogLawStore.fetchPosts()
    }

    const mapaMental = {
  "mapa_mental": {
    "config": {
      "tema": "moderno_juridico",
      "layout": "radial",
      "animacoes": true,
      "interativo": true
    },
    "no_central": {
      "id": "root",
      "titulo": "Regimes de Apuração IBS/CBS",
      "subtitulo": "Arts. 41-42, LC 214/2025",
      "cor": "#2563eb",
      "icone": "gavel",
      "nivel": 0
    },
    "nos": [
      {
        "id": "regime_regular",
        "pai": "root",
        "titulo": "Regime Regular",
        "descricao": "Regime padrão com todas as regras de incidência e apuração da LC",
        "cor": "#10b981",
        "icone": "document-text",
        "nivel": 1,
        "posicao": { "angulo": 0, "distancia": 200 },
        "filhos": ["aplicacao_geral", "opcao_simples", "vedacao_saida"]
      },
      {
        "id": "simples_nacional",
        "pai": "root",
        "titulo": "Simples Nacional/MEI",
        "descricao": "Regimes diferenciados da LC 123/2006",
        "cor": "#f59e0b",
        "icone": "user-group",
        "nivel": 1,
        "posicao": { "angulo": 90, "distancia": 200 },
        "filhos": ["regras_proprias", "opcao_regular"]
      },
      {
        "id": "apuracao_consolidada",
        "pai": "root",
        "titulo": "Apuração Consolidada",
        "descricao": "Consolidação de operações de todos os estabelecimentos",
        "cor": "#8b5cf6",
        "icone": "building-office",
        "nivel": 1,
        "posicao": { "angulo": 180, "distancia": 200 },
        "filhos": ["centralizacao", "consolidacao_debitos"]
      },
      {
        "id": "aplicacao_geral",
        "pai": "regime_regular",
        "titulo": "Aplicação Geral",
        "descricao": "Contribuintes que não optaram pelo Simples Nacional ou MEI",
        "cor": "#14b8a6",
        "icone": "arrow-right",
        "nivel": 2,
        "posicao": { "angulo": 15, "distancia": 150 },
        "tooltip": "Sujeição automática ao regime regular (§1º)"
      },
      {
        "id": "opcao_simples",
        "pai": "regime_regular",
        "titulo": "Opção de Optantes Simples",
        "descricao": "Simples Nacional pode optar pelo regime regular para IBS/CBS",
        "cor": "#14b8a6",
        "icone": "switch-horizontal",
        "nivel": 2,
        "posicao": { "angulo": -15, "distancia": 150 },
        "destaque": true,
        "tooltip": "Opção exercida nos termos da LC 123/2006 (§§3º-4º)"
      },
      {
        "id": "vedacao_saida",
        "pai": "regime_regular",
        "titulo": "Vedação de Saída",
        "descricao": "Proibição de sair do regime regular após ressarcimento",
        "cor": "#ef4444",
        "icone": "x-circle",
        "nivel": 2,
        "posicao": { "angulo": -30, "distancia": 150 },
        "destaque": true,
        "tooltip": "Vedação após ressarcimento no ano corrente ou anterior (§5º)"
      },
      {
        "id": "regras_proprias",
        "pai": "simples_nacional",
        "titulo": "Regras Próprias",
        "descricao": "Optantes ficam sujeitos às regras do Simples/MEI",
        "cor": "#f97316",
        "icone": "document",
        "nivel": 2,
        "posicao": { "angulo": 105, "distancia": 150 },
        "tooltip": "Conforme LC 123/2006 (§2º)"
      },
      {
        "id": "opcao_regular",
        "pai": "simples_nacional",
        "titulo": "Opção pelo Regular",
        "descricao": "Possibilidade de apurar IBS/CBS pelo regime regular",
        "cor": "#f97316",
        "icone": "arrow-path",
        "nivel": 2,
        "posicao": { "angulo": 75, "distancia": 150 },
        "destaque": true,
        "tooltip": "Mantém Simples para outros tributos, regular só IBS/CBS"
      },
      {
        "id": "centralizacao",
        "pai": "apuracao_consolidada",
        "titulo": "Centralização",
        "descricao": "Pagamento e ressarcimento em estabelecimento único",
        "cor": "#7c3aed",
        "icone": "building-office-2",
        "nivel": 2,
        "posicao": { "angulo": 195, "distancia": 150 },
        "tooltip": "Um estabelecimento centraliza pagamentos e ressarcimentos (§1º Art.42)"
      },
      {
        "id": "consolidacao_debitos",
        "pai": "apuracao_consolidada",
        "titulo": "Consolidação Débitos/Créditos",
        "descricao": "Todos os débitos e créditos do contribuinte no regime regular",
        "cor": "#7c3aed",
        "icone": "calculator",
        "nivel": 2,
        "posicao": { "angulo": 165, "distancia": 150 },
        "tooltip": "Inclui regimes diferenciados e específicos, salvo exceções (§2º Art.42)"
      }
    ],
    "conexoes": [
      {
        "origem": "root",
        "destino": "regime_regular",
        "tipo": "principal",
        "cor": "#6b7280",
        "espessura": 3
      },
      {
        "origem": "root",
        "destino": "simples_nacional",
        "tipo": "principal",
        "cor": "#6b7280",
        "espessura": 3
      },
      {
        "origem": "root",
        "destino": "apuracao_consolidada",
        "tipo": "principal",
        "cor": "#6b7280",
        "espessura": 3
      },
      {
        "origem": "regime_regular",
        "destino": "aplicacao_geral",
        "tipo": "secundaria",
        "cor": "#9ca3af",
        "espessura": 2,
        "tracejada": false
      },
      {
        "origem": "regime_regular",
        "destino": "opcao_simples",
        "tipo": "secundaria",
        "cor": "#9ca3af",
        "espessura": 2,
        "tracejada": false
      },
      {
        "origem": "regime_regular",
        "destino": "vedacao_saida",
        "tipo": "secundaria",
        "cor": "#ef4444",
        "espessura": 2,
        "tracejada": true
      },
      {
        "origem": "simples_nacional",
        "destino": "regras_proprias",
        "tipo": "secundaria",
        "cor": "#9ca3af",
        "espessura": 2,
        "tracejada": false
      },
      {
        "origem": "simples_nacional",
        "destino": "opcao_regular",
        "tipo": "secundaria",
        "cor": "#9ca3af",
        "espessura": 2,
        "tracejada": false
      },
      {
        "origem": "apuracao_consolidada",
        "destino": "centralizacao",
        "tipo": "secundaria",
        "cor": "#9ca3af",
        "espessura": 2,
        "tracejada": false
      },
      {
        "origem": "apuracao_consolidada",
        "destino": "consolidacao_debitos",
        "tipo": "secundaria",
        "cor": "#9ca3af",
        "espessura": 2,
        "tracejada": false
      },
      {
        "origem": "opcao_regular",
        "destino": "vedacao_saida",
        "tipo": "especial",
        "cor": "#ef4444",
        "espessura": 1,
        "tracejada": true
      }
    ],
    "anotacoes": [
      {
        "id": "nota_vedacao",
        "no_vinculado": "vedacao_saida",
        "texto": "⚠️ PEGADINHA: Vedação se aplica também a outras opções facultativas",
        "tipo": "alerta",
        "cor": "#ef4444"
      },
      {
        "id": "nota_opcao_dupla",
        "no_vinculado": "opcao_regular",
        "texto": "💡 Optante Simples pode escolher regime regular só para IBS/CBS",
        "tipo": "dica",
        "cor": "#3b82f6"
      },
      {
        "id": "nota_consolidacao",
        "no_vinculado": "consolidacao_debitos",
        "texto": "📋 Consolida TODOS os estabelecimentos do contribuinte",
        "tipo": "informacao",
        "cor": "#8b5cf6"
      },
      {
        "id": "nota_ressarcimento",
        "no_vinculado": "vedacao_saida",
        "texto": "🚫 Referência ao Art. 39 - ressarcimento de créditos",
        "tipo": "referencia",
        "cor": "#6b7280"
      }
    ],
    "metadados": {
      "total_nos": 10,
      "profundidade_maxima": 2,
      "conceitos_principais": [
        "Regime Regular",
        "Simples Nacional/MEI",
        "Apuração Consolidada",
        "Vedação de Saída",
        "Opção Facultativa"
      ],
      "artigos_referenciados": [
        "Art. 41 LC 214/2025",
        "Art. 42 LC 214/2025", 
        "Art. 39 LC 214/2025",
        "LC 123/2006"
      ]
    }
  }
}

    const artOneSelect = ref(route.query.art)

    const listArtsSelected = computed(() => {
        const queryArts = route.query.arts
        if (queryArts) {
            // Se arts for um array (múltiplos valores)
            if (Array.isArray(queryArts)) {
               return queryArts.map(art => parseInt(art))
            } 
            // Se arts for uma string (um único valor)
            else {
                return [parseInt(queryArts)]
            } 
        } else {
           return []
        }
    })

    watch(
        () => route.query.arts,
        () => {
            // getMindMapArt()
            artOneSelect.value = null
        }
    )

    watch(
        () => route.query.art,
        () => {
            artOneSelect.value = route.query.art
            // getMindMapArt()
        }
    )
    
    const mapFormString = ref('')
    const form = ref(null)
    const load = ref(false)

    const submitForm = async () => {
        const { valid } = await form.value.validate()
        if (!valid) return
        
        load.value = true

        let objeto = { id: null, art: null, arts: []}

        try {
            objeto = JSON.parse(mapFormString.value)
        } catch (err) {
            console.error('Erro ao fazer parse de mapFormString.value:', err)
            alert('Erro: o conteúdo do campo deve estar em formato JSON válido.')
            return
        }

        objeto.id_law = forumStore.readGroupForum._source.idLaw
        objeto.art = artOneSelect.value || listArtsSelected.value[0]
        objeto.arts = listArtsSelected.value
        objeto.name_law = forumStore.readGroupForum._source.title

        await blogLawStore.createPost(objeto)
        getPostLaw()
        const { art, arts, ...outrosParams } = route.query
        router.push({
            path: route.path, 
            query: {
                ...outrosParams,      
                art: objeto.art,   
                arts: [...objeto.arts]          
            }
        })
        load.value = false
        mapFormString.value = ''
    } 

    const submitForm2 = async () => {
        load.value = true
        // const { valid } = await form.value.validate()
        // if (!valid) return

        let objeto = { id: null, art: null, arts: []}   
        try {
            objeto = JSON.parse(mapFormString.value)
        } catch (err) {
            console.error('Erro ao fazer parse de mapFormString.value:', err)
            alert('Erro: o conteúdo do campo deve estar em formato JSON válido.')
            return
        }

        objeto.id = forumStore.readGroupForum._source.idLaw
        objeto.art = artOneSelect.value || listArtsSelected.value[0]
        objeto.arts = listArtsSelected.value

        await mapaMentalStore.createMindMap(objeto)
        // getMindMapArt()
        const { art, arts, ...outrosParams } = route.query
        router.push({
            path: route.path, 
            query: {
                ...outrosParams,      
                art: objeto.art,   
                arts: [...objeto.arts]          
            }
        })
        load.value = false
    }  

    onMounted(async() => {
        await getPostLaw(forumStore.readGroupForum._source.idLaw)
    })

</script>

<style scoped>
    .wrapper {
        display: flex;
        justify-content: center; /* Isso centraliza o 'conteudo' se ele não ocupar 100% da largura do 'wrapper' */
        min-height: 50vh;
        font-family: Arial, sans-serif;
        padding-bottom: 2rem;
        /* Se você quer que o conteúdo ocupe toda a altura do wrapper, adicione: */
        align-items: stretch;
    }

    .conteudo {
        margin-top: 1rem;
        padding: 0 20px;
        background-color: #fffdfd;
        flex-grow: 1; /* Permite que o 'conteudo' se expanda */
        /* 'box-sizing: border-box;' é bom para evitar problemas com padding e largura */
        box-sizing: border-box;
    }

    /* Se a ideia é que 'conteudo1' e 'conteudo2' limitem a largura máxima, mantenha assim: */
    .conteudo1 {
        max-width: 900px; /* Altere de 'width' para 'max-width' para que ele cresça até 900px */
    }

    .conteudo2 {
        max-width: 900px;
    }
</style>