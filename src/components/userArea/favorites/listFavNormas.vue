<template>
    <v-card variant="flat" class="card">
            <div v-if="favStore.readLoad" class="load">
                <v-progress-circular
                        :size="50"
                        color="primary"
                        indeterminate
                ></v-progress-circular>
            </div>
            <v-list class="pa-0" v-if="listFav?.total?.value && !favStore.readLoad">
                <v-list-subheader>Quantidade de documentos: {{ listFav?.total?.value }}</v-list-subheader>
                <transition-group name="fade">
                    <v-list-item 
                        v-if="listFav?.total?.value"
                        link
                        v-for="item, i in listFav?.hits.map(x => ({ idU: x._id, ...x._source }))"
                        :key="item.id"
                        @click.stop="goTo(item)"
                    >
                        <template v-slot:prepend>
                            <v-checkbox
                                v-if="move"
                                hide-details
                                @click.stop="addItem(item)"
                            ></v-checkbox>
                            <v-icon color="primary">
                                mdi-notebook
                            </v-icon>
                        </template>
                        <template v-slot:append>
                            <small class="hidden-sm-and-down">Criado em: {{ useDateNow(item.dateCreated) }}</small>
                            <RemoveFav :id="item" />
                            <!-- <div
                                title="Arraste para pasta desejada para salvar"
                                draggable="true"
                                @dragstart="onDragStart(item.id)"
                                @dragend="onDragEnd">
                                <v-icon>mdi-drag</v-icon>
                            </div> -->
                        </template>
                            {{ item.name_law }}<br>
                        <small class="text-overline">{{ item.ano }}, {{ item.tipo }}</small> {{ item.folder }}
                    </v-list-item>
                </transition-group>
                <Pagination :section="'law'" v-if="listFav?.total?.value" :totalDocs="listFav?.total?.value"  />
            </v-list>
            <v-alert type="warning" variant="outlined" class="mx-4 my-5" density="compact" v-if="!favStore.readLoad && !listFav?.total?.value">
                Não há normas favoritadas.
                <template v-slot:append>
                    <v-btn variant="text" @click="favStore.getListFavPages('law')">Recarregar</v-btn>
                </template>
            </v-alert>
    </v-card>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue';

    import { useRoute } from 'vue-router';
    const route = useRoute()

    import { useDateNow } from '@/composables/dateFormat'

    import { useFavStore } from '@/store/FavStore'
    const favStore = useFavStore()

    import RemoveFav from '@/components/userArea/favorites/removeFav.vue';
    import Pagination from '@/components/userArea/favorites/pagination.vue'

    const move = ref(false)
    const listMove = ref([])

    const addItem = (item) => {
        const find = listMove.value.find(x => x.id == item.id)
        if(find){
            listMove.value = listMove.value.filter(x => x.id != item.id)
        } else {
            listMove.value.push(item)
        }
    }

    const goTo = (item) => {
        if(item.section == 'page') window.open(`/textpage/${item.id}?search=favs`, '_blank');

        if(item.section == 'law') window.open(`/text/${item.id}?search=favs`, '_blank');
    }

    onMounted(async ()=> {
        favStore.pagination.page = 1
        await favStore.getListFavPages('law')
    })

    const listFav = computed(() => {
        return favStore.readFavPages
    })

</script>

<style scoped>
.card{
    animation: aparecer 1s ease-in forwards;
}
.load{
    height: 60vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>