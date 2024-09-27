<template>
    <div class="pa-5">
        <h2 class="text-center">Nota da avaliação</h2>
        <div class="icon-nota">
            <v-icon :color="score.color" size="5rem">{{ score.icon }}</v-icon>
            <v-chip :color="score.color">{{ score.name }}</v-chip>
            <div class="total">Total: {{ score.score }} pontos</div>
        </div>
    </div>
</template>

<script>
    export default {
        props:{
            score: Object
        }
    }
</script>

<style lang="scss" scoped>
.icon-nota{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.total{
    padding: 1rem;
    background: rgb(237, 235, 235);
    margin: 1rem 0;
    font-weight: 600;
}
@keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
    100% { transform: translateX(0); }
  }
</style>