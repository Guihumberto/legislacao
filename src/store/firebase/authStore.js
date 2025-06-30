import { defineStore } from "pinia";
import { auth, googleProvider, signInWithRedirect, signInWithPopup, getRedirectResult, onAuthStateChanged, signOut as firebaseSignOut } from '@/services/firebase'; // Ajuste o caminho se necessário

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';


export const useAuthStore = defineStore("authStore", {
  state: () => ({
    load: false,
    user: null,
    error: null,
    loading: true,
    unsubscribe: null,
  }),
  getters: {
    readLoad(){
      return this.load
    },
    getCurrentUser() {
      return this.user || auth.currentUser;
    },
  },
  actions:{
    // Initialize auth state checking
    async init() {
      this.load = true;
    
      try {
        console.log('Iniciando autenticação...', auth);
        const result = await getRedirectResult(auth);
        if (result) {
          this.user = result.user;
          console.log('Usuário logado via redirect:', this.user);
        } else {
          console.log('Nenhum resultado de redirecionamento.');
        }
      } catch (error) {
        console.error('Erro ao obter resultado do redirecionamento:', error);
      }
    
      await new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          this.user = user;
          resolve(user);
        });
      });
    
      this.load = false;
    },
    async register(email, password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        this.user = userCredential.user;
        return userCredential.user;
      } catch (error) {
        console.error('Erro ao registrar:', error);
        throw error;
      }
    },
    async login(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        this.user = userCredential.user;
        return userCredential.user;
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        throw error;
      }
    },   
    async loginWithGoogle() {
      this.loading = true;
      this.error = null;
      try {
        const result = await signInWithPopup(auth, googleProvider);
        if (result && result.user) {
            this.user = {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
              // Adicione outros campos que você precisar
            };
          }
      } catch (error) {
        console.error("Erro ao iniciar login com Google:", error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },   
    async handleRedirectResult(){
      console.log('Store: handleRedirectResult chamada.');
      this.loading = true;
      this.error = null;
      try {
          console.log('Store: Aguardando getRedirectResult...');
          const result = await getRedirectResult(auth);
          console.log('Store: Resultado de getRedirectResult:', result)

          if (result && result.user) {
            console.log('Store: Usuário encontrado no resultado do redirecionamento:', result.user);
            this.user = {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
              // Adicione outros campos que você precisar
            };
          } else {
            console.log('Store: Nenhum usuário encontrado no resultado do redirecionamento ou resultado é nulo.');
          }
      } catch (err) {
          console.error("Erro ao obter resultado do redirecionamento:",  err.code, err.message);
          if (err.code !== 'auth/redirect-cancelled' && err.code !== 'auth/user-cancelled') {
            this.error = err.message;
          }
      } finally {
        this.loading = false;
        console.log('Store: handleRedirectResult finalizada.');
      }
    }, 
    async logout() {
      this.loading = true;
      this.error = null;
      try {
        await firebaseSignOut(auth);
        this.user = null;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    initAuthListener() {
      console.log('Store: onAuthStateChanged disparado. Usuário Firebase:', firebaseUser);
      this.loading = true;

       this.unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            console.log('Store: onAuthStateChanged - TEM usuário:', firebaseUser.uid, firebaseUser.email); // <--- LOG DETALHADO
            this.user = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            };
            this.error = null;
          } else {
            this.user = null;
          }
          this.loading = false;
          console.log('Store: onAuthStateChanged - estado do usuário atualizado, loading definido como false.');
        },
        (err) => {
          console.error('Erro no onAuthStateChanged:', err);
          this.error = err.message;
          this.loading = false;
        }
      );

    }
  }
})