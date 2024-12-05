<template>
    <div>
        <p :class="dispositivo.estrutura ? 'estrutura': ''"
            v-html="dispositivo.textlaw.startsWith('Art') ?  `<b>${dispositivo.textlaw.substr(0, 4)}</b> ${markSearch(dispositivo.textlaw.substr(4))}` : markSearch(dispositivo.textlaw)">
        </p>
    </div>
</template>

<script setup>


    const props = defineProps({
        dispositivo: Object,
        search: String
    })

    const markSearch = (item) => {
        if(props.search) {
            let termoPesquisado = props.search.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
            let pattern = new RegExp(termoPesquisado,"gi");
    
            return item.replace(pattern, match => `<mark>${match}</mark>`);
        } else {
            return item
        }
    }
    
</script>

<style scoped>
.estrutura{
    background: rgb(234, 232, 232);
    padding: .5rem;
    text-align: center;
    font-weight: 440;
}
</style>