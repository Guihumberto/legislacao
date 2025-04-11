<template>
    <div class="containerIA">
        <h1 class="text-h5 mb-5 d-flex align-center ga-2"> <v-icon size="1.5rem">mdi-robot</v-icon> Arcadio IA</h1>
        <Loading v-if="searchStore.readLoad" />
        <p>{{ respArcadio }}</p>
    </div>
</template>

<script setup>
    import Loading from "../forum/loading.vue";
    
    import { useSearchStore } from "@/store/SearchStore"
        const searchStore = useSearchStore()

    const props = defineProps({
        respArcadio: {
            type: String,
            required: true
        }
    })
</script>

<style scoped>
.containerIA{
    border: 1px solid #ccc;
    border-radius: 12px;
    padding: 1rem;
    margin-top: 1rem;
}

</style>