<template>
    <section class="bg-black">
        <div class="container">
            <v-btn variant="text" class="pa-0 mb-10" @click="$router.push('/leges')" prepend-icon="mdi-home">INÍCIO</v-btn>
            <h2>Busca Legislação</h2>
            <div class="my-5 w-50">
                <h3 class="mb-2">Insira sua consulta</h3>
                <v-form>
                    <v-text-field
                        type="text"
                        label="Busca"
                        variant="outlined"
                        density="compact"
                        v-model="query"
                        @input="fetchSuggestions"
                        placeholder="Digite para buscar..."
                    ></v-text-field>
                    <v-btn variant="outlined">Buscar</v-btn>
                </v-form>
            </div>
            <div v-if="suggestions.length">
                Total Páginas: {{ suggestions.length }}
                <ul v-if="suggestions.length">
                    <li v-for="suggestion in suggestions" :key="suggestion._id">
                        {{ suggestion._source.text_page }}
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<script setup>
    import { usePageStore } from '@/store/PageStore';
    const pageStore = usePageStore()
    import { ref } from 'vue';

    const query = ref('')
    const suggestions = ref([])
      
    const fetchSuggestions = async () => {
        
        if (query.value.length > 2) {
            const resp = await pageStore.fetchSuggestions(query.value)
            suggestions.value = resp
        } else {
            suggestions.value = [];
        }
    }
</script>

<style lang="scss" scoped>
.container{
    min-height: 60vh;
}

</style>