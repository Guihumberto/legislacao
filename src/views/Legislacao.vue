<template>
  <div class="leges-wrapper">
    <!-- Barra lateral esquerda -->
    <aside 
      class="sidebar sidebar-left" 
      :class="{ 'sidebar-expanded': isLeftSidebarExpanded }"
      v-show="showSidebars"
    >
      <div class="sidebar-content">
        <side-left @large="toggleLeftSidebar" />
      </div>
    </aside>

    <!-- Área central principal (fluida) -->
    <main class="main-content">
      <section-search />
    </main>

    <!-- Barra lateral direita -->
    <aside 
      class="sidebar sidebar-right" 
      v-show="showSidebars"
    >
      <div class="sidebar-content">
        <side-right type="screen" />
      </div>
    </aside>

    <!-- Navigation drawer para mobile -->
    <v-navigation-drawer 
      location="right"
      v-model="geralStore.drawerHistory"
      temporary
      width="300"
    >
      <div class="drawer-content">
        <side-right type="drawer" />
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGeralStore } from '@/store/GeralStore'

import SectionSearch from '@/components/legislacao/search.vue'
import SideLeft from '@/components/legislacao/sidebar/sideLeft.vue'
import SideRight from '@/components/legislacao/sidebar/sideRight.vue'

const geralStore = useGeralStore()

// Estado reativo para controle das barras laterais
const isLeftSidebarExpanded = ref(false)
const windowWidth = ref(window.innerWidth)

// Computed para mostrar/esconder barras laterais baseado na largura da tela
const showSidebars = computed(() => windowWidth.value >= 1500)

// Função para alternar o tamanho da barra lateral esquerda
const toggleLeftSidebar = () => {
  isLeftSidebarExpanded.value = !isLeftSidebarExpanded.value
}

// Função para atualizar a largura da janela
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})
</script>

<style scoped>
.leges-wrapper {
  display: flex;
  min-height: calc(100vh - 320px);
  width: 100%;
  position: relative;
}

/* Barras laterais */
.sidebar {
  flex-shrink: 0;
  background-color: var(--v-surface-color, #ffffff);
  transition: all 0.3s ease-in-out;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-left {
  width: 250px;
  border-right: 1px solid var(--v-border-color, #e9dddd);
  order: 1;
}

.sidebar-left.sidebar-expanded {
  width: 350px;
}

.sidebar-right {
  width: 250px;
  border-left: 1px solid var(--v-border-color, #e9dddd);
  order: 3;
}

.sidebar-content {
  padding: 12px;
  height: 100%;
}

/* Área principal (fluida) */
.main-content {
  flex: 1;
  min-width: 0; /* Permite que o flex item encolha */
  order: 2;
  background-color: var(--v-background-color, #fafafa);
  overflow-y: auto;
}

/* Drawer para mobile */
.drawer-content {
  padding: 16px;
  height: 100%;
}

/* Media queries para responsividade */
@media (max-width: 1670px) {
  .sidebar-left.sidebar-expanded {
    width: 300px; /* Reduz um pouco o tamanho expandido em telas menores */
  }
}

@media (max-width: 1600px) {
  .sidebar {
    opacity: 0.9;
  }
}

@media (max-width: 1500px) {
  .leges-wrapper {
    justify-content: center;
  }
  
  .main-content {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 8px;
  }
}

/* Melhorias de acessibilidade e UX */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: var(--v-surface-variant-color, #f5f5f5);
}

.sidebar::-webkit-scrollbar-thumb {
  background: var(--v-outline-color, #cccccc);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--v-outline-variant-color, #999999);
}

/* Animações suaves */
@media (prefers-reduced-motion: reduce) {
  .sidebar {
    transition: none;
  }
}

/* Estados de foco para acessibilidade */
.sidebar:focus-within {
  outline: 2px solid var(--v-primary-color, #1976d2);
  outline-offset: -2px;
}
</style>