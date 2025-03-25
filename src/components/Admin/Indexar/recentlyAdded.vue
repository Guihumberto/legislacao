<template>
    <transition name="fade">
        <div v-if="load">Carregando...</div>
    </transition>
    <transition name="fade">
        <v-list class="pa-0 mb-5" v-if="!load && imporType == 'pdf'">
            <v-list-subheader>Últimas normas adicionadas</v-list-subheader>
            <v-list-item link v-for="item, i in list" :key="i"
                :title="item.title"
                :subtitle="item.tipo"
            >
                <template v-slot:append>
                    <small>{{ item.data_include }}</small>
                </template>
            </v-list-item>
        </v-list>
    </transition>
</template>

<script setup>
    import { onMounted, ref, watch } from 'vue';
    
    import { useRoute } from 'vue-router';
    const route = useRoute()
  
    import { useLawStore } from '@/store/LawsStore';
    const lawStore = useLawStore()

    const list = ref([])
    const load = ref(false)

    onMounted( async () => {
        load.value = true
        const resp = await lawStore.getLastLawsAdd()
        list.value = resp.map(x => ({ idU: x._id, ...x._source }))
        load.value = false
    })

    watch(() => ({ fonte: route.query.source }), async (newVal, oldVal) => {
            const search = {
                tipo: route.query.source || false,
                ano: route.query.year || false
            }

            load.value = true
            const resp = await lawStore.getLastLawsAdd(search)

            list.value = resp.map(x => ({ idU: x._id, ...x._source }))
            load.value = false
        }, {deep: true} 
    )

    const props = defineProps({
        imporType: String
    })

</script>

<style scoped>

</style>