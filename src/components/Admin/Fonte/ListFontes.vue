<template>
    <v-card variant="flat" class="my-5 card">
        <v-card-text class="text-center">
            <addFonte @saveFonte="salvar" />
            <v-row v-for="item, i in generalStore.readAggsFonte">
                <!-- jogasr para dentro de um componente -->
                <FormFonte :fonte="item" :exist="generalStore.readTipos.find(x => x.nome == item.key)" @saveFonte="salvar" />
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup>
        import FormFonte from './formFonte.vue';
        import addFonte from './addFonte.vue';

        import { useGeneralStore } from '@/store/GeneralStore';
        const generalStore = useGeneralStore()

        generalStore.getAllFonteLaws()

        const salvar = async (event) => {
            generalStore.saveFonteMudar(event)
            
        }

</script>

<style scoped>
.card{
    animation: aparecer 2s ease;
    transition: 1s ease;
}

</style>