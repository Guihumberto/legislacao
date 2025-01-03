<template>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        location="end"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            icon="mdi-dots-vertical"
          >
          </v-btn>
        </template>
  
        <v-card width="350">
          <v-list>
            <v-list-item
              prepend-icon="mdi-file-document-multiple-outline"
              :subtitle="item.tipo"
              :title="item.title"
            >
              <template v-slot:append>
                <v-btn
                  icon="mdi-close"
                  variant="text"
                  @click="menu = false"
                ></v-btn>
              </template>
            </v-list-item>
          </v-list>
  
          <v-divider></v-divider>
          <div class="d-flex">
              <v-list>
                <v-list-item>
                  <v-switch
                    v-model="item.revogado"
                    color="orange"
                    label="Revogado"
                    hide-details
                  ></v-switch>
                </v-list-item>
      
                <v-list-item>
                  <v-switch
                    v-model="item.sigiloso"
                    color="error"
                    label="Sigiloso"
                    hide-details
                  ></v-switch>
                </v-list-item>
              </v-list>
              <v-list>
                <v-list-item>
                  <v-switch
                    v-model="item.revogado"
                    color="success"
                    label="Eficaz"
                    hide-details
                  ></v-switch>
                </v-list-item>
                <v-list-item>
                  <v-btn @click="deleteLaw(item.id)" prepend-icon="mdi-delete" variant="text" color="red">Apagar</v-btn>
                </v-list-item>
              </v-list>
          </div>
  
          <v-card-actions>
            <v-spacer></v-spacer>
  
            <v-btn
              variant="text"
              @click="menu = false"
            >
              Fechar
            </v-btn>
            <v-btn
              color="primary"
              variant="text"
              @click="menu = false"
            >
              Salvar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
</template>
<script setup>
    import { useLawStore } from '@/store/LawsStore';
    const lawStore = useLawStore()

    import { ref } from 'vue';
    const fav = ref(true)
    const menu = ref(false)
    const message = ref(false)
    const hints = ref(true)

    const props = defineProps({
        item: Object
    })

    const deleteLaw = async(item) => {
      await lawStore.deleteLaw(item)
      console.log(item);
    }

  </script>