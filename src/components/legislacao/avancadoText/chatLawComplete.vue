<template>
        <div class="wrapperChat">
            <div class="top">
                <v-alert type="info" text="Arcádio Chat" class="top" icon="mdi-robot">
                    <template v-slot:append>
                        <v-btn 
                            variant="flat" density="compact" 
                            v-if="!isEmbeddingExist" @click="activeChat()" 
                            :loading="loadInit || searchStore.readLoadSaveEmbbedings">Ativar</v-btn>
                    </template>
                </v-alert>
            </div>
            <div class="middle" ref="middle">
                <active v-if="!isEmbeddingExist" :loading="loadInit || searchStore.readLoadSaveEmbbedings" @ativar="activeChat()" />
                <Suggesntions v-if="isEmbeddingExist && messages.length <= 3" @question="goQuestion" />
                <v-card-text class="chat-content" ref="chatContent">
                    <div
                        v-for="(msg, index) in messages"
                        :key="index"
                        :class="['message', msg.user === 'assistant' ? 'assistant' : 'user']"
                    >
                        <v-menu
                            open-on-hover
                            location="bottom"
                            attach=".chat-content"
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
            </div>
            <div class="bottom">
                <v-form>
                    <v-textarea
                        variant="outlined"
                        density="compact"
                        placeholder="Faça uma pergunta ou solicitação"
                        @keyup.enter="sendMessage"
                        v-model="newMessage"
                        :disabled="!isEmbeddingExist || load || searchStore.readLoad"
                        clearable
                    ></v-textarea>
                </v-form>
                <div class="px-2 text-grey ">
                    <small>As respostas geradas por Ia podem ser imprecisas ou enganosas. Certifique-se de verificar as respostas e as fontes.</small>
                </div>
            </div>
        </div>
</template>

<script setup>
    import { ref, onMounted, watch } from 'vue';
    import { useDateNow } from '@/composables/dateFormat';

    import { useRoute } from 'vue-router';
    const route = useRoute()

    import MenuUser from '@/components/chat/menuUser.vue';
    import Loading from '../../chat/loading.vue';
    import active from './active.vue';
    import Suggesntions from './suggesntions.vue';

    import { useSearchStore } from '@/store/SearchStore';
    const searchStore = useSearchStore()

    import { useChatStore } from '@/store/ChatStore';
    const chatStore = useChatStore()

    import { useGeralStore } from '@/store/GeralStore'
    const geralStore = useGeralStore()

    const idChat = route.params?.id || null
    const loadInit = ref(false)
    const isEmbeddingExist = ref(0)

    const props = defineProps({
        idLaw: Object
    })

    const messages = ref([
        // { user: '', content: '', idCollection: null }
    ])
    const load = ref(false)
    const newMessage = ref('')
    const chatContent = ref(null);
    const middle = ref(null);


    const goQuestion = (msg) => {
        newMessage.value = msg.title
        sendMessage()
    }

    const scrollToBottom  = () => {
        if (middle.value) {
            middle.value.scrollTo({
                top: middle.value.scrollHeight,
                behavior: "smooth"
            });
        }
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
        }
    } 

    const nextTick = () => {
      setTimeout(() => {
        scrollToBottom()
      }, 1000)
    }

    watch(messages, () => {
        nextTick() 
    }, { deep: true });

    const activeChat = async () => {
        await searchStore.saveEmbbedings(props.idLaw)
        geralStore.changeHeaderNoShow(false)
        isEmbeddingExist.value = 1
    }

    onMounted(async () => {
        loadInit.value = true
        const resp = await searchStore.isEmbeddingExist(idChat)
        isEmbeddingExist.value = resp
        loadInit.value = false
        if(isEmbeddingExist.value) {
            geralStore.changeHeaderNoShow(false)
            load.value = true
            const init = await searchStore.searchChatInit()
            await chatStore.getChat(route.params?.id)
            messages.value = [...chatStore.readChat]
            load.value = false
            messages.value.push({ user: 'assistant', content: init, date: Date.now() })
        } 
    })
</script>

<style scoped>
.wrapperChat{
    position: relative;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 135px);
    margin: 1rem;
    animation: aparecer 1s ease-in forwards ;
}

.top{
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Padrão */
}

.middle {
    background: rgb(248, 248, 248);
    flex-grow: 1; /* Ocupa o espaço restante */
    overflow-y: auto; /* Adiciona scroll vertical se necessário */
    padding: 1rem;
    border-radius: 8px;
}
.chat-content {
    contain: layout paint; /* Impede que elementos dentro ultrapassem os limites */
    position: relative; /* Certifica-se de que elementos filhos respeitem essa div */
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start; 
}
.chat-content .v-overlay {
    z-index: 1 !important; /* Define um z-index menor para que o menu fique abaixo de outros elementos */
}
.bottom{
    position: relative;
    flex-shrink: 0;
    background: white;
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