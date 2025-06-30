<template>
    <section class="bg-black">
        <div class="container">
            <v-btn variant="text" class="pa-0 mb-10" @click="$router.push('/homepainel')" prepend-icon="mdi-home">INÍCIO</v-btn>
            <h2>Busca Legislação</h2>
            <div class="my-5 w-50">
                <h3 class="mb-2">Insira sua consulta</h3>
                <v-form @submit.prevent="fetchSuggestions">
                    <v-text-field
                        type="text"
                        label="Busca"
                        variant="outlined"
                        density="compact"
                        v-model="query"
                        @input="fetchSuggestions"
                        placeholder="Digite para buscar..."
                    ></v-text-field>
                    <v-btn variant="outlined" type="submit">Buscar</v-btn>
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
            <div v-if="load">
                Carregando...
            </div>
            <div>
                {{ summary }}
                <br>
                <v-list link>
                    <v-list-item v-for="item, i in keywords.filter(x => x.score > 0.9)" :title="`Score: ${item.score}`">
                        {{ item.entity_group }} - {{ item.word }}
                    </v-list-item>
                </v-list>
            </div>
        </div>
    </section>
</template>

<script setup>
    import api from '@/services/api_hf'

    import { usePageStore } from '@/store/PageStore';
    const pageStore = usePageStore()
    import { ref } from 'vue';

    const query = ref('')
    const suggestions = ref([])

    const summary = ref(null)
    const keywords = ref([])
    const load = ref(false)
      

    const fetchSuggestions = async () => {
        try {
            load.value = true
            const resp = await api.post('facebook/bart-large-cnn', {
                inputs: query.value
            })
             summary.value = resp.data[0].summary_text

             const sumRep = await api.post('dslim/bert-base-NER', {
                inputs: query.value
             })
             console.log(sumRep);
             keywords.value = sumRep.data

        } catch (error) {
            console.log('error chamada hf', error);
        } finally {
            load.value = false
        } 
    }
</script>

<style lang="scss" scoped>
.container{
    min-height: 60vh;
}

</style>