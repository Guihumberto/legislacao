<template>
    <div class="my-5 py-5">
        <p class="mb-2">Como você avalia este resultado?</p>
        <v-btn-toggle
            v-model="toggle"
            divided
        >
            <v-btn icon="mdi-thumb-down-outline"></v-btn>
            <v-btn icon="mdi-thumb-up-outline"></v-btn>
        </v-btn-toggle>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    const toggle = ref(null)

</script>

<style scoped>


</style>