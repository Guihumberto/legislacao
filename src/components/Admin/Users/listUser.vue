<template>
    <v-alert v-if="loginStore.readLoad">
        Carregando
    </v-alert>
    <v-alert v-else-if="!loginStore.readListUsers.length" type="warning">
        Não há usuários cadastrados
    </v-alert>
    <v-list v-else>
        <v-list-subheader>Lista de usuários</v-list-subheader>
        <v-list-item link v-for="item, i in loginStore.readListUsers" :key="i">
            <template v-slot:prepend>
                <v-icon v-if="!loginStore.readLoad">mdi-account</v-icon>
                <v-btn v-else loading="true"></v-btn>
            </template>
            <template v-slot:append>
                <v-select
                    label="Perfil"
                    density="compact"
                    :items="perfis"
                    item-title="name"
                    item-value="id"
                    hide-details
                    variant="outlined"
                    class="mr-5"
                    style="width: 110px;"
                    v-model="item.perfil"
                    @update:model-value="updateUser(item)"
                ></v-select>
                <v-switch
                    label="Adm"
                    density="compact"
                    hide-details
                    color="success"
                    v-model="item.admin"
                    @update:model-value="updateUser(item)"
                ></v-switch>
            </template>
            <div>
                {{ item.cpf }} <span v-if="item?.name">- {{ item.name }}</span> 
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

    const perfis = [
        {id: 1, name: 'Básico'},
        {id: 2, name: 'Amplo'},
    ]

    const updateUser = (item) => {
        loginStore.editUser(item)
    }

</script>

<style lang="scss" scoped>

</style>