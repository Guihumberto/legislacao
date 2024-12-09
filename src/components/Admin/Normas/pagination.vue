<template>
    <div>
        <v-pagination 
            :length="lawStore.readTotalPagesLawsAdmConfig"
            v-model="lawStore.pagination.page"
            @click="page = lawStore.pagination.page"
        ></v-pagination>
    </div>
</template>

<script setup>
    import { useLawStore } from '@/store/LawsStore';
    import { ref, watch } from 'vue';
    const lawStore = useLawStore()

    const page = ref(1)

    watch(page, (newPage) => {
        lawStore.getLawsAdmConfig()
    })

</script>

<style lang="scss" scoped>

</style>