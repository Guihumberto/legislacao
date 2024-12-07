<template>
    <div v-for="item, i in resultsSearch.map(x => x._source)" :key="i">
        {{ item.title }}
    </div>
</template>

<script setup>
    import api from "@/services/api"
    import { ref } from "vue"

    const resultsSearch = ref([])

    const props = defineProps({
        search: String
    })


    const getLaws = async () => {
        const response = await api.post("laws_v3/_search", {
            from: 0,
            size: 5,
            query:{
                match:{
                    "description_norm": {
                        "query": props.search,
                        "fuzziness": "AUTO",
                        "minimum_should_match": "75%"
                    }
                }
            }
        })
        resultsSearch.value = response.data.hits.hits;
    }

    getLaws()

   
</script>