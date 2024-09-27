<template>
    <div>
      <div  v-if="myAvaliation && isExistAvaliation && isShowAvaliationServidor">
        <v-tooltip text="Sua avaliação foi realizada" model-value="true">
          <template v-slot:activator="{ props }">
            <v-btn 
              v-bind="props"
              prepend-icon="mdi-star"
              variant="text"
              color="success"
              elevation="0"
              title="Ver a avaliação"
              @click="dialog = true"
              class="myAvaliation"
            >
            Minha Avaliação
            </v-btn>
          </template>
        </v-tooltip>
      </div>
      <v-btn 
        v-if="!myAvaliation"
        variant="text"
        color="grey"
        icon="mdi-list-box"
        title="Ver a avaliação"
        @click="dialog = true">
      </v-btn>
      <v-dialog
        v-model="dialog"
        width="auto"
      >
      <v-card
          width="800"
          prepend-icon="mdi-calendar-check"
          title="Avaliação"
        >
        <v-card-text
          :class="toggle_exclusive == 0 ? 'changeclass' : 'changeclass2'"
        >
          <v-btn-toggle 
            v-model="toggle_exclusive"
            divided
            variant="outlined"
            class="mb-2"
          >
          <v-btn>
            1º Ciclo
          </v-btn>

          <v-btn>
            2º Ciclo
          </v-btn>
        </v-btn-toggle>
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
        </v-card-text>
        <template v-slot:actions>
          <div class="text-right w-100 mx-5">
            <v-btn
              text="Fechar"
              @click="dialog = false"
              color="grey"
            ></v-btn>
            <v-btn
              class="ml-2"
              text="Imprimir"
              @click="goTo()"
            ></v-btn>
          </div>
        </template>
      </v-card>
    </v-dialog>
      
    </div>
  </template>
  <script>
  import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
  const avaliacaoStore = useAvaliacaoStore() 

  import moment from 'moment'
  import 'moment/locale/pt-br'

  export default {
    props:{
        servidor: Object,
        myAvaliation: Boolean
    },
    data () {
      return {
        dialog: false,
        avalia: '',
        toggle_exclusive: 1,
      }
    },
    computed:{
        isExistAvaliation(){
            return !!this.avaliacaoServidor
        },
        avaliacaoServidor(){

            let servidor = this.todasAvaliacoes.filter(x => x.idServidor == this.servidor.id)
            
            if(!this.toggle_exclusive){
              servidor = servidor.find(x => x.periodo == '05/2024')
            } else {
              servidor = servidor.find(x => x.periodo == '08/2024')
            }
            
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
        goTo(){
          this.$router.push(`avaliacao/printavaliacao/${this.servidor.id}`)
        },
        changeClass(){
          console.log('mudou');
        }
    }
  }
</script>

<style scoped>
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
  .changeclass {
    background: rgb(225, 218, 218);
    transition: .5s ease-in-out;
    animation: mariaddd 1s ease-in;
  }
  .changeclass2 {
    background: rgb(236, 236, 238);
    transition: .5s ease-in-out;
    animation: mariaddd .5s ease-in;
  }

  @keyframes mariaddd {
    0%{
      background: rgb(236, 236, 238);
      opacity: 0;
    }
    100% {
      background: white;
      opacity: 1;
    }
  }
</style>