<template>
  <div class="text-center py-10">
    <v-fade-transition mode="out-in">
      <div :key="currentMessage" class="text-subtitle-1 font-weight-medium transition-text">
        {{ currentMessage }}
      </div>
    </v-fade-transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const messages = [
  'Aguarde, estamos gerando suas questões.',
  'Você poderá treinar com questões focadas no(s) artigo(s) selecionado(s).',
  'Estamos quase terminando.',
  'Você poderá favoritar as questões para ter acesso mais rápido.',
  'A resolução das questões ficam salvas para consultas posteriores.',
  'Todas as questões são comentadas.',
]

const currentIndex = ref(0)
const currentMessage = ref(messages[currentIndex.value])
let intervalId

onMounted(() => {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % messages.length
    currentMessage.value = messages[currentIndex.value]
  }, 3000) // Troca a cada 3 segundos
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>

<style scoped>
.transition-text {
  opacity: 0.9;
}
</style>
