<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
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

    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()


</script>

<style lang="scss" scoped>
    .listFolder{
        display: flex;
        flex-direction: column;
        justify-self: start;
    }
</style>