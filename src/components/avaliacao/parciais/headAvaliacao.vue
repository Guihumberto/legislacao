<template>
    <div class="d-flex justify-space-between align-center">
        <div>
            <span class="font-weight-bold">Nome:</span> {{ servidor.nome }} <br>
            <span class="font-weight-bold">CPF:</span> {{ cpf }} <br>
            <span class="font-weight-bold">Cargo:</span> {{ servidor.cargo }} <br>
           
        </div>
        <v-icon color="grey" size="5rem">mdi-account-tie</v-icon>
    </div>
</template>

<script>
    import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
    const avaliacaoStore = useAvaliacaoStore() 

    export default {
        props:{
            servidor: Object
        },
        computed:{
            cpf(){
                return avaliacaoStore.completarComZeros(this.servidor.id)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>