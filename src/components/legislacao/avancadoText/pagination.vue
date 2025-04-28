<template>
    <div class="content">
      <div class="center">
        <v-pagination
          :length="totalPage"
          v-model="pagination.page"
          :total-visible="isMobile ? 1 : 5"
        ></v-pagination>
        <v-select
          density="compact"
          style="width: 85px"
          :items="dipositivos"
          v-model="pagination.perPage"
          hide-details=""
        ></v-select>

      </div>
    </div>
  </template>

  <script setup>
    import { ref, onMounted, onBeforeUnmount } from 'vue';

    const isMobile = ref(false);

    const checkIfMobile = () => {
      isMobile.value = window.innerWidth <= 768; // Define 768px como largura limite
    };

    onMounted(() => {
      checkIfMobile(); // Verifica no carregamento inicial
      window.addEventListener('resize', checkIfMobile); // Adiciona o ouvinte de redimensionamento
    });

    onBeforeUnmount(() => {
      // Remove o listener para evitar vazamentos de memória
      window.removeEventListener('resize', checkIfMobile);
    });

    const dipositivos = [
        15, 30, 40, 50
    ]


    const props = defineProps({
        pagination: Object, 
        totalPage: Number
    })


  </script>

  <style scoped>
    .content{
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1rem 0;;
    }
    .center{
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>