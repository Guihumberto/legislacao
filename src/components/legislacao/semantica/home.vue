<template>
    <section class="bg-black">
        <div class="container">
            <v-btn variant="text" class="mb-10" @click="voltar">Voltar</v-btn>
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
            <div>
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

<script>
    import api from "@/services/api"

    export default {
        data() {
            return {
                query: '',
                suggestions: []
            };
        },
        methods:{
            voltar(){
                this.$router.push('/leges')
            },
            async fetchSuggestions() {
                if (this.query.length > 2) {
                    try {
                        const response = await api.post("pages_v2/_search", {
                            query: {
                                "match_phrase_prefix": {
                                    "text_page": {
                                        "query": this.query,
                                        "slop" : 10
                                    }
                                }
                            }
                        });
                        this.suggestions = response.data.hits.hits;
                    } catch (error) {
                        console.error('Erro ao buscar sugestões:', error);
                    }
                } else {
                    this.suggestions = [];
                }
            }
        },
    }   
</script>

<style lang="scss" scoped>
.container{
    min-height: 60vh;
}

</style>