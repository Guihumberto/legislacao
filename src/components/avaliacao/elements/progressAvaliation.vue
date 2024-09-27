<template>
     <v-sheet
        class="d-flex align-center pr-4 py-2 mr-2"
        color="primary"
        min-width="550"
        rounded="lg"
    >
        <small class="text-center">Avaliações realizadas</small>
        <v-progress-linear
            :location="false"
            bg-color="#92aed9"
            buffer-color="#6a3e0b"
            buffer-opacity="1"
            buffer-value="3"
            color="#12512a"
            height="12"
            :max="concluidos.total"
            min="0"
            :model-value="concluidos.avaliados"
            rounded
        ></v-progress-linear>

        <div class="ms-4 text-h6">{{concluidos.avaliados}}/{{ concluidos.total }}</div>
    </v-sheet>
</template>

<script>
    export default {
        props:{
            concluidos: Object
        }
    }
</script>

<style lang="scss" scoped>

</style>