<template>
    <div class="d-flex">
        <div>
            <small>Total de Normas: </small><br>
            <small>Total de Páginas: </small><br>
            <small>Total de Consultas:</small>
        </div>
        <div class="ml-5">
            <small>{{ consultaStore.readTotalLaws }} </small><br>
            <small>{{ consultaStore.readTotalPages }} </small><br>
            <small> {{ consultaStore.readTotalConsulta }} </small>
        </div>
    </div>
</template>

<script setup>
    import { useConsultaStore } from '@/store/ConsultaStore'
    const consultaStore = useConsultaStore()  
</script>

<style lang="scss" scoped>

</style>