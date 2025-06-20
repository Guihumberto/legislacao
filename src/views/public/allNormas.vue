<template>
     <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
             <div>
                <v-btn variant="outlined" prepend-icon="mdi-arrow-left" @click="$router.push('/homepainel')">voltar</v-btn>
             </div>
             <h1 class="text-h4 my-6 text-center grey--text text--darken-3">
                Buscar normas
             </h1>
             <div>
                <v-form @submit.prevent="searchLaw" ref="form">
                    <v-text-field
                        label="Buscar"
                        prepend-inner-icon="mdi-magnify"
                        density="compact"
                        variant="outlined"
                        clearable
                        v-model="search"
                    ></v-text-field>
                    <div class="d-flex justify-center ga-2 mt-5">
                        <v-btn variant="text" :disabled="!search" @click="search = ''">limpar</v-btn>
                        <v-btn color="primary" variant="flat" type="submit" append-icon="mdi-magnify">Buscar</v-btn>
                    </div>
                </v-form>
             </div>


        </div>
    </section>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    
    import { useGeralStore } from '@/store/GeralStore';
    import { useLawStore } from '@/store/LawsStore';
    
    const geralStore = useGeralStore()
    const lawStore = useLawStore()
    
    const router = useRouter()
    const route = useRoute()
    const search = ref('')

    const navigateToLaw = (id) => {
        router.push(`/avancado/${id}`)
    }

    const searchLaw = async () => {
        await lawStore.searchLaw(search.value)
    }

</script>

<style scoped>

</style>