<template>
    <v-card variant="flat" class="card">
            <div v-if="areaUserStore.readLoad" class="load">
                <v-progress-circular
                        :size="50"
                        color="primary"
                        indeterminate
                ></v-progress-circular>
            </div>
            <v-list class="pa-0" lines="two" v-else>
                <v-list-subheader v-if="listFav?.total?.value">Quantidade de documentos: {{ listFav?.total?.value }}</v-list-subheader>
                <transition-group name="fade">
                    <v-list-item 
                        v-if="listFav?.total?.value"
                        link
                        v-for="item, i in listFav?.hits.map(x => ({ idU: x._id, ...x._source }))"
                        :key="item.id"
                        @click.stop="goTo(item)"
                    >
                        <template v-slot:prepend>
                            <v-icon>
                                mdi-text-box
                            </v-icon>
                        </template>
                        <template v-slot:append>
                            <small class="hidden-sm-and-down mr-2">Criado em: {{ useDateNow(item.dateCreated) }}</small>
                            <RemoveFav :id="item" />
                        </template>
                        Página: {{ item.num_page }}, {{ item.ano }}, {{ item.tipo }} <br>
                        <small class="text-overline">{{ item.name_law }}</small> {{ item.folder }}
                    </v-list-item>
                </transition-group>
                <v-alert type="warning" variant="outlined" class="mx-4 my-5" density="compact" v-if="!areaUserStore.readLoad && !listFav?.total?.value">
                    Não há páginas favoritadas.
                    <template v-slot:append>
                        <v-btn variant="text" @click="areaUserStore.getListFavPages('page')">Recarregar</v-btn>
                    </template>
                </v-alert>
                <Pagination :section="'page'" v-if="listFav?.total?.value" :totalDocs="listFav?.total?.value"  />
            </v-list>
    </v-card>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import { useDateNow } from '@/composables/dateFormat'
    import { useUserAreaStore } from '@/store/AreaUserStore'
    const areaUserStore = useUserAreaStore()

    import RemoveFav from '@/components/userArea/removeFav.vue';
    import Pagination from '@/components/legislacao/elements/pagination.vue';
    import { computed } from 'vue';

    const goTo = (item) => {
        if(item.section == 'page') window.open(`/textpage/${item.id}?search=favs`, '_blank');
        if(item.section == 'law') window.open(`/text/${item.id}?search=favs`, '_blank');
    }


    onMounted(async ()=> {
        await areaUserStore.getListFavPages('page')
        areaUserStore.pagination.page = 1
    })

    const listFav = computed(() => {
        return areaUserStore.readFavPages
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