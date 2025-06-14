<template>
     <div class="wrapper">
        <div class="mindmap-container">
            <v-card class="mindmap-card" elevation="2">
              <v-card-title class="d-flex align-center">
                  <v-icon class="mr-2">mdi-sitemap</v-icon>  Mapa Mental Dinâmico
                  <v-spacer />
                  <v-btn
                      icon
                      size="small"
                      @click="expandAll"
                      color="primary"
                  >
                      <v-icon>mdi-arrow-expand-all</v-icon>
                  </v-btn>
                  <v-btn
                      icon
                      size="small"
                      @click="collapseAll"
                      color="secondary"
                      class="ml-1"
                  >
                      <v-icon>mdi-arrow-collapse-all</v-icon>
                  </v-btn>
              </v-card-title>
              <v-chip color="info" density="compact" v-if="data.arts.length" v-for="item, i in data.arts" :key="i" class="ml-2">Art.{{ item }}</v-chip>
              <v-card-text>
                  <div class="mindmap-tree">
                  <MindMapNode
                      :node="data"
                      :level="0"
                      @toggle="handleToggle"
                  />
                  </div>
              </v-card-text>
            </v-card>
        </div>    
    </div>
</template>

<script setup>
    import { ref, computed, inject } from 'vue'
    const rightWidth = inject('rightWidth')

    import MindMapNode from './mindMaps/mindMapNode.vue'

    // Props
    const props = defineProps({
        data: {
            type: Object,
            default: () => ({})
        }
    })

    // Estado reativo
    const expandedNodes = ref(new Set())

    // Métodos
    const handleToggle = (nodeId) => {
    // Lógica adicional se necessário
    }

    const expandAll = () => {
        const expandRecursive = (node) => {
            node.expanded = true
              if (node.children) {
              node.children.forEach(expandRecursive)
            }
        }
        expandRecursive(props.data)
    }

    const collapseAll = () => {
        const collapseRecursive = (node) => {
            if (node.type !== 'root') {
            node.expanded = false
            }
            if (node.children) {
            node.children.forEach(collapseRecursive)
            }
        }
        collapseRecursive(props.data)
    }
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
    .mindmap-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
}

.mindmap-card {
  border-radius: 12px;
  overflow: hidden;
}

.mindmap-tree {
  padding: 20px 0;
}

.mind-node {
  margin: 8px 0;
  position: relative;
}

.node-content {
  cursor: pointer;
  border-radius: 8px;
  padding: 12px 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-left: 4px solid transparent;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  backdrop-filter: blur(10px);
}

.node-content:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.node-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.expand-icon {
  transition: transform 0.3s ease;
  margin-top: 2px;
}

.expand-icon.rotated {
  transform: rotate(90deg);
}

.node-icon {
  margin-top: 2px;
}

.node-text {
  flex: 1;
}

.node-title {
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 4px;
}

.node-subtitle {
  font-size: 0.85em;
  opacity: 0.7;
  font-weight: 500;
  margin-bottom: 4px;
}

.node-description {
  font-size: 0.9em;
  opacity: 0.8;
  line-height: 1.3;
}

/* Estilos por nível */
.level-0 .node-content {
  border-left-color: #1976d2;
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%);
}

.level-0 .node-title {
  font-size: 1.5em;
  color: #1976d2;
}

.level-1 .node-content {
  border-left-color: #2196f3;
  margin-left: 20px;
}

.level-1 .node-title {
  font-size: 1.2em;
  color: #2196f3;
}

.level-2 .node-content {
  border-left-color: #4caf50;
  margin-left: 40px;
}

.level-2 .node-title {
  font-size: 1.1em;
  color: #4caf50;
}

.level-3 .node-content {
  border-left-color: #ff9800;
  margin-left: 60px;
}

.level-3 .node-title {
  color: #ff9800;
}

.level-4 .node-content {
  border-left-color: #9c27b0;
  margin-left: 80px;
}

.level-4 .node-title {
  color: #9c27b0;
}

/* Estilos por tipo */
.type-exclusion .node-content {
  border-left-color: #f44336 !important;
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%);
}

.type-exclusion .node-title {
  color: #f44336 !important;
}

.type-special .node-content {
  border-left-color: #9c27b0 !important;
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(156, 39, 176, 0.05) 100%);
}

.type-special .node-title {
  color: #9c27b0 !important;
}

/* Animações */
.children-container {
  overflow: hidden;
}

.child-node {
  position: relative;
}

.child-node::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 20px;
  width: 8px;
  height: 1px;
  background: rgba(0,0,0,0.2);
}

.node-children-enter-active,
.node-children-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.node-children-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.node-children-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.node-children-move {
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Responsividade */
@media (max-width: 768px) {
  .mindmap-container {
    padding: 10px;
  }
  
  .level-1 .node-content { margin-left: 15px; }
  .level-2 .node-content { margin-left: 30px; }
  .level-3 .node-content { margin-left: 45px; }
  .level-4 .node-content { margin-left: 60px; }
  
  .node-title {
    font-size: 0.9em !important;
  }
  
  .level-0 .node-title {
    font-size: 1.2em !important;
  }
}
</style>