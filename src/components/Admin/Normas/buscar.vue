<template>
    <v-card>
       <v-card-text>
            <v-form @submit.prevent="searchForm()">
                <v-text-field
                    label="Buscar"
                    placeholder="Digite o nome ou número da norma"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-magnify"
                    v-model.trim="search.text"
                    clearable
                    :disabled="search.fav_law"
                ></v-text-field>
                <div class="autocompletes">
                    <v-autocomplete
                        :disabled="search.fav_law"
                        clearable
                        chips
                        label="Fonte"
                        density="compact"
                        :items="generalStore.readTipos"
                        item-value="nome"
                        item-title="mudar"
                        multiple
                        variant="outlined"
                        v-model="search.fonte"
                        closable-chips
                        prepend-inner-icon="mdi-alpha-f-box"
                    ></v-autocomplete>
                    <v-autocomplete
                        :disabled="search.fav_law"
                        prepend-inner-icon="mdi-calendar"
                        clearable
                        chips
                        label="Período"
                        density="compact"
                        :items="generalStore.readPeriodo"
                        multiple
                        variant="outlined"
                        v-model="search.years"
                        closable-chips
                    ></v-autocomplete>
                </div>
                <div class="checkbox">
                        <v-checkbox :disabled="search.fav_law" hide-details label="Eficaz" v-model="search.eficaz" color="success"></v-checkbox>
                        <v-checkbox :disabled="search.fav_law" hide-details label="Sigiloso" v-model="search.sigiloso" color="warning"></v-checkbox>
                        <v-checkbox :disabled="search.fav_law" hide-details label="Revogado" v-model="search.revogado" color="error"></v-checkbox>
                </div>
                <div>
                    <v-checkbox v-model="search.fav_law" color="amber" label="Apenas marcados como favoritos" hide-details></v-checkbox>
                </div>
                
                <div class="text-right">
                    <v-btn color="success" variant="flat" type="submit">Buscar</v-btn>
                </div>
            </v-form>
       </v-card-text>
    </v-card>
</template>

<script setup>
    import { ref } from 'vue';

    import { useGeneralStore } from '@/store/GeneralStore'
    const generalStore = useGeneralStore()  

    import { useLawStore } from '@/store/LawsStore';
    const lawStore = useLawStore()

    const search = ref({
        text: '',
        years: [],
        fonte: [], 
        eficaz: true,
        sigiloso: false,  
        revogado: false,
        fav_law: false
    })

    const searchForm = async () => {
        await lawStore.searchform(search.value)
    }
</script>

<style lang="scss" scoped>
.autocompletes{
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 1rem;
}
.checkbox{
    display: flex;
    gap: 1rem;
}
@media (max-width: 500px) {
    .autocompletes{
        flex-direction: column;
        gap: 0;
    }
}
</style>