<template>
    <div>
        <h1 class="text-center text-h5">{{ $route.query.title }}</h1>
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
                    class="message-content" v-html="msg.content"></div>
                </template>
                <MenuUser :msg="msg" />
                </v-menu>
            </div>
            <div v-if="searchStore.readLoad">
                <v-skeleton-loader
                    :loading="searchStore.readLoad"
                    type="list-item-two-line"
                    width="400"
                >
                </v-skeleton-loader>
            </div>
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
                :disabled="load"
            >
            </v-textarea>
        </v-card-actions>
    </v-card>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue'

    import api from '@/services/api_hf'

    import MenuUser from '@/components/chat/menuUser.vue';
    
    import { useSearchStore } from '@/store/SearchStore';
    const searchStore = useSearchStore()
    
    import { useRoute } from 'vue-router';
    const route = useRoute()

    const theme = inject('theme')
    const load = ref(false)
    const chatContent = ref(null);

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
        { user: '', content: '' }
    ])

    onMounted(async () => {
        const init = await searchStore.searchChatInit()
        messages.value.push({ user: 'assistant', content: init })
    })

    const newMessage = ref('')
    const idChat = route.params?.id || null

    const contarTokens = (texto) => {
        const palavras = texto.split(/\s+/); // Divide por espaços
        return Math.round(palavras.length * 1.33); // Aproximadamente 1,33 tokens por palavra em português
    }

    const sendMessage = async () => {
        if (newMessage.value.trim() !== '') {

            messages.value.push({ user: 'user', content: newMessage.value })
            const ask = newMessage.value
            newMessage.value = ''

            const resp = await searchStore.searchChatApi(ask, idChat)
           
            messages.value.push({ user: 'assistant', content: resp || "Sem resposta" }) //resp.data?.[0].generated_text 
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
.chat-container {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 170px); /* Adjust based on toolbar height */
    width: 800px;
    margin: 1rem 0;
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

@media (max-width: 800px) {
    .chat-container {
        width: 100%;
    }
}
</style>