<template>
    <v-card
        title="Comentários do Artigo"
        subtitle="Todos os comentários dos dispositivos no Artigo."
    >
        <v-card-text>
            <Loading v-if="load" class="my-2 py-2" />
            <div class="pa-2 text-left" v-else>
                <transition-group name="fade" tag="div">
                    <div class="comment-box" v-for="item, i in commentsArt" :key="i" v-if="commentsArt.length">
                        <div class="profile-pic">{{ item?.user_name.slice(0, 2) || '' }}</div>
                        <div class="comment-content">
                            <div class="username">{{ item.user_name }} <v-chip density="compact" :color="typeComment(item.type).color">{{ typeComment(item.type).title }}</v-chip></div>
                            <div class="timestamp text-subtitle">{{ item.data_include }}</div>
                            <div class="comment-text text-body-2">
                                <p v-html="item.text"></p>
                            </div>
                        </div>
                    </div>
                    <v-alert class="appear" v-else type="info" variant="text" text="Não há comentários neste dispositivo."></v-alert>
                </transition-group>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import Loading from './loading.vue';

    import { useForumStore } from '@/store/ForumStore';
    const forumStore = useForumStore()

    const commentsArt = ref([])
    const load = ref(false)

    const props = defineProps({
        dispositivo: Object
    })

    onMounted( async () => {
        load.value = true
        const resp = await forumStore.getAllCommentsArt(props.dispositivo)
        commentsArt.value = resp
        load.value = false
    })

    const typeComment = (item) => {
        if(item == 1) return { title: "Comentário", color: "success"}
        if(item == 2) return { title: "Pergunta", color: "primary"}
        if(item == 3) return { title: "Resposta", color: "orange"}
        if(item == 4) return { title: "Resumo", color: "purple"}
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