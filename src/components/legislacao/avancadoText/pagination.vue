<template>
    <div class="content">
      <div class="center">
        <v-pagination
          :length="totalPage"
          v-model="pagination.page"
          :total-visible="checkIfMobile ? 1 : 5"
        ></v-pagination>
        <v-select
          density="compact"
          style="width: 85px"
          :items="dipositivos"
          v-model="pagination.perPage"
          hide-details
        ></v-select>

      </div>
    </div>
  </template>

  <script setup>
    import { ref, onMounted, computed, onBeforeUnmount } from 'vue';

    const props = defineProps({
        pagination: Object, 
        totalPage: Number,
        large: Number
    })

    const checkIfMobile = computed(() => {
      return props.large <= 768
      ? true
      : false
    })

    const dipositivos = [
        15, 30, 40, 50
    ]

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