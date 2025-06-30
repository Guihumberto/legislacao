<template>
    <div class="content">
      <div class="center">
        <v-pagination
          :length="totalPage"
          v-model="pagination.page"
          :total-visible="checkIfMobile ? 1 : 5"
          density="compact"
        ></v-pagination>
        <v-select
          density="compact"
          style="width: 85px; transform: scale(.8);"
          :items="dipositivos"
          v-model="pagination.perPage"
          hide-details
          class="mb-4"
        ></v-select>

      </div>
    </div>
  </template>

  <script setup>
    import {  computed } from 'vue';
    import { useDisplay } from 'vuetify'
    const { mobile } = useDisplay()

    const props = defineProps({
        pagination: Object, 
        totalPage: Number,
        large: Number
    })

    const checkIfMobile = computed(() => {
      if(mobile.value) return true
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