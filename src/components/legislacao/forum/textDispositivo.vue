<template>
    <div @mouseover="showActions = true" @mouseleave="showActions = false" class="relativeContainer">
        <TextEdit :dispositivo="dispositivo" :search="search" />
      
        <v-expand-transition>
            <div class="action-art" v-if="isArt && showActions || activeArt">
                <v-btn class="pa-0" stacked variant="text" density="compact" @click="activeArt = !activeArt">
                    <v-icon>mdi-forum</v-icon>
                </v-btn>
            </div>
        </v-expand-transition>

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
            <div class="text-right border rounded mt-2 bg-blue-grey-lighten-5"  v-if="activeComment || dispositivo.comments.length > 0">
               <transition name="fade">
                <div v-if="activeComment">
                    <v-form v-if="isComment" class="mx-2 mt-5" ref="form" @submit.prevent="saveComment">
                         <v-select
                             label="Comentar"
                             density="compact"
                             :items="types"
                             item-title="title"
                             item-value="id"
                             class="mb-2"
                             v-model="comment.type"
                             style="width: 200px;"
                             hide-details
                             clearable
                         ></v-select>
                         <v-textarea
                             v-if="comment.type"
                             :label="types.find( x => x.id == comment.type).title"
                             density="compact"
                             variant="outlined"
                             v-model="comment.text"
                             clearable
                             :rules="[ rules.required ]"
                         >
                         </v-textarea>
                         <div class="d-flex justify-end my-2" v-if="comment.type">
                             <v-btn color="primary" type="submit" :loading="load">Enviar</v-btn>
                         </div>
                    </v-form>
                    <Comments :dispositivo="dispositivo" ref="childRef" />
                </div>
               </transition>    
            </div>
        </v-expand-transition>
        
        <v-dialog
            v-model="activeArt"
            max-width="700"
        >
            <CommentsArt :dispositivo="dispositivo" />
        </v-dialog>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue';

    import CommentsArt from './commentsArt.vue';
    import Comments from './comments.vue';
    import TextEdit from './textEdit.vue';

    import { useForumStore } from '@/store/ForumStore';
    const forumStore = useForumStore()

    import { useLoginStore } from '@/store/LoginStore';
    const LoginStore = useLoginStore()

    const showActions = ref(false);
    const activeComment = ref(false)
    const activeArt = ref(false)
    const form = ref(null)
    const load = ref(false)

    const isArt = computed(() => {
        return props.dispositivo.textlaw.startsWith('Art') || props.dispositivo.textlaw.startsWith('<b>Art')
        ? true
        : false
    })

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
        type: '',
        idRef: props.dispositivo.id, 
        commentRef: null,
        idGroup: props.dispositivo.idGroup,
        art: props.dispositivo.art,
    })

    const types = [
        {id: 1, title: "Comentário"},
        {id: 2, title: "Pergunta"},
    ]

    const saveComment = async () => {
        
        comment.value = {
            ...comment.value,
            idRef: props.dispositivo.id,
            idGroup: props.dispositivo.idGroup,
            art: props.dispositivo.art,
        }

        const { valid } = await form.value.validate()
        if(!valid) return
        load.value = true
        const resp = await forumStore.saveComment(comment.value)
        console.log('comment save', resp);
        comment.value.pontos = 0
        comment.value.user_name = 'Eu'
        if (childRef.value) childRef.value.adicionarObjeto(comment.value, resp);
        comment.value.text = null
        load.value = false
    }

    const childRef = ref(null);
    
</script>

<style scoped>
.relativeContainer{
    position: relative;
    display: inline-block; 
    width: 100%;
}

.action-art {
    position: absolute;
    top: 0;
    left: -60px; /* Ajuste conforme necessário para alinhar ao lado */
    background: transparent;
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

</style>