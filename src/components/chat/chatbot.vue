<template>
    <section>
        <div class="d-flex justify-space-between align-center w-100">
            <v-btn variant="text" @click="$router.push('/chatarcadio')" icon="mdi-arrow-left"></v-btn>
            <h1 class="text-center text-h5">{{ $route.query.title }}</h1>
            <v-btn disabled variant="text" icon="mdi-information"></v-btn>
        </div>
        <v-card class="chat-container" variant="outlined">
            <v-card-text class="chat-content" ref="chatContent">
                <div
                    v-for="(msg, index) in messages"
                    :key="index"
                    :class="['message', msg.user === 'assistant' ? 'assistant' : 'user']"
                >
                    <v-menu
                        open-on-hover
                        location="bottom"
                    >
                        <template v-slot:activator="{ props }">
                            <div 
                                v-bind="props"
                                class="message-content">
                                <p v-html="msg.content"></p>
                                <div class="text-right">
                                    <small v-if="msg?.date">{{ useDateNow(msg.date) }}</small>
                                </div>
                            </div>
                        </template>
                        <MenuUser :msg="msg" />
                    </v-menu>
                </div>
                <Loading v-if="load || searchStore.readLoad" />
            </v-card-text>
            
            <v-divider></v-divider>
            <v-card-actions class="chat-input" :class="theme == 'dark' ? 'bg-grey-darken-4' : 'bg-grey-lighten-3'">
                <v-textarea
                    v-model="newMessage"
                    variant="outlined"
                    @keyup.enter="sendMessage"
                    auto-grow
                    autofocus
                    rows="1"
                    row-height="24"
                    clearable
                    hint="Faça uma pergunta sobre a coleção de referência."
                    style="max-height: 150px; overflow-y: auto;"
                    placeholder="Digite aqui sua pergunta"
                    :disabled="load || searchStore.readLoad"
                >
                </v-textarea>
            </v-card-actions>
        </v-card>
    </section>
</template>

<script setup>
    import { ref, inject, onMounted, watch } from 'vue'
    import api from '@/services/api_hf'
    import MenuUser from '@/components/chat/menuUser.vue';
    import Loading from './loading.vue';
    import { useSearchStore } from '@/store/SearchStore';
    import { useChatStore } from '@/store/ChatStore';
    import { useLoginStore } from '@/store/LoginStore';
    import { useRoute } from 'vue-router';
    import { useDateNow } from '@/composables/dateFormat';
    import { storeToRefs } from 'pinia';

    const searchStore = useSearchStore()
    const chatStore = useChatStore()
    const loginStore = useLoginStore()
    const route = useRoute()
    const theme = inject('theme')
    const load = ref(false)
    const chatContent = ref(null);
   
    const { readLogin } = storeToRefs(loginStore)


    const nextTick = () => {
      setTimeout(() => {
        if (chatContent.value) {
          chatContent.value.$el.scrollTo({
            top: chatContent.value.$el.scrollHeight,
            behavior: "smooth"
          });
        }
      }, 1000)
    }
    
    const messages = ref([
        { user: '', content: '', idCollection: null }
    ])

    onMounted(async () => {
        load.value = true
        const init = await searchStore.searchChatInit()
        await chatStore.getChat(route.params?.id)
        messages.value = [...chatStore.readChat]
        load.value = false
        messages.value.push({ user: 'assistant', content: init, date: Date.now() })
    })


    watch(readLogin, (newValue, oldValue) => {
            setTimeout(() => {
               messages.value = [...chatStore.readChat]
            }, 2000)
    })

    const newMessage = ref('')
    const idChat = route.params?.id || null

    const contarTokens = (texto) => {
        const palavras = texto.split(/\s+/); // Divide por espaços
        return Math.round(palavras.length * 1.33); // Aproximadamente 1,33 tokens por palavra em português
    }

    const sendMessage = async () => {
        if(!newMessage.value) return

        if (newMessage.value.trim() !== '') {

            const msg = {
                user: 'user', content: newMessage.value, idCollection: route.params?.id || null 
            }

            messages.value.push({...msg})
            chatStore.saveChat(msg)

            const ask = newMessage.value
            newMessage.value = ''

            const resp = await searchStore.searchChatApi(ask, idChat)

            const assistent = {
                user: 'assistant', content: resp || "Sem resposta", idCollection: route.params?.id || null 
            }
           
            messages.value.push({ ...assistent }) //resp.data?.[0].generated_text 
            chatStore.saveChat(assistent)
            nextTick()

            // const resp = await searchStore.searchDirect(ask, idChat)
            // await chatArcadio(ask, resp)
        }
    }

    const chatArcadio = async (pergunta, contexto) => {
      console.log(pergunta, contexto);
      try {
        load.value = true
        if (contarTokens(contexto) <= 500) {

            const resp = await api.post('meta-llama/Meta-Llama-3-8B-Instruct', {
                inputs: `Você é um assistente útil. Use o contexto abaixo para 
                responder à pergunta do usuário de forma clara e objetiva. Contexto: ${contexto}\n\nPergunta: ${pergunta}\n\nResposta:`,
                parameters: {
                  "max_new_tokens": 200,
                  "temperature": 0.5,
                  "top_p": 0.8,
                  "return_full_text": false,
                }
            })
            console.log(resp);
            messages.value.push({ user: 'assistant', content: resp.data?.[0].generated_text || "Sem resposta" })
            nextTick()
        }

      } catch (error) {
          console.log('erro chat', error);
      } finally { 
          load.value = false
      }
    }

</script>

<style scoped>
section{
    width: min(1080px, 100%);
    height: 90%;
    margin-inline: auto;
}
.chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    transition: 1s ease;
    animation: fadeIn 1s ease-in-out forwards;
    opacity: 0;
}

.chat-content {
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start; 
}

.chat-input {
    padding: 8px 16px;
}

.message {
    margin-bottom: 16px;
    padding: 8px;
    border-radius: 8px;
    max-width: 75%;
    display: flex;
    cursor: pointer;
}

.assistant {
    align-self: flex-start;
    background-color: #f1f1f1;
    color: black;
}

.user {
    align-self: flex-end;
    background-color: #1976d2;
    color: white;
}
</style>