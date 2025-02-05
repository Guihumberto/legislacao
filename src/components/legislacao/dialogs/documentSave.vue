<template>
      <v-btn @click="dialog = true" variant="text" prepend-icon="mdi-content-save">
        Salvar
      </v-btn>
  
      <v-dialog
        v-model="dialog"
        width="auto"
      >
        <v-card
          min-width="400"
        >
        <v-card-title class="d-flex  justify-space-between bg-primary">
          <div class="d-flex ga-2 ">
            <v-icon>mdi-content-save</v-icon>
            <h3>Salvar Documento</h3>
          </div>
          <v-btn @click="dialog = false" variant="text" density="comfortable" icon="mdi-close"></v-btn>
        </v-card-title>
          <v-card-text>
            <div class="border pa-2">
              <p class="mb-5 font-italic">Escolha um nome para o documento.</p>
                <v-form @submit.prevent="saveDocument()" ref="form">
                  <v-text-field
                    label="Nome do Documento"
                    variant="outlined"
                    density="compact"
                    placeholder="Digite o nome do documento"
                    focused
                    v-model="title"
                    :rules="[rules.required, rules.minfield]"
                    clearable
                    color="success"
                  >
                  <template v-slot:append>
                    <v-btn variant="flat" color="success" type="submit">Salvar</v-btn>
                  </template>
                
                  </v-text-field>
                </v-form>
            </div>
            <v-list class="mt-5 pa-0 border">
              <v-list-item 
                v-for="doc, i in document" :key="i" class="py-2"
                :subtitle="`${doc.tipo} - ${doc.ano}`"
               >
                <template v-slot:prepend>
                  <v-icon icon="mdi-file-document"></v-icon>
                </template>
                <template v-slot:append>
                  <div class="ml-2 pa-2 bg-grey">
                    {{ i + 1 }}
                  </div>
                </template>
                <span>pag. {{ doc.num_page }}, do doc {{ doc.name_law }}</span>
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
  </template>
  <script setup>
    import { onMounted, ref } from 'vue';

    import { useUserAreaStore } from '@/store/AreaUserStore';
    const userAreaStore = useUserAreaStore()

    const dialog = ref(false)
    const form = ref(null)
    const title = ref(null)

    const props = defineProps({
      document: Array,
      textsearch: String
    })

    const emit = defineEmits(['fecharDoc'])

    const rules = {
        required: value => !!value || "campo obrigatório", 
        minfield: (v) => (v||'').length >= 3 || "Mínimo 4 caracteres",
    }

    const saveDocument = async () => {
        const { valid } = await form.value.validate()
            if(valid){
               const objeto = {
                title: title.value.trim(),
                pages: props.document,
                active: true,
                publish: false,
               }
               userAreaStore.saveDoc(objeto)
               emit("fecharDoc")
            }
    }

    onMounted(() => {
      if(props.textsearch){
        title.value = props.textsearch.toUpperCase()
      }
    })

  </script>