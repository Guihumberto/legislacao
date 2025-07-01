<template>
  <div class="solicitations-container">
    <v-card elevation="2" rounded="lg">
      <v-card-title class="text-h6 font-weight-bold py-3">
        <v-icon start>mdi-file-document-outline</v-icon>
        Minhas Solicitações
      </v-card-title>
      <v-divider></v-divider>
      <v-list density="comfortable" class="pa-0">
        <v-list-item
          v-for="(item, i) in solicitationStore.readSolicitations"
          :key="i"
          class="solicitation-item"
          :class="{ 'bg-grey-lighten-4': i % 2 === 0 }"
        >
          <v-list-item-title class="font-weight-medium">
            Grupo: {{ item.nameGroup }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption text-grey-darken-1">
            ID do Grupo: {{ item.idGroup }}
          </v-list-item-subtitle>
          <template v-slot:append>
            <v-chip
              color="orange"
              variant="tonal"
              size="small"
              class="mx-1 text-capitalize"
            >
              Pendente
            </v-chip>
            <v-btn
              icon="mdi-eye-arrow-right-outline"
              color="primary"
              variant="tonal"
              size="small"
              class="mx-1"
              @click.stop="$router.push(`/avancado/forumlaw/${item.idGroup}?permission=true`)"
            ></v-btn>
          </template>
        </v-list-item>
        <v-list-item v-if="!solicitationStore.readSolicitations.length">
          <v-alert
            type="info"
            variant="text"
            text="Não há solicitações pendentes"
            class="w-100"
          ></v-alert>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script setup>
import { useSolicitationsStore } from '@/store/SolicitationsStore';

const solicitationStore = useSolicitationsStore();
</script>

<style scoped>
.solicitations-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}

.solicitation-item {
  transition: background-color 0.3s ease;
}

.solicitation-item:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.v-btn, .v-chip {
  transition: transform 0.2s ease;
}

.v-btn:hover, .v-chip:hover {
  transform: scale(1.1);
}

.v-card-title {
  background: linear-gradient(to right, #f5f7fa, #e4e7eb);
}
</style>