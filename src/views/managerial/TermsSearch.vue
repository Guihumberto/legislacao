<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <h1 class="text-h5 d-flex align-center"> <v-icon color="#030131" size="1.7rem" class="mr-1">mdi-magnify</v-icon>Termos mais buscados</h1>
            <div class="mt-5">
                <div v-if="historyStore.readLoad">carregando...</div>
                <v-list v-else>
                    <v-list-subheader>Termos mais buscados</v-list-subheader>
                    <v-list-item
                        v-for="item, i in historyStore.readAggsHistory"
                        :key="i" link
                        :title="item"
                        :to="`../leges?search=${item}`"
                    >
                        <template v-slot:prepend>
                            <v-icon>mdi-text-search</v-icon>
                        </template>
                    
                    </v-list-item>
                </v-list>
            </div>
        </div>
    </section>
</template>

<script setup>
    import { onMounted } from 'vue';

    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()
    
    import { useHistoryStore } from '@/store/HistoryStore';
    const historyStore = useHistoryStore()

    onMounted(() => {
        historyStore.getHistoryAggs()
    })

    

</script>

<style scoped>
    .listFolder{
        display: flex;
        flex-direction: column;
        justify-self: start;
    }
</style>