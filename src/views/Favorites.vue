<template>
    <section>
        <div class="container">
            <h1 class="text-h5">Favoritos</h1>
            <div class="text-right mb-2">
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
                    @drop="onDrop(folder)"
                    class="folder"
                >
                    <template v-slot:prepend>
                        <v-icon>mdi-folder</v-icon>
                    </template>
                    <h2 class="text-h6">{{ item.name }}</h2>
                </v-list-item>
            </v-list>

            <v-alert
                v-if="areaUserStore.readLoad" type="info"
            >Carregando...</v-alert>
            <v-card v-if="areaUserStore.readFavoritos.length">
                <v-list class="pa-0">
                    <v-list-subheader>Normas</v-list-subheader>
                    <v-list-item 
                        link
                        v-for="item, i in areaUserStore.readFavoritos.filter(x => x.section == 'law')"
                        :key="item.id"
                        @click.stop="goTo(item)"
                        draggable="true"
                        @dragstart="onDragStart(item)"
                        @dragend="onDragEnd"
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
                            <RemoveFav :id="item" />
                        </template>
                         {{ item.name_law }}<br>
                        <small class="font-weight-bold">{{ item.ano }}, {{ item.tipo }}</small> {{ item.folder }}
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
                            <v-checkbox
                                v-if="move"
                                hide-details
                                @click.stop="addItem(item)"
                            ></v-checkbox>
                            <v-icon>
                                mdi-text-box
                            </v-icon>
                        </template>
                        <template v-slot:append>
                            <RemoveFav :id="item" />
                        </template>
                        Página: {{ item.num_page }}, {{ item.ano }}, {{ item.tipo }} <br>
                        <small class="font-weight-bold">{{ item.name_law }}</small> {{ item.folder }}
                    </v-list-item>
                </v-list>
            </v-card>
            <v-alert v-else type="warning" variant="outlined" text="Não há normativos favoritados"></v-alert>
           
        </div>
    </section>
</template>

<script setup>
    import { ref } from 'vue';
    import { useUserAreaStore } from '@/store/AreaUserStore'
    const areaUserStore = useUserAreaStore()

    import { useLoginStore } from '@/store/LoginStore';
    const loginStore = useLoginStore()

    import { useRouter } from 'vue-router';
    const router = useRouter()


    import AddFolder from '@/components/userArea/addFolder.vue';
    import RemoveFav from '@/components/userArea/removeFav.vue';

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
          areaUserStore.editFav(x)
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
        console.log(`Item ${draggedItem.value} solto na pasta ${folder}`);
        // Aqui você pode chamar a função para gravar os dados, por exemplo:
        saveItemToFolder(draggedItem.value, folder);
      }
    };

    const saveItemToFolder = (item, folder) => {
      // Substitua com a lógica de gravação
      console.log(`Gravando ${item} na pasta ${folder}`);
    };



    const goTo = (item) => {

        if(item.section == 'page') window.open(`/textpage/${item.id}?search=favs`, '_blank');

        if(item.section == 'law') window.open(`/text/${item.id}?search=favs`, '_blank');
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
    .folder:hover {
        background-color: rgb(222, 206, 206);
    }
</style>