<template>
  <div class="solicitations-container">
    <v-card elevation="2" rounded="lg">
      <v-card-title class="text-h6 font-weight-bold py-3">
        <v-icon start>mdi-account-check-outline</v-icon>
        Solicitações dos Meus Grupos
      </v-card-title>
      <v-divider></v-divider>
      <v-list density="comfortable" class="pa-0">
        <v-list-item
          v-for="(item, i) in solicitationStore.readAvaliations"
          :key="i"
          class="solicitation-item"
          :class="{ 'bg-grey-lighten-4': i % 2 === 0 }"
        >
          <v-list-item-title class="font-weight-medium">
            Grupo: {{ item.nameGroup }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption text-grey-darken-1">
            Solicitante: {{ item.nameUser || item.idUser }} (ID: {{ item.idUser }})
          </v-list-item-subtitle>
          <template v-slot:append>
            <v-btn
              icon="mdi-close"
              color="error"
              variant="tonal"
              size="small"
              class="mx-1"
              :disabled="isProcessing"
              @click.stop="actionReject(item)"
            ></v-btn>
            <v-btn
              icon="mdi-check"
              color="success"
              variant="tonal"
              size="small"
              class="mx-1"
              :loading="isProcessing"
              @click.stop="actionAccept(item)"
            ></v-btn>
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
        <v-list-item v-if="!solicitationStore.readAvaliations.length">
          <v-alert
            type="info"
            variant="tonal"
            text="Não há permissões a serem avaliadas"
            class="w-100"
          ></v-alert>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSolicitationsStore } from '@/store/SolicitationsStore';

const solicitationStore = useSolicitationsStore();
const isProcessing = ref(false);

const actionAccept = async (item) => {
  isProcessing.value = true;
  try {
    await solicitationStore.acceptAvaliations(item);
  } catch (error) {
    console.error('Error accepting solicitation:', error);
  } finally {
    isProcessing.value = false;
  }
};

const actionReject = async (item) => {
  isProcessing.value = true;
  try {
    await solicitationStore.rejectAvaliations(item);
  } catch (error) {
    console.error('Error rejecting solicitation:', error);
  } finally {
    isProcessing.value = false;
  }
};
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

.v-btn {
  transition: transform 0.2s ease;
}

.v-btn:hover {
  transform: scale(1.1);
}

.v-card-title {
  background: linear-gradient(to right, #f5f7fa, #e4e7eb);
}
</style>