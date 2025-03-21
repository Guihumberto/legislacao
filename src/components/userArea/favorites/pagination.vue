<template>
    <div class="mt-10">
        <v-pagination 
            :length="Math.ceil(totalDocs/favStore.readPagination.perPage)"
            v-model="favStore.pagination.page" 
            density="compact">
        </v-pagination>
    </div>
</template>

<script setup>
    import { onMounted, watch } from 'vue';

    import { useRoute, useRouter } from 'vue-router';
    const router = useRouter()
    const route = useRoute()

    import { useFavStore } from '@/store/FavStore';
    const favStore = useFavStore()

    const props = defineProps({
        totalDocs: Number,
        section: String
    })

    watch(
        () => favStore.pagination.page,
            (newValue, oldValue) => {
                favStore.pagination.start = favStore.pagination.page * favStore.readPagination.perPage - favStore.readPagination.perPage + 1
                favStore.getListFavPages(props.section)
                router.push(`favorites?tab=${route.query.tab}&page=${favStore.pagination.page}`)
            }
    );

    onMounted(() => {
        // if(route.query.page){
        //     favStore.pagination.page = parseInt(route.query.page)
        //     favStore.pagination.start = favStore.pagination.page * favStore.readPagination.perPage - favStore.readPagination.perPage + 1
        //     favStore.getListFavPages(props.section)
        // }
    })

</script>

<style scoped>

</style>