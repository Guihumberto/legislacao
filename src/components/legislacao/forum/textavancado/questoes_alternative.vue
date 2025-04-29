<template>
    <div class="my-5 d-flex align-center ga-2">
        <v-btn 
            @click="markAlternative('verdadeiro')" 
            color="success" :variant="marked == 'verdadeiro' ? 'flat':'outlined'" class="mr-2">Certo</v-btn>
        <v-btn 
            @click="markAlternative('falso')" 
            color="error" :variant="marked == 'falso' ? 'flat':'outlined'" class="mr-2">Errado</v-btn>
    </div>
    <div class="d-flex ga-2 align-center">
        <v-btn v-if="!resposta" @click="responderQuestao()" :disabled="!marked" variant="flat" color="blue">Responder</v-btn>
        <div v-if="resposta" class="border pa-2 w-100 bg-blue-lighten-5">
            <p v-if="resposta == 'acertou'" class="text-success font-weight-bold">Você acertou!</p>
            <p v-else class="text-error font-weight-bold">Você errou!</p>
            {{ aleternativa.justificativa }}
        </div>
    </div>

</template>

<script setup>
    import { ref } from 'vue';

    const marked = ref(null)
    const resposta = ref(null)

    const markAlternative = (id) => {
        marked.value = id
    }

    const responderQuestao = () => {
        if(marked.value == props.aleternativa.resposta){
            resposta.value = 'acertou'
        }else{
            resposta.value = 'errou'
        }
    }

    const props = defineProps({
        aleternativa: Object
    })

</script>

<style scoped>

</style>