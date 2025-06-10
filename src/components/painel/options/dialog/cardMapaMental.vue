<template>
  <v-container fluid class="mind-map-container">
    <v-card class="elevation-4">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon color="primary" class="mr-2">mdi-brain</v-icon>
          <span class="text-h5">{{ mindMapData.title }}</span>
        </div>
        <div>
          <v-btn
            icon
            @click="expandAll"
            variant="text"
            :disabled="loading"
            title="Expandir todos"
          >
            <v-icon>mdi-arrow-expand-all</v-icon>
          </v-btn>
          <v-btn
            icon
            @click="collapseAll"
            variant="text"
            :disabled="loading"
            title="Recolher todos"
          >
            <v-icon>mdi-arrow-collapse-all</v-icon>
          </v-btn>
          <v-btn
            icon
            @click="resetView"
            variant="text"
            :disabled="loading"
            title="Resetar visualização"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text>
        <div v-if="loading" class="text-center py-8">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
          <div class="mt-4 text-subtitle-1">Carregando mapa mental...</div>
        </div>

        <div v-else class="mind-map-wrapper">
          <div class="mind-map-canvas" ref="canvasRef">
            <!-- Nó Central -->
            <div
              class="mind-node central-node"
              :style="getCentralNodeStyle()"
              @click="toggleNode('root')"
            >
              <div class="node-content">
                <v-icon class="node-icon" size="large">{{ mindMapData.icon || 'mdi-lightbulb' }}</v-icon>
                <div class="node-title">{{ mindMapData.title }}</div>
                <div v-if="mindMapData.description" class="node-description">
                  {{ mindMapData.description }}
                </div>
              </div>
              <v-btn
                v-if="mindMapData.children && mindMapData.children.length > 0"
                icon
                size="small"
                class="expand-btn"
                :class="{ 'rotated': expandedNodes.has('root') }"
              >
                <v-icon size="small">mdi-chevron-right</v-icon>
              </v-btn>
            </div>

            <!-- Nós Filhos -->
            <template v-if="expandedNodes.has('root')">
              <div
                v-for="(child, index) in mindMapData.children"
                :key="`child-${index}`"
                class="mind-node child-node"
                :style="getChildNodeStyle(index, mindMapData.children.length)"
                @click="toggleNode(`child-${index}`)"
              >
                <!-- Linha conectora -->
                <div
                  class="connector-line"
                  :style="getConnectorStyle(index, mindMapData.children.length)"
                ></div>

                <div class="node-content">
                  <v-icon class="node-icon" :color="child.color || 'primary'">
                    {{ child.icon || 'mdi-circle-outline' }}
                  </v-icon>
                  <div class="node-title">{{ child.title }}</div>
                  <div v-if="child.description" class="node-description">
                    {{ child.description }}
                  </div>
                  <div v-if="child.keywords" class="node-keywords">
                    <v-chip
                      v-for="keyword in child.keywords"
                      :key="keyword"
                      size="x-small"
                      class="ma-1"
                      :color="child.color || 'primary'"
                      variant="outlined"
                    >
                      {{ keyword }}
                    </v-chip>
                  </div>
                </div>

                <v-btn
                  v-if="child.children && child.children.length > 0"
                  icon
                  size="small"
                  class="expand-btn"
                  :class="{ 'rotated': expandedNodes.has(`child-${index}`) }"
                >
                  <v-icon size="small">mdi-chevron-right</v-icon>
                </v-btn>

                <!-- Sub-nós -->
                <template v-if="expandedNodes.has(`child-${index}`)">
                  <div
                    v-for="(subChild, subIndex) in child.children"
                    :key="`sub-${index}-${subIndex}`"
                    class="mind-node sub-node"
                    :style="getSubNodeStyle(index, subIndex, child.children.length)"
                    @click="showNodeDetails(subChild)"
                  >
                    <!-- Sub linha conectora -->
                    <div
                      class="sub-connector-line"
                      :style="getSubConnectorStyle(index, subIndex, child.children.length)"
                    ></div>

                    <div class="node-content">
                      <v-icon class="node-icon" size="small" :color="subChild.color || child.color || 'secondary'">
                        {{ subChild.icon || 'mdi-circle-small' }}
                      </v-icon>
                      <div class="node-title small">{{ subChild.title }}</div>
                      <div v-if="subChild.keywords" class="node-keywords">
                        <v-chip
                          v-for="keyword in subChild.keywords"
                          :key="keyword"
                          size="x-small"
                          class="ma-1"
                          :color="subChild.color || child.color || 'secondary'"
                          variant="text"
                        >
                          {{ keyword }}
                        </v-chip>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Dialog para detalhes do nó -->
    <v-dialog v-model="detailDialog" max-width="600">
      <v-card v-if="selectedNode">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2" :color="selectedNode.color">
            {{ selectedNode.icon || 'mdi-information' }}
          </v-icon>
          {{ selectedNode.title }}
        </v-card-title>
        
        <v-card-text>
          <div v-if="selectedNode.description" class="mb-4">
            <v-card variant="outlined" class="pa-3">
              <div class="text-subtitle-2 mb-2">Descrição:</div>
              <div>{{ selectedNode.description }}</div>
            </v-card>
          </div>

          <div v-if="selectedNode.content" class="mb-4">
            <v-card variant="outlined" class="pa-3">
              <div class="text-subtitle-2 mb-2">Conteúdo:</div>
              <div class="text-body-2">{{ selectedNode.content }}</div>
            </v-card>
          </div>

          <div v-if="selectedNode.examples" class="mb-4">
            <v-card variant="outlined" class="pa-3">
              <div class="text-subtitle-2 mb-2">Exemplos:</div>
              <v-list density="compact">
                <v-list-item
                  v-for="example in selectedNode.examples"
                  :key="example"
                  class="text-body-2"
                >
                  <template v-slot:prepend>
                    <v-icon size="small">mdi-play</v-icon>
                  </template>
                  {{ example }}
                </v-list-item>
              </v-list>
            </v-card>
          </div>

          <div v-if="selectedNode.keywords">
            <div class="text-subtitle-2 mb-2">Palavras-chave:</div>
            <div>
              <v-chip
                v-for="keyword in selectedNode.keywords"
                :key="keyword"
                class="ma-1"
                :color="selectedNode.color"
                variant="outlined"
              >
                {{ keyword }}
              </v-chip>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="detailDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'

