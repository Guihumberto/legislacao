<template>
      <v-btn 
        @click="dialog = true" prepend-icon="mdi-link" 
        variant="outlined" class="text-lowercase" >incluir a partir dos meus documentos</v-btn>
  
      <v-dialog
        v-model="dialog"
        width="auto"
      >
        <v-card
          max-width="400"
          prepend-icon="mdi-file"
          text="Escolha o documento para fazer referência no seu post."
          title="Referência por documento"
        >
            <v-card-text>
                <v-list lines="two">
                    <v-list-item 
                        :title="item.title" 
                        :subtitle="resumo(item.pages)"
                        link
                        v-for="item, i in userAreaStore.readDocumentos" :key="i"
                        @click.stop="sendDoc(item.pages)"
                    >
                        <template v-slot:prepend>
                            <v-icon>
                                mdi-text-box-multiple-outline
                            </v-icon>
                        </template>
                    </v-list-item>
                </v-list>
            </v-card-text>
            <template v-slot:actions>
                <v-btn
                class="ms-auto"
                text="FEchar"
                @click="dialog = false"
                ></v-btn>
            </template>
        </v-card>
      </v-dialog>
  </template>
 <script setup>
    import { useUserAreaStore } from '@/store/AreaUserStore';
    const userAreaStore = useUserAreaStore()
    import { ref } from 'vue';

    const dialog = ref(false)

    const resumo = (item) => {
        const res = item.map(x => x.name_law)
        return res.join(", ")
    }

    const emit = defineEmits(['enviarDocRef'])

    const sendDoc = (item) => {
        dialog.value = false
        emit("enviarDocRef", item)
    }
</script>