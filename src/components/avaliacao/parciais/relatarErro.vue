<template>
    <div class="text-center pa-4">
      <v-btn prepend-icon="mdi-alert-circle" @click="dialog = true" variant="text" color="error" class="text-capitalize">
       <small>Reportar erro</small> 
      </v-btn>
  
      <v-dialog
        v-model="dialog"
        width="auto"
      >
        <v-card
          max-width="400"
          prepend-icon="mdi-alert-circle"
          title="Relatar erro"
        >
        <v-card-text>
            <div class="mb-5">
               <p>Envie um e-mail para central de serviços com tílulo de <span class="font-italic">erro na aplicação de avaliação</span>. 
          <br>Anexe o print do erro para agilizar seu atendimento.
                </p>
            </div>
            <v-btn variant="text" color="primary" prepend-icon="mdi-email" @click="linkUrl()">centraldeservicos@sefaz.ma.gov.br</v-btn>
        </v-card-text>
          <template v-slot:actions>
            <v-btn
              class="ms-auto"
              text="Fechar"
              @click="dialog = false"
            ></v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
  </template>

<script>
  export default {
    data () {
      return {
        dialog: false,
      }
    },
    methods:{
        linkUrl(item){
          window.open('https://correio.sefaz.ma.gov.br/#1', '_blank');
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>