// Props
const props = defineProps({
  data: {
    type: Object,
    default: () => null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Estado reativo
const expandedNodes = ref(new Set())
const detailDialog = ref(false)
const selectedNode = ref(null)
const canvasRef = ref(null)

// Dados de exemplo (será substituído pelos dados da IA)
const mindMapData = ref(props.data || {
  title: "Direito Constitucional",
  description: "Fundamentos para Concursos Públicos",
  icon: "mdi-scale-balance",
  children: [
    {
      title: "Princípios Fundamentais",
      description: "Base da Constituição",
      icon: "mdi-foundation",
      color: "blue",
      keywords: ["Soberania", "Cidadania", "Dignidade"],
      children: [
        {
          title: "Fundamentos da República",
          description: "Art. 1º da CF/88",
          content: "A República Federativa do Brasil tem como fundamentos: soberania, cidadania, dignidade da pessoa humana, valores sociais do trabalho e da livre iniciativa, pluralismo político.",
          examples: ["Soberania nacional", "Exercício da cidadania", "Respeito à dignidade humana"],
          keywords: ["Art. 1º", "República", "Fundamentos"],
          icon: "mdi-account-group",
          color: "blue"
        },
        {
          title: "Objetivos Fundamentais",
          description: "Art. 3º da CF/88",
          content: "Construir uma sociedade livre, justa e solidária; garantir o desenvolvimento nacional; erradicar a pobreza; promover o bem comum.",
          examples: ["Justiça social", "Desenvolvimento sustentável", "Redução das desigualdades"],
          keywords: ["Art. 3º", "Objetivos", "Sociedade"],
          icon: "mdi-target",
          color: "blue"
        }
      ]
    },
    {
      title: "Direitos e Garantias",
      description: "Direitos fundamentais",
      icon: "mdi-shield-account",
      color: "green",
      keywords: ["Individuais", "Coletivos", "Sociais"],
      children: [
        {
          title: "Direitos Individuais",
          description: "Art. 5º da CF/88",
          content: "Direito à vida, liberdade, igualdade, segurança e propriedade. Princípio da isonomia e devido processo legal.",
          examples: ["Direito à vida", "Liberdade de expressão", "Direito de propriedade"],
          keywords: ["Art. 5º", "Vida", "Liberdade", "Igualdade"],
          icon: "mdi-account",
          color: "green"
        },
        {
          title: "Direitos Sociais",
          description: "Art. 6º da CF/88",
          content: "Educação, saúde, alimentação, trabalho, moradia, transporte, lazer, segurança, previdência social.",
          examples: ["Sistema público de saúde", "Educação gratuita", "Previdência social"],
          keywords: ["Art. 6º", "Educação", "Saúde", "Trabalho"],
          icon: "mdi-heart-multiple",
          color: "green"
        }
      ]
    },
    {
      title: "Organização do Estado",
      description: "Estrutura estatal",
      icon: "mdi-city",
      color: "orange",
      keywords: ["Federação", "Poderes", "Municípios"],
      children: [
        {
          title: "Federação",
          description: "União, Estados, DF e Municípios",
          content: "Organização político-administrativa com autonomia dos entes federativos. Repartição de competências.",
          examples: ["Competência da União", "Autonomia estadual", "Poder local municipal"],
          keywords: ["Federação", "Autonomia", "Competências"],
          icon: "mdi-map",
          color: "orange"
        },
        {
          title: "Separação dos Poderes",
          description: "Executivo, Legislativo e Judiciário",
          content: "Independência e harmonia entre os poderes. Sistema de freios e contrapesos.",
          examples: ["Poder Executivo - Presidente", "Poder Legislativo - Congresso", "Poder Judiciário - STF"],
          keywords: ["Executivo", "Legislativo", "Judiciário", "Independência"],
          icon: "mdi-scale-balance",
          color: "orange"
        }
      ]
    },
    {
      title: "Controle de Constitucionalidade",
      description: "Proteção da Constituição",
      icon: "mdi-gavel",
      color: "red",
      keywords: ["ADI", "ADC", "ADPF"],
      children: [
        {
          title: "Controle Concentrado",
          description: "STF - Ações diretas",
          content: "ADI, ADC, ADPF. Competência exclusiva do STF. Efeito erga omnes e vinculante.",
          examples: ["ADI por inconstitucionalidade", "ADC para confirmar constitucionalidade", "ADPF para proteção de preceito fundamental"],
          keywords: ["STF", "Erga omnes", "Vinculante"],
          icon: "mdi-courthouse",
          color: "red"
        }
      ]
    }
  ]
})

// Métodos para estilização dos nós
const getCentralNodeStyle = () => {
  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
}

const getChildNodeStyle = (index, total) => {
  const angle = (360 / total) * index - 90
  const radius = 300
  const x = Math.cos(angle * Math.PI / 180) * radius
  const y = Math.sin(angle * Math.PI / 180) * radius
  
  return {
    position: 'absolute',
    top: `calc(50% + ${y}px)`,
    left: `calc(50% + ${x}px)`,
    transform: 'translate(-50%, -50%)'
  }
}

const getSubNodeStyle = (parentIndex, subIndex, subTotal) => {
  const parentAngle = (360 / mindMapData.value.children.length) * parentIndex - 90
  const subAngle = parentAngle + ((subIndex - (subTotal - 1) / 2) * 30)
  const radius = 450
  const x = Math.cos(subAngle * Math.PI / 180) * radius
  const y = Math.sin(subAngle * Math.PI / 180) * radius
  
  return {
    position: 'absolute',
    top: `calc(50% + ${y}px)`,
    left: `calc(50% + ${x}px)`,
    transform: 'translate(-50%, -50%)'
  }
}

const getConnectorStyle = (index, total) => {
  const angle = (360 / total) * index - 90
  const length = 150
  
  return {
    position: 'absolute',
    width: `${length}px`,
    height: '2px',
    background: 'linear-gradient(90deg, #1976d2, transparent)',
    top: '50%',
    left: '50%',
    transformOrigin: '0 50%',
    transform: `rotate(${angle}deg)`,
    zIndex: 0
  }
}

const getSubConnectorStyle = (parentIndex, subIndex, subTotal) => {
  const parentAngle = (360 / mindMapData.value.children.length) * parentIndex - 90
  const subAngle = parentAngle + ((subIndex - (subTotal - 1) / 2) * 30)
  const length = 100
  
  return {
    position: 'absolute',
    width: `${length}px`,
    height: '1px',
    background: 'linear-gradient(90deg, #666, transparent)',
    top: '50%',
    left: '50%',
    transformOrigin: '0 50%',
    transform: `rotate(${subAngle - parentAngle}deg)`,
    zIndex: 0
  }
}

// Métodos de interação
const toggleNode = (nodeId) => {
  if (expandedNodes.value.has(nodeId)) {
    expandedNodes.value.delete(nodeId)
  } else {
    expandedNodes.value.add(nodeId)
  }
}

const showNodeDetails = (node) => {
  selectedNode.value = node
  detailDialog.value = true
}

const expandAll = () => {
  const allNodes = new Set(['root'])
  mindMapData.value.children?.forEach((_, index) => {
    allNodes.add(`child-${index}`)
  })
  expandedNodes.value = allNodes
}

const collapseAll = () => {
  expandedNodes.value.clear()
}

const resetView = () => {
  expandedNodes.value.clear()
  expandedNodes.value.add('root')
}

// Watchers para props
import { watch } from 'vue'

watch(() => props.data, (newData) => {
  if (newData) {
    mindMapData.value = newData
    resetView()
  }
}, { deep: true })

// Inicialização
onMounted(() => {
  resetView()
})
</script>

<style scoped>
.mind-map-container {
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.mind-map-wrapper {
  position: relative;
  height: 80vh;
  overflow: hidden;
  border-radius: 12px;
  background: radial-gradient(ellipse at center, #ffffff 0%, #f8f9fa 100%);
}

.mind-map-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  transform-origin: center center;
}

.mind-node {
  min-width: 180px;
  max-width: 250px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.mind-node:hover {
  transform: translate(-50%, -50%) scale(1.05);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  border-color: #1976d2;
}

.central-node {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  min-width: 220px;
  min-height: 120px;
}

.central-node:hover {
  transform: translate(-50%, -50%) scale(1.08);
}

.child-node {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-left: 4px solid #1976d2;
}

.sub-node {
  min-width: 140px;
  max-width: 180px;
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-left: 2px solid #666;
}

.node-content {
  padding: 16px;
  text-align: center;
  position: relative;
}

.sub-node .node-content {
  padding: 12px;
}

.node-icon {
  margin-bottom: 8px;
  display: block;
}

.node-title {
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.4;
  margin-bottom: 6px;
  color: #2c3e50;
}

.node-title.small {
  font-size: 0.85rem;
}

.central-node .node-title {
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
}

.node-description {
  font-size: 0.8rem;
  color: #6c757d;
  line-height: 1.3;
  margin-bottom: 8px;
}

.central-node .node-description {
  color: rgba(255, 255, 255, 0.9);
}

.node-keywords {
  margin-top: 8px;
}

.expand-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(25, 118, 210, 0.1);
  transition: all 0.3s ease;
}

.expand-btn:hover {
  background: rgba(25, 118, 210, 0.2);
}

.expand-btn.rotated {
  transform: rotate(90deg);
}

.connector-line, .sub-connector-line {
  pointer-events: none;
}

.connector-line {
  opacity: 0.6;
}

.sub-connector-line {
  opacity: 0.4;
}

/* Animações */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.mind-node {
  animation: fadeIn 0.5s ease-out;
}

/* Responsividade */
@media (max-width: 768px) {
  .mind-node {
    min-width: 140px;
    max-width: 180px;
  }
  
  .central-node {
    min-width: 160px;
    min-height: 100px;
  }
  
  .node-content {
    padding: 12px;
  }
  
  .node-title {
    font-size: 0.85rem;
  }
}
</style>