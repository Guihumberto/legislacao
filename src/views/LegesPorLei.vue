<template>
    <forLaw />
    <!-- <updateLaws /> -->
     <div>
       <span ref="targetSection" id="news"></span>
       <newsLaws :type="'resumo'" />
     </div>
</template>

<script setup>
  import { onMounted, ref } from "vue";

  import forLaw from "@/components/legislacao/porLei.vue"
  import updateLaws from "@/components/legislacao/elements/updateLaws"
  import newsLaws from "@/components/legislacao/elements/newsLaws.vue"

  import { useRoute } from "vue-router";
  import { usePublishStore } from "@/store/publishStore";
  const route = useRoute()
  const publisStore = usePublishStore()
  


  const targetSection = ref(null);

  const deslocarTela = () => {
      targetSection.value.scrollIntoView({behavior: "smooth"})
  }

  onMounted(() => {
    setTimeout(() => {
      if(route.query.news == 'news') deslocarTela()
    }, 1000)
  })

</script>

<style lang="scss" scoped>

</style>