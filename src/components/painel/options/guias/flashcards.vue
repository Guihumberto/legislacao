<template>
    <v-btn icon="mdi-arrow-left" variant="text" @click="$emit('back')"></v-btn>
    <div class="w-100 border rounded-lg">
        <h1>Flashcards</h1>

        <v-form @click="submitForm" ref="form">

        </v-form>
       
    </div>
</template>

<script setup>
   
</script>

<style scoped>

</style>