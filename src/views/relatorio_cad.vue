<template>
    <section>
        <div v-if="login" class="wrapper">
            <div class="containera" >
                <login :flutuante="true" />
                <boxAdmin />
            </div>
        </div>
        <div class="container" v-else>
            <div class="d-flex justify-space-between align-center">
                <div class="d-flex align-center">
                    <h2>Relatório</h2>
                </div>
                <div class="d-flex">
                    <create />
                    <div class="d-flex justify-space-around align-center">
                        <v-menu>
                            <template v-slot:activator="{ props }">
                                <v-btn
                                color="grey"
                                density="comfortable"
                                variant="text"
                                icon="mdi-dots-vertical-circle-outline"
                                v-bind="props"
                                class="ml-2"
                                >
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item
                                    :prepend-icon="item.icon"
                                    v-for="(item, index) in items"
                                    :key="index"
                                    :value="index"
                                    @click="action(item.id)"
                                >
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </div>
                </div>
            </div>
            <load v-if="readLoad" />
            <div v-else>
                <v-card>
                    <v-tabs
                        v-model="tab"
                    >
                        <v-tab value="one">Relatório 1</v-tab>
                        <v-tab value="dois">Relatório 2</v-tab>
                    </v-tabs>

                    <v-card-text>
                        <v-tabs-window v-model="tab">
                            <v-tabs-window-item v-if="tab == 'one'">
                                <lista />
                            </v-tabs-window-item>
                            <v-tabs-window-item v-if="tab == 'dois'">
                                <lista_nova />
                            </v-tabs-window-item>
                        </v-tabs-window>
                    </v-card-text>
                </v-card>
            </div>
        </div>
    </section>
</template>

<script>
    import login from '@/components/avaliacao/login/login.vue'
    import boxAdmin from '@/components/avaliacao/login/rec_hum.vue'


    import lista from '@/components/avaliacao/relatorio/lista.vue'
    import lista_nova from '@/components/avaliacao/relatorio/lista_nova.vue'
    import load from '@/components/avaliacao/parciais/loading.vue'
    import create from '@/components/avaliacao/relatorio/createServidor.vue'

    import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
    const avaliacaoStore = useAvaliacaoStore() 

    import { useGeralStore } from '@/store/GeralStore'
    const geralStore = useGeralStore()

    export default {
        components:{
            login, boxAdmin, lista, load, create, lista_nova
        },
        data(){
            return{
                items: [
                    { id: 1, icon: 'mdi-text-box-multiple-outline', title: 'Relatório' },
                    { id: 2, icon: 'mdi-plus-circle', title: 'Incluir Servidor' },
                    { id: 3, icon: 'mdi-tools', title: 'Configurações' },
                    { id: 4, icon: 'mdi-logout', title: 'Sair' },

                ],
                tab: "one",
            }
        },
        computed:{  
            readLoad(){
                return avaliacaoStore.readLoad
            },
            login(){
                const ava = avaliacaoStore.readLogin.id
                if(ava && avaliacaoStore.readLogin.perfil == 5){
                    avaliacaoStore.cargaIncialrelatorio()
                    return false
                }
                    return true
            }
        },
        methods:{
            action(id){
                if(id == 3) {
                    window.open('configuracoes', '_blank');
                }
                if(id == 4) avaliacaoStore.limpar()
                
            }
        },
        created(){
            avaliacaoStore.loadUserData()
            geralStore.changeTitleApp({title:'Avaliação', to:'/avaliacao'})
        }
    }
</script>

<style lang="scss" scoped>
section{
    min-height: 64vh;
}
.wrapper{
    display: grid;
    place-items: center;
    height: 50vh;
}
.containera{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 800px;
}
.login{
    padding: 2rem;
    min-height: 350px;
    width: 48%;
    text-align: center;
    border: 1px solid #d2d2d7;
    border-radius: 16px;
    background: #e4eef1;
    transition: 1s ease;
}
.central{
    height: 100%;
    margin: 0;
    display: grid;
    place-items: center;
}
.box{
    line-height: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.login{
    transition: 1s ease;
    animation: slideLeft 1s ease-in;
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