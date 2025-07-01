<template>
  <div class="invites-container">
    <!-- Invites Section -->
    <v-card class="mb-6" elevation="2" rounded="lg">
      <v-card-title class="text-h6 font-weight-bold py-3">
        <v-icon start>mdi-email-outline</v-icon>
        Convites Pendentes
      </v-card-title>
      <v-divider></v-divider>
      <v-list density="comfortable" class="pa-0">
        <v-list-item
          v-for="(item, i) in solicitationStore.readInvites"
          :key="i"
          class="invite-item"
          :class="{ 'bg-grey-lighten-4': i % 2 === 0 }"
        >
          <v-list-item-title class="font-weight-medium">
            {{ item.nameGroup }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption text-grey-darken-1">
            Convite para o grupo #{{ item.idGroup }}
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
        <v-list-item v-if="!solicitationStore.readInvites.length">
          <v-alert
            type="info"
            variant="text"
            text="Não há convites a serem avaliados"
            class="w-100"
          ></v-alert>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- Accepted Groups Section -->
    <v-expand-transition>
      <v-card v-if="links.length" class="mb-6" elevation="2" rounded="lg">
        <v-card-title class="text-h6 font-weight-bold py-3">
          <v-icon start>mdi-account-group-outline</v-icon>
          Grupos Aceitos
        </v-card-title>
        <v-divider></v-divider>
        <v-list density="comfortable" class="pa-0">
          <v-list-item
            v-for="(item, i) in links"
            :key="i"
            :to="`/avancado/forumlaw/${item.idGroup}?permission=true`"
            class="group-item"
            :class="{ 'bg-grey-lighten-4': i % 2 === 0 }"
            hover
          >
            <v-list-item-title class="font-weight-medium">
              {{ item.nameGroup }}
            </v-list-item-title>
            <template v-slot:append>
              <v-btn
                color="primary"
                variant="flat"
                size="small"
                class="text-capitalize"
              >
                Entrar
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-expand-transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSolicitationsStore } from '@/store/SolicitationsStore';

const solicitationStore = useSolicitationsStore();
const links = ref([]);
const isProcessing = ref(false);

const actionAccept = async (item) => {
  isProcessing.value = true;
  try {
    await solicitationStore.acceptInvites(item);
    addLink(item);
  } catch (error) {
    console.error('Error accepting invite:', error);
  } finally {
    isProcessing.value = false;
  }
};

const actionReject = async (item) => {
  isProcessing.value = true;
  try {
    await solicitationStore.rejectInvites(item);
  } catch (error) {
    console.error('Error rejecting invite:', error);
  } finally {
    isProcessing.value = false;
  }
};

const addLink = (item) => {
  if (!links.value.some(link => link.idGroup === item.idGroup)) {
    links.value.push(item);
  }
};
</script>

<style scoped>
.invites-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}

.invite-item, .group-item {
  transition: background-color 0.3s ease;
}

.invite-item:hover, .group-item:hover {
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