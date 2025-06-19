<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <div class="d-flex justify-space-between align-center">
                <h1 class="text-h5 d-flex align-center"> <v-icon color="#030131" size="1.7rem" class="mr-1">mdi-forum</v-icon>Meus Foruns</h1>
                <div>
                    <v-btn
                        variant="text"
                        prepend-icon="mdi-check-circle"
                        @click="$router.push('/permissoes')"
                        title="permissões"
                        icon="mdi-lock"
                    >
                    </v-btn>
                    <ConfigMyGroup :groups="forumStore.readMyGroup" />
                </div>
            </div>
            <ListForuns @saveFoldersForum="saveFoldersForum" :foldersES="preferencesStore.foldersForum" />
        </div>
    </section>
</template>

<script setup>
    import { onMounted } from 'vue';

    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()

    import { useForumStore } from '@/store/ForumStore'
    const forumStore = useForumStore()

    import { usePreferencesStore } from '@/store/PreferencesUsersStore';
    const preferencesStore = usePreferencesStore()

    import ListForuns from '@/components/legislacao/forum/foruns/listForuns.vue';
    import ConfigMyGroup from '@/components/dialogs/configMyGroup.vue';

    const saveFoldersForum = async (event) => {
        await preferencesStore.saveFolders(event);
    }

    onMounted(async () => {
        await preferencesStore.loadFolders()
    })
    
</script>

<style scoped>

</style>