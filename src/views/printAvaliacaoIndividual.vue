<template>
    <section>
        <div class="container2">
            <div class="d-flex justify-space-between">
                <v-btn prepend-icon="mdi-arrow-left" variant="text" class="btnPrint mr-2" @click="goTo()">voltar</v-btn>
                <v-btn variant="outlined" class="btnPrint" @click="printPage()">Imprimir</v-btn>
            </div>
            <div class="titleCabecalho">
                <div>
                    <img class="imgPrint" src="../assets/brasao.png" alt="">
                </div>
                <h2 class="my-5">Avaliação Individual de Desempenho</h2>
            </div>
            <div class="w-100">
                <div class="title-head">
                    <div class="text-title">
                    <span class="font-weight-bold">Avaliador:</span>  {{ cpf }}<br> 
                    <span class="font-weight-bold">Avaliado:</span> {{ servidor.nome }}<br>
                    <span class="font-weight-bold">Data da Avaliação:</span> {{ formatteDate(avaliacaoServidor.dateFirstAvaliation) }}<br>
                    </div>
                    <div class="icon-nota">
                    <v-icon :color="avaliacaoFinal.color" size="5rem">{{ avaliacaoFinal.icon }}</v-icon>
                    <v-chip :color="avaliacaoFinal.color">{{ avaliacaoFinal.name }}</v-chip>
                    </div>
                </div>
                <div class="mt-5 ml-2 font-weight-medium">
                    Nota média da avaliação: {{notaMedia}} <br> <br>
                </div>
                <v-list class="listNota pa-0 bg-transparent">
                    <v-list-item v-for="item, i in avaliacaoServidor.criterios" :key="i" link>
                        {{ item.id }} - {{ criteriosFind(item.id) }}
                        <template v-slot:append>
                            {{ item.nota }}
                        </template>
                    </v-list-item>
                </v-list>
                <div class="border mt-5 pa-2">
                    <h3 class="font-weight-medium">Comentários:</h3>
                    <p v-if="avaliacaoServidor.comments" v-text="avaliacaoServidor.comments"></p>
                    <p v-else>Não foi deixado comentário para essa avaliação</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
    const avaliacaoStore = useAvaliacaoStore() 

    import moment from 'moment'
    import 'moment/locale/pt-br'


    export default {
        data(){
            return{
                 search: '',
                 servidor: {},
                 myAvaliation: false,
            }
        },
        computed:{
        isExistAvaliation(){
            return !!this.avaliacaoServidor
        },
        avaliacaoServidor(){
            const servidor = this.todasAvaliacoes.find(x => x.idServidor == this.servidor.id)
            return servidor
        },
        criterios(){
            return avaliacaoStore.readCriterios.sort((a, b) => a.id - b.id)
        },
        notaMedia(){
            let notalist = this.avaliacaoServidor.criterios.map( x=> parseInt(x.nota))
            let soma = notalist.reduce((acc, valorAtual) => acc + valorAtual, 0)
            return soma
        },
        avaliacaoFinal(){
          let name
          let icon
          let color
          let score = this.notaMedia

          switch(true){
            case (score <= 20):
              name = 'Crítico'
              icon = 'mdi-emoticon-cry-outline'
              color = 'red-accent-2'
              break
            case (score <= 40):
              name = 'Baixo'
              icon = 'mdi-emoticon-sad-outline'
              color = 'red-accent-1'
              break
            case (score <= 60):
              name = 'Regular'
              icon = 'mdi-emoticon-neutral-outline'
              color = 'deep-purple-lighten-5'
              break
            case (score <= 80):
              name = 'Bom'
              icon = 'mdi-emoticon-happy-outline'
              color = 'green-accent-1'
              break
            case (score <= 100):
              name = 'Ótimo'
              icon = 'mdi-medal-outline'
              color = 'green-accent-2'
              break
            default:
              name = '-'
              icon = 'mdi-help'
              color = 'green-lighten-5'
          }
          return {name, icon, color}
        },
        todasAvaliacoes(){
          return avaliacaoStore.allAvaliations
        },
        cpf(){
            return avaliacaoStore.completarComZeros(this.avaliacaoServidor.idAvaliador)
        },
        isShowAvaliationServidor(){
          avaliacaoStore.showAvaliacaoFinalizadaServidor(this.avaliacaoServidor.idAvaliador)
          return avaliacaoStore.readIsFinalizada
           
        }
        },
        methods:{
            criteriosFind(item){
                return this.criterios.find(x => x.id == item).name
            },
            formatteDate(item){
            return moment(item).locale('pt-br').format('DD/MM/YYYY')
            },
            printPage() {
                window.print();
            },
            goTo(){
                this.$router.push('/avaliacao')
            },
            async localizarServidor(id){
                this.servidor = await avaliacaoStore.findServidorElastic(id)
                this.servidor = this.servidor.data._source 
            }
        },
        created(){
            this.localizarServidor(this.$route.params.id)
        }
    }
</script>

<style lang="scss" scoped>
.container2{
    width: min(800px, 100%);
    margin: 0 auto;
    min-height: calc(100vh - 550px);
}
.titleCabecalho{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.spanTag{
    font-weight: 700;
}
.btnPrint{
    margin-top: 2rem;
}
.imgPrint{
    height: 130px;
    margin-right: 2rem;
}
@media print {
    .btnPrint {
        display: none;
    }
}

.listNota{
    border: 1px solid rgb(214, 211, 211);

  }
  .title-head{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgb(214, 211, 211);
    padding: .4rem 1rem;
  }
  .title-head .icon-nota{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .text-title{
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.667;
    letter-spacing: 0.0333333333em;
  }
  .myAvaliation{
    opacity: 1;
    /* animation: colorChange 1s ease-in-out forwards; */
  }
  @keyframes colorChange {
    from{
      background: rgb(116, 197, 109);
      opacity: 0;
      transform: translateX(40px);
    }
    to {
      background: rgb(213, 211, 211);
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>