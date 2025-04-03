<template>
    <div v-if="forumStore.readGroupForum._id" class="mt-5">
        <h1 class="text-h5">Dados Grupo</h1>
        <div class="wrapper">
            <b>{{ forumStore.readGroupForum._source.title }}</b> <br>
            {{ forumStore.readGroupForum._source.description }} <br><br>
            <p :class="forumStore.readGroupForum._source.open ? 'text-success' :'text-red'" v-text="forumStore.readGroupForum._source.open ? 'Aberto para comentários':'Fechado comentários para não participantes do grupo'"></p>
            <small>Data de Criação do grupo: {{ forumStore.readGroupForum._source.data_include }}</small> <br><br>
            <v-list v-if="forumStore.readGroupForum._source.group.length">
                <v-list-subheader>Participantes</v-list-subheader>
                <v-list v-for="item, i in forumStore.readGroupForum._source.group"></v-list>
            </v-list>
            
            <v-btn variant="text" prepend-icon="mdi-account-plus" v-if="loginStore.readLogin.cpf == forumStore.readGroupForum._source.created_by" @click="addParticipante = !addParticipante">Incluir novos participantes</v-btn>
            <transition name="fade">
                <div class="mt-2" v-if="addParticipante" ref="form">
                    <v-form @submit.prevent="addSaveParticipante">
                        <v-autocomplete
                            label="Participante"
                            variant="outlined"
                            density="compact"
                            v-model="participante"
                            :rules="[ rules.required, rules.minfield ]"
                        ></v-autocomplete>
                        <v-btn color="primary" type="submit">Adicionar</v-btn>
                    </v-form>
                </div>
            </transition>
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
    import { computed, onMounted, ref } from 'vue';

    import { useForumStore } from '@/store/ForumStore';
    const forumStore = useForumStore()
    
    import { useLoginStore } from '@/store/LoginStore';
    const loginStore = useLoginStore()

    const addParticipante = ref(false)
    const participante = ref(null)
    const form = ref(null)

    const rules = {
        required: value => !!value || "campo obrigatório", 
        minfield: (v) => (v||'').length >= 3 || "Mínimo 4 caracteres",
    }

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

    const addSaveParticipante = async () => {
        // const { valid } = await form.value.validate()
     
          console.log('add participante')
     
    }

</script>

<style scoped>
.wrapper{
    padding: 1rem;
    border: 1px solid rgb(207, 203, 203);
    border-radius: 8px;
    transition: 1s ease;
}
</style>