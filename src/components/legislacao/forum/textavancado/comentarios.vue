<template>
    <div>
        <div class="mt-2 d-flex ga-2 align-center pa-2">
            <v-icon>mdi-chat</v-icon>
                <h1 class="text-h5">Comentários</h1>
        </div>
        <div class="d-flex ga-2 align-center">
            <v-select
                :items="artsList"
                label="Filtro por Artigo"
                density="compact"
                variant="outlined"
                v-model="selectArt"
                clearable
                prepend-inner-icon="mdi-filter"
                style="max-width: 250px;"
                hide-details
            ></v-select>
            <v-select
                label="ordenar"
                density="compact"
                variant="outlined"
                :items="['Por data', 'Por Artigo']"
                v-model="selectOrder"
                clearable
                prepend-inner-icon="mdi-sort"
                style="max-width: 250px;"
                hide-details
                disabled
            ></v-select>
            <v-btn disabled><v-icon>mdi-sort</v-icon></v-btn>
        </div>
        <div class="mt-2">
            <v-responsive class="overflow-y-auto" max-height="500">
                <v-select
                    multiple
                    v-model="usersCommentsFilter"
                    :items="commentStore.readUsersComments"
                    item-title="key"
                    item-value="key"
                    variant="outlined"
                    label="Usuários"
                    density="compact"
                    class="pt-2"
                    clearable
                    prepend-inner-icon="mdi-chat"
                ></v-select>
            </v-responsive>
        </div>
        <!-- <p>Selecione o Artigo</p> -->

        <Loading v-if="load" class="my-2 py-2" />
        <div class="pa-2 text-left" v-else>
            <transition-group name="fade" tag="div">
                <div class="comment-box" v-for="item, i in commentsList" :key="item.id" v-if="commentStore.readComments.length">
                    <div class="profile-pic"></div>
                    <div class="comment-content">
                        <div class="username">{{ item.user_name }} 
                            <v-chip density="compact" :color="typeComment(item.type)?.color">{{ typeComment(item.type)?.title }}</v-chip>
                        </div>
                        <div>
                            Art. {{ item.art }}
                        </div>
                        <div class="timestamp text-subtitle">{{ item.data_include }}</div>
                       <div class="comment-text text-body-2">
                            <p v-html="comentarioFormatado(item.text)"></p>
                       </div>
                       <div class="menu-actions" >
                            <transition name="fade">
                                <div class="menu-comments">
                                    <div class="d-flex align-center mr-1">  
                                        <!-- <v-btn 
                                            variant="text"
                                            @click="showCommentResp = !showCommentResp">
                                            <v-badge 
                                                :content="forumStore.countRespComments(item.id)" :color="forumStore.countRespComments(item.id) ? 'error' : 'grey'"> <v-icon>mdi-forum-plus</v-icon>
                                            </v-badge>
                                        </v-btn> -->
                                    </div>
                                    <AvaliarComment :comment="item" />
                                </div>
                            </transition>
                        </div>
                       <!--  <v-expand-transition>
                            <CommentResp v-if="showCommentResp" :dispositivo="dispositivo" :idComment="item.id" />
                        </v-expand-transition> -->
                    </div>
                </div>
                <v-alert class="appear" v-else type="info" variant="text" text="Não há comentários neste dispositivo."></v-alert>
            </transition-group>
    
            <v-btn 
                v-if="commentStore.pagination.total > commentStore.readComments.length"
                append-icon="mdi-plus" variant="outlined" class="my-5" 
                block 
                @click="commentStore.getAllCommnetsLawMore($route.params.id)">
                Carregar
            </v-btn>
        </div>


    </div>
</template>

<script setup>
    import { ref, onMounted, watch } from 'vue';

    import { useRoute } from 'vue-router';
    const route = useRoute()

    import { useCommentStore } from '@/store/CommentStore';
    const commentStore = useCommentStore()

    import Loading from '../loading.vue';
    import { computed } from 'vue';
    import AvaliarComment from '../avaliarComment.vue';

    const load = ref(false)
    const selectArt = ref(null)
    const selectOrder = ref(null)   
    const usersCommentsFilter = ref([])


    onMounted( async () => {
        load.value = true
        commentStore.getAllCommnetsLaw(route.params.id)
        load.value = false
    })

    watch(
        () => route.params.id,
        (newId, oldId) => {
            console.log('teste')
            load.value = true
            commentStore.getAllCommnetsLaw(newId)
            load.value = false
        }
    )

    const commentsList = computed(() => {
        const list = commentStore.readComments

        if(selectArt.value) {
            return list.filter(item => item.art == selectArt.value)
        }   

        if(usersCommentsFilter.value.length) {
            return list.filter(item => usersCommentsFilter.value.includes(item.created_by))
        }

        return list
    })

    const artsList = computed(() => {
        const list = commentStore.readComments.map(item => item.art)
        return [ ...new Set(list)].sort((a, b) => a - b)
    })

    const typeComment = (item) => {
        if(item == 1) return { title: "Comentário", color: "success"}
        if(item == 2) return { title: "Pergunta", color: "primary"}
        if(item == 3) return { title: "Resposta", color: "orange"}
    }

    const comentarioFormatado = (item) => {
        try {
            return item.replace(/\n/g, '<br>')
        } catch (error) {
            return item
        }
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
.menu-comments{
    display: flex;
    justify-content: end;
    align-items: center;
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
    .menu-comments {
        flex-direction: column;
    }    
}

</style>