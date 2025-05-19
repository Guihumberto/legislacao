<template>
    <v-btn :loading="load" :disabled="load" @click="favQuestion" class="my-n2" variant="text" :color="isFav ? 'amber-darken-1':'grey'" icon="mdi-star"></v-btn>
</template>

<script setup>
    import { ref, computed } from 'vue';

    import { useFavQuestoesStore } from '@/store/forum/favQuestionStore';
    const favStore = useFavQuestoesStore()

    const fav = ref(false)
    const load = ref(false)

    const props = defineProps({
        questao: Object
    })

    const favQuestion = async () => {
        load.value = true

        fav.value = !isFav.value

        const objeto = {
            ...props.questao,
            fav: fav.value
        }

        const resp = await favStore.saveFavQuestion(objeto)
        load.value = false
    }

    const isFav = computed(() => {
        const exist = favStore.readFavorites.find(x => x.id_question == props.questao.id && x.fav == true)
        return exist ? true : false
    })  

</script>

<style scoped>

</style>