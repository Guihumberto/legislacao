<template>
    <div class="mt-5">
        <v-list class="pa-0">
            <v-list-subheader>Minhas Solicitações</v-list-subheader>
            <v-list-item link v-for="item, i in solicitationStore.readSolicitations" :key="i">
                Grupo: {{ item.nameGroup }}
                <template v-slot:append>
                    <v-btn variant="flat" color="orange" class="mx-2">Pendente</v-btn>
                    <v-btn @click.stop="$router.push(`avancado/forumlaw/${item.idGroup}?permission=true`)" variant="flat" color="grey"><v-icon>mdi-eye-arrow-right-outline</v-icon></v-btn>
                </template>
            </v-list-item>
        </v-list>
        <v-alert v-if="!solicitationStore.readSolicitations.length" class="mt-5" type="info" variant="text" text="Não há solicitações pendentes"></v-alert>
    </div>
</template>

<script setup>
    import { useSolicitationsStore } from '@/store/SolicitationsStore';
    const solicitationStore = useSolicitationsStore()
</script>

<style scoped>

</style>