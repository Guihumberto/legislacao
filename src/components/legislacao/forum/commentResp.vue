<template>
    <Loading v-if="load" />
    <div class="response-comment">
            <v-form v-if="isComment" class="mx-2 mt-5" ref="form" @submit.prevent="saveComment">
                    <v-select
                        label="Responder"
                        variant="outlined"
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
                    <ComentEdit 
                        v-if="comment.type"
                        :label="types.find( x => x.id == comment.type).title"
                        v-model="comment.text"
                        :disabled="load"
                        :loading="load"
                        class="mt-5"
                        :max-length="1000"
                    />
                    <div class="d-flex justify-end my-2" v-if="comment.type">
                        <v-btn variant="text" color="primary" type="submit" :loading="load">Enviar</v-btn>
                    </div>
            </v-form>
            <transition-group name="fade" tag="div">
                <div class="comment-box" v-for="item, i in respComments" :key="item.id" v-if="respComments.length">
                    <div class="comment-content">
                        <div class="username">{{ item.user_name }} <v-chip density="compact" :color="typeComment(item.type).color">{{ typeComment(item.type).title }}</v-chip></div>
                        <div class="timestamp text-subtitle">{{ item.data_include }}</div>
                        <div class="comment-text text-body-2">
                            <p v-if="item.id != idEdit" v-html="comentarioFormatado(item.text)"></p>
                            <div v-else>
                                <v-form @submit.prevent="editComment(item)">
                                    <ComentEdit 
                                        label="Comentario"
                                        v-model="commentEdit"
                                        :disabled="loadEdit"
                                        :loading="loadEdit"
                                        class="mt-5"
                                        :max-length="1000"
                                    />
                                    <div class="text-right mt-5">
                                        <v-btn variant="text" @click="idEdit = null">Cancelar</v-btn>
                                        <v-btn :loading="loadEdit" class="ml-2" color="warning" @click="editComment(item)">Editar</v-btn>
                                    </div>
                                </v-form>
                            </div>
                        </div>
                        <div class="menu-actions" >
                            <transition name="fade">
                                <div class="menu-comments" v-if="item.id != idDelete">
                                    <div v-if="item.id != idEdit && LoginStore.readLogin.cpf == item.created_by">
                                        <v-btn variant="text" class="mr-1" @click="actionEdit(item)"><v-icon>mdi-pencil</v-icon></v-btn>
                                        <v-btn variant="text" color="red" @click="idDelete = item.id, loadDelete = false"><v-icon>mdi-delete</v-icon></v-btn>
                                    </div>
                                    <AvaliarComment :comment="item" />
                                </div>
                            </transition>
                            <transition name="fade">
                                <div class="d-flex align-center justify-end ga-2" v-if="item.id == idDelete">
                                    Tem certeza que deseja excluir este comentário?
                                    <div>
                                        <v-btn variant="text" class="text-capitalize mr-1" @click="idDelete = null">Cancelar</v-btn>
                                        <v-btn :loading="loadDelete" @click="deleteComment(item.id)" color="red">excluir</v-btn>
                                    </div>
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>
            </transition-group>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'

    import { useForumStore } from '@/store/ForumStore';
    const forumStore = useForumStore()

    import { useLoginStore } from '@/store/LoginStore';
    const LoginStore = useLoginStore()
    
    import Loading from './loading.vue';
    import AvaliarComment from './avaliarComment.vue';
    import ComentEdit from './comentarios/comentEdit.vue';

    const respComments = ref([])
    const idEdit = ref(null)
    const idDelete = ref(null)
    const load = ref(false)
    const form = ref(null)

    const props = defineProps({
        dispositivo: Object,
        idComment: String
    })

    onMounted( async () => {
        load.value = true
        const resp = await forumStore.getRespComments(props.idComment)
        respComments.value = resp
        load.value = false
    })

    const comentarioFormatado = (item) => item.replace(/\n/g, '<br>')

    const types = [
        {id: 1, title: "Comentário"},
        {id: 3, title: "Resposta"},
    ]

    const rules = ref({
        required: (value) => !!value || "Campo obrigatório"
    })

    const isComment = computed(() => {
        const cpf = LoginStore.readLogin.cpf
        const grupo = forumStore.readGroupForum._source
        const participantes = [ ...grupo.group, grupo.created_by ]

        return grupo.open
        ? true
        : !!participantes.find( x => x == cpf)
    })

    const typeComment = (item) => {
        if(item == 1) return { title: "Comentário", color: "success"}
        if(item == 2) return { title: "Pergunta", color: "primary"}
        if(item == 3) return { title: "Resposta", color: "orange"}
        if(item == 4) return { title: "Resumo", color: "purple"}
        return { title: "Resposta", color: "orange"}
    }

    const comment = ref({
        text: null, 
        type: '',
        idRef: props.dispositivo.id, 
        commentRef: props.idComment,
        idGroup: props.dispositivo.idGroup,
        art: props.dispositivo.art,
        created_by: LoginStore.readLogin.cpf
    })

    const saveComment = async () => {
        
            comment.value = {
                ...comment.value,
                idRef: props.dispositivo.id,
                commentRef: props.idComment,
                idGroup: props.dispositivo.idGroup,
                art: props.dispositivo.art,
                created_by: LoginStore.readLogin.cpf
            }

            const { valid } = await form.value.validate()
            if(!valid) return
            load.value = true
            const resp = await forumStore.saveComment(comment.value, true)
            comment.value.pontos = 0
            comment.value.user_name = 'Eu'
            respComments.value.push({ id: resp, ...comment.value })
            comment.value.text = null
            comment.value.type = ''
            load.value = false
    }

    const loadDelete = ref(false)
    const loadEdit = ref(false) 
    const commentEdit = ref(null)  

    const deleteComment = async (id) => {
        loadDelete.value = true
        await forumStore.deleteRespComment(id)
        respComments.value = respComments.value.filter(item => item.id != id)
        idDelete.value = null
        loadDelete.value = false
    }

    const actionEdit = (item) => {
        loadEdit.value = false
        idDelete.value = null
        idEdit.value = item.id
        commentEdit.value = item.text
    }

    const editComment = async (item) => {
        loadEdit.value = true
        const compare = respComments.value.find(x => x.id == item.id).text
        const editCom = respComments.value.find(x => x.id == item.id)
        editCom.text = commentEdit.value
        if(compare.trim() != commentEdit.value.trim()) await forumStore.editTextComment(editCom)
        idEdit.value = null
        commentEdit.value = null
        loadEdit.value = false
    }

</script>

<style scoped>
.response-comment{
    padding: 1rem;
    border: 1px solid rgb(185, 181, 181);
    margin-top: 1rem;
    border-radius: 12px;
}
.appear{
    animation: aparecer 1s ease-in-out;
}
.comment-box {
    background: rgb(238, 235, 235);
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
    padding: 1rem;
}
.menu-actions{
    position: relative;
}
.menu-comments{
    display: flex;
    justify-content: end;
    align-items: baseline;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s, transform 0.4s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Estilos para recuo adequado das listas */
ul, ol {
    padding-left: 24px;
    margin: 8px 0;
}

@media (max-width: 600px) {
    .profile-pic{
        display: none;
    }
    .menu-comments {
        flex-direction: column;
    }    
}
</style>