<template>
    <div v-if="lawStore.readLoad">Carregando...</div>
    <v-list class="pa-0 mt-5">
        <v-list-subheader>Total de normas encontradas: {{ lawStore.readTotalLawsAdmConfig }}</v-list-subheader>
        <v-list-item v-for="item, i in lawStore.readLawsListConfigAdm" :key="i" link>
            <template v-slot:prepend>
                <v-icon>mdi-file</v-icon>
            </template>
            <div>
                {{ item._source.title }} <br>
                <small>ano: {{ item._source.ano }} - tipo: {{ item._source.tipo }} - total pág: {{ item._source.total_pages }}</small>
            </div>
            <template v-slot:append>
               <v-switch
                    label="Revogado"
                    density="compact"
                    hide-details
                    color="warning"
                    v-model="item._source.revogado"
               ></v-switch>
               <v-switch
                    class="ml-5"
                    label="Sigiloso"
                    density="compact"
                    hide-details
                    color="error"
                    v-model="item._source.sigiloso"
               ></v-switch>
               <v-switch
                    class="ml-5"
                    label="Eficaz"
                    density="compact"
                    hide-details
                    color="success"
                    v-model="teste"
               ></v-switch>
            </template>
            
        </v-list-item>
    </v-list>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import { useLawStore } from '@/store/LawsStore';
    const lawStore = useLawStore()

    const teste = ref(true)

    onMounted(() => {
        lawStore.getLawsAdmConfig()
    })

</script>

<style lang="scss" scoped>

</style>