<template>
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            placeholder="Seu email"
          />
        </div>
  
        <div class="form-group">
          <label for="password">Senha:</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            placeholder="Sua senha"
          />
        </div>
  
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
  
        <div class="actions">
          <button type="submit" :disabled="loading">
            {{ loading ? 'Processando...' : 'Entrar' }}
          </button>
          <button type="button" @click="handleGoogleLogin" :disabled="loading">
            Login com Google
          </button>
        </div>
  
        <div class="register-link">
          <span>Não tem uma conta?</span>
          <a href="#" @click.prevent="goToRegister">Registre-se</a>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
      import { ref } from 'vue';
      import { useRouter } from 'vue-router';
      import { useAuthStore } from '@/store/firebase/authStore';
      const authService = useAuthStore();
  
      const router = useRouter();
      const email = ref('');
      const password = ref('');
      const loading = ref(false);
      const errorMessage = ref('');
  
      const handleLogin = async () => {
        loading.value = true;
        errorMessage.value = '';
  
        try {
          await authService.login(email.value, password.value);
          router.push('/dashboard');
        } catch (error) {
          errorMessage.value = traduzirErro(error.code);
        } finally {
          loading.value = false;
        }
      };
  
      const handleGoogleLogin = async () => {
        loading.value = true;
        errorMessage.value = '';
  
        try {
          await authService.loginWithGoogle();
          router.push('/dashboard');
        } catch (error) {
          errorMessage.value = traduzirErro(error.code);
        } finally {
          loading.value = false;
        }
      };
  
      const goToRegister = () => {
        router.push('/register');
      };
  
      // Função para traduzir mensagens de erro do Firebase
      const traduzirErro = (errorCode) => {
        switch (errorCode) {
          case 'auth/invalid-email':
            return 'Email inválido.';
          case 'auth/user-disabled':
            return 'Usuário desativado.';
          case 'auth/user-not-found':
            return 'Usuário não encontrado.';
          case 'auth/wrong-password':
            return 'Senha incorreta.';
          default:
            return 'Ocorreu um erro ao fazer login. Tente novamente.';
        }
      };
  
  
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .error-message {
    color: #d32f2f;
    margin: 10px 0;
  }
  
  .actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  
  button {
    padding: 10px 15px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  button:hover:not(:disabled) {
    background-color: #388e3c;
  }
  
  .register-link {
    margin-top: 20px;
    text-align: center;
  }
  
  .register-link a {
    color: #2196f3;
    margin-left: 5px;
    text-decoration: none;
  }
  
  .register-link a:hover {
    text-decoration: underline;
  }
  </style>