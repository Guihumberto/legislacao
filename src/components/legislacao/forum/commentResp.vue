<template>
    <div class="response-comment">
            <div class="comment-box" v-for="item, i in 5" :key="item">
                <div class="profile-pic"></div>
                <div class="comment-content">
                    <div class="username">{{ item.user_name }} <v-chip density="compact" :color="typeComment(item.type).color">{{ typeComment(item.type).title }}</v-chip></div>
                    <!-- <div class="timestamp text-subtitle">{{ item.data_include }}</div>
                    <div class="comment-text text-body-2">
                        <p v-if="item.id != idEdit">{{ item.text }}</p>
                        <div v-else>
                            <v-form>
                                <v-textarea
                                    label="Comentario"
                                    variant="outlined"
                                    density="compact"
                                    v-model="commentEdit"
                                ></v-textarea>
                                <div class="text-right">
                                    <v-btn variant="text" @click="idEdit = null">Cancelar</v-btn>
                                    <v-btn :loading="loadEdit" class="ml-2" color="warning" @click="editComment(item)">Editar</v-btn>
                                </div>
                            </v-form>
                        </div>
                    </div>
                    <div class="menu-actions" >
                        <transition name="fade">
                            <div class="d-flex justify-end" v-if="item.id != idDelete">
                                <div v-if="item.id != idEdit && LoginStore.readLogin.cpf == item.created_by">
                                    <v-btn variant="text" class="mr-2" icon="mdi-pencil" @click="actionEdit(item)"></v-btn>
                                    <v-btn variant="text" color="red" icon="mdi-delete" @click="idDelete = item.id, loadDelete = false"></v-btn>
                                </div>
                                <v-btn variant="text" icon="mdi-forum-plus" @click="showCommentResp = !showCommentResp"></v-btn>
                                <v-btn 
                                    prepend-icon="mdi-chevron-up" variant="text" >
                                    <template v-slot:append>
                                        <v-badge
                                        color="info"
                                        content="0"
                     
                                        ></v-badge>
                                    </template>
                                </v-btn>
                                <v-btn 
                                    prepend-icon="mdi-chevron-down" variant="text" >
                                    <template v-slot:append>
                                        <v-badge
                                        color="error"
                                        content="0"
                                        ></v-badge>
                                    </template>
                                </v-btn>    
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
                    </div> -->
                </div>
            </div>
    </div>
</template>

<script setup>

const typeComment = (item) => {
    if(item == 1) return { title: "Comentário", color: "success"}
    if(item == 2) return { title: "Pergunta", color: "primary"}
    if(item == 3) return { title: "Resposta", color: "orange"}
    return { title: "Resposta", color: "orange"}
}

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
.menu-actions{
    position: relative;
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

</style>