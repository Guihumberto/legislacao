<template>
    <div>
        <small>Total de consultas realizadas: </small>
        <small class="counter" :class="{ grow: isGrowing }">{{ counter }}</small>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { useConsultaStore } from '@/store/ConsultaStore'
    const consultaStore = useConsultaStore()  
    
    const counter = ref(1)
    const isGrowing = ref(false)

    const startCounting = async() => {
        const interval = await setInterval(() => {
            if(consultaStore.readTotalConsulta > 4){
                if (counter.value < consultaStore.readTotalConsulta) {
                    counter.value++;
                } else {
                    clearInterval(interval);
                    animateFinal();
                }
            }
        }, 1); 
    }

    const animateFinal = () => {
        isGrowing.value = true;
        setTimeout(() => {
            isGrowing.value = false;
        }, 1000); 
    }
    
    startCounting();
</script>

<style lang="scss" scoped>
.counter {
  transition: transform 0.5s ease-in-out;
}
.grow {
  animation: grow-shrink 1s ease-in-out infinite;
  transition: transform 0.5s ease-in-out;
}

@keyframes grow-shrink {
  0%, 100% {
    transform: scale(1);
    font-weight: bold;
  }
  50% {
    transform: scale(1.01);
    font-weight: normal;
  }
}

</style>