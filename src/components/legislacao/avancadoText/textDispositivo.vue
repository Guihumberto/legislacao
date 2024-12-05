<template>
    <div>
        <p :class="dispositivo.estrutura ? 'estrutura': ''"
            v-html="dispositivo.textlaw.startsWith('Art') ?  `<b>${dispositivo.textlaw.substr(0, 4)}</b> ${dispositivo.textlaw.substr(4)}` : dispositivo.textlaw">
        </p>
    </div>
</template>

<script setup>

const props = defineProps({
    dispositivo: Object
})
</script>

<style scoped>
.estrutura{
    background: rgb(234, 232, 232);
    padding: .5rem;
    text-align: center;
    font-weight: 440;
}
</style>