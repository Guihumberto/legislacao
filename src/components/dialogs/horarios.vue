<template>
  <v-dialog width="500">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" variant="tonal"><v-icon class="mr-2">mdi-clock-time-eight-outline</v-icon>Horário</v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Horário de Funcionamento" subtitle="Atendimento ao público">
        <v-card-text>
          <div class="d-flex justify-center">
            <v-icon class="mr-2">mdi-clock-time-eight-outline</v-icon>
            <h5>Segunda a Sexta <br>13:00h às 19:00h</h5>
          </div>
        </v-card-text>

        <v-card-actions class="text-center text-grey mx-auto">
          <v-btn
            text="Dúvidas Frequentes"
            @click="goTO('https://sistemas1.sefaz.ma.gov.br/portalsefaz/jsp/pagina/pagina.jsf?codigo=6621')"
          ></v-btn>
          <v-btn
            text="Atendimento"
            @click="goTO('https://sistemas1.sefaz.ma.gov.br/portalsefaz/jsp/pagina/pagina.jsf?codigo=6621')"
          ></v-btn>
          <v-btn
            text="Contatos"
            @click="goTO('https://sistemas1.sefaz.ma.gov.br/portalsefaz/jsp/pagina/pagina.jsf?codigo=1511')"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
  export default {
    methods:{
      goTO(item){
        window.open(item, '_blank');
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
