<template>
    <div v-if="forumStore.readGroupForum._id" class="mt-5">
        <h1 class="text-h5">Dados Grupo</h1>
        <div class="border rounded pa-2">
            <b>{{ forumStore.readGroupForum._source.title }}</b> <br>
            {{ forumStore.readGroupForum._source.description }} <br><br>
            <p :class="forumStore.readGroupForum._source.open ? 'text-success' :'text-red'" v-text="forumStore.readGroupForum._source.open ? 'Aberto para comentários':'Fechado comentários para não participantes do grupo'"></p>
            <small>Data de Criação do grupo: {{ forumStore.readGroupForum._source.data_include }}</small> <br><br>
            <v-list v-if="forumStore.readGroupForum._source.group.length">
                <v-list-subheader>Participantes</v-list-subheader>
                <v-list v-for="item, i in forumStore.readGroupForum._source.group"></v-list>
            </v-list>
            
            <v-btn v-if="loginStore.readLogin.cpf == forumStore.readGroupForum._source.created_by">Incluir novos participantes</v-btn>
            <div v-if="!isComment">
                <v-btn v-if="!isExistSolicitation" @click="sendSolicitation">Pedir para participar do grupo</v-btn>
                <v-alert v-else type="info" text="Seu convite foi enviado, aguarde sua liberação pelo administrador do grupo.">
                    <template v-slot:append>
                        <v-btn disabled @click="editSolicitation(false)">Cancelar o pedido</v-btn>
                    </template>
                </v-alert>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { computed, onMounted } from 'vue';

    import { useForumStore } from '@/store/ForumStore';
    const forumStore = useForumStore()
    
    import { useLoginStore } from '@/store/LoginStore';
    const loginStore = useLoginStore()

    onMounted( async () => {
        await forumStore.getSolicitations()
    })

    const isComment = computed(() => {
        const cpf = loginStore.readLogin.cpf
        const grupo = forumStore.readGroupForum._source
        const participantes = [ ...grupo.group, grupo.created_by ]

        return grupo.open
        ? true
        : !!participantes.find( x => x == cpf)

    })

    const sendSolicitation = async (cancelar = true) => {
        await forumStore.sendSolicitation(forumStore.readGroupForum._id, cancelar)
    }

    const isExistSolicitation = computed(() => {
        const list = forumStore.readSolicitation.find( x => x.idGroup == forumStore.readGroupForum._id)
        return !!list
    })

    const editSolicitation = (cancelar) => {
        console.log('edit', cancelar);
    }

</script>

<style scoped>

</style>