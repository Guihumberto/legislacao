<template>
  <div class="text-center pa-4">
    <v-dialog
      v-model="dialog"
      width="auto"
    >
      <v-card
        max-width="900"
        max-height="600"
        prepend-icon="mdi-text"
        text="faça pesquisa dos pontos relevantes."
        title="Copiar Prompt"
      >
        <v-card-text class="overflow-y-auto border mx-5" style="max-height: 400px;">
            <div>
                <pre>{{ prompt }}</pre>
            </div>
            
        </v-card-text>
      
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Fechar"
            @click="dialog = false"
          ></v-btn>
          <v-btn variant="text" @click="copiarPrompt" icon="mdi-content-copy"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
 import { ref, watch } from 'vue'

  const dialog = ref(false)
  const props = defineProps({
        prompt: {
                type: String,
                required: true
        },
        dialog2: {
                type: Boolean,
                required: true
        }
 })

    const copiarPrompt = () => {
        navigator.clipboard.writeText(props.prompt)
    }

    watch(props.dialog2, () => {
        dialog.value = true
    })
</script>

  

<style scoped>

</style>