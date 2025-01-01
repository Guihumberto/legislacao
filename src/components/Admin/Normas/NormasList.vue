<template>
    <div v-if="lawStore.readLoad">Carregando...</div>
    <v-list class="pa-0 mt-5">
        <v-list-subheader>
            Total de normas encontradas: {{ lawStore.readTotalLawsAdmConfig }}
        </v-list-subheader>
        <v-list-item v-for="item, i in lawStore.readLawsListConfigAdm" :key="i" link>
            <template v-slot:prepend>
                <v-icon>mdi-file</v-icon>
            </template>
            <div>
                {{ item._source.title }} <br>
                <small>ano: {{ item._source.ano }} - tipo: {{ item._source.tipo }} - total pág: {{ item._source.total_pages }}</small>
            </div>
            <template v-slot:append>
                <div class="switchs">
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
                </div>
                <v-btn variant="text" 
                    :class="isFav(item._source.id) ? 'favoritar':''"
                    :icon="isFav(item._source.id) ? 'mdi-star': 'mdi-star-outline'" 
                    :color="isFav(item._source.id) ? 'amber': 'grey'"
                    @click.stop="changeLawFav(item._source)"
                ></v-btn>
                <Menu_popover class="menu" :item="item._source" />
            </template>
            
        </v-list-item>
    </v-list>
</template>

<script setup>
    import { onMounted, ref, computed } from 'vue';
    import { useLawStore } from '@/store/LawsStore';
import Menu_popover from './menu_popover.vue';
    const lawStore = useLawStore()

    const teste = ref(true)

    onMounted(() => {
        lawStore.getLawsAdmConfig()
    })

    const idsMainLaws = computed(() => {
        return lawStore.readMainLaws.map(x => x.id)
    })

    const isFav = (id) => idsMainLaws.value.includes(id)

    const changeLawFav = async (item) => {
        const { ano, description_norm, id, path, revogado, sigiloso, tipo, title, total_pages } = item
        const objeto = { ano, description_norm, id, path, revogado, sigiloso, tipo, title, total_pages }
        await lawStore.addMainLaw(objeto)
    }

</script>

<style lang="scss" scoped>
.switchs {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 1s ease;
}
.menu {
    display: none;
    transition: 1s ease;
}
.favoritar{
    font-size: 1.1rem;
    animation: aumentar 1s ease;
}
@keyframes aumentar {
    from{
        scale: 2;
    }
    to{
        scale: 1;
    }
}
@media (max-width: 800px) {
    .switchs {
        display: none;
    }
    .menu{
        display: flex;
    }
}
</style>