<template>
    <div @mouseover="showActions = true" @mouseleave="showActions = false">
        <p 
            :class="dispositivo.estrutura ? 'estrutura': ''"
            :title="`Artigo ${dispositivo.art}`"
            v-html="highlightText(dispositivo)">
        </p>
        <v-expand-transition>
            <div class="border rounded mt-2 pt-2 bg-blue-grey-lighten-5"  v-if="showActions || activeComment || dispositivo.comments.length > 0">
               <v-btn density="compact" stacked color="primary" variant="text">
                    <v-badge color="error" :content="dispositivo.comments.length">
                        <v-btn @click="activeComment = !activeComment">
                            <v-icon>mdi-forum</v-icon>
                        </v-btn>
                    </v-badge>
               </v-btn>
               <transition name="fade">
                   <v-form v-if="activeComment" class="mx-2 mt-5" ref="form" @submit.prevent="saveComment">
                        <v-select
                            label="Tipo de Comentário"
                            density="compact"
                            variant="text"
                            :items="types"
                            item-title="title"
                            item-value="id"
                            v-model="comment.type"
                            style="width: 150px;"
                            hide-details
                        ></v-select>
                        <v-textarea
                            :label="types.find( x => x.id == comment.type).title"
                            density="compact"
                            variant="outlined"
                            v-model="comment.text"
                            :rules="[ rules.required ]"
                        >
                            <template v-slot:append-inner>
                                <div class="d-flex align-center h-100">
                                    <v-btn color="primary" type="submit" :loading="load">Salvar</v-btn>
                                </div>
                            </template>
                        </v-textarea>
                   </v-form>
               </transition>
               <div class="pa-2">
                    <div class="comment-box" v-for="item, i in forumStore.readComments" :key="i">
                        <div class="profile-pic"></div>
                        <div class="comment-content">
                            <div class="username">{{ item.user_name }}</div>
                            <div class="timestamp">{{ item.data_include }}</div>
                            <div class="comment-text">{{ item.text }}</div>
                        </div>
                    </div>
               </div>
            </div>
        </v-expand-transition>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    import { useForumStore } from '@/store/ForumStore';
    const forumStore = useForumStore()

    const showActions = ref(false);
    const activeComment = ref(false)
    const form = ref(null)
    const load = ref(false)

    const props = defineProps({
        dispositivo: Object,
        search: String
    })

    const rules = ref({
        required: (value) => !!value || "Campo obrigatório"
    })

    const comment = ref({
        text: null, 
        type: 1,
        idRef: props.dispositivo.id, 
        commentRef: null
    })

    const types = [
        {id: 1, title: "Comentário"},
        {id: 2, title: "Pergunta"},
        {id: 3, title: "Resposta"},
    ]

    const saveComment = async () => {
        const { valid } = await form.value.validate()

        if(valid) {
            load.value = true
            await forumStore.saveComment(comment.value)
            comment.value.text = null
            load.value = false
        }
    }

    const highlightText = (text) => {
        if(props.search) {
            const normalize = str => 
            str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            
            const normalizedText = normalize(text.textlaw);
            const normalizedKeyword = normalize(props.search);
            const regex = new RegExp(`(${normalizedKeyword})`, 'gi');
            
            let highlightedText = normalizedText.replace(regex, '<mark>$1</mark>');
    
            if(text.textlaw.startsWith('Art')) {    
                highlightedText = `<b>${highlightedText.substr(0, 4)}</b> ${highlightedText.substr(4)}`
            } 
            else {
                highlightedText = ` (art. ${text.art}º), ${highlightedText}`
            }
    
            return highlightedText;
        } else {
            if(text.textlaw.startsWith('Art')){
                return `<b>${text.textlaw.substr(0, 4)}</b> ${text.textlaw.substr(4)}`
            } else {
                return text.textlaw
            }
        }
    }
    
</script>

<style scoped>
.estrutura{
    background: rgb(234, 232, 232);
    padding: .5rem;
    text-align: center;
    font-weight: 440;
}
.comment-box {
    background: white;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    gap: 10px;
    margin-bottom: .5rem;
}
.profile-pic {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: gray;
}
.comment-content {
    flex: 1;
}
.username {
    font-weight: bold;
}
.timestamp {
    color: gray;
    font-size: 12px;
}
.comment-text {
    margin-top: 5px;
}
</style>