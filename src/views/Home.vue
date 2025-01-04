<template>
 <section-search />
</template>

<script setup>
    import { onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    const router = useRouter()

    import SectionSearch from '@/components/home/SectionSearch.vue';

    import { useLawStore } from '@/store/LawsStore'
    const lawStore = useLawStore()

    onMounted(() => {
        if(!lawStore.readLoad) router.push('/leges')
        setTimeout(() => {
            router.push('/leges')
        }, 1500)
    })

</script>
