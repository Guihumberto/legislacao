<template>
    <div class="headSearch" id="target">
        <div>
        </div> 
        <div class="d-flex align-center">
            <router-link :to="namePage.url" class="linkTO">{{ namePage.title }}</router-link>
            <help title="ajuda" :idHelp="namePage.id" class="ml-2 contador" />
            <menuOpt class="contador" />
        </div>
    </div>
</template>

<script setup>
    import help from "@/components/legislacao/dialogs/help.vue"
    import menuOpt from "@/components/legislacao/elements/menu.vue"
    import { useRoute } from "vue-router";
    import { computed } from "vue";
    const route = useRoute()

    const namePage = computed(() => {
        return route.name == 'Legislacaoporlei'
        ? { url:'/leges', title: 'Ir para busca por termo', id: 2 }
        : { url:'/legesporlei', title: 'Ir para busca por norma', id: 1 }
       
    })
  
</script>

<style lang="scss" scoped>
.headSearch{
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: aparecer .5s ease-in;
    margin-bottom: 2rem;
}
.linkTO{
    font-size: .9rem;
    padding: .3rem .6rem;
    font-weight: 400;
    color: #040341;
    transition: .7s;
    border-radius: 5rem;
}
.linkTO:hover{
    color: rgb(227, 235, 216);
    background: #040341;
}

@media (max-width: 500px) {
    .contador{
            display: none;
        }
    }
</style>