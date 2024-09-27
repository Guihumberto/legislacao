<template>
    <div class="container">
        <sidebar />
        <sbright />
        <principal />
    </div>
</template>

<script>
import sidebar from '@/components/painel/SideBar.vue'
import sbright from '@/components/painel/SideBarRight.vue'
import principal from '@/components/painel/principal.vue'

import { usePainelStore }  from '@/store/AvaliacaoPainel'
const avaliacaoPainel = usePainelStore()

    export default {
        name: 'Painel',
        components:{
            sidebar, sbright, principal
        },
        created(){
            avaliacaoPainel.cargaInitPainel()
        }
    }
</script>

<style lang="scss" scoped>
.container{
    background: #EEEEEE;
    min-height: 100vh;
}
</style>