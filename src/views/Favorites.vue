<template>
    <section>
        <div class="container">
            <h1 class="text-h5">Favoritos</h1>
            <div class="text-right mb-2">
                <AddFolderFavortite />
            </div>
            <v-card v-if="areaUserStore.readFavoritos.length">
                <!-- <div class="pa-2">
                    <h3 class="text-h6">Pastas</h3>
                    <div class="listFolder">
                        <v-btn v-for="item,i in 5" variant="text" prepend-icon="mdi-folder">Respostas</v-btn>
                    </div>
                </div> -->
                <v-list class="pa-0">
                    <v-list-subheader>Normas</v-list-subheader>
                    <v-list-item 
                        link
                        v-for="item, i in areaUserStore.readFavoritos.filter(x => x.section == 'law')"
                        :key="item.id"
                        @click.stop="goTo(item)"
                    >
                        <template v-slot:prepend>
                            <v-icon color="primary">
                                mdi-notebook
                            </v-icon>
                        </template>
                        <template v-slot:append>
                            <RemoveFav :id="item" />
                        </template>
                         {{ item.norma }}<br>
                        <small class="font-weight-bold">{{ item.ano }}, {{ item.tipo }}</small>
                    </v-list-item>
                </v-list>
                <v-list class="pa-0">
                    <v-list-subheader>Páginas</v-list-subheader>
                    <v-list-item 
                        link
                        v-for="item, i in areaUserStore.readFavoritos.filter(x => x.section == 'page')"
                        :key="item.id"
                        @click.stop="goTo(item)"
                    >
                        <template v-slot:prepend>
                            <v-icon>
                                mdi-text-box
                            </v-icon>
                        </template>
                        <template v-slot:append>
                            <RemoveFav :id="item" />
                        </template>
                        Página: {{ item.num_page }}, {{ item.ano }}, {{ item.tipo }} <br>
                        <small class="font-weight-bold">{{ item.norma }}</small>
                    </v-list-item>
                </v-list>
            </v-card>
            <v-alert v-else type="warning" variant="outlined" text="Não há normativos favoritados"></v-alert>
           
        </div>
    </section>
</template>

<script setup>
    import { useUserAreaStore } from '@/store/AreaUserStore'
    const areaUserStore = useUserAreaStore()

    import { useRouter } from 'vue-router';
    const router = useRouter()


    import AddFolderFavortite from '@/components/userArea/addFolderFavortite.vue';
    import RemoveFav from '@/components/userArea/removeFav.vue';


    const goTo = (item) => {

        if(item.section == 'page') window.open(`/textpage/${item.id}`, '_blank');

        if(item.section == 'law') window.open(`/text/${item.id}`, '_blank');
    }

</script>

<style scoped>
    section .container{
        min-height: calc(100vh - 400px);
    }
    .listFolder{
        display: flex;
        flex-direction: column;
        justify-self: start;
    }
</style>