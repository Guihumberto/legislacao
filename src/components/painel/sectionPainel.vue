<template>
    <section class="mb-12">
        <v-row>
            <v-col cols="12">
            <h2 class="text-h5 mb-4 grey--text text--darken-3">
                <v-icon color="grey darken-2" class="mr-2">mdi-clipboard-text-outline</v-icon>
                {{ title }}
            </h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col
                cols="12"
                sm="6"
                md="4"
                v-for="(concurso, i) in concursos"
                :key="`concurso-${i}`"
            >
            <v-card
                class="mx-auto h-100"
                max-width="400"
                elevation="3"
                hover
                @click="$router.push('homepainel/concurso/1')"
            >
                <v-img
                v-if="concurso.img"
                :src="concurso.img"
                height="150"
                cover
                class="grey lighten-2"
                ></v-img>
                <v-card-title class="text-shadow bg-grey-lighten-4">
                    {{ concurso.titulo }}
                </v-card-title>
                <v-card-text class="pt-4">
                    <div>{{ concurso.descricao }}</div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <Details :concurso="concurso" />
                </v-card-actions>
            </v-card>
            </v-col>
        </v-row>
    </section>
</template>

<script setup>
import Details from './details.vue';


const props = defineProps({
    title:  {
        type: String,
        required: true
    },
    concursos: {
        type: Array,
        required: true
    }
})

</script>

<style scoped>

</style>