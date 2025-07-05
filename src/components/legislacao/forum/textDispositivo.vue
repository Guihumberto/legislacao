<template>
    <div @mouseover="handleMouseOver" @mouseleave="handleMouseLeave" class="relativeContainer">
        <TextEdit :dispositivo="dispositivo" :search="search" />
      
        <v-expand-transition>
            <div class="action-art" v-if="isArt && showActions || activeArt" >
                <v-btn variant="text" @click="activeArt = !activeArt" title="Todos os comentários do Artigo">
                    <v-icon>mdi-forum</v-icon>
                </v-btn>
                <v-btn 
                    title="Selecionar Artigo"
                    variant="text"
                    @click="selectArt(dispositivo)"> <v-icon>mdi-check-all</v-icon>
                </v-btn>
            </div>
        </v-expand-transition>

        <v-expand-transition>
            <div class="action-container" v-if="showActions || activeComment || dispositivo.comments.length > 0">
                <v-btn variant="text" @click="activeComment = !activeComment">
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
                        <v-row class="d-flex" v-if="LoginStore.user" >
                            <v-col cols="12" sm="3">
                                <v-tooltip text="Enter para salvar" location="top" color="info">
                                    <template v-slot:activator="{ props }">
                                        <v-autocomplete
                                            v-bind="props"
                                            v-model="tag"
                                            v-model:search="searchTag"
                                            :items="filteredTags"
                                            label="Tag"
                                            variant="outlined"
                                            density="compact"
                                            clearable
                                            :loading="loadTag"
                                            :disabled="loadTag"
                                            hide-no-data
                                            hide-details
                                            @keydown.enter="saveTag"
                                            :search-input.sync="tag"
                                        ></v-autocomplete>
                                    </template>
                                </v-tooltip>
                                <!-- <v-text-field
                                    label="Tag"
                                    variant="outlined"
                                    density="compact"
                                    clearable
                                    @keypress.enter="saveTag"
                                    v-model="tag"
                                    :disabled="loadTag"
                                    :loading="loadTag"
                                ></v-text-field> -->
                            </v-col>
                            <v-col cols="12" sm="9">
                                <v-chip-group column>
                                    <v-menu
                                        v-model="menu"
                                        :close-on-content-click="false"
                                        location="top"
                                    >
                                    <template v-slot:activator="{ props }">
                                        <v-chip @click="tag = item" v-bind="props" v-for="item, i in dispositivo?.tags" :key="item+i" closable @click:close="deleteTag(item)">{{item}}</v-chip>
                                    </template>

                                    <v-btn :loading="loadTag" :disabled="loadTag" @click="copyTagArg" prepend-icon="mdi-content-copy">Copiar tag para todo os dispositivos do artigo</v-btn>
                                </v-menu>
                                </v-chip-group>
                            </v-col>
                        </v-row>
                        <div class="d-flex align-center ga-2 my-2">
                            <div>
                                <v-select
                                    label="Comentar"
                                    density="compact"
                                    :items="types"
                                    item-title="title"
                                    item-value="id"
                                    variant="outlined"
                                    v-model="comment.type"
                                    style="width: 218px;"
                                    hide-details
                                    clearable
                                ></v-select>
                            </div>
                            <v-btn @click="gerarResumo()" v-if="comment.type == 4" color="red" variant="text" prepend-icon="mdi-robot" :loading="loadResumo" :disabled="loadResumo">Criar Resumo do artigo por ia</v-btn>
                        </div>
                        <ComentEdit 
                            v-if="comment.type"
                            :label="types.find(x => x.id == comment.type).title"
                            v-model="comment.text"
                            :disabled="loadResumo"
                            :loading="loadResumo"
                            class="mt-5"
                            :max-length="1000"
                        />
                         <div class="d-flex justify-end my-2" v-if="comment.type">
                             <v-btn color="primary" type="submit" :loading="load">Enviar</v-btn>
                         </div>
                    </v-form>
                    <Comments :dispositivo="dispositivo" ref="childRef" :usersCommentsFilter="usersCommentsFilter" />
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
    import { ref, computed, watch, toRefs, inject  } from 'vue';

    import CommentsArt from './commentsArt.vue';
    import Comments from './comments.vue';
    import ComentEdit from './comentarios/comentEdit.vue';
    import TextEdit from './textEdit.vue';
    import { useForumStore } from '@/store/ForumStore';
    import { useLoginStore } from '@/store/LoginStore';
    import { useSnackStore } from '@/store/snackStore';
    import { useRoute, useRouter } from 'vue-router'

    const forumStore = useForumStore()
    const LoginStore = useLoginStore()
    const snackStore = useSnackStore()

    const route = useRoute()
    const router = useRouter()

    const props = defineProps({
        dispositivo: Object,
        search: String,
        listTags: Array,
        usersCommentsFilter: Array,
    })

    const searchTag = ref('')
    const menu = ref(false)

    const { dispositivo, listTags } = toRefs(props)

    const filteredTags = computed(() => {
        const input = tag.value ? tag.value.toLowerCase() : ''
        return listTags.value.filter(t =>
            typeof t === 'string' &&
            !dispositivo.value.tags.includes(t) &&
            t.toLowerCase().includes(input)
        )
    })

    const showActions = ref(false);
    let hideActionsTimeout = null

    const handleMouseOver = () => {
        clearTimeout(hideActionsTimeout)
        showActions.value = true
    }

    const handleMouseLeave = () => {
            hideActionsTimeout = setTimeout(() => {
            showActions.value = false
        }, 300) // 300ms de atraso
    }

    const activeComment = ref(false)
    const activeArt = ref(false)
    const form = ref(null)
    const load = ref(false)

    const closeActiveComment = () => {
        activeComment.value = false
    }

    defineExpose({
        closeActiveComment
    })

    watch(() => route.query.page, (newPage, oldPage) => {
        activeComment.value = false
      }
    )

    watch(() => props.search, (newPage, oldPage) => {
        activeComment.value = false
      }
    )

    const isArt = computed(() => {
        if (!props.dispositivo || !props.dispositivo.textlaw) return false
        const plainText = props.dispositivo.textlaw.replace(/<[^>]*>/g, '').trim()
        return plainText.startsWith('Art')
    })

    const isComment = computed(() => {
        const cpf = LoginStore.readLogin.cpf
        const grupo = forumStore.readGroupForum._source
        const participantes = [ ...grupo.group, grupo.created_by ]

        return grupo.open
        ? true
        : !!participantes.find( x => x == cpf)

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

    const types = computed(() => {
        return [
            ...(isArt.value ? [{ id: 4, title: "Resumo" }] : []),
            { id: 1, title: "Comentário" },
            { id: 2, title: "Pergunta" },
        ]
    })

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
        comment.value.type = null
        load.value = false
    }

    const childRef = ref(null);

    const emits = defineEmits(['open', 'update-dispositivo'])

    const selectArt = (item) => {
        if(item.art == route.query.art) {
            router.push({query: {id: null, art: null}})
            return
        }
        router.push({query: {id: item.id, art: item.art}})
        emits('open')
    }

    const tag = ref(null)
    const loadTag = ref(false)
    const dispositivoLocal = ref({ ...props.dispositivo })

    const saveTag = async () => {
        if(searchTag.value) saveTag2()
        
        if(!tag.value) return

        const exist = props.dispositivo?.tags.find( x => x.toLowerCase().trim() == tag.value.toLowerCase().trim())
        if(exist) {
            tag.value = null
            snackStore.activeSnack('Tag já cadastrada.', 'warning')
            return
        }

        loadTag.value = true
        const resp = await forumStore.saveTag(tag.value, props.dispositivo.id)
        props.dispositivo?.tags.push(tag.value.toLowerCase().trim())
        tag.value = null
        loadTag.value = false
        snackStore.activeSnack('Tag cadastrada!', 'success')
    }

    const deleteTag = async (item) => {
        loadTag.value = true
        const resp = await forumStore.saveTag(item, props.dispositivo.id)
        dispositivoLocal.value.tags = dispositivoLocal.value.tags.filter( x => x != item)
        emits('update-dispositivo', dispositivoLocal.value)
        loadTag.value = false
        snackStore.activeSnack('Tag excluída!', 'error')
    }

    const saveTag2 = () => {
        tag.value = searchTag.value
        searchTag.value = ''
    }

    const copyTagArg = async () => {
        const list = listFinal.value.filter(x => x.art == props.dispositivo.art)

        loadTag.value = true
        for (const el of list) {
            const exist = el?.tags.find(x => x.toLowerCase().trim() == tag.value.toLowerCase().trim())
            if (!exist && tag.value) {
                await forumStore.saveTag(tag.value, el.id)
                el.tags.push(tag.value.toLowerCase().trim())
            }
        }
        loadTag.value = false
        tag.value = null
        snackStore.activeSnack('Tags copiadas!', 'success')
    }

    //resumo

    import { useSearchStore } from '@/store/SearchStore';
    
    const searchStore = useSearchStore()

    const listFinal = inject('listFinal')
    const loadResumo = ref(false)

    const gerarResumo = async () => {
        loadResumo.value = true
        const artSelects = listFinal.value.filter( x => x.art == props.dispositivo.art).map(x => x.textlaw).join('\n')
        const resumo = await searchStore.resumoPage(artSelects)
        comment.value.text = resumo
        loadResumo.value = false
    }
    
</script>

<style scoped>
.relativeContainer{
    position: relative;
    display: inline-block; 
    width: 100%;
}

.action-art {
    position: absolute;
    display: flex;
    flex-direction: column;;
    top: 0;
    left: -70px; /* Ajuste conforme necessário para alinhar ao lado */
    background: transparent;
}

.action-container {
    position: absolute;
    top: 0;
    right: -70px; /* Ajuste conforme necessário para alinhar ao lado */
    background: transparent;
}

.comment-box {
    margin-top: 10px;
    border: 1px solid #ccc;
    padding: 10px;
    background: #f9f9f9;
}

@media (max-width: 768px) {
    .action-container {
        right: -50px;
    }  
    .action-art {
        left: -50px;
    }  
}

</style>