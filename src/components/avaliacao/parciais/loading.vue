<template>
    <div class="load">
        <span class="loading">
            Aguarde! <br>
            Estamos carregando a lista de servidores na base de dados. <br>
            Carregando<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
        </span>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
.load{
    min-height: 55vh;
}
.loading {
    font-size: 1.2em;
    font-weight: 300;
    color: #333;
}

.dot {
    opacity: 0;
    animation: blink 1.5s infinite step-start;
}

.dot:nth-child(1) {
    animation-delay: 0s;
}

.dot:nth-child(2) {
    animation-delay: 0.5s;
}

.dot:nth-child(3) {
    animation-delay: 1s;
}

@keyframes blink {
    0%, 100% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
}
</style>