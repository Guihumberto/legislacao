<template>
        <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <div class="d-flex justify-space-between align-center">
                <h1 class="text-h5 d-flex align-center"> <v-icon color="#030131" size="1.7rem" class="mr-1">mdi-information</v-icon>Tratar Erros</h1>
            </div>
            <div v-if="load">
                Carregando
            </div>
            <div class="mt-10" v-if="questoresStore.readErrorList.length && !load">
                <v-list class="bg-transparent border rounded-lg">
                    <v-list-item v-for="item, i in questoresStore.readErrorList" :key="id" prepend-icon="mdi-alert">
                        {{ errorMap(item.typeError) }} - {{ item.id_questao }}
                        <template v-slot:append>
                            <Tratar_erro :erro="item" />
                        </template>
                    </v-list-item>
                </v-list>
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

    onMounted( async () => {
        load.value = true
        await questoresStore.getAllErrorQuestion()
        // console.log('oi');
        load.value = false
    })

</script>

<style scoped>

</style>