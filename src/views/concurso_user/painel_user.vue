<template>
   <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <h1 class="text-h5 d-flex align-center mt-5"> <v-icon color="#030131" size="1.7rem" class="mr-1">mdi-account</v-icon>Área do Usuário</h1>
            <v-divider class="my-5"></v-divider>
            <div class="border rounded-lg pa-5">
                <div class="mb-5" v-if="!load">
                    <h1 class="text-h5">Painel de Editais</h1>
                    <p>Concursos</p>
                </div>
                <div v-else>Carregando....</div>
                <div v-if="!load">
                    <v-list class="bg-transparent border rounded-lg pa-0" v-if="conteudoStore.readEditarUser.length">
                        <v-list-item 
                            @click="$router.push(`/areauser/concurso/${item.id}?concurso=${item.concurso}&cargo=${item.cargo}`)"
                            class="border-b" v-for="item, i in conteudoStore.readEditarUser" :key="item.id" 
                            prepend-icon="mdi-lightbulb-on-outline" :title="item.concurso" link>
                            <template v-slot:append>
                                <v-btn variant="text" color="primary" icon="mdi-arrow-right-circle"></v-btn>
                            </template>
                        </v-list-item>
                    </v-list>
                    <v-alert v-else variant="outlined" type="info" text="Você ainda não adicionou um edital.">
                        <template v-slot:append>
                            <v-btn color="primary" @click="$router.push('/homepainel')">editais</v-btn>
                        </template>
                    </v-alert>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
    import { onMounted, ref } from 'vue';

    import { useGeralStore } from '@/store/GeralStore';
    import { useConteudoEditalStore } from '@/store/concursos/ConteudoEditalStore';
    const geralStore = useGeralStore()
    const conteudoStore = useConteudoEditalStore()
    
    const load = ref(false)

    onMounted(async() => {
        load.value = true
        await conteudoStore.getEditalUser()
        load.value = false
    })
 
</script>

<style scoped>

</style>