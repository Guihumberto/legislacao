import { defineStore } from "pinia";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged
} from 'firebase/auth';

import { auth } from '@/services/firebase';

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    load: false,
    user: null
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
      try {
        const provider = new GoogleAuthProvider();
        // Use the imported auth instance consistently;
        await signInWithRedirect(auth, provider);
        sessionStorage.setItem('redirecting', 'true');
        // Note: No return value here as the redirect happens immediately
       
      } catch (error) {
        console.error('Erro ao fazer login com Google:', error);
        throw error;
      }
    },   
    async logout() {
      try {
        await signOut(auth);
        this.user = null;
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
        throw error;
      }
    }
  }
})