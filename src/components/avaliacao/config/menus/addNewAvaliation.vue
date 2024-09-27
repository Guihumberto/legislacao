<template>
    <div class="text-center">
      <v-btn @click="dialog = true" color="success">Nova Avaliação</v-btn>
  
      <v-dialog
        v-model="dialog"
        width="auto"
      >
        <v-card
          max-width="400"
          prepend-icon="mdi-plus"
          text="Crie uma nova avaliação para ser realizada pelos gestores."
          title="Nova Avaliação"
        >
        <v-card-text>
              <v-form @submit.prevent="save()" ref="form">
                <v-text-field
                    label="Referência"
                    variant="outlined"
                    density="compact"
                    v-mask="'##/####'"
                    placeholder="05/2024"
                    prepend-inner-icon="mdi-calendar-blank"
                    v-model="newAvaliation.referencia"
                    :rules="[rules.required, rules.minref]"
                ></v-text-field>
                <v-text-field
                    label="Data de Início"
                    variant="outlined"
                    density="compact"
                    class="my-2"
                    type="date"
                    prepend-inner-icon="mdi-calendar-check"
                    v-model="newAvaliation.startdate"
                    :rules="[rules.required, rules.mindate]"
                ></v-text-field>
                <v-text-field
                    label="Data Fim"
                    variant="outlined"
                    density="compact"
                    type="date"
                    prepend-inner-icon="mdi-calendar-remove"
                    v-model="newAvaliation.enddate"
                    :rules="[rules.required, rules.mindate]"
                ></v-text-field>
                <v-btn block type="submit" color="success">Salvar</v-btn>
            </v-form>
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
  import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
  const avaliacaoStore = useAvaliacaoStore() 
  import {mask} from 'vue-the-mask'
  
  export default {
    directives:{ mask },
    data () {
      return {
        dialog: false,
        newAvaliation: {
          referencia: '',
          startdate: '',
          enddate: '',
          status: false,
        },
        rules:{
            required: (value) => !!value || "Campo obrigatório",
            mindate: (v) => (v||'').length == 10 || "8 dígitos",
            minref: (v) => (v||'').length == 7 || "6 dígitos"
        },
      }
    },
    methods:{
      async save(){
        const { valid } = await this.$refs.form.validate()
        if(valid){
          avaliacaoStore.saveDadosNewAvaliation(this.newAvaliation)
          this.dialog = false
        }
      }
    }
  }
</script>