<template>
    <div class="wrapper">
        <section class="conteudo" ref="topUp" :class="rightWidth > 900 ? 'conteudo1' : 'conteudo2'">
            <div class="mt-2 d-flex ga-2 align-center pa-2">
                <v-icon>mdi-chat</v-icon> <h1 class="text-h5">Comentários</h1>
            </div>
            <v-card>
                <v-card-text>
                    <div class="d-flex ga-2 align-center">
                        <v-select
                            :items="listArts"
                            label="Filtro por Artigo"
                            density="compact"
                            variant="outlined"
                            v-model="selectArt"
                            clearable
                            prepend-inner-icon="mdi-filter"
                            style="max-width: 250px;"
                            hide-details
                            multiple
                        ></v-select>
                        <v-select
                            label="ordenar"
                            density="compact"
                            variant="outlined"
                            :items="listOrderby"
                            item-title="name"
                            item-value="id"
                            v-model="selectOrder.tipo"
                            clearable
                            prepend-inner-icon="mdi-sort"
                            style="max-width: 250px;"
                            hide-details
                        ></v-select>
                        <v-btn @click="selecionarOrdem"><v-icon>{{ selectOrder.order == 'asc' ?  'mdi-sort-ascending' : 'mdi-sort-descending' }}</v-icon></v-btn>
                    </div>
                    <div class="mt-2 d-flex ga-2 align-center">
                            <v-select
                                multiple
                                v-model="usersCommentsFilter"
                                :items="listUsers"
                                item-title="name"
                                item-value="cpf"
                                variant="outlined"
                                label="Usuários"
                                density="compact"
                                clearable
                                prepend-inner-icon="mdi-chat"
                                hide-details
                            ></v-select>
                            <v-btn prepend-icon="mdi-magnify" color="success" variant="flat" @click="searchComments">Buscar</v-btn>
                    </div>
                    <div class=" text-overline mt-5 border rounded-lg pa-2 text-right" style="border-color: #e0e0e0;">
                        <p v-if="commentStore.apenasmeusComentarios">Apenas você comentou nesta norma ({{ commentStore.readTotalCommentsUser }})</p>
                        <p v-else>você tem {{ commentStore.readTotalCommentsUser }} comentários do total de {{ commentStore.readTotalComments }}</p>
                    </div>
                </v-card-text>
            </v-card>
            <Loading v-if="load" class="my-10 py-2" />
            <div class="mt-2 text-left" v-else>
                <transition-group name="fade" tag="div">
                    <div class="comment-box" v-for="item, i in commentsList" :key="item.id" v-if="commentStore.readComments.length">
                        <div class="profile-pic">{{ item?.user_name.slice(0, 2) || '' }}</div>
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
                    v-if="commentStore.pagination.total > commentStore.readComments.length && commentsList.length"
                    append-icon="mdi-plus" variant="outlined" class="my-5" 
                    block 
                    @click="searchCommentsMore">
                    Carregar
                </v-btn>
            </div>
        </section>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch, inject } from 'vue';

    import { useRoute } from 'vue-router';
    const route = useRoute()

    const rightWidth = inject('rightWidth')

    import { useCommentStore } from '@/store/CommentStore';
    const commentStore = useCommentStore()

    import Loading from '../loading.vue';
    import { computed } from 'vue';
    import AvaliarComment from '../avaliarComment.vue';

    const load = ref(false)
    const selectArt = ref([])
    const selectOrder = ref({
        tipo: 'art',
        order: 'asc'
    })   

    const listOrderby = [
        {id: 'data_include', name: 'pela data da inclusão' },
        {id: 'art', name: 'Pelo artigo' }
    ]

    const selecionarOrdem = () => {
        if(selectOrder.value.order == 'asc') {
            selectOrder.value.order = 'desc'
           return
        }   
        if(selectOrder.value.order == 'desc') {
            selectOrder.value.order = 'asc'
            return
        } 
    }

    const order = computed(() => {
        return  {
                [selectOrder.value.tipo]: {
                        order: selectOrder.value.order, 
                     }
                }
    })

    const usersCommentsFilter = ref([])

    const listArtsSelected = computed(() => {
        const queryArts = route.query.arts
        if (queryArts) {
            if (Array.isArray(queryArts)) {
               return queryArts.map(art => parseInt(art))
            } 
            else {
                return [parseInt(queryArts)]
            } 
        } else {
           return []
        }
    })

    watch(
        () => route.params.id,
        (newId, oldId) => {
            load.value = true
            commentStore.getAllCommnetsLaw(newId)
            load.value = false
        }
    )

    watch(
        () => route.query.arts,
        () => {
            selectArt.value = listArtsSelected.value
            searchComments()
        }
    )

    watch(
        () => route.query.art,
        () => {
           selectArt.value = [ route.query.art ]
           searchComments()
        }
    )

    onMounted( async () => {
        load.value = true
        if(listArtsSelected.value.length) {
            selectArt.value = listArtsSelected.value
            await searchComments()
        } else {
            await commentStore.getList(route.params.id, order.value)
        }

        load.value = false
    })

    const listArts = computed(() => {
        return commentStore.readListArts.map(x => x.key).sort((a, b) => a - b)
    })

    const listUsers = computed(() => {
        return commentStore.readListUsers.map(x => ({ cpf: x.cpf, name: x.name }))
    })

    const commentsList = computed(() => {
        const list = commentStore.readComments

        if(selectArt.value.length) {
            let inteiros = selectArt.value.map(Number)
            return list.filter(item => inteiros.includes(item.art))
        }   

        if(usersCommentsFilter.value.length) {
            return list.filter(item => usersCommentsFilter.value.includes(item.created_by))
        }

        return list
    })


    const typeComment = (item) => {
        if(item == 1) return { title: "Comentário", color: "success"}
        if(item == 2) return { title: "Pergunta", color: "primary"}
        if(item == 3) return { title: "Resposta", color: "orange"}
        if(item == 4) return { title: "Resumo", color: "purple"}
    }

    const comentarioFormatado = (item) => {
        try {
            return item.replace(/\n/g, '<br>')
        } catch (error) {
            return item
        }
    } 

    const searchComments = async () => {
        const objeto = {
            listArts: selectArt.value,
            listCpfs: usersCommentsFilter.value
        }

        load.value = true
        await commentStore.getAllCommnetsLaw(route.params.id, objeto, order.value)
        load.value = false
    }

    const searchCommentsMore = async () => {
        if(commentStore.pagination.total > commentStore.readComments.length) {
            searchComments()
        }
        const objeto = {
            listArts: selectArt.value,
            listCpfs: usersCommentsFilter.value
        }
 
        load.value = true
        commentStore.getAllCommnetsLawMore(route.params.id, objeto, order.value)
        load.value = false
    }

</script>

<style scoped>
    .wrapper {
        display: flex;
        justify-content: center; /* Isso centraliza o 'conteudo' se ele não ocupar 100% da largura do 'wrapper' */
        min-height: 50vh;
        font-family: Arial, sans-serif;
        padding-bottom: 2rem;
        /* Se você quer que o conteúdo ocupe toda a altura do wrapper, adicione: */
        align-items: stretch;
    }

    .conteudo {
        margin-top: 1rem;
        padding: 0 20px;
        background-color: #fffdfd;
        flex-grow: 1; /* Permite que o 'conteudo' se expanda */
        /* 'box-sizing: border-box;' é bom para evitar problemas com padding e largura */
        box-sizing: border-box;
    }

    /* Se a ideia é que 'conteudo1' e 'conteudo2' limitem a largura máxima, mantenha assim: */
    .conteudo1 {
        max-width: 900px; /* Altere de 'width' para 'max-width' para que ele cresça até 900px */
    }

    .conteudo2 {
        max-width: 900px;
    }
    
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