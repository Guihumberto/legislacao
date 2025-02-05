<template>
    <div class="d-flex align-center">
        <v-tooltip width="200" :text="isFav.exist ? 'Dê dois cliques para desfavoritar a Norma' : 'Dê dois cliques para favoritar a Norma'">
           <template v-slot:activator="{ props }">
               <div  v-bind="props">
                   <p 
                       @dblclick.stop="saveFavoritos()"
                       class="d-flex align-center"> <span class="destaqueTitle">{{ law._source.page_to_norma.title }} </span>
                       <v-icon class="favoritar" v-if="isFav.exist" color="primary">mdi-star</v-icon>
                   </p> 
               </div>
           </template>
       </v-tooltip>
       <v-tooltip width="200" text="Filtrar por norma">
            <template v-slot:activator="{ props }">
                <v-btn @click="filterLaw"  v-bind="props" density="compact" :color="isFilterLaw() ? 'primary' : 'grey'" variant="text" icon="mdi-filter"></v-btn>
            </template>
       </v-tooltip>
    </div>
</template>

<script setup>
    import { computed, ref, inject } from 'vue';
    
    import { useUserAreaStore } from '@/store/AreaUserStore'
    const areaUserStore = useUserAreaStore()

    import { useLoginStore } from '@/store/LoginStore'
    const loginStore = useLoginStore()

    import { useSnackStore } from '@/store/snackStore';
    const snackStore = useSnackStore()

    const props = defineProps({
        law: Object
    })

    const isFav = computed(() => {
        if(loginStore.readLogin.cpf) {
            const isFind = areaUserStore.readFavoritos
                            .find(x => x.id == props.law._source.page_to_norma.parent)
            return { exist: !!isFind, item: isFind}
        } else {
            return { exist: false, item: false }
        }
    })

    const saveFavoritos = async () => {
        if(loginStore.readLogin.cpf && !areaUserStore.readLoad) {
            if(isFav.value.exist){
                areaUserStore.deleteFav(isFav.value.item.idU)
                snackStore.activeSnack('Norma removida dos favoritos.', 'error')
                return
            }

            const lawFav = {
                fav: true,
                section: 'law',
                folder: null,
                ano: props.law._source.ano,
                tipo: props.law._source.tipo,
                num_page: null,
                id_law: props.law._source.page_to_norma.parent,
                name_law: props.law._source.page_to_norma.title,
                id: props.law._source.page_to_norma.parent,
                revogado: props.law._source.revogado,
                sigiloso: props.law._source.sigiloso
            }
            await areaUserStore.saveFavoritos(lawFav)
            snackStore.activeSnack('Norma adicionada aos favoritos', 'success')

        } else {
            snackStore.activeSnack('Necessário estar logado para usar esta funcionalidade.', 'error')   
        }
    }


    const emits = defineEmits(['filterLaw'])

    const filterLaws = inject('filterLaws')
    const selectLaw = ref(null)

    const filterLaw = () => {
        if(!isFilterLaw()){
            selectLaw.value = props.law._source.page_to_norma.parent
        } else {
            selectLaw.value = null
        }
         emits('filterLaw', selectLaw.value)
    }

    const isFilterLaw = () => {
        return !!filterLaws.value.norma.find(x => x == props.law._source.page_to_norma.parent )
    }
</script>

<style lang="scss" scoped>
.favoritar{
    font-size: 1.2rem;
    animation: aumentar 1s ease;
}
.destaqueTitle{
    transition: .4s ease-in-out;
    padding: 1px 5px;
    border-radius: 12px;
    cursor: pointer;
}
.destaqueTitle:hover{
    background: rgb(164, 212, 227);
}
@keyframes aumentar {
    from{
        scale: 2;
    }
    to{
        scale: 1;
    }
}
</style>