<template>
      <v-btn @click="dialog = true" color="success" variant="flat">
        NOVA PASTA
      </v-btn>
  
      <v-dialog
        v-model="dialog"
        width="auto"
      >
        <v-card
          max-width="400"
          prepend-icon="mdi-plus"
          text="Adicione uma nova pasta de favoritos"
          title="NOVA PASTA"
        >
        <v-card-text>
            <v-form class="text-right" @submit.prevent="addNewFolder()" ref="form">
                <v-text-field
                    variant="outlined"
                    density="compact"
                    label="Nome da Pasta"
                    placeholder="Digite o nome da pasta"
                    v-model="folder"
                    :rules="[rules.required]"
                    clearable
                ></v-text-field>
                <v-btn class="mr-2" variant="text" @click="dialog = false">Fechar</v-btn>
                <v-btn type="submit" variant="flat" color="success">Criar</v-btn>
            </v-form>
        </v-card-text>
        </v-card>
      </v-dialog>
  </template>
  <script setup>
    import { ref } from 'vue';
    
    const folder = ref(null)
    const form = ref(null)
    const dialog = ref(false)

    const rules = {
        required: value => !!value || "campo obrigatório", 
        minfield: (v) => (v||'').length >= 3 || "Mínimo 4 caracteres",
    }

    const addNewFolder = async () => {
            const { valid } = await form.value.validate()

            if(valid){
                console.log(folder.value)
            }
    }

  </script>