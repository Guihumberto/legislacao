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
              :subtitle="item._source.tipo"
              :title="item._source.title"
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
                    v-model="item._source.revogado"
                    color="orange"
                    label="Revogado"
                    hide-details
                  ></v-switch>
                </v-list-item>
      
                <v-list-item>
                  <v-switch
                    v-model="item._source.sigiloso"
                    color="error"
                    label="Sigiloso"
                    hide-details
                  ></v-switch>
                </v-list-item>
              </v-list>
              <v-list>
                <v-list-item>
                  <v-switch
                    v-model="item._source.revogado"
                    color="success"
                    label="Eficaz"
                    hide-details
                  ></v-switch>
                </v-list-item>
                <v-list-item>
                  <v-btn @click="deleteLaw(item._source.id)" prepend-icon="mdi-delete" variant="text" color="red">Apagar</v-btn>
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
              @click.stop="$router.push(`/laws/${item._id}`)"
              prepend-icon="mdi-pencil"
            >
              Editar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
</template>
<script setup>
    import { ref } from 'vue';
    import { useLawStore } from '@/store/LawsStore';
    const lawStore = useLawStore()
    
    const menu = ref(false)

    const props = defineProps({
        item: Object
    })

    const deleteLaw = async(item) => {
      await lawStore.deleteLaw(item)
    }

  </script>