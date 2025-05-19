<template>
    <v-list class="pa-0 mt-5 list" :class="lawStore.readLoad ? 'transitionTrue' : 'transitionFalse'">
        <v-list-subheader>
            Total de normas encontradas: {{ lawStore.readTotalLawsAdmConfig }}
        </v-list-subheader>
        <transition-group name="fade">
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
                             @update:model-value="changeRevogado({idU: item._id, ...item._source})"
                        ></v-switch>
                        <v-switch
                             class="ml-5"
                             label="Sigiloso"
                             density="compact"
                             hide-details
                             color="error"
                             v-model="item._source.sigiloso"
                             @update:model-value="changeSigiloso({idU: item._id, ...item._source})"
                        ></v-switch>
                        <v-switch
                             class="ml-5"
                             label="Eficaz"
                             density="compact"
                             hide-details
                             color="success"
                             v-model="item._source.eficaz"
                             @update:model-value="changeEficaz({idU: item._id, ...item._source})"
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
        </transition-group>
    </v-list>
</template>

<script setup>
    import { onMounted, ref, computed } from 'vue';
    import { useLawStore } from '@/store/LawsStore';
    import Menu_popover from './menu_popover.vue';
    const lawStore = useLawStore()
    
    import { useAdminStore } from '@/store/AdminStore';
    const adminStore = useAdminStore()

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

    const changeRevogado = (item) => {
        adminStore.editLaw(item, 'revogado')
    }

    const changeSigiloso = (item) => {
        adminStore.editLaw(item, 'sigiloso')
    }

    const changeEficaz = (item) => {
        adminStore.editLaw(item, 'eficaz')
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s, transform 0.4s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.transitionTrue {
    background: #d2d2d8;
    color: #EEEEEE;
    transition: .5s ease;
}
.transitionFalse {
    background: rgb(252, 249, 249);
    transition: .5s ease;
}
.list{
    animation: aparecer 2s ease;
    transition: 1s ease;
}
</style>