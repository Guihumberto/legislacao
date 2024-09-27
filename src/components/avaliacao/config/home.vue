<template>
    <section>
        <div class="container">
            <h1><v-icon class="mr-2" size="2.2rem">mdi-tools</v-icon>Configurações</h1>
            <div class="tab">
                <sidebar @menuSelect="menuSelect = $event" />
                <div class="dados">
                    <v-icon class="imgcent">mdi-tools</v-icon>
                    <avaliacao v-if="menuSelect == 1" />
                    <criterios v-if="menuSelect == 2" />
                    <inicial v-if="menuSelect == 3" />
                    <acessos v-if="menuSelect == 4" />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import sidebar from '@/components/avaliacao/config/sidebar.vue'
    import avaliacao from '@/components/avaliacao/config/menus/avaliacao.vue'
    import criterios from '@/components/avaliacao/config/menus/criterios.vue'
    import inicial from '@/components/avaliacao/config/menus/pagstart.vue'
    import acessos from '@/components/avaliacao/config/menus/acessos.vue'


    export default {
        components: { sidebar, avaliacao, criterios, inicial, acessos },
        data: () => ({
            menuSelect: 1
        }),
        created(){
            let route = parseInt(this.$route.query.menu)
            this.menuSelect = route
        }
    }
</script>

<style lang="scss" scoped>
.container{
    color: #212121;
    min-height: calc(100vh - 550px);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: flex-start;
    align-items: flex-start;
}
.tab{
    display: flex;
}
.menuConfig{
    min-width: 300px;
}
.dados{
    position: relative;
    width: 700px;
    border: 1px solid rgb(205, 197, 197);
    padding: 1rem;
    min-height: 500px;
    z-index: 1;
}
.imgcent{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    font-size: 15rem;
    color: rgb(237, 231, 231);
}
</style>