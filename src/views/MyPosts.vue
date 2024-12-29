<template>
    <section>
        <div class="container">
            <div class="d-flex justify-space-between mb-5">
                <h1 class="text-h5">Meus Posts</h1>
                <v-btn variant="flat" prepend-icon="mdi-plus" color="success" @click="router.push('/myposts/create')">Criar Post</v-btn>
            </div>
            <ListPost />
        </div>
    </section>
</template>

<script setup>
    import ListPost from '@/components/Posts/create/listPost.vue';
    import { useRouter } from 'vue-router' 
    const router = useRouter()

    import { useUserAreaStore } from '@/store/AreaUserStore';
    import { usePostStore } from '@/store/PostStore';
    const postStore = usePostStore()
    const userAreaStore = useUserAreaStore()

    postStore.getPosts()
    userAreaStore.getDocs()

</script>

<style lang="scss" scoped>
    section .container{
        min-height: calc(100vh - 400px);
    }
    .listFolder{
        display: flex;
        flex-direction: column;
        justify-self: start;
    }
</style>