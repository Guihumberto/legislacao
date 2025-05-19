<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
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
                    :rules="[rules.required, rules.minfield]"
                ></v-text-field>
            </v-form>
            <v-alert v-if="areaUserStore.readLoad || loginStore.readLoad">Aguarde....</v-alert>
            <div v-else>
                <v-card v-if="areaUserStore.readHistoricoFormatdo.length" class="card">
                    <v-list>
                        <transition-group name="fade">
                            <v-list-item v-for="item, i in areaUserStore.readHistoricoFormatdo.sort((a,b) => b.date - a.date )" :key="i">
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
                        </transition-group>
                    </v-list>
                </v-card>
                <v-alert v-if="!areaUserStore.readHistorico.length" type="warning" variant="outlined" :text="modeSearch ? 'Não há resultados para sua busca' : 'Não há histórico salvo no momento.'">
                    <template v-slot:append>
                        <v-btn @click="goBackHistory" variant="text" prepend-icon="mdi-update">Voltar ao histórico</v-btn>
                    </template>
                </v-alert>
                <div class="d-flex justify-center my-5">
                    <v-btn 
                        v-if="!modeSearch"
                        :loading="areaUserStore.readLoadHistorico"
                        :disabled="areaUserStore.readHistoricoComplete"
                        variant="text" append-icon="mdi-plus" @click="loadPlusHistory()"
                        >Carregar</v-btn>
                    <v-btn v-else @click="goBackHistory" variant="text" prepend-icon="mdi-update">Voltar ao histórico</v-btn>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
    import { ref } from 'vue';

    import { useUserAreaStore } from '@/store/AreaUserStore'
    const areaUserStore = useUserAreaStore()

    import { useGeneralStore } from '@/store/GeneralStore'
    const generalStore = useGeneralStore()

    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()
    
    import { useLoginStore } from '@/store/LoginStore';
    const loginStore = useLoginStore()

    import { useRouter } from 'vue-router';
    const router = useRouter()
    
    import MoreDetailSearch from '@/components/userArea/moreDetailSearch.vue';

    const search = ref(null)
    const modeSearch = ref(false)
    const form = ref(null)

    const searchGo = async () => {
            const { valid } = await form.value.validate()
            if(valid){
                modeSearch.value = true
                areaUserStore.searchHistory(search.value)
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

    const loadPlusHistory = () => {
        areaUserStore.loadPlusHistory()
    }

    const goBackHistory = async () => {
        await areaUserStore.getAllHistórico()
        modeSearch.value = false
    }

        

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s, transform 0.4s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.card{
    animation: aparecer 2s ease forwards;
    transition: 1s ease;
}
</style>