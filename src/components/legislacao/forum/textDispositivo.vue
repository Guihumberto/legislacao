<template>
    <div @mouseover="showActions = true" @mouseleave="showActions = false" class="relativeContainer">
        <p 
            :class="dispositivo.estrutura ? 'estrutura': ''"
            :title="`Artigo ${dispositivo.art}`"
            v-html="highlightText(dispositivo)">
        </p>
        <v-expand-transition>
            <div class="action-container" v-if="showActions || activeComment || dispositivo.comments.length > 0">
                <v-btn class="pa-0" stacked variant="text" density="compact" @click="activeComment = !activeComment">
                    <v-badge :color="dispositivo.comments.length ? 'error' : 'grey'" :content="dispositivo.comments.length">
                        <v-icon>mdi-forum</v-icon>
                    </v-badge>
                </v-btn>
            </div>
        </v-expand-transition>
        <v-expand-transition>
            <div class="text-right border rounded mt-2 bg-blue-grey-lighten-5"  v-if="showActions || activeComment || dispositivo.comments.length > 0">
               <transition name="fade">
                <div v-if="activeComment">
                    <v-form v-if="isComment" class="mx-2 mt-5" ref="form" @submit.prevent="saveComment">
                         <v-select
                             label="Tipo de Comentário"
                             density="compact"
                             :items="types"
                             item-title="title"
                             item-value="id"
                             class="mb-2"
                             v-model="comment.type"
                             style="width: 150px;"
                             hide-details
                         ></v-select>
                         <v-textarea
                             :label="types.find( x => x.id == comment.type).title"
                             density="compact"
                             variant="outlined"
                             v-model="comment.text"
                             clearable
                             :rules="[ rules.required ]"
                         >
                         </v-textarea>
                         <div class="d-flex justify-end my-2">
                             <v-btn color="primary" type="submit" :loading="load">Enviar</v-btn>
                         </div>
                    </v-form>
                    <Comments :dispositivo="dispositivo" ref="childRef" />
                </div>
               </transition>    
            </div>
        </v-expand-transition>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue';

    import Comments from './comments.vue';

    import { useForumStore } from '@/store/ForumStore';
    const forumStore = useForumStore()

    import { useLoginStore } from '@/store/LoginStore';
    const LoginStore = useLoginStore()

    const showActions = ref(false);
    const activeComment = ref(false)
    const form = ref(null)
    const load = ref(false)

    const isComment = computed(() => {
        const cpf = LoginStore.readLogin.cpf
        const grupo = forumStore.readGroupForum._source
        const participantes = [ ...grupo.group, grupo.created_by ]

        return grupo.open
        ? true
        : !!participantes.find( x => x == cpf)

    })

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
    ]

    const saveComment = async () => {
            const { valid } = await form.value.validate()
            if(!valid) return
            load.value = true
            const resp = await forumStore.saveComment(comment.value)
            if (childRef.value) childRef.value.adicionarObjeto(comment.value, resp);
            comment.value.text = null
            load.value = false
    }

    const childRef = ref(null);

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
.relativeContainer{
    position: relative;
    display: inline-block; 
    width: 100%;
}
.action-container {
    position: absolute;
    top: 0;
    right: -50px; /* Ajuste conforme necessário para alinhar ao lado */
    background: transparent;
}

.comment-box {
    margin-top: 10px;
    border: 1px solid #ccc;
    padding: 10px;
    background: #f9f9f9;
}
.estrutura{
    background: rgb(234, 232, 232);
    padding: .5rem;
    text-align: center;
    font-weight: 440;
}
</style>