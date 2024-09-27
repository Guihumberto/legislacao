<template>
    <v-card
        max-width="300"
        flat
    >
        <v-list elevation="0">
        <v-list-subheader>MENU</v-list-subheader>

        <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :value="item"
            color="primary"
            @click="$emit('menuSelect', item.id), isRoute(item.id)"
        >
            <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
            </template>

            <v-list-item-title v-text="item.text"></v-list-item-title>
        </v-list-item>
        </v-list>
    </v-card>
</template>

<script>
    export default {
        data: () => ({
            items: [
                { id: 3, text: 'Página Inicial', icon: 'mdi-home' },
                { id: 1, text: 'Avaliação', icon: 'mdi-clock' },
                { id: 2, text: 'Critérios', icon: 'mdi-account' }, 
                { id: 4, text: 'Acessos', icon: 'mdi-account-group' }, 
            ],
        }),
        methods:{
            isRoute(id){
                this.$router.push(`configuracoes?menu=${id}`)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>