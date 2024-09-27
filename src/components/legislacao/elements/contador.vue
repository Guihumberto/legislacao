<template>
    <div>
        <small>Total de consultas realizadas: </small>
        <small class="counter" :class="{ grow: isGrowing }">{{ counter }}</small>
    </div>
</template>

<script>
    import { useConsultaStore } from '@/store/ConsultaStore'
    const consultaStore = useConsultaStore()  
    
    export default {
        data(){
            return{
                resultsSearch: [],
                totalDocs: 0,
                counter: 1,
                isGrowing: false,
            }
        },
        computed:{
            totalNum(){
                return consultaStore.readTotalConsulta
            }
        },
        methods: {
            async startCounting() {
                const interval = await setInterval(() => {
                    if(this.totalNum > 4){
                        if (this.counter < this.totalNum) {
                            this.counter++;
                        } else {
                            clearInterval(interval);
                            this.animateFinal();
                        }
                    }
                }, 1); // Ajuste o intervalo conforme necessário
            },
            animateFinal() {
                this.isGrowing = true;
                setTimeout(() => {
                    this.isGrowing = false;
                }, 1000); // Duração da animação final
            }
        },
        mounted() {
            this.startCounting();
        }
    }
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