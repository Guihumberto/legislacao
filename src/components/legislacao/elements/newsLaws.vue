<template>
     <section>
        <div class="containerNews">
            <h5 class="mb-5 text-h6">Normas em Destaque Adicionadas Recentemente</h5>
            <div v-if="pusblishStore.readLoad" class="load">
                <v-progress-circular
                    :size="50"
                    color="primary"
                    indeterminate
                ></v-progress-circular>
            </div>

            <v-list class="border pa-0 mt-5 list" v-else>
                <v-list-item
                    v-for="item, i in pusblishStore.readPublicacoes"
                    :key="i"
                    :value="item.idU"
                    active-class="text-pink"
                    class="py-3"
                    :to="`text/${item.id_law}?search=${refQuery}`"
                >
                    <v-list-item-title>{{ item.title }}</v-list-item-title>

                    <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">{{ item.name_law }}</v-list-item-subtitle>

                    <v-list-item-subtitle class="text-high-emphasis">{{ item.text }}</v-list-item-subtitle>

                    <template v-slot:append="{ isSelected }">
                    <v-list-item-action class="flex-column">
                        <small class="mb-4 text-high-emphasis opacity-60">{{ useDateNow(item.dateCreate) }}</small>

                        <v-spacer></v-spacer>
                        <v-btn 
                            color="primary" 
                            density="compact" variant="text" @click="$router.push(`text/${item.id_law}?search=${refQuery}`)" icon="mdi-chevron-right"></v-btn>
                    </v-list-item-action>
                    </template>
                </v-list-item>
                <div class="text-center my-3" v-if="type == 'resumo'">
                    <v-btn variant="text" color="primary" @click="$router.push('/newslaws')" v-if="pusblishStore.readPublicacoes.length > 5">Ver mais</v-btn>
                </div>
                <v-pagination
                    v-else
                    v-model="pusblishStore.pagination.page"
                    :length="1"
                    rounded="0"
                ></v-pagination>
            </v-list>
        </div>
    </section>
</template>

<script setup>
    import { onMounted, ref, computed } from 'vue';
    import { useDateNow } from '@/composables/dateFormat';

    import { usePublishStore } from '@/store/publishStore';
    const pusblishStore = usePublishStore() 

    const props = defineProps({
        type: String
    })

    const refQuery = computed(() => {
        return props.type == 'complete'
        ? 'news'
        : 'leges'
    })

    onMounted(() => {
        if(props.type == 'complete') {
            pusblishStore.pagination.perPage = 15
        } else {
            pusblishStore.pagination.perPage = 10
        }
        pusblishStore.getPublicacoes()
    })


</script>


<style scoped>
section .containerNews{
    width: min(90vw, 1000px);
    margin-inline: auto;
    padding: 2rem 0 2rem
}
.load{
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
div h5 {
  color: #39393a;
  border-left: 8px solid #0063AA;
  padding-left: .5rem;
}
.list{
    animation: aparecer 1s ease-in;
    transition: 1s ease;
}
</style>