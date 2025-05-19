<template>
    <div class="mt-5">
        <v-list class="pa-0">
            <v-list-subheader>Solicitações dos meus grupos</v-list-subheader>
            <v-list-item link v-for="item, i in solicitationStore.readAvaliations" :key="i">
                <b>Grupo: </b>{{ item.nameGroup }} <br>
                <b>Solicitante: </b>{{ item.nameUser || item.idUser }}
                <template v-slot:append>
                    <v-btn disabled variant="flat" color="error"><v-icon>mdi-close</v-icon></v-btn>
                    <v-btn variant="flat" color="success" class="mx-2" @click.stop="actionAcceptt(item)"><v-icon>mdi-check</v-icon></v-btn>
                    <v-btn @click.stop="$router.push(`avancado/forumlaw/${item.idGroup}?permission=true`)" variant="flat" color="grey"><v-icon>mdi-eye-arrow-right-outline</v-icon></v-btn>
                </template>
            </v-list-item>
        </v-list>
        <v-alert v-if="!solicitationStore.readAvaliations.length" class="mt-5" type="info" variant="text" text="Não há permissões a serem avaliadas"></v-alert>
    </div>
</template>

<script setup>
    import { useSolicitationsStore } from '@/store/SolicitationsStore';
    const solicitationStore = useSolicitationsStore()

    const actionAcceptt = async (item) => {
        await solicitationStore.acceptAvaliations(item)
    }

</script>

<style scoped>

</style>