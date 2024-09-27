<template>
    <v-dialog
        transition="dialog-top-transition"
        width="500px"
        v-model="ShowTotal"
      >
          <v-card>
            <v-toolbar
              color="primary"
              title="Atualizações 0.0.1"
            ></v-toolbar>
            <v-card-text class="px-10">
              <ul>
                <li>Texto resumo nos resultados da pesquisa.</li>
                <li>Botão de ocultar o texto resumo.</li>
                <li>Seção de "normas adicionadas recentemente" (busca por lei).</li>
                <li>Agregar por norma todos os resultados</li>
                <li>Botão de ajuda</li>
              </ul>
            </v-card-text>
            <v-card-actions>
              <v-checkbox
                v-model="noShow"
                label="Não mostrar mais"
                @click="naoMostrar"
              ></v-checkbox>
              <v-btn
                variant="text"
                @click="dialog = false"
              >Fechar</v-btn>
            </v-card-actions>
          </v-card>
    </v-dialog>
</template>

<script>
    import { useGeneralStore } from '@/store/GeneralStore'
    const generalStore = useGeneralStore()  
    export default {
        data(){
            return{
                dialog: false,
                noShow: false
            }
        },
        computed:{
            show(){
                return generalStore.readShowNews
            },
            ShowTotal(){
                if(this.show && this.dialog){
                    return true
                } else {
                    return false
                }
            }
        },
        methods:{
            naoMostrar(){
                generalStore.changeShowsNews(false)
            },
            activeDialog(){
              setTimeout(()=>{
                this.dialog = true
              }, 2000)
            }
        },
        created(){
          this.activeDialog()
        }

    }
</script>

<style lang="scss" scoped>

</style>