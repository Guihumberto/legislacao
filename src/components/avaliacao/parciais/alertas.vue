<template>
    <v-alert :icon="alerta.icon" :color="alerta.color" class="mt-5" variant="outlined">
        {{ alerta.text }}
    </v-alert>
</template>

<script>
    export default {
        props:{
            alerta: Object
        }
    }
</script>

<style lang="scss" scoped>

</style>