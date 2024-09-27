<template>
    <section>
        <div class="container">
            <headLista :gestor="gestor" :equipe="listAll" />
            <div class="lista" v-if="isGestor && readCicloAvaliation.referencia && !finalizado">
                <v-list class="bg-transparent" id="item-list">
                        <v-list-item class="bg-blue-grey-lighten-4 text-grey-darken-2" key="a">
                            <template v-slot:prepend>
                                <v-icon size="2.5rem">mdi-account-group-outline</v-icon>
                            </template>
                            <h2>Equipe</h2>
                            <template v-slot:append>
                                <add v-if="!isFinalizada" />         
                                <resumo />
                            </template>
                        </v-list-item>
                        <v-list-subheader v-if="listAll.length">{{listAll.length}} servidor<span v-if="listAll.length > 1">es</span> na equipe</v-list-subheader>
                        <v-list-item class="py-2" v-if="listAll.length" v-for="item, i in listAll" :key="i" link :color="idDelete == item.id ? 'red' : 'bg-blue-grey-lighten-4'">
                            <template v-slot:prepend>
                                <v-icon class="icon_list" size="2.5rem">mdi-account-tie</v-icon>
                            </template>
                            <div class="dados_lista">
                                {{ item.nome }} - {{ item.matricula }} <br>
                                <span class="cargo_list"><b>Cargo:</b> {{ item.cargo }} </span>
                            </div>
                            <template v-slot:append v-if="readLoad">
                               <v-btn color="grey" class="my-5" loading></v-btn>
                            </template>
                            <template v-slot:append v-else-if="idDelete != item.id">
                                <div v-if="!item.nota" class="d-flex align-center">
                                    <avaliar :servidor="item" />
                                    <v-btn 
                                    title="Excluir do servidor da equipe"
                                    @click="deleteSet(item)"
                                    variant="text" color="red" icon="mdi-delete">
                                </v-btn>
                                </div>
                                <div v-else class="d-flex justify-end align-center">
                                    <notaFinal :servidor="item" />
                                    <nota :servidor="item" />
                                    <edit :servidor="item" v-if="!readAvaliacaoFinalizada" />
                                    <deleteAvaliacao :servidor="item" v-if="!readAvaliacaoFinalizada" />
                                </div>
                            </template>
                            <template v-slot:append v-else>
                                <v-btn @click="idDelete = ''" variant="text">Cancelar</v-btn>
                                <v-btn class="my-4" flat color="error" @click="apagar(item)">Excluir</v-btn>
                            </template>
                        </v-list-item>
                        <alert v-else :alerta="readAlerta" key="b"/>
                </v-list>
            </div>
            <erroDialog :erroDialog="erroDialog" />
        </div>
    </section>
</template>

<script>
    import avaliar from '@/components/avaliacao/avaliar'
    import add from '@/components/avaliacao/addServidor.vue'
    import edit from '@/components/avaliacao/edit.vue'
    import nota from '@/components/avaliacao/nota.vue'
    import notaFinal from '@/components/avaliacao/parciais/notafinal.vue'
    import headLista from '@/components/avaliacao/parciais/headLista.vue'
    import alert from '@/components/avaliacao/parciais/alertas.vue'
    import resumo from '@/components/avaliacao/relatorio/resumo.vue'
    import erroDialog from '@/components/avaliacao/parciais/erroDialog.vue'
    import deleteAvaliacao from '@/components/avaliacao/relatorio/deleteAvaliacao.vue'

    import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
    const avaliacaoStore = useAvaliacaoStore() 

    export default {
        components:{
            avaliar, add, edit, nota, notaFinal, headLista, alert, resumo, erroDialog, deleteAvaliacao
        },
        data(){
            return{
                idDelete: '',
                erroDialog: false
            }
        },
        computed:{
            listaEquipe(){
                let equipe = avaliacaoStore.readEquipe.equipe
                if(equipe.length){
                    equipe = [...new Set(equipe)]
                }
                return equipe
                
            },
            listaAllServidores(){
                return avaliacaoStore.readServidores
            },
            listAll(){
                let lista = []
                this.listaAllServidores.forEach( x => {
                    this.listaEquipe.forEach( eq => {
                        if(x.id == eq){
                            x.nota = this.listServidoresAvaliados.includes(x.id)
                            lista.push(x)
                        }
                    })
                });

                return lista.sort(this.sortName)
            },
            gestor(){
                return avaliacaoStore.readLogin
            },
            listServidoresAvaliados(){
                let list = avaliacaoStore.readAllAvaliationsServidoresEquipe

                if(list.length){
                    list = list.map(x => x.idServidor)
                }
                return list
            },
            readAlerta(){
                return {text: 'Adicione servidores para iniciar as avaliações.' , icon: 'mdi-bullhorn-variant', color: 'orange-darken-4' }
            },
            readLoad(){
                return avaliacaoStore.readLoad
            },
            readAvaliacaoFinalizada(){
                return avaliacaoStore.readFinalizar
            },
            isFinalizada(){
                return avaliacaoStore.readFinalizar
            },
            isGestor(){
                return this.gestor.Gestor === false
                ? false
                : true
            },
            readCicloAvaliation(){
                return avaliacaoStore.readDadosNewAvaliation 
            },
            finalizado(){
                return avaliacaoStore.readPeriodoEncerrado
            }
        },
        methods:{
            deleteSet(item){
                this.idDelete = item.id
            },
            async apagar(item){
                let lista = this.listaEquipe
                
                if(await avaliacaoStore.findAvaliacaoPorCpf(item.id)){
                    const errorMsg = 'Não é posssível excluir servidor(a) avaliado(a)'
                    this.erroDialog = true
                    return 
                }

                lista = lista.filter(x => x != item.id)

                const data = {
                    idGestor: this.gestor.id,
                    equipe: lista
                }
                avaliacaoStore.excluirIdEquipe(data)
                this.idDelete = ''
            },
            toLink(){
                window.open('avaliacao/resumo', '_blank');
            },
            sortName(a, b) {
                if (a.nome < b.nome) {
                    return -1;
                }
                if (a.nome > b.nome) {
                    return 1;
                }
                return 0;
            }
        },
        created(){
            // avaliacaoStore.findAllAvaliacaoGestor()
        }
    }
</script>

<style lang="scss" scoped>
.container{
    min-height: 60vh;
    color: #212121;
}
.lista{
    min-height: 20vh;
    border: 1px grey solid;
    padding: 1rem;
    border-radius: 12px;
    color: #212121;
    transition: 1s ease;
    animation: aparecer .5s ease-in;
}
@keyframes aparecer {
    0%{
        transform: translateY(20px);
        opacity: 0;
    }
    100%{
        transform: translateY(0px);
        opacity: 1;
    }
}
@media (max-width: 500px) {
    .icon_list, .cargo_list{
        display: none;
    }
}
</style>