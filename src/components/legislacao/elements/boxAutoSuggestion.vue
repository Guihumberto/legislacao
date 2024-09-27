<template>
     <v-card-text>
        <div class="d-flex justify-space-between align-center">
            <h3>Sugestões</h3>
            <v-btn flat icon="mdi-close" @click="$emit('close')"></v-btn>
            <div @input="fetchSuggestions"></div>
        </div>
    </v-card-text>
</template>

<script>
    import api from "@/services/api"

    export default {
        data(){
            return{
                suggestions: []
            }
        },
        props:{
            search: String,
            autosuggestion: Array
        },
        methods:{
            async autosuggestion(){
                if (this.search.length > 2) {
                    try{
                        const response = await  api.post("autocomplete/_search", {
                            "suggest":{
                                "name_suggestion" :{
                                "prefix" : "subs",
                                "completion" : {
                                    "field": "suggest"
                                }
                                }
                            }
                        })
                        this.suggestions = response.data.hits.hits;
                    } catch(e){
                        console.log('erro')
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>