<template>
    <v-card width="50%" height="340px" class="central">
        <v-card-text class="box">
            <img class="img_flag" src="../../../assets/brasao.png" />
            <h2 class="mb-2">SEFAZ MA</h2>
            <h3>Avaliação de Desempenho Individual</h3>
            <h3>Administração</h3>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
.central{
    transition: 1s ease;
    animation: slideLeft 1s ease-in;
}
.box{
    font-family: 'Poppins', sans-serif;
    line-height: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.img_flag{
  height: 5rem;
  margin-bottom: 1rem;
}
h2{
    font-size: 2.5em;
    font-weight: 600;
}

@keyframes slideLeft {
    0%{
        opacity: 0;
        transform: translateX(50px);
    }
    100%{
        opacity: 1;
        transform: translateX(0);
    }
}

</style>