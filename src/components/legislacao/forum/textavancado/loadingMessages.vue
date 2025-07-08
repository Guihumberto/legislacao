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

const props = defineProps({
  messages: Array
})

const currentIndex = ref(0)
const currentMessage = ref(props.messages[currentIndex.value])
let intervalId

onMounted(() => {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.messages.length
    currentMessage.value = props.messages[currentIndex.value]
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
