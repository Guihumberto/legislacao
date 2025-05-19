<template>
  <div>
      <h1>Login firebse</h1>
      {{ authStore.user }} oi
      <v-container fluid>
        <div v-if="authStore.loading && !authStore.user" class="text-center pa-4">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p>Verificando autenticação...</p>
        </div>
        <router-view v-else />
        <v-alert v-if="authStore.error" type="error" closable class="ma-4">
          {{ authStore.error }}
        </v-alert>
      </v-container>


       <v-container class="fill-height d-flex justify-center align-center">
        <v-card class="pa-4" width="400">
          <v-card-title class="text-center text-h5">Login</v-card-title>
          <v-card-text>
            <p class="text-center mb-4">Faça login com sua conta Google.</p>
            <div v-if="authStore.loading && !authStore.user" class="text-center">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <p>Processando...</p>
            </div>
            <v-alert v-if="authStore.error" type="error" density="compact" class="mb-4">
              {{ authStore.error }}
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-btn
              block
              color="primary"
              @click="handleLogin"
              :loading="authStore.loading && !authStore.user"
              :disabled="authStore.loading && !authStore.user"
            >
              <v-icon start>mdi-google</v-icon>
              Login com Google
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
  </div>
</template>

<script setup>
  import { onMounted, watch } from 'vue';

  import { useRouter } from 'vue-router';
  const router = useRouter()

  import { useAuthStore } from '@/store/firebase/authStore'
  const authStore = useAuthStore()

  const handleLogin = async () => {
    await authStore.loginWithGoogle();
    // O redirecionamento acontecerá aqui, então o código abaixo pode não ser executado
    // imediatamente se o redirecionamento for bem-sucedido.
  };

  watch(() => authStore.user, (currentUser) => {
    if (currentUser) {
      router.push('/'); // Redireciona para a página inicial ou dashboard
    }
  }, { immediate: true }); // 'immediate: true' verifica ao montar o componente
</script>