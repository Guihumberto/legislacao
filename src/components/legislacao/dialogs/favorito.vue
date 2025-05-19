<template>
    <v-tooltip :text="isFav.exist ? 'Desfavoritar a página' : 'Favoritar a página'">
        <template v-slot:activator="{ props }">
            <v-btn 
                @click="saveFavorite()" v-bind="props" variant="text" 
                :disabled="favStore.readload"
                icon="mdi-star" 
                :color="isFav.exist ? 'yellow-darken-1' : 'grey'"
            ></v-btn>
        </template>
    </v-tooltip>
</template>

<script setup>
    import { onMounted, ref, computed } from 'vue';

    import { useFavStore } from '@/store/FavStore'
    const favStore = useFavStore()

    import { useLoginStore } from '@/store/LoginStore'
    const loginStore = useLoginStore()

    import { useSnackStore } from '@/store/snackStore';
    const snackStore = useSnackStore()

    const props = defineProps({
        page: Object
    })

    const favorite = ref({})

    const isFav = computed(() => {
        if(loginStore.readLogin.cpf) {
            const isFind = favStore.readFavoritos
                            .find(x => x.id == props.page._id)
            return { exist: !!isFind, item: isFind}
        } else {
            return { exist: false, item: false }
        }
    })

    onMounted(() => {
        favorite.value = {
            section: 'page',
            folder: null,
            ano: props.page._source.ano,
            tipo: props.page._source.tipo,
            num_page: props.page._source.num_page,
            id_law: props.page._source.page_to_norma.parent,
            name_law: props.page._source.page_to_norma.title,
            id: props.page._id,
            revogado: props.page._source.revogado,
            sigiloso: props.page._source.sigiloso,
        }
    })

    const saveFavorite = async() =>{
        if(loginStore.readLogin.cpf) {

            if(isFav.value.exist){
                favStore.deleteFav(isFav.value.item.idU)
                snackStore.activeSnack('Página removida dos favoritos.', 'error')
                return
            }

            favorite.value.fav = true

            await favStore.saveFavoritos(favorite.value)
            snackStore.activeSnack('Página adicionada aos favoritos.', 'success')
        } else {
            snackStore.activeSnack('Necessário estar logado para usar esta funcionalidade.', 'error')
        }
    }

</script>

<style lang="scss" scoped>

</style>