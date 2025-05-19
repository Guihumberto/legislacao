<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <h1 class="text-h4">Permissões</h1>
            <div v-if="load">Carregando</div>
            <div v-else>
                <Avaliar />
                <Mypermissions />
                <AcceptSollicitations />
            </div>
        </div>
    </section>
</template>

<script setup>
    import { onMounted, ref } from 'vue';

    import Avaliar from '@/components/legislacao/permissions/avaliar.vue';
    import Mypermissions from '@/components/legislacao/permissions/mypermissions.vue';
    import AcceptSollicitations from '@/components/legislacao/permissions/acceptSollicitations.vue';

    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()
    
    import { useSolicitationsStore } from '@/store/SolicitationsStore';
    const solicitationStore = useSolicitationsStore()

    const load = ref(false)

    onMounted( async () => {
        load.value = true
        await solicitationStore.getAvaliations()
        await solicitationStore.getSolicitations()
        await solicitationStore.getInvites()
        load.value = false
    })

</script>

<style scoped>

</style>