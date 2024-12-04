<template>
    <section>
        <div class="container">
            <h1 class="text-h5">Histórico de buscas</h1>
            <v-form @submit.prevent="searchGo()" ref="form">
                <v-text-field
                    label="Busca"
                    density="compact"
                    variant="outlined"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="my-5"
                    v-model="search"
                    :rules="[rules.required]"
                ></v-text-field>
            </v-form>
            <v-card>
                <v-list>
                    <v-list-item v-for="item, i in areaUserStore.readHistoricoFormatdo" :key="i">
                        <h3 class="font-weight-bold">{{ formateDateTitle(item.date) }}</h3>
                        <v-list class="mx-0 px-0">
                            <v-list-item v-for="a, ai in item.agg" class="py-0" :key="ai" link @click.stop="goToSearch(a)">
                                <small class="mr-5">{{ getHours(a.date) }}</small> {{ a.text_search }}
                                <template v-slot:append>
                                    <MoreDetailSearch :search="a" />
                                </template>
                            </v-list-item>
                        </v-list>
                    </v-list-item>
                </v-list>
            </v-card>
        </div>
    </section>
</template>

<script setup>
    import { ref } from 'vue';

    import { useUserAreaStore } from '@/store/AreaUserStore'
    const areaUserStore = useUserAreaStore()

    import { useGeneralStore } from '@/store/GeneralStore'
    const generalStore = useGeneralStore()

    areaUserStore.getAllHistórico()

    import { useRouter } from 'vue-router';
    const router = useRouter()
    
    import MoreDetailSearch from '@/components/userArea/moreDetailSearch.vue';

    const search = ref(null)
    const form = ref(null)

    const searchGo = async () => {
            const { valid } = await form.value.validate()
            if(valid){
                console.log(search.value)
            }
    }

    const rules = {
        required: value => !!value || "campo obrigatório", 
        minfield: (v) => (v||'').length >= 3 || "Mínimo 4 caracteres",
    }

    const goToSearch = (item) => {
        const req = true
        generalStore.reqChangeFromHistory(req, item)
        router.push(`leges?search=${item.text_search}&years=${item.years}&fonte=${item.sources}&termo=${item.termos}&precision=${item.precision}`)
    }

    const getHours = (item) => {
        const data = new Date(item);

        const horas = data.getHours().toString().padStart(2, '0'); 
        const minutos = data.getMinutes().toString().padStart(2, '0'); 

        const horaMinutos = `${horas}:${minutos}`;
        return horaMinutos
    }

    const formateDateTitle = (item) => {

        const data = new Date(item); 
        const formato = new Intl.DateTimeFormat('pt-BR', {
            weekday: 'long', // Nome completo do dia da semana
            day: 'numeric',  // Dia do mês
            month: 'long',   // Nome completo do mês
            year: 'numeric'  // Ano completo
            }).format(data);

        return formato
    }

        

</script>

<style scoped>
    section .container{
        min-height: calc(100vh - 400px);
    }
</style>