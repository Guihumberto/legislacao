<template>
    <div class="content">
      <v-pagination
        :length="totalPage"
        v-model="pagination.page"
        :total-visible="7"
      ></v-pagination>
      <v-select
        density="compact"
        style="width: 90px"
        :items="dipositivos"
        v-model="pagination.perPage"
      ></v-select>
    </div>
  </template>

  <script setup>
    import { ref } from 'vue';

    const dipositivos = [
        15, 30, 40, 50
    ]
    const qtdSelect = ref(30)

    const props = defineProps({
        pagination: Object, 
        totalPage: Number
    })


  </script>

  <style scoped>
    .content{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 1rem 0;;
    }
  </style>