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
            <Loading v-if="load" />
            <ListForuns v-else @saveFoldersForum="saveFoldersForum" :foldersES="preferencesStore.foldersForum" />
        </div>
    </section>
</template>

<script setup>
    import { ref, onMounted } from 'vue';

    import { useGeralStore } from '@/store/GeralStore';
    import { useForumStore } from '@/store/ForumStore'
    import { usePreferencesStore } from '@/store/PreferencesUsersStore';

    import ListForuns from '@/components/legislacao/forum/foruns/listForuns.vue';
    import ConfigMyGroup from '@/components/dialogs/configMyGroup.vue';
    import Loading from '@/components/partiaslLayout/loading.vue';

    const geralStore = useGeralStore()
    const forumStore = useForumStore()
    const preferencesStore = usePreferencesStore()

    // Estados reativos
    const load = ref(false)

    // Funções para gerenciar pastas
    const saveFoldersForum = async (event) => {
        await preferencesStore.saveFolders(event);
    }

    // Carregar pastas ao montar o componente
    onMounted(async () => {
        load.value = true
        await preferencesStore.loadFolders()
        load.value = false
    })
    
</script>

<style scoped>

</style>