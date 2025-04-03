<template>
    <div class="loading text-white" >
        <div class="dot" :class="theme == 'dark' ? 'dot-black': 'dot-white'"></div>
        <div class="dot" :class="theme == 'dark' ? 'dot-black': 'dot-white'"></div>
        <div class="dot" :class="theme == 'dark' ? 'dot-black': 'dot-white'"></div>
    </div>
</template>

<script setup>
const theme = 'light'

</script>

<style scoped>
   .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30px;
    }

    .dot {
        width: 10px;
        height: 10px;
        margin: 0 5px;
        border-radius: 50%;
        animation: bounce 1.5s infinite;
    }

    .dot-black{
        background-color: rgb(248, 246, 246);
    }

    .dot-white{
        background-color: rgb(17, 17, 17);
    }

    .dot:nth-child(1) {
        animation-delay: 0s;
    }

    .dot:nth-child(2) {
        animation-delay: 0.2s;
    }

    .dot:nth-child(3) {
        animation-delay: 0.4s;
    }

    @keyframes bounce {
        0%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
    }
</style>