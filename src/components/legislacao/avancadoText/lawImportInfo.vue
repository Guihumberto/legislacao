<template>
    <v-alert v-if="!loginStore.readLogin?.cpf" class="mt-5" type="error" text="Você precisa estar conectado para importar a norma!">
        <template v-slot:append>
            <v-btn @click="$router.push('/login')" variant="outlined" color="white" block>Entrar</v-btn>
        </template>
    </v-alert>
    <div v-else>
        <v-alert :type="info.type" :text="info.text" class="mt-5" variant="tonal">
           <template v-slot:append>
                <v-btn @click="$router.push(`/avancado/forumlaw/${info.id}?det=false`)" variant="flat" color="wite" block v-if="info.id">Acessar Minha norma</v-btn>
                <ForumInfo :title="title" v-else />
           </template>
        </v-alert>
        <v-card variant="outlined" color="primary" class="mt-5" v-if="!info.import">
            <v-card-text>
                <v-btn class="mb-2" :prepend-icon="showInfo ? 'mdi-chevron-down' : 'mdi-chevron-right'" :variant=" showInfo ? 'outlined' : 'text'" @click="showInfo = !showInfo">por que importar a norma?</v-btn>
                <v-expand-transition>
                    <div v-if="showInfo">
                        <v-list color="transparent" density="compact" class="pa-0">
                            <v-list-item v-for="item, i in items" :key="i" :prepend-icon=" i == 0 || i == items.length - 1 ? '' : 'mdi-check'" :title="item" link></v-list-item>
                        </v-list>
                    </div>
                </v-expand-transition>
           </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
    import { computed, ref } from 'vue';
    import { useForumStore } from '@/store/ForumStore';
    import { useRoute } from 'vue-router';
    import ForumInfo from './forumInfo.vue';
    import { useLoginStore } from '@/store/LoginStore';
    
    const route = useRoute()
    const forumStore = useForumStore()
    const loginStore = useLoginStore()

    const props = defineProps({
      title: String
    })

    const idLaw = route.params.id
    const showInfo = ref(false)

    const items = [
        'Ao importar a norma é possível:',
        'fazer comentários nos dispositivos;',
        'fazer questões;',
        'Criar esquemas;',
        'Vincular tags;',
        'Fazer anotações vinculadas a outras legislações;',
        'Marcar a legislação (igual ao PDF);',
        'Fazer resumos com ajuda da IA;',
        'Gerar questões de concursos;',
        'Gerar Post com questões de multipla escolha;', 
        'Gerar resumos de cada dispositivo com ajuda da IA;',
        'Compartilhar com outras pessoas;',
        'Fazer perguntas e responder perguntas;',
        'Convidar um amigo para participar do grupo;',
        'e muito mais....'
    ]
    
    const info = computed(() => {
        const find = forumStore.readMyGroup.find(item => item.idLaw == idLaw)
        return find
        ? { type: 'success', text: 'Você já importou esta norma!', import: 'false', id: find.id }
        : { type: 'warning', text: 'Você ainda não importou esta norma!', import: 'true', id: false }
    })
   
</script>

<style scoped>

</style>