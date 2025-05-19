<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <h1 class="text-h5 d-flex align-center"> <v-icon color="#030131" size="1.7rem" class="mr-1">mdi-star</v-icon>Favoritos</h1>
            <!-- <div class="text-right mb-2">
                <AddFolder :local="'favorites'" />
            </div>
            <div class="text-right mb-2">
                <v-btn variant="text" @click="move = !move" :prepend-icon="move ? 'mdi-close' : 'mdi-swap-horizontal'">mover</v-btn>
            </div>
            <v-select
                label="Pastas"
                variant="outlined"
                density="compact"
                placeholder="Escolha a pasta de Destino"
                :items="loginStore.readLogin.folders"
                item-title="name"
                v-if="move && listMove.length"
                clearable
                style="width: 500px;"
                v-model="folder"
            >
                <template v-slot:append>
                    <v-btn :disabled="!listMove.length" color="primary" @click="moverDocs()">Mover</v-btn>
                </template>
            </v-select>

            <v-list class="pa-0 my-5">
                <v-list-item 
                    link v-for="item, i in loginStore.readLogin.folders" :key="i"
                    @dragover.prevent
                    @drop="onDrop(item.name)"
                    class="folder"
                >
                    <template v-slot:prepend>
                        <v-icon>mdi-folder</v-icon>
                    </template>
                    <h2 class="text-h6">{{ item.name }}</h2>
                </v-list-item>
            </v-list> -->

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
                <v-card-text v-if="tab == 'Normas'">
                    <ListFavNormas />
                </v-card-text>
                <v-card-text v-if="tab == 'Páginas'">
                    <ListFavPages />
                </v-card-text>
            </v-card>
        </div>
    </section>
</template>

<script setup>
    import { onMounted, onUnmounted, ref, watch } from 'vue';

    import { useFavStore } from '@/store/FavStore'
    const favStore = useFavStore()

    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()

    import { useRoute, useRouter } from 'vue-router';
    const router = useRouter()
    const route = useRoute()


    import AddFolder from '@/components/userArea/addFolder.vue';
    import RemoveFav from '@/components/userArea/favorites/removeFav.vue';
    import ListFavNormas from '@/components/userArea/favorites/listFavNormas.vue';
    import ListFavPages from '@/components/userArea/favorites/listFavPages.vue';

    const tab = ref('Normas')
    const items = ['Normas', 'Páginas']

    watch(tab, (newPage) => {
        router.push(`favorites?tab=${tab.value}`)
    })

    onMounted(()=>{
        if(route.query.tab) tab.value = route.query.tab
        if(!route.query.page) favStore.pagination.page = 1
    })

    const move = ref(false)
    const listMove = ref([])
    const folder = ref(null)
    const draggedItem = ref(null);

    const addItem = (item) => {
        const find = listMove.value.find(x => x.id == item.id)
        if(find){
            listMove.value = listMove.value.filter(x => x.id != item.id)
        } else {
            listMove.value.push(item)
        }
    }

    const moverDocs = async () => {
        await listMove.value.forEach( x => {
          x.folder = folder.value
          favStore.editFav(x)
        } )
        listMove.value = []
        move.value = false
        folder.value =  null
    }

    const onDragStart = (item) => {
      draggedItem.value = item;
    };

    const onDragEnd = () => {
      draggedItem.value = null;
    };

    const onDrop = (folder) => {
      if (draggedItem.value) {
        const find = favStore.readFavoritos.find(x => x.id == draggedItem.value) 
        find.folder = folder
        favStore.editFav(find)
      }
    };

    const goTo = (item) => {

        if(item.section == 'page') window.open(`/textpage/${item.id}?search=favs`, '_blank');

        if(item.section == 'law') window.open(`/text/${item.id}?search=favs`, '_blank');
    }

    onUnmounted(() => {
        favStore.pagination.page = 1
    })

</script>

<style scoped>
    section{
        min-height: calc(100vh - 330px);
    }
    .container{
        padding-bottom: 2rem;
    }
    .listFolder{
        display: flex;
        flex-direction: column;
        justify-self: start;
    }
    .folder:hover {
        background-color: rgb(222, 206, 206);
    }
</style>