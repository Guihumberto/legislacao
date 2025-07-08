<template>
    <div class="my-5 d-flex align-center ga-2" :class="{ bloqueado: resposta }">
        <v-btn 
            @click="markAlternative('verdadeiro')" 
            color="success" :variant="respostaExist == 'verdadeiro' ? 'flat':'outlined'" class="mr-2">Certo</v-btn>
        <v-btn 
            @click="markAlternative('falso')" 
            color="error" :variant="respostaExist == 'falso' ? 'flat':'outlined'" class="mr-2">Errado</v-btn>
    </div>
    <div class="d-flex ga-2 align-center">
        <v-btn v-if="!resposta" @click="responderQuestao()" :disabled="!marked" variant="flat" color="blue">Responder</v-btn>
        <div v-if="resposta" class="border pa-2 w-100" :class="resposta == 'acertou' ? 'bg-blue-lighten-5' : 'bg-red-lighten-5'">
            <p v-if="resposta == 'acertou'" class="text-success font-weight-bold">Você acertou!</p>
            <p v-else class="text-error font-weight-bold">Você errou!</p>
            {{ aleternativa.justificativa }}
            <div class="text-right mt-2">
                <InfoError :questao="aleternativa" />
            </div>
        </div>
    </div>
</template>

<script setup>
    import { onMounted, ref, computed } from 'vue';
    import InfoError from './infoError.vue';

    import { useQuestoesStore } from '@/store/forum/QuestoesStore';
    const questoesStore = useQuestoesStore()

    const marked = ref(null)
    const resposta = ref(null)

    const props = defineProps({
        aleternativa: Object
    })

    const markAlternative = (id) => {
        marked.value = id
    }

    const responderQuestao = async () => {
        if(marked.value == props.aleternativa.resposta){
            resposta.value = 'acertou'
        }else{
            resposta.value = 'errou'
        }

        const objeto = {
            id_law: props.aleternativa.id_law,
            id_origin_law: props.aleternativa?.id_origin_law,
            id_art: props.aleternativa.id_art,
            id_question: props.aleternativa.id,
            id_resposta: marked.value,
            result: resposta.value
        }

        const resp = await questoesStore.saveRespQuestao(objeto)
    }

    const responderQuestao2 = async () => {
        if(marked.value == props.aleternativa.resposta){
            resposta.value = 'acertou'
        }else{
            resposta.value = 'errou'
        }
    }

    const respostaExist = computed(() => {
        if(props.aleternativa?.id_resposta){
            marked.value = props.aleternativa.id_resposta
            responderQuestao2()
        }
        return props.aleternativa?.id_resposta || marked.value
    })

</script>

<style scoped>
.bloqueado {
  pointer-events: none;
}
</style>