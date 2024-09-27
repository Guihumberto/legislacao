<template>
    <div class="d-flex">
        <div>
            <small>Total de Leis: </small><br>
            <small>Total de Páginas: </small><br>
            <small>Total de Consultas:</small>
        </div>
        <div class="ml-5">
            <small>{{ totalLaw }} </small><br>
            <small>{{ totalPages }} </small><br>
            <small> {{ totalConsultas }} </small>
        </div>
    </div>
</template>

<script>
    import { useConsultaStore } from '@/store/ConsultaStore'
    const consultaStore = useConsultaStore()  

    export default {
        computed:{
            totalLaw(){
                return consultaStore.readTotalLaws
            },
            totalPages(){
                return consultaStore.readTotalPages
            },
            totalConsultas(){
                return consultaStore.readTotalConsulta
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>