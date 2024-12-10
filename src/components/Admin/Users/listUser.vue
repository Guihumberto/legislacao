<template>
    <v-list>
        <v-list-subheader>Lista de usuários</v-list-subheader>
        <v-list-item link v-for="item, i in loginStore.readListUsers" :key="i">
            <template v-slot:prepend>
                <v-icon>mdi-magnify</v-icon>
            </template>
            <template v-slot:append>
                <v-switch
                    label="Adm"
                    density="compact"
                    hide-details
                    color="success"
                ></v-switch>
            </template>
            <div>
                {{ item }}
            </div>
        </v-list-item>
        <Pagination />
    </v-list>

</template>

<script setup>
    import Pagination from './pagination.vue';

    import { useLoginStore } from '@/store/LoginStore';
    const loginStore = useLoginStore()

    loginStore.getUsers()

</script>

<style lang="scss" scoped>

</style>