<template>
    <div class="header_av">
        <div class="d-flex justify-space-between align-center">
            <div>
                <h3 class="d-flex align-center"> 
                    <v-icon class="mr-1" size="1.5rem">{{titleMenu.icon}}</v-icon>
                    {{titleMenu.title}}
                </h3>
                <small class="d-flex"><editGestor :servidor="gestor" /></small> 
            </div>
            <nota :servidor="gestor" :myAvaliation="true" />
            <v-btn 
                title="Sair da sessão"
                variant="text" color="red" @click="limpar"> <v-icon>mdi-logout</v-icon>sair</v-btn>
        </div>
        <div>
            <span class="font-weight-bold">Nome:</span> {{ gestor.nome }}<br>
            <span class="font-weight-bold">Cargo:</span> {{ gestor.cargo}}<br>
            <span class="font-weight-bold">Unidade:</span> {{gestor.lotacao}}<br>
            <edit-perfil :servidor="gestor" />
            <div class="concluir d-flex align-center justify-center mt-2" v-if="readEquipe.total > 1 && !isFinalizada && !finalizado">
                <concluidos :concluidos="readEquipe" />
                <v-sheet
                    class="d-flex align-center px-2 py-2 mr-2"
                    color="primary"
                    min-width="50"
                    rounded="lg"
                    v-if="!readConcluir"
                >
                <v-btn 
                    :disabled="readConcluir" color="white" class="text-white" 
                    variant="outlined"
                    @click="finalizarAvaliacao()">Finalizar
                    <v-tooltip
                        activator="parent"
                        location="bottom"
                    >Envia a avaliação para o ASRHU <br>e disponibiliza para o avaliado</v-tooltip>
                </v-btn>
                </v-sheet>
            </div>
            <v-alert type="success" variant="tonal" v-if="isFinalizada  && !finalizado" class="mt-5 concluir">
                Avaliação concluída
                <template v-slot:append>
                    <v-btn variant="text" @click="editAvaliacaoFinalizada()">
                        Reabrir avaliação
                        <v-tooltip
                        activator="parent"
                        location="bottom"
                    >Reabertura da avaliação do {{ nameCiclo }} Ciclo <br>
                    disponível até o dia. {{ readDataLimite }}</v-tooltip>
                </v-btn>
                </template>
            </v-alert>
            <div class="ciclo concluir" v-if="readCicloAvaliation.referencia && !finalizado">
                <p class="font-weight-bold">{{nameCiclo}} Ciclo de Avaliação</p>
                <span class="prazoFinal">Prazo Final para Avaliação:
                     <span class="font-weight-bold">{{ readDataLimite }}.</span>
                </span>
            </div>
        </div>
        <v-dialog
            v-model="dialog"
            max-width="600"
            persistent
        >
        <satisfacao @fechardialog="dialog = false" />
        </v-dialog>
    </div>
</template>

<script>
    import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
    const avaliacaoStore = useAvaliacaoStore() 

    import nota from '@/components/avaliacao/nota.vue'
    import concluidos from '@/components/avaliacao/elements/progressAvaliation.vue'
    import editPerfil from '@/components/avaliacao/parciais/editPerfil.vue'
    import editGestor from '@/components/avaliacao/parciais/editGestorPerfil.vue'
    import satisfacao from '@/components/avaliacao/parciais/pesquisaSatisfacao.vue'

    export default {
        components:{
            nota, concluidos, editPerfil, editGestor, satisfacao
        },
        data(){
            return{
                concluir: false,
                dialog: false
            }
        },
        props:{
            gestor: Object,
            equipe: Array
        },
        methods:{
            limpar(){
                avaliacaoStore.limpar()
            },
            finalizarAvaliacao(){
                this.concluir = true
                avaliacaoStore.finalizarAvaliacaoEquipe(this.gestor)
                setTimeout(()=> {
                    this.dialog = true
                }, 1000)
            },
            editAvaliacaoFinalizada(){
                avaliacaoStore.finalizarAvaliacaoDelete()
            }
        },
        computed:{
            readDataLimite(){
                return avaliacaoStore.converter(avaliacaoStore.readDadosNewAvaliation.enddate) 
            },
            readCicloAvaliation(){
                return avaliacaoStore.readDadosNewAvaliation 
            },
            readEquipe(){
                let equipe = this.equipe
                let avaliados = equipe.filter(x => x.nota)
                return {total: equipe.length, avaliados: avaliados.length}
            },
            readConcluir(){
                if(this.readEquipe.avaliados == this.readEquipe.total){
                    return false
                }
                return true
            },
            isFinalizada(){
                return avaliacaoStore.readFinalizar
            },
            nameCiclo(){
                return avaliacaoStore.nameCiclo
            },
            titleMenu(){
                return this.gestor.Gestor === false
                ? { title: 'Servidor', icon: 'mdi-account'}
                : { title: 'Avaliador', icon: 'mdi-medal-outline'}

            },
            finalizado(){
                return avaliacaoStore.readPeriodoEncerrado
            }
        },
        created(){
            avaliacaoStore.getAvaliacaoFinalizada()
        }
    }
</script>

<style lang="scss" scoped>
.header_av{
    padding: 2rem;
    border: 1px solid grey;
    border-radius: 12px;
    margin-bottom: 2rem;
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
.header_av h3{
    font-size: 1.5rem;
    font-weight: 500;
}
.concluir{
    animation: aparecer 1s ease-in;
}
.ciclo{
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 1rem;
}
</style>