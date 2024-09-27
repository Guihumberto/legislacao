<template>
    <div class="text-center">
      <v-btn class="ml-2" v-if="servdidoresList.length" @click="dialog = true" icon="mdi-file-pdf-box" color="red" variant="text" flat>
      </v-btn>
  
      <v-dialog
        v-model="dialog"
        width="auto"
      >
        <v-card
          max-width="1500"
          prepend-icon="mdi-update"
          title="Resumo"
        >
        <v-card-text class="contentAreaTab">
            <v-data-table 
              v-model:search="search" 
              :items="servdidoresList" class=text-center>
            </v-data-table>
            <!-- <sendEmail :plan="servdidoresList" /> -->
        </v-card-text>
          <template v-slot:actions>
            <div class="w-100 text-right">
              <v-btn
                class="ms-auto"
                text="Fechar"
                @click="dialog = false"
              ></v-btn>
              <v-btn
                prepend-icon="mdi-printer"
                class="ml-2"
                text="Imprimir"
                variant="outlined"
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

import sendEmail from '@/components/avaliacao/parciais/sendEmail.vue'

  export default {
    components:{sendEmail},
    data () {
      return {
        dialog: false,
        search: ''
      }
    },
    computed:{
        equipe(){
            return avaliacaoStore.readEquipe.equipe
        },
        avaliacaoEquipe(){
            return avaliacaoStore.readAllAvaliationsServidoresEquipe
        },
        servidores(){
            return avaliacaoStore.readServidores
        },
        servdidoresList(){
            let list = []

            this.avaliacaoEquipe.forEach(a => {
                this.servidores.forEach(s => {
                    if(a.idServidor == s.id){
                       let objetct = {
                        matricula: s.matricula,
                        nome: s.nome,
                        Assiduidade: a.criterios[0].nota,
                        Disciplina: a.criterios[1].nota,
                        iniciativa : a.criterios[2].nota,
                        Produtividade: a.criterios[3].nota,
                        Responsabilidade: a.criterios[4].nota,
                        Interacao : a.criterios[5].nota,
                        Relacionamento: a.criterios[6].nota,
                        Total: parseInt(a.criterios[0].nota) + parseInt(a.criterios[1].nota) + parseInt(a.criterios[2].nota) + parseInt(a.criterios[3].nota) + parseInt(a.criterios[4].nota) + parseInt(a.criterios[5].nota) + parseInt(a.criterios[6].nota)
                       }
                       list.push(objetct)
                    }
                })
            })

            return list
        }
    },
    methods:{
      goTo(){
        this.$router.push(`avaliacao/printAvaliacaoEquipe/123`)
      }
    }
  }
</script>

<style scoped>
.contentAreaTab{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>