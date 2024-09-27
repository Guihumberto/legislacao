<template>
    <div class="mt-n3">
        Não é gestor?
        <v-btn color="primary" variant="text" @click="dialog = true" class="text-lowercase mb-1 ml-n2">
        Clique aqui
        </v-btn>

        <v-dialog
        v-model="dialog"
        width="auto"
        >
        <v-card
            max-width="400"
            prepend-icon="mdi-update"
            title="Atualizar Perfil"
        >
        <v-card-text class="text-center">
            <div>
                <p class="text-left">Apenas cargos de gestão ou seus substitutos estão aptos a avaliar a equipe.</p>
            </div>
            <v-alert v-if="dadosServidor.Gestor === true" icon="mdi-account-tie" class="my-5"> 
                Seu cargo atual está sinalizado como de gestão ou substituto. <br>
                <v-btn @click="updatePerfil(2)" class="mt-2" color="red" variant="text" >Não sou gestor</v-btn>
            </v-alert>
            <div v-else class="mt-3">
                <p class="my-5">Você possui cargo de gestão?</p>
                <v-btn @click="updatePerfil(1)" class="mr-2" color="success">Sim</v-btn>
                <v-btn @click="updatePerfil(2)" variant="outlined" color="error">Não</v-btn>
            </div>
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

  export default {
    data () {
      return {
        dialog: false,
      }
    },
    computed:{
        dadosServidor(){
            return avaliacaoStore.readLogin
        }
    },
    methods:{
        updatePerfil(item){
            if(item == 1) this.dadosServidor.Gestor = true
            if(item == 2) this.dadosServidor.Gestor = false
            avaliacaoStore.updatePerfil(this.dadosServidor)
            this.dialog = false
        }
    }
  }
</script>
<style lang="scss" scoped>
.v-btn.withUppercase{
    text-transform: none !important;
}

</style>