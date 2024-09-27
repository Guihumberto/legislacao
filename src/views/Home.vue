<template>
 <section-search />
 <!-- <section-banner />
 <section-atendimento />
 <section-sistems />
 <section-home  />
 <section-main-service />
 <section-tarf />
 <section-all-services />
 <section-faq /> -->
</template>

<script setup>
    import { onMounted } from 'vue'
    import { useRouter } from 'vue-router'


    const router = useRouter()
    // const route = useRoute()

    // import SectionAllServices from '@/components/home/SectionAllServices.vue';
    // import SectionBanner from '@/components/home/SectionBanner.vue';
    // import SectionHome from '@/components/home/SectionHome.vue'
    // import SectionMainService from '@/components/home/SectionMainService.vue';
    import SectionSearch from '@/components/home/SectionSearch.vue';
    // import SectionSistems from '@/components/home/SectionSistems.vue';
    // import SectionTarf from '@/components/home/SectionTarf.vue';
    // import sectionFaq from '@/components/home/SectionFaq.vue'
    // import SectionAtendimento from '@/components/home/SectionAtendimento.vue';


    onMounted(() => {
            setTimeout(()=>{
                router.push('/leges')
            }, 1500)
        
    })

</script>
