<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <h1 class="text-h5 d-flex align-center"> <v-icon color="#030131" size="1.7rem" class="mr-1">mdi-book</v-icon>Páginas mais acessadas</h1>
            <div class="mt-5">
                <div v-if="accessStore.readLoad">carregando...</div>
                <v-list v-else class="pa-0">
                    <v-list-subheader>Normas mais acessadas</v-list-subheader>
                    <v-list-item
                        :to="`../textpage/${item.id}?page=norms`"
                        link
                        v-for="item, i in accessStore.readAggsAccessed" :key="item.defineOptions"
                        :title="item.page_to_norma.title"
                    >
                        <div>
                            <small>page: {{ item.num_page }} - {{ item.tipo }}</small>
                        </div>
                        <template v-slot:prepend>
                            <v-icon>mdi-book-outline</v-icon>
                        </template>
                    </v-list-item>
                </v-list>
            </div>
        </div>
    </section>
</template>

<script setup>
    import { onMounted } from 'vue';

    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()
    
    import { useAccessedNormsStore } from '@/store/NormsAccessedStore';
    const accessStore = useAccessedNormsStore()

    onMounted(() => {
        accessStore.aggsAccessdsAllUser()
    })

</script>

<style scoped>
    .listFolder{
        display: flex;
        flex-direction: column;
        justify-self: start;
    }
</style>