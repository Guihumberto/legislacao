<template>
    <v-dialog
      v-model="dialog"
      width="auto"
    >
      <v-card
        max-width="400"
        prepend-icon="mdi-alert-box"
        text="Não é possível excluir servidor da equipe com avaliação realizada."
        title="Notificação"
      >
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Fechar"
            @click="dialog = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
</template>

<script>
    export default {
        data(){
            return{
                dialog: false
            }
        },
        props:{
            erroDialog: Boolean
        },
        watch:{
            erroDialog(ante, depois){
                this.dialog = this.erroDialog
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>