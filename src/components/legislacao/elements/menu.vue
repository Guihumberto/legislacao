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
            >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
            </v-list>
    </v-menu>
</template>

<script>
    export default {
        data(){
            return{
                items: [
                    { title: 'Sobre', url: '/about'}
                ],
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>