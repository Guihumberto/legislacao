<template>
    <v-menu>
            <template v-slot:activator="{ props }">
            <v-btn flat variant="text" icon="mdi-dots-vertical" v-bind="props"></v-btn>
            </template>

            <v-list class="pa-0">
                <v-list-item
                    v-for="(item, i) in items"
                    :key="i"
                    link
                    :to="item.url"
                    @click="deslocar(item.id)"
                >
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
    </v-menu>
</template>

<script setup>
    const items =  [
        { id:1, title: 'Atualizações', url: '/legesporlei?news=news'},
        { id:2, title: 'Sobre', url: '/about'},
        { id:3, title: 'Ajuda', url: '/help'},
    ] 

    const deslocar = (id) => {
        if( id == 1){
            const element = document.getElementById('news')
            element.scrollIntoView({behavior: "smooth"})
        }
    }

</script>

<style lang="scss" scoped>

</style>