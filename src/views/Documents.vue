<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <h1 class="text-h5 d-flex align-center"> <v-icon color="#030131" size="1.7rem" class="mr-1">mdi-text-box</v-icon>Documentos</h1>
            <!-- <div class="text-right mb-2">
                <AddFolderFavortite />
            </div> -->
            <v-card variant="flat" class="my-5">
                <v-toolbar density="compact">
                    <v-tabs
                        v-model="tab"
                    >
                        <v-tab
                            v-for="item in items"
                            :key="item"
                            :text="item"
                            :value="item"
                        ></v-tab>
                    </v-tabs>
                </v-toolbar>
                <v-card-text v-if="tab == 'Documentos'">
                    <ListDocuments /> 
                </v-card-text>
                <v-card-text v-if="tab == 'Coleção'">
                    <ListCollection />
                </v-card-text>
            </v-card>    
        </div>
    </section>
</template>

<script setup>
    import { ref, watch, onMounted, onUnmounted } from 'vue';

    import { useRoute, useRouter } from 'vue-router';
    const router = useRouter()
    const route = useRoute()

    import AddFolderFavortite from '@/components/userArea/addFolder.vue';
    import ListCollection from '@/components/userArea/collection/listCollection.vue';
    import ListDocuments from '@/components/userArea/collection/listDocuments.vue';

    import { useUserAreaStore } from '@/store/AreaUserStore';
    const userAreaStore = useUserAreaStore()

    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()

    const tab = ref('Documentos')
    const items = ['Documentos', 'Coleção']

    watch(tab, (newPage) => {
        console.log('teste');
        userAreaStore.pagination.page = 1
        router.push(`documents?tab=${tab.value}`)
    })

    onMounted(()=>{
        if(route.query.tab) tab.value = route.query.tab
        if(!route.query.page) userAreaStore.pagination.page = 1
    })

    onUnmounted(() => {
        userAreaStore.pagination.page = 1

    })

</script>

<style scoped>

</style>