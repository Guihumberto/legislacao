<template>
    <section>
        <div class="container">
            <v-btn variant="text" class="pa-0" color="grey" prepend-icon="mdi-chevron-left" @click="router.push('/myposts')">Voltar</v-btn>
            <h1 class="text-h5 mb-5">Criar Post</h1>
           <CreatePost />
        </div>
    </section>
</template>

<script setup>
    import CreatePost from '@/components/Posts/create/createPost.vue';
    import { useRouter } from 'vue-router' 
    const router = useRouter()


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