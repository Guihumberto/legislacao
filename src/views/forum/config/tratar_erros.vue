<template>
        <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <div class="d-flex justify-space-between mb-5">
                <v-btn variant="outlined" prepend-icon="mdi-arrow-left" @click="$router.push('/home/admin/')">Voltar</v-btn>
            </div>
            <div class="d-flex justify-space-between align-center">
                <h1 class="text-h5 d-flex align-center"> <v-icon color="#030131" size="1.7rem" class="mr-1">mdi-information</v-icon>Tratar Erros</h1>
            </div>
            <div v-if="load">
                Carregando
            </div>
            <div class="mt-10" v-if="!load">
                <v-list class="bg-transparent border rounded-lg"  v-if="questoresStore.readErrorList.length">
                    <v-list-item v-for="item, i in questoresStore.readErrorList" :key="item.id" prepend-icon="mdi-alert">
                        {{ errorMap(item.typeError) }} - {{ item.id_questao }}
                        <template v-slot:append>
                            <Tratar_erro :erro="item" />
                        </template>
                    </v-list-item>
                </v-list>
                <v-alert variant="outlined" type="info" text="Não há erros em questão relatados." v-if="!questoresStore.readErrorList.length">
                    <template v-slot:append>
                        <v-btn variant="text" @click="questoresStore.getAllErrorQuestion()"><v-icon>mdi-update</v-icon></v-btn>
                    </template>
                </v-alert>
            </div>
        </div>
    </section>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()
    
    import { useQuestoesStore } from '@/store/forum/QuestoesStore';
    const questoresStore = useQuestoesStore()
    
    import Tratar_erro from '@/components/legislacao/forum/textavancado/questao/tratar_erro.vue';

    const load = ref(false)
    

    onMounted( async () => {
        load.value = true
        await questoresStore.getAllErrorQuestion()
        load.value = false
    })



    const listErrors = [
        {
            name: 'Gabarito Invertido',
            id: 1
        },
        {
            name: 'Justificativa Incorreta',
            id: 2
        },
        {
            name: 'Artigo não correponde a questão',
            id: 3
        },
        {
            name: 'Outro',
            id: 4
        },
    ]

    const errorMap = (item) => {
        return listErrors.find(e => e.id === item).name
    }

</script>

<style scoped>

</style>