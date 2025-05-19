<template>
    <div>
        <p 
            :class="dispositivo.estrutura ? 'estrutura': ''"
            :title="`Artigo ${dispositivo.art}`"
            v-html="highlightText(dispositivo)">
        </p>
    </div>
</template>

<script setup>
    const props = defineProps({
        dispositivo: Object,
        search: String
    })

    const highlightText = (text) => {
        if(props.search) {
            const normalize = str => 
            str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            
            const normalizedText = normalize(text.textlaw);
            const normalizedKeyword = normalize(props.search);
            const regex = new RegExp(`(${normalizedKeyword})`, 'gi');
            
            let highlightedText = normalizedText.replace(regex, '<mark>$1</mark>');
    
            if(text.textlaw.startsWith('Art')) {    
                highlightedText = `<b>${highlightedText.substr(0, 4)}</b> ${highlightedText.substr(4)}`
            } 
            else {
                highlightedText = ` (art. ${text.art}º), ${highlightedText}`
            }
    
            return highlightedText;
        } else {
            if(text.textlaw.startsWith('Art')){
                return `<b>${text.textlaw.substr(0, 4)}</b> ${text.textlaw.substr(4)}`
            } else {
                return text.textlaw
            }
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