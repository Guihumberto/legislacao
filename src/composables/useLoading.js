// composables/useLoading.js
import { ref } from 'vue'

export function useLoading(minDuration = 500) {
  const isLoading = ref(false)
  const showLoading = ref(false)
  
  let startTime = null
  let hideTimer = null
  
  const startLoading = () => {
    isLoading.value = true
    showLoading.value = true
    startTime = Date.now()
    
    // Limpa timer anterior se existir
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
  }
  
  const stopLoading = () => {
    isLoading.value = false
    
    if (startTime) {
      const elapsed = Date.now() - startTime
      const remainingTime = Math.max(0, minDuration - elapsed)
      
      if (remainingTime > 0) {
        hideTimer = setTimeout(() => {
          showLoading.value = false
        }, remainingTime)
      } else {
        showLoading.value = false
      }
    } else {
      showLoading.value = false
    }
  }
  
  return {
    isLoading,
    showLoading,
    startLoading,
    stopLoading
  }
}