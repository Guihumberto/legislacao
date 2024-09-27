<template>
    <div class="text-center">
      <v-btn title="Editar Avaliação" variant="text" @click="dialog = true" flat color="warning" icon="mdi-note-edit">
      </v-btn>
  
      <v-dialog
        v-model="dialog"
        width="auto"
      >
        <v-card
          max-width="800"
        > 
          <v-card-title class="d-flex justify-space-between align-center">
            <h3 class="d-flex align-center"> <v-icon class="mr-2"  size="1.5rem">mdi-chart-box-outline</v-icon> Editar Avaliação</h3>
            <v-btn @click="dialog = false" variant="text" title="fechar"><v-icon>mdi-close</v-icon></v-btn>
          </v-card-title>
          <v-card-text>
            <div class="avaliado">
              <h3>Avaliado</h3>
              <headerAvaliacao :servidor="servidor" />
            </div>
          </v-card-text>
          <v-card-text v-if="!confirmation">
            <v-alert  title="Atenção" type="warning"> <p v-html="readInfoTitle.instructions"></p></v-alert>
            <div v-for="item, i in criterios" :key="i" class="criterios">
              <div class="d-flex justify-start align-center">
                <v-icon class="mr-2">{{ item.icon }}</v-icon>
                <h3>{{item.name}}</h3>
              </div>
              <p>{{ item.desc }}</p>
              <div class="mt-2">
                  <v-slider
                    v-model="item.nota"
                    :color="color(item.nota)"
                    :min="item.min"
                    :max="item.max"
                    :step="1"
                    class="align-center"
                    track-color="grey"
                    hide-details
                  >
                    <template v-slot:append>
                      <span
                        class="text-h2 font-weight-light nota"
                        v-text="item.nota"
                      ></span>
                    </template>
                  </v-slider>
              </div>
            </div>
            <div>
              <v-alert type="warning" v-if="clearsCriterios">
                Há critérios ainda não avaliados.
              </v-alert>
            </div>
          </v-card-text>  
          <v-card-text v-else>
            <div>
              <painelAvaliacao :score="avaliacaoFinal" />
              <v-textarea 
                v-model="comments" 
                label="Comentário" 
                placeholder="Deixe seu comentário sobre a avaliação (opcional)">
              </v-textarea>
            </div>
          </v-card-text>
          
          <v-card-actions class="d-flex justify-end bg-grey" >
            <v-btn @click="dialog = false" v-if="!confirmation">Fechar</v-btn>
            <v-btn @click="confirmation = false" v-else>Voltar</v-btn>
            <v-btn color="primary" variant="flat" @click="saveElastic()" :disabled="clearsCriterios" v-if="confirmation">Editar</v-btn>
            <v-btn color="teal" variant="flat" @click="confirmation = true" :disabled="clearsCriterios" v-else>Continuar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  <script>
  import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
  const avaliacaoStore = useAvaliacaoStore() 

  import painelAvaliacao from '@/components/avaliacao/parciais/painelAavaliacao.vue'
  import headerAvaliacao from '@/components/avaliacao/parciais/headAvaliacao.vue'

  export default {
    components:{ painelAvaliacao, headerAvaliacao },
    props:{
      servidor: Object
    },
    data () {
      return {
        dialog: false,
        comments: '',
        confirmation: false,
        criterios: []
      }
    },
    watch:{
      dialog(ante, depois) { this.updateComments(), this.criteriosFunction()}
    },
    computed:{
      acriterios(){
        return avaliacaoStore.readDadosCriterios.sort((a, b) => a.id - b.id)
      },
      saveCriterio(){
        const list = this.criterios.map(({ id, nota}) => ({ id, nota}))
        return list
      },
      clearsCriterios(){
        let list = this.criterios.map(x => x.nota)
        list = list.filter(x => x === '')
        return !!list.length
        ? true
        : false
      },
      comentarios(){
        let list = this.avaliacaoServidor.comments
        return list
      },
      notaMedia(){
          let notalist = this.criterios.map( x=> parseInt(x.nota))
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
          return {name, icon, color, score}
      },
      avaliacaoServidor(){
        return this.todasAvaliacoes.find(x => x.idServidor == this.servidor.id)
      },
      todasAvaliacoes(){
        return avaliacaoStore.allAvaliations
      },
      readInfoTitle(){
          return avaliacaoStore.readPageInitial
      },
    },
    methods:{
      color (item) {
        if (item < 3) return 'red'
        if (item < 5) return 'orange'
        if (item < 8) return 'teal'
        if (item < 11) return 'green'
        return 'primary'
      },
      saveElastic(){
        let criterios = [ ...this.saveCriterio ]
        let comments = this.comments
        let idAvaliador = avaliacaoStore.readLogin.id
        let idServidor = this.servidor.id

        const userAvaliado = {
          idAvaliador,
          idServidor,
          criterios,
          comments,
          dateFirstAvaliation: this.avaliacaoServidor.dateFirstAvaliation,
          idu: this.avaliacaoServidor.idu,
          updateDate: this.avaliacaoServidor.updateDate,
          periodo: this.avaliacaoServidor.periodo
        }
        avaliacaoStore.saveUpdateAvaliacaoServidor(userAvaliado)
        criterios = []
        comments = ''
        idAvaliador = ''
        idServidor = ''
        this.dialog = false
        
        setTimeout(()=>{
          this.confirmation = false
        }, 1000)
      },
      clear(){
        this.comments = ''
      },
      setAavaliacao(){
        avaliacaoStore.foundAvaliationServidor(this.servidor.id)
      },
      updateComments(){
        this.comments = this.comentarios
      },
      clearCriteriosNota(){
        this.acriterios.forEach(x => x.nota = "");
      },
      criteriosFunction(){
        let list = this.avaliacaoServidor.criterios
        this.criterios = []
        this.clearCriteriosNota()
        this.acriterios.forEach( x => {
          list.forEach( y => {
            if(x.id == y.id){
              x.nota = y.nota
              this.criterios.push(x)
            }
          })
        })
      },
    }
  }
</script>
<style scoped>
.avaliado{
  border: 1px solid grey;
  border-radius: 16px;
  margin: 1rem 0;
  padding: 1rem;
}

h3{
  font-size: 1.1rem;
  font-weight: 500;
}
.criterios{
  margin: 1rem 0;
  background: rgb(248, 245, 245);
  padding: .5rem;
}
.nota{
  min-width: 65px;
  text-align: center
}
</style>