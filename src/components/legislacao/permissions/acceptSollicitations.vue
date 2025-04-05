<template>
    <div class="mt-5">
        <v-list class="pa-0">
            <v-list-subheader>Aceitar Convites</v-list-subheader>
            <v-list-item link v-for="item, i in solicitationStore.readInvites" :key="i">
                Group:{{ item.idGroup }}
                <template v-slot:append>
                    <v-btn disabled variant="flat" color="error"><v-icon>mdi-close</v-icon></v-btn>
                    <v-btn variant="flat" color="success" class="ml-2" @click="actionAcceptt(item)"><v-icon>mdi-check</v-icon></v-btn>
                </template>
            </v-list-item>
        </v-list>
        <v-alert v-if="!solicitationStore.readInvites.length" class="mt-5" type="info" variant="text" text="Não há convites a serem avaliados"></v-alert>
    </div>
</template>

<script setup>
    import { useSolicitationsStore } from '@/store/SolicitationsStore';
    const solicitationStore = useSolicitationsStore()

    const actionAcceptt = async (item) => {
        await solicitationStore.acceptInvites(item)
    }

</script>

<style scoped>

</style>