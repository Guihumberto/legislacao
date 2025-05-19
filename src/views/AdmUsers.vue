<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
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

    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()

</script>

<style scoped>
    .listFolder{
        display: flex;
        flex-direction: column;
        justify-self: start;
    }
    .contentWrapper{
        margin: 1rem 0;
    }
</style>