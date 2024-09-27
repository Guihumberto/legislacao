<template>
    <v-navigation-drawer v-model="drawer" app color="white" mini-variant mini-variant-width="80">
        <v-avatar class="d-block text-center mx-auto mt-4 mb-2" size="60" rounded="0">
            <v-img src="../../assets/brasao.png"></v-img>
        </v-avatar>
        <h3 class="text-center">Secretária da Fazenda do Estado do Maranhão</h3>
        <v-divider class="mx-3 my-5"></v-divider>
        <div style="position: absolute; bottom: 20px; margin-left: auto; margin-right: auto; left: 0; right: 0; text-align: center;">
            <v-avatar class="d-block text-center mx-auto" rounded="0">
            <v-icon color="primary">mdi-poll</v-icon>
        </v-avatar>
            <h3 class="text-center">Avaliação de Desempenho Individual</h3>
            <router-link class="text-black border px-2" to="/avaliacao">Início</router-link> 
        </div>
    </v-navigation-drawer>
</template>

<script>
    export default {
        data(){
            return{
                selectdItem: 0,
                drawer: true, 
                items:[
                    {icon: 'mdi-home'},
                    {icon: 'mdi-home'},
                    {icon: 'mdi-home'}
                ]
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>