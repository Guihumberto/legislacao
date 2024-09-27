<template>
     <div class="content">
        <div class="d-flex align-center justify-space-between">
            <h2>Acessos</h2>
            <addperfil @carregar="getServidoresAdm(false)" />
        </div>
        <v-list>
            <v-list-item v-for="item, i in listServidores" :key="i">
                <template v-slot:prepend>
                    <v-icon>mdi-account</v-icon>
                </template>
                <div>
                    {{ item._source.nome }} - {{ item._source.matricula }} <br>
                    {{ item._source.id }} - {{ item._source.lotacao }}

                </div>
                <template v-slot:append>
                    <v-icon>mdi-account</v-icon>
                    <v-btn variant="icon" icon="mdi-delete" color="red" @click="removePerfil(item._source)"></v-btn>
                </template>
            </v-list-item>
        </v-list>
    </div>
</template>

<script>
import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
const avaliacaoStore = useAvaliacaoStore() 

import addperfil from '@/components/avaliacao/config/menus/addPefil.vue'

    export default {
        components:{ addperfil },
        data(){
            return{
                listServidoresAdm: []
            }
        },
        computed:{
            listServidores(){
                return this.listServidoresAdm
            }
        },
        methods:{
            async getServidoresAdm(ref){
                if(ref) {
                    const resp = await avaliacaoStore.searchAdmServidores()
                    this.listServidoresAdm = resp
                } else {
                    setTimeout(async ()=> {
                        const resp = await avaliacaoStore.searchAdmServidores()
                        this.listServidoresAdm = resp
                    }, 1000)
                }
            },
            async removePerfil(servidor){
                servidor.perfil = 1
                avaliacaoStore.updatePerfil(servidor)
                this.getServidoresAdm(false)
            }
        },
        created(){
            this.getServidoresAdm(true)
        }
    }
</script>

<style lang="scss" scoped>
.content{
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>