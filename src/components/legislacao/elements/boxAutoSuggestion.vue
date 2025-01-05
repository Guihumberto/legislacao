<template>
    <v-card-text>
       <div class="d-flex justify-space-between align-center">
           <h3>Sugestões</h3>
           <v-btn flat icon="mdi-close" @click="$emit('close')"></v-btn>
           <div @input="fetchSuggestions"></div>
       </div>
   </v-card-text>
</template>

<script setup>
   import { useAutoSuggestion } from '@/store/AutoSuggestionStore';
   const suggestStore = useAutoSuggestion()
    
   const props = defineProps({
       search: String,
       autosuggestion: Array
   })
       
   const autosuggestion = async() => {
       if (props.search.length > 2) {
           suggestStore.getSuggestions()
       }
   }
       
   
</script>

<style lang="scss" scoped>

</style>