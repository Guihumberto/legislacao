<template>
    <section>
        <div class="container">
            <h1 class="text-h5">Favoritos</h1>
            <div class="text-right mb-2">
                <AddFolderFavortite />
            </div>
            <v-card>
                <div class="pa-2">
                    <h3 class="text-h6">Pastas</h3>
                    <div class="listFolder">
                        <v-btn v-for="item,i in 5" variant="text" prepend-icon="mdi-folder">Respostas</v-btn>
                    </div>
                </div>
                <v-list class="pa-0">
                    <v-list-item v-for="item, i in 5">
                        <template v-slot:prepend>
                            <v-icon color="primary">
                                mdi-notebook
                            </v-icon>
                        </template>
                        <template v-slot:append>
                            <v-btn variant="text" icon="mdi-dots-vertical">
                            </v-btn>
                        </template>
                        Rótulo: Pesquisa tarara<br>
                        Página: 12, nome da norma, 2024, portaria <br>
                    </v-list-item>
                </v-list>
                <v-list class="pa-0">
                    <v-list-item v-for="item, i in 5">
                        <template v-slot:prepend>
                            <v-icon>
                                mdi-text-box
                            </v-icon>
                        </template>
                        <template v-slot:append>
                            <v-btn variant="text" icon="mdi-dots-vertical">
                            </v-btn>
                        </template>
                        Rótulo: Pesquisa tarara<br>
                        Página: 12, nome da norma, 2024, portaria <br>
                    </v-list-item>
                </v-list>
            </v-card>
        </div>
    </section>
</template>

<script setup>
    import AddFolderFavortite from '@/components/userArea/addFolderFavortite.vue';

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