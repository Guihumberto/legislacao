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

    import { useConsultaStore } from '@/store/ConsultaStore'
    const consultaStore = useConsultaStore()  

    onMounted(() => {
        if(!lawStore.readLoad && !consultaStore.readLoadAll) {
            setTimeout(() => {
                router.push('/leges')
            }, 1500)
        } 
        setTimeout(() => {
            router.push('/leges')
        }, 3000)
    })

</script>
