<template>
    <v-card class="mt-5 card" variant="flat">
            <loading v-if="userAreaStore.readLoad" />
            <v-list lines="two" class="pa-0" density="compact" v-else>
                <v-list-subheader v-if="userAreaStore.readDocumentos.length">Quantidade de documentos: {{ userAreaStore.readTotalDocuments || userAreaStore.readDocumentos.length }}</v-list-subheader>
                <v-list-item 
                    v-if="userAreaStore.readTotalDocuments || userAreaStore.readDocumentos.length"
                    :title="item.title" 
                    link
                    :subtitle="resumo(item.pages)"
                    v-for="item, i in userAreaStore.readDocumentos" :key="i"
                    class="border-b"
                >
                    <template v-slot:prepend>
                        <v-icon>
                            mdi-text-box-multiple-outline
                        </v-icon>
                    </template>
                    
                    <template v-slot:append>
                        <OptionsDoc :document="item" />
                    </template>
                    <div class="ml-3">
                        <v-switch
                            label="Publicar"
                            hide-details
                            color="success"
                            v-model="item.publish"
                            @update:model-value="pusblishDocument(item)"
                            density="compact"
                        ></v-switch>
                    </div>
                </v-list-item>
                <v-alert v-else type="warning" variant="outlined" text="Não há documentos salvos."></v-alert>
                <v-pagination
                    class="mt-5"
                    :length="Math.ceil(userAreaStore.readTotalDocuments/userAreaStore.readPagination.perPage)"
                    v-model="userAreaStore.pagination.page" 
                    v-if="userAreaStore.readDocumentos.length"
                    density="compact">
                ></v-pagination>
            </v-list>
    </v-card>
</template>

<script setup>
    import { onMounted, watch } from 'vue';

    import { useDocumetStore } from '@/store/DocumentStore';
    const documentStore = useDocumetStore()

    import { useRoute, useRouter } from 'vue-router';
    const router = useRouter()
    const route = useRoute()
    
    import OptionsDoc from './optionsDoc.vue';
    import loading from './../load.vue';

    import { useUserAreaStore } from '@/store/AreaUserStore';

    const userAreaStore = useUserAreaStore()

    const resumo = (item) => {
        const res = item.map(x => x.name_law)
        return res.join(", ")
    }

    const pusblishDocument = async (item) => {
        await documentStore.publishDocument(item)
    }

    watch(
        () => userAreaStore.pagination.page,
            (newValue, oldValue) => {
                userAreaStore.pagination.start = userAreaStore.pagination.page * userAreaStore.readPagination.perPage - userAreaStore.readPagination.perPage + 1
                userAreaStore.getDocs()
                router.push(`documents?tab=${route.query.tab}&page=${userAreaStore.pagination.page}`)
            }
    );

    onMounted(() => {
        if(route.query.page){
            userAreaStore.pagination.page = parseInt(route.query.page)
            userAreaStore.pagination.start = userAreaStore.pagination.page * userAreaStore.readPagination.perPage - userAreaStore.readPagination.perPage + 1
            userAreaStore.getDocs()
        }
    })

</script>

<style scoped>
.card{
    animation: aparecer .5s ease-in forwards;
}
    
</style>