<template>
    <section>
        <div class="container">
            <h1 class="text-h5">Administração de Usuários</h1>
            <div class="contentWrapper">
                <AddUser />
                <SearchUser />
                <ListUser />
            </div>
        </div>
    </section>
</template>

<script setup>
    import AddUser from '@/components/Admin/Users/addUser.vue';
    import ListUser from '@/components/Admin/Users/listUser.vue';
    import SearchUser from '@/components/Admin/Users/searchUser.vue';
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
    .contentWrapper{
        margin: 1rem 0;
    }
</style>