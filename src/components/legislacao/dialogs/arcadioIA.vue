<template>
    <div class="containerIA">
        <div class="d-flex align-center justify-space-between">
            <h1 class="text-h5 mb-5 d-flex align-center ga-2"> <v-icon size="1.5rem">mdi-robot</v-icon> Arcadio IA</h1>
            <v-switch v-model="activeArcadioIA" color="success" hide-details label="Ativar"></v-switch>
        </div>
        <div v-if="!respArcadio" class="text-justify mb-2">
            <p>Obtenha respostas geradas por IA a partir de perguntas no prompt.</p>
            <small>Algumas respostas dependem de conversão de textos relacionados com a busca.</small>
        </div>
        <v-alert v-if="!isLogin" type="info" variant="outlined" text="Faça login para utilizar!">
            <template v-slot:append>
                <v-btn density="comfortable" color="primary" @click="$router.push('/login')">Login</v-btn>
            </template>
        </v-alert>
        <div class="mt-10">
            <Loading v-if="searchStore.readLoad" />
            <div v-if="respArcadio">
                <p class="mb-5">{{ respArcadio }}</p>
                <small>O arcádio IA pode gerar respostas incorretas ou imprecisas. Consulte a legislação de referência.</small>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { computed, inject } from "vue";
    
    import Loading from "../forum/loading.vue";
    import { useSearchStore } from "@/store/SearchStore"
    const searchStore = useSearchStore()

    const props = defineProps({
        respArcadio: {
            type: String,
            required: true
        }
    })

    const activeArcadioIA = inject('activeArcadioIA')

    const isLogin = computed(() => {
        const data = sessionStorage.getItem('userData') || localStorage.getItem('userData');
        if (data) {
            return JSON.parse(data).cpf
        }
        return null
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