<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <div class="d-flex justify-space-between align-center">
                <h1 class="text-h5 d-flex align-center"> <v-icon color="#030131" size="1.7rem" class="mr-1">mdi-forum</v-icon>Meus Foruns</h1>
                <ConfigMyGroup :groups="forumStore.readMyGroup" />
            </div>
            <router-link to="/permissoes"> <v-icon>mdi-check-circle</v-icon> Permissões</router-link>
            <ListForuns />
        </div>
    </section>
</template>

<script setup>
    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()

    import { useForumStore } from '@/store/ForumStore'
    const forumStore = useForumStore()

    import ListForuns from '@/components/legislacao/forum/foruns/listForuns.vue';
    import ConfigMyGroup from '@/components/dialogs/configMyGroup.vue';
    
</script>

<style scoped>

</style>