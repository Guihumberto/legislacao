<template>
     <v-tooltip width="200" :text="lawFav.fav ? 'Dê dois cliques para desfavoritar a Norma' : 'Dê dois cliques para favoritar a Norma'">
        <template v-slot:activator="{ props }">
            <div  v-bind="props">
                <p 
                    @dblclick="saveFavoritos()"
                    class="d-flex align-center"> <span class="destaqueTitle">{{ law._source.page_to_norma.title }} </span>
                    <v-icon class="favoritar" v-if="lawFav.fav" color="primary">mdi-star</v-icon>
                </p> 
            </div>
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
    import { useUserAreaStore } from '@/store/AreaUserStore'
    const areaUserStore = useUserAreaStore()

    import { useLoginStore } from '@/store/LoginStore'
    import { ref, onMounted } from 'vue';
    const loginStore = useLoginStore()

    const isExist = ref(false)

    const props = defineProps({
        law: Object
    })

    const lawFav = ref({
        fav: false, 
        section: 'law',
        folder: null,
        norma: null,
        ano: null,
        folder: null,
        id: null,
    })

    const isFav = () => {
        if(loginStore.readLogin.login) {
            isExist.value = areaUserStore.readFavoritos
                            .find(x => x.id == props.law._source.page_to_norma.parent)
        }
    }

    onMounted(() => {
        if(loginStore.readLogin.login) {
            isFav()
            lawFav.value = {
                fav: !!isExist.value,
                section: 'law',
                folder: null,
                ano: props.law._source.ano,
                tipo: props.law._source.tipo,
                norma: props.law._source.page_to_norma.title,
                id: props.law._source.page_to_norma.parent
            }
        }
    })

    const saveFavoritos = async () => {
        if(loginStore.readLogin.login) {
            lawFav.value.fav = !lawFav.value.fav

            lawFav.value.date = Date.now()
            await areaUserStore.saveFavoritos(lawFav.value)

            snack.value = {
                snackbar: true,
                text: lawFav.value.fav ? 'Norma adicionada aos favoritos.' : 'Norma removida dos favoritos.'
            }

        } else {
            snack.value = {
                snackbar: true,
                text: 'Necessário estar logado para usar esta funcionalidade.'
            }
        }
    }

    const snack = ref({
        snackbar: false,
        text: 'Necessário estar logado para usar esta funcionalidade.',
        timeout: 2000
    }) 




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