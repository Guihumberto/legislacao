import { defineStore } from "pinia";

import { collection, addDoc, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';
import { getToken, onMessage } from 'firebase/messaging';
import { db, messaging } from '@/services/firebase';

export const notificationStore = defineStore("notificationStore", {
    state: () => ({
        load: false
    }),
    getters: {
        readLoad(){
            return this.load
        },
        onForegroundMessage(callback) {
            return onMessage(messaging, (payload) => {
                console.log('Mensagem recebida em primeiro plano:', payload);
                callback(payload);
            });
        }
    },
    actions:{
        async sendMessage(userId, message) {
            try {
              await addDoc(collection(db, 'messages'), {
                userId,
                text: message,
                createdAt: serverTimestamp()
              });
            } catch (error) {
              console.error('Erro ao enviar mensagem:', error);
              throw error;
            }
          },
        
          // Ouvir novas mensagens em tempo real
          subscribeToMessages(userId, callback) {
            // Cria uma consulta para buscar mensagens do usuário específico
            const q = query(collection(db, 'messages'), where('userId', '==', userId));
            
            // Configura um listener em tempo real
            return onSnapshot(q, (snapshot) => {
              const messages = [];
              snapshot.forEach((doc) => {
                messages.push({
                  id: doc.id,
                  ...doc.data()
                });
              });
              callback(messages);
            }, (error) => {
              console.error('Erro ao receber mensagens:', error);
            });
          },
        
          // Solicitar permissão para notificações e obter token FCM
          async requestNotificationPermission() {
            try {
              // Solicita permissão do navegador
              const permission = await Notification.requestPermission();
              
              if (permission === 'granted') {
                // Obter token do FCM
                const token = await getToken(messaging, {
                  vapidKey: 'SUA_CHAVE_PUBLICA_VAPID'
                });
                
                console.log('Token FCM:', token);
                return token;
              } else {
                console.log('Permissão de notificação negada');
                return null;
              }
            } catch (error) {
              console.error('Erro ao solicitar permissão:', error);
              throw error;
            }
          },
    }
})