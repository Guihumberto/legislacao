<template>
    <Transition name="fade">
        <v-card-text>
            <h1 class="text-h4">{{ form.name }}</h1>
            <div class="mt-5">
                <div v-for="parg, p in form.text" :key="p" class="mb-10">
                    <p class="font-weight-bold mb-5">Página {{ p + 1 }}</p>
                    <p class="parag" v-html="showTexto(parg.text)"></p>
                </div>
            </div>
        </v-card-text>
    </Transition>
</template>

<script setup>
     const props = defineProps({
        form: Object
    })

    const showTexto = (item) => {
        return item
            .replace(/\n{2,}/g, '<br>') // 2 quebras de linha viram <br><br>
            .replace(/\n/g, '<br>'); // 1 quebra de linha vira <br>
    }

</script>

<style scoped>
.parag{
    padding: 0 0 .5rem;
    line-height: 2;
}

</style>