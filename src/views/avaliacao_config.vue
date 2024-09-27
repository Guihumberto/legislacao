<template>
    <home />
</template>

<script>
    import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
    const avaliacaoStore = useAvaliacaoStore() 
    import { useGeralStore } from '@/store/GeralStore'
    const geralStore = useGeralStore()


    import home from '@/components/avaliacao/config/home.vue'
    export default {
        components:{ home },
        created() { 
            avaliacaoStore.loadUserData()
            avaliacaoStore.cargaInicial() 
            geralStore.changeTitleApp({title:'Avaliação', to:'/avaliacao'})
        }
    }
</script>

<style lang="scss" scoped>

</style>