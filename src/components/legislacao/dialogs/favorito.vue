<template>
    <v-tooltip :text="favorite.fav ? 'Desfavoritar a Página' : 'Favoritar a Página'">
        <template v-slot:activator="{ props }">
            <v-btn 
                @click="saveFavorite()" v-bind="props" variant="text" 
                icon="mdi-star" 
                :color="favorite.fav ? 'yellow-darken-1' : 'grey'"
            ></v-btn>
        </template>
    </v-tooltip>
    <v-snackbar
        v-model="snack.snackbar"
        :timeout="snack.timeout"
    >
        {{ snack.text }}
        <template v-slot:actions>
            <v-btn
            color="blue"
            variant="text"
            @click="snack.snackbar = false"
            >
            X
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script setup>
    import { onMounted, ref } from 'vue';

    import { useUserAreaStore } from '@/store/AreaUserStore'
    const areaUserStore = useUserAreaStore()

    import { useLoginStore } from '@/store/LoginStore'
    const loginStore = useLoginStore()

    const props = defineProps({
        page: Object
    })

    const favorite = ref({
        fav: false,
        section: 'page',
        folder: 'PROCESSOS',
        ano: 2003,
        tipo: "decretos",
        num_page: "",
        id: 0
    })
    const isExist = ref(false)

    const isFav = () => {
        if(loginStore.readLogin.cpf) {
            isExist.value = areaUserStore.readFavoritos
                            .find(x => x.id == props.page._id)
        }
    }

    onMounted(() => {
        isFav()
        favorite.value = {
            fav: !!isExist.value,
            section: 'page',
            folder: 'PROCESSOS',
            ano: props.page._source.ano,
            tipo: props.page._source.tipo,
            num_page: props.page._source.num_page,
            norma: props.page._source.page_to_norma.title,
            id: props.page._id
        }
    })

    const snack = ref({
        snackbar: false,
        text: 'Necessário estar logado para usar esta funcionalidade.',
        timeout: 2000
    }) 

    const saveFavorite = async() =>{
        if(loginStore.readLogin.cpf) {
            favorite.value.fav = !favorite.value.fav
            favorite.value.date = Date.now()
            await areaUserStore.saveFavoritos(favorite.value)

            snack.value = {
                snackbar: true,
                text: favorite.value.fav ? 'Página adicionada aos favoritos.' : 'Página removida dos favoritos.'
            }
        } else {
            snack.value = {
                snackbar: true,
                text: 'Necessário estar logado para usar esta funcionalidade.'
            }
        }
    }

</script>

<style lang="scss" scoped>

</style>