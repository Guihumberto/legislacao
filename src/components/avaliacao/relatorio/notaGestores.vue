<template>
    <div class="text-center pa-4">
      <v-btn @click="dialog = true">
        Nota Gestores
      </v-btn>
  
      <v-dialog
        v-model="dialog"
        width="auto"
      >
        <v-card
          max-width="700"
          prepend-icon="mdi-update"
          text="Os Gestores de celulas são avaliados a partir da média da nota da equipe avaliada."
          title="Nota dos Gestores de Célula"
        >
        <v-card-text>
            <v-list>
                <v-list-item v-for="item, i in gestores" :key="i" class="border">
                    <div>
                        {{ item.avaliador }} <br> {{ item.nome }}
                    </div>
                    <template v-slot:append>
                        <div>
                            {{ (item.avaliados.reduce((acc, valorAtual) => acc + valorAtual.nota, 0) / item.avaliados.length).toFixed(2) }}  ({{ item.avaliados.length }})
                        </div>
                    </template>
                </v-list-item>
            </v-list>
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
    props:{
        gestores: Array
    }
  }
</script>

<style lang="scss" scoped>

</style>