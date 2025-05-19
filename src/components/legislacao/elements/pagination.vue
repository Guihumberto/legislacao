<template>
    <div class="mt-10">
        <v-pagination 
            :length="Math.ceil(totalDocs/areaUserStore.readPagination.perPage)"
            v-model="areaUserStore.pagination.page" 
            density="compact">
        </v-pagination>
    </div>
</template>

<script setup>
    import { onMounted, watch } from 'vue';

    import { useRoute, useRouter } from 'vue-router';
    const router = useRouter()
    const route = useRoute()

    
    import { useUserAreaStore } from '@/store/AreaUserStore';
    const areaUserStore = useUserAreaStore()

    const props = defineProps({
        totalDocs: Number,
        section: String
    })

    watch(
        () => areaUserStore.pagination.page,
            (newValue, oldValue) => {
                areaUserStore.pagination.start = areaUserStore.pagination.page * areaUserStore.readPagination.perPage - areaUserStore.readPagination.perPage + 1
                areaUserStore.getListFavPages(props.section)
                router.push(`favorites?tab=${route.query.tab}&page=${areaUserStore.pagination.page}`)
            }
    );

    onMounted(() => {
        // if(route.query.page){
        //     areaUserStore.pagination.page = parseInt(route.query.page)
        //     areaUserStore.pagination.start = areaUserStore.pagination.page * areaUserStore.readPagination.perPage - areaUserStore.readPagination.perPage + 1
        //     areaUserStore.getListFavPages(props.section)
        // }
    })

</script>

<style scoped>

</style>