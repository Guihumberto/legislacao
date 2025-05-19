<template>
    <div class="container">
      <!-- Sidebar esquerda -->
      <div
        class="sidebar left"
        :style="{ width: leftWidth + 'px' }"
      >
          <sideLeft @large="largeSidebar()" />
        <div class="resizer" @mousedown="startResize('left')"></div>
      </div>
  
      <!-- Conteúdo principal -->
      <div class="main-content">
        <section-search />
      </div>
  
      <!-- Sidebar direita -->
      <div
        class="sidebar right"
        :style="{ width: rightWidth + 'px' }"
      >
        <div class="resizer" @mousedown="startResize('right')"></div>
      </div>
    </div>
  </template>
  
  <script setup>
    import { ref } from 'vue'

    import SectionSearch from '@/components/legislacao/search.vue';
    import sideLeft from '@/components/legislacao/sidebar/sideLeft'
    import sideRight from '@/components/legislacao/sidebar/sideRight'

    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()

    const leftWidth = ref(200) // Largura inicial da sidebar esquerda
    const rightWidth = ref(200) // Largura inicial da sidebar direita
    const isResizing = ref(false)
    const activeSidebar = ref(null)
 
    const startResize = (side) => {
      isResizing.value = true;
      activeSidebar.value = side;

      // Adiciona os eventos de movimento e liberação
      window.addEventListener("mousemove", onResize);
      window.addEventListener("mouseup", stopResize);
    }

    const onResize = (event) => {
        if (isResizing.value && activeSidebar.value) {
          const containerWidth = document.querySelector(".container").offsetWidth;
  
          if (activeSidebar.value === "left") {
            // Calcula a nova largura da sidebar esquerda
            const newLeftWidth = Math.min(Math.max(event.clientX, 100), containerWidth - rightWidth.value - 100);
            leftWidth.value = newLeftWidth;
          } else if (activeSidebar.value === "right") {
            // Calcula a nova largura da sidebar direita
            const newRightWidth = Math.min(
              Math.max(containerWidth - event.clientX, 100),
              containerWidth - leftWidth.value - 100
            );
            rightWidth.value = newRightWidth;
          }
        }
    }
    
    const stopResize = () => {
      isResizing.value = false;
      activeSidebar.value = null;

      // Remove os eventos de movimento e liberação
      window.removeEventListener("mousemove", onResize);
      window.removeEventListener("mouseup", stopResize);
    }
  </script>
  
  <style scoped>
  .container {
    display: flex;
    min-height: calc(100vh - 460px);
    width: 100%;
    overflow: hidden;
  }
  
  .sidebar {
    background-color: #f4f4f4;
    overflow: auto;
    position: relative;
    padding: 2rem;
  }
  
  .sidebar.left {
    border-right: 1px solid #ddd;
  }
  
  .sidebar.right {
    border-left: 1px solid #ddd;
  }
  
  .main-content {
    flex-grow: 1;
    background-color: #fff;
  }
  
  .resizer {
    width: 5px;
    cursor: ew-resize;
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: #ccc;
  }
  
  .sidebar.left .resizer {
    right: 0;
  }
  
  .sidebar.right .resizer {
    left: 0;
  }
  </style>
  