<template>
    <v-tooltip :text="favorite.fav ? 'Desfavoritar a Página' : 'Favoritar a Página'">
        <template v-slot:activator="{ props }">
            <v-btn 
                @click="saveFavorite()" v-bind="props" variant="text" 
                :disabled="areaUserStore.readload"
                icon="mdi-star" 
                :color="favorite.fav ? 'yellow-darken-1' : 'grey'"
            ></v-btn>
        </template>
    </v-tooltip>
</template>

<script setup>
    import { onMounted, ref } from 'vue';

    import { useUserAreaStore } from '@/store/AreaUserStore'
    const areaUserStore = useUserAreaStore()

    import { useLoginStore } from '@/store/LoginStore'
    const loginStore = useLoginStore()

    import { useSnackStore } from '@/store/snackStore';
    const snackStore = useSnackStore()

    const props = defineProps({
        page: Object
    })

    const favorite = ref({})
    const isExist = ref(false)

    const isFav = () => {
        if(loginStore.readLogin.cpf && !areaUserStore.readLoad) {
            isExist.value = areaUserStore.readFavoritos
                            .find(x => x.id == props.page._id)
        }
    }

    onMounted(() => {
        isFav()
        favorite.value = {
            fav: !!isExist.value,
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
            favorite.value.fav = !favorite.value.fav
            await areaUserStore.saveFavoritos(favorite.value)

            const text = favorite.value.fav ? 'Página adicionada aos favoritos.' : 'Página removida dos favoritos.'
            const color = favorite.value.fav ? 'success' : 'error'
            snackStore.activeSnack(text, color)
            
        } else {
            snackStore.activeSnack('Necessário estar logado para usar esta funcionalidade.', 'error')
        }
    }

</script>

<style lang="scss" scoped>

</style>