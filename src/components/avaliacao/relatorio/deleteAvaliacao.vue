<template>
    <div>
      <v-btn title="Excluir avaliação" color="red" variant="text" flat @click="dialog = true" icon="mdi-file-document-remove-outline">
      </v-btn>
  
      <v-dialog
        v-model="dialog"
        width="auto"
      >
        <v-card
          max-width="400"
          prepend-icon="mdi-delete"
          :text="`Deseja excluir a avaliação do servidor(a) ${servidor.nome}.`"
          title="Excluir avaliação"
        >
          <template v-slot:actions>
            <div class="text-right w-100">
                <v-btn
                  text="Cancelar"
                  @click="dialog = false"
                ></v-btn>
                <v-btn
                  color="error"  
                  text="excluir"
                  @click="deleteAvaliacao(avaliacaoServidor.idu)"
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

    export default {
        data () {
        return {
            dialog: false,
            }
        },
        props:{
            servidor: Object
        },
        computed:{
            todasAvaliacoes(){
                return avaliacaoStore.allAvaliations
            },
            avaliacaoServidor(){
                return this.todasAvaliacoes.find(x => x.idServidor == this.servidor.id)
            }
        },
        methods:{
            deleteAvaliacao(item){
                avaliacaoStore.deleteAvaliacao(item)
                this.dialog = false

            }
        }
    }
</script>

<style lang="scss" scoped>

</style>