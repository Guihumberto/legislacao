<template>
    <v-card
        title="Ative o chat IA"
        subtitle="Arcádio Chat"
        text="Simplifique a norma e aumente as possibilidades de pesquisa."
        elevation="1"
    >
        <v-card-actions>
            <div class="text-center w-100">
                <v-btn :loading="loading" @click="$emit('ativar')" variant="tonal" color="purple" prepend-icon="mdi-robot">Ativar Chat</v-btn>
            </div>
        </v-card-actions>
    </v-card>
</template>
<script setup>

const props = defineProps({
    loading: Boolean
})

</script>
<style scoped>

</style>