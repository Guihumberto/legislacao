<template>
    <Loading v-if="load" class="my-2 py-2" />
    <div class="pa-2 text-left" v-else>
        <transition-group name="fade" tag="div">
            <div class="comment-box" v-for="item, i in listComments" :key="item.id" v-if="listComments.length">
                <div class="profile-pic">{{ item?.user_name.slice(0, 2) || '' }}</div>
                <div class="comment-content">
                    <div class="username">{{ item.user_name }} <v-chip density="compact" :color="typeComment(item.type).color">{{ typeComment(item.type).title }}</v-chip></div>
                    <div class="timestamp text-subtitle">{{ item.data_include }}</div>
                    <div class="comment-text text-body-2">
                        <p v-if="item.id != idEdit" v-html="comentarioFormatado(item.text)"></p>
                        <div v-else>
                            <v-form>
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
                                <div class="d-flex align-center mr-1">
                                    <div class="d-flex" v-if="item.id != idEdit && LoginStore.readLogin.cpf == item.created_by">
                                        <v-btn variant="text" class="mr-2 mt-5" @click="actionEdit(item)"><v-icon>mdi-pencil</v-icon></v-btn>
                                        <v-btn variant="text" class="mt-5" color="red" @click="idDelete = item.id, loadDelete = false, showCommentResp = false"><v-icon>mdi-delete</v-icon></v-btn>
                                    </div>    
                                    <v-btn 
                                        variant="text"
                                        class="mt-5"
                                        @click="showCommentResp = !showCommentResp">
                                        <v-badge 
                                            :content="forumStore.countRespComments(item.id)" :color="forumStore.countRespComments(item.id) ? 'error' : 'grey'"> <v-icon>mdi-forum-plus</v-icon>
                                        </v-badge>
                                    </v-btn>
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
                    <v-expand-transition>
                        <CommentResp v-if="showCommentResp" :dispositivo="dispositivo" :idComment="item.id" />
                    </v-expand-transition>
                </div>
            </div>
            <v-alert class="appear" v-else type="info" variant="text" text="Não há comentários neste dispositivo."></v-alert>
        </transition-group>
    </div>
</template>

<script setup>
        import { onMounted, ref, computed } from 'vue';
        
        import Loading from './loading.vue';
        import CommentResp from './commentResp.vue';
        import AvaliarComment from './avaliarComment.vue';
        import ComentEdit from './comentarios/comentEdit.vue';

        
        import { useForumStore } from '@/store/ForumStore';
        const forumStore = useForumStore()
        
        import { useLoginStore } from '@/store/LoginStore';
        const LoginStore = useLoginStore()

        const props = defineProps({
            dispositivo: Object,
            usersCommentsFilter: Array
        })

        const comments = ref([])
        const commentEdit = ref(null)
        const idDelete = ref(null)
        const idEdit = ref(null)
        const load = ref(false)
        const loadEdit = ref(false)
        const loadDelete = ref(false)
        const showCommentResp = ref(false)

        onMounted( async () => {
           load.value = true
           const resp = await forumStore.getComments(props.dispositivo.comments)
           await forumStore.getAllCommentsArt(props.dispositivo)
           comments.value = resp
           load.value = false
        })

        const listComments = computed(() => {
            try {

                const list = comments.value.filter(item => !item.commentRef)

                // if(props.usersCommentsFilter.length){
                //     list = list.filter(x => props.usersCommentsFilter.includes(x.created_by))
                //     console.log(list.filter(x => props.usersCommentsFilter.includes(x.created_by)));
                // }

                return list
            } catch (error) {
                comments.value = []
                return comments.value
            }
        })

        const typeComment = (item) => {
            if(item == 1) return { title: "Comentário", color: "success"}
            if(item == 2) return { title: "Pergunta", color: "primary"}
            if(item == 3) return { title: "Resposta", color: "orange"}
            if(item == 4) return { title: "Resumo", color: "purple"}
        }

        const adicionarObjeto = (objeto, idU) => {
            objeto.created_by = LoginStore.readLogin.cpf
            comments.value.unshift({ ...objeto, id: idU });
        };
        
        defineExpose({ adicionarObjeto })

        const deleteComment = async (id) => {
            loadDelete.value = true
            const listIdComment = props.dispositivo.comments.filter(item => item != id)
            await forumStore.deleteComment(id, props.dispositivo.id, listIdComment)
            comments.value = comments.value.filter(item => item.id != id)
            idDelete.value = null
            loadDelete.value = false
        }

        const actionEdit = (item) => {
            showCommentResp.value = false
            loadEdit.value = false
            idDelete.value = null
            idEdit.value = item.id
            commentEdit.value = item.text
        }

        const editComment = async (item) => {
            loadEdit.value = true
            const compare = comments.value.find(x => x.id == item.id).text
            const editCom = comments.value.find(x => x.id == item.id)
            editCom.text = commentEdit.value
            if(compare.trim() != commentEdit.value.trim()) await forumStore.editTextComment(editCom)
            idEdit.value = null
            commentEdit.value = null
            loadEdit.value = false
        }

        const comentarioFormatado = (item) => item.replace(/\n/g, '<br>')
        

</script>

<style scoped>
.appear{
    animation: aparecer 1s ease-in-out;
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
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
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

.menu-actions{
    position: relative;
}
.menu-comments{
    display: flex;
    justify-content: end;
    align-items: center;
}

.comment-text {
    margin-top: 5px;
}

.comment-text p > ol,
.comment-text p > ul {
  margin-left: 2rem;
  padding-left: 1.5rem;
}

.comment-text li {
  margin-bottom: 0.25rem;
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

@media (max-width: 600px) {
    .profile-pic{
        display: none;
    }
    .menu-comments {
        flex-direction: column;
    }    
}

</style>