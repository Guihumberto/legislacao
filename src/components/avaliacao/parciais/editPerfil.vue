<template>
    <div>
        <v-btn prepend-icon="mdi-pencil" color="primary" variant="text" @click="dialog = true" class="text-lowercase pa-0">
        Editar Perfil
        </v-btn>

        <v-dialog
        v-model="dialog"
        width="auto"
        >
        <v-card
            max-width="500"
            prepend-icon="mdi-update"
            title="Atualizar Perfil"
        >
        <v-card-text class="text-left">
            <div>
                <p>A atualização do perfil se reflete apenas no sistemas de avaliação individual.</p>
                <p>Qualquer erro em seu cadastro procure o COTRH!</p>
            </div>
            <v-alert v-if="!editPerfil" class="text-left my-5"> 
                 <span class="font-weight-bold">Nome:</span> {{ dadosServidor.nome }} <br>
                 <span class="font-weight-bold">Unidade:</span> {{ dadosServidor.lotacao }} <br>
                 <span class="font-weight-bold">Cargo:</span> {{ dadosServidor.cargo }} <br>
                 <span class="font-weight-bold">E-mail:</span> {{ dadosServidor.email }} <br>
                <v-btn @click="editPerfil = true" color="primary" variant="text" class="pa-0" >Editar meus dados</v-btn>
            </v-alert>
            <div v-else class="mt-3">
                <v-form @submit.prevent="updatePerfil(false)" ref="form">
                    <v-text-field
                        label="Nome"
                        v-model="dadosServidor.nome"
                        density="compact"
                        variant="outlined"
                        :rules="[rules.required]"
                    ></v-text-field>
                    <v-text-field
                        label="Unidade"
                        v-model="dadosServidor.lotacao"
                        density="compact"
                        variant="outlined"
                        :rules="[rules.required]"
                    ></v-text-field>
                    <v-text-field
                        label="Cargo"
                        v-model="dadosServidor.cargo"
                        density="compact"
                        variant="outlined"
                        :rules="[rules.required]"
                    ></v-text-field>
                    <v-text-field
                        label="Email"
                        v-model="dadosServidor.email"
                        density="compact"
                        variant="outlined"
                        :rules="[rules.required]"
                    ></v-text-field>
                    <v-switch color="success" label="Gestor ou substituto" v-model="dadosServidor.Gestor"></v-switch>
                    <div class="text-right">
                        <v-btn variant="text" @click="editPerfil = false" class="mr-2">Cancelar</v-btn>
                        <v-btn color="success" type="submit" class="mr-2">Salvar</v-btn>
                    </div>
                </v-form>
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
        editPerfil: false,
        rules:{
            required: (value) => !!value || "Campo obrigatório",
            mincpf: (v) => (v||'').length == 14 || "11 dígitos",
            minnome: (v) => (v||'').length > 4 || "mínimo de 4 caracteres"
        },
      }
    },
    computed:{
        dadosServidor(){
            return avaliacaoStore.readLogin
        }
    },
    methods:{
        updatePerfil(item){
            if(item){
                if(item == 1) this.dadosServidor.Gestor = true
                if(item == 2) this.dadosServidor.Gestor = false
            }
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