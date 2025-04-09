<template>
    <div class="mt-5">
        <v-list class="pa-0">
            <v-list-subheader>Aceitar Convites</v-list-subheader>
            <v-list-item link v-for="item, i in solicitationStore.readInvites" :key="i">
                Grupo: {{ item.nameGroup }}
                <template v-slot:append>
                    <v-btn disabled variant="flat" color="error"><v-icon>mdi-close</v-icon></v-btn>
                    <v-btn variant="flat" color="success" class="mx-2" @click.stop="actionAcceptt(item)"><v-icon>mdi-check</v-icon></v-btn>
                    <v-btn @click.stop="$router.push(`avancado/forumlaw/${item.idGroup}?permission=true`)" variant="flat" color="grey"><v-icon>mdi-eye-arrow-right-outline</v-icon></v-btn>
                </template>
            </v-list-item>
        </v-list>
        <v-alert v-if="!solicitationStore.readInvites.length" class="mt-5" type="info" variant="text" text="Não há convites a serem avaliados"></v-alert>
    </div>
    <v-expand-transition>
        <div v-if="links.length">
            <v-list class="mt-5 border rounded-lg">
                <v-list-item v-for="item, i in links" :key="i" :to="`avancado/forumlaw/${item.idGroup}?permission=true`">
                    Abrir grupo {{ item.nameGroup }}
                    <template v-slot:append>
                        <v-btn>entrar</v-btn>
                    </template>
                </v-list-item>
            </v-list>

        </div>
    </v-expand-transition>
</template>

<script setup>
    import { ref } from 'vue';

    import { useSolicitationsStore } from '@/store/SolicitationsStore';
    const solicitationStore = useSolicitationsStore()

    const actionAcceptt = async (item) => {
        await solicitationStore.acceptInvites(item)
        addLink(item)
    }

    const links = ref([])

    const addLink = (item) => [
        links.value.push(item)
    ]

</script>

<style scoped>

</style>