<template>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="item, i in userAreaStore.readCollection"
          :key="i"
        >
            <v-expansion-panel-title expand-icon="mdi-menu-down">
                <div class="d-flex justify-space-between w-100">
                    <h5 class="text-h6">{{ item.title }}</h5>
                    <v-btn variant="outlined" color="primary" @click.stop="openCollection(item.title)">abrir</v-btn>
                </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
                <p>{{ item.description }}</p>
                {{ item }}
                <v-list>
                    <v-list-item 
                        v-for="ind, x in item.law" :key="x" 
                        :subtitle="`${ind.tipo} - ${ind.ano}`"
                        link
                    >
                        <template v-slot:prepend>
                            <v-icon icon="mdi-file-document"></v-icon>
                        </template>
                        <span>{{ ind.title }} - total pag. {{ ind.total_pages }}</span>
                        <template v-slot:append>
                            {{ x + 1 }}
                        </template>
                    </v-list-item>
                </v-list>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>
<script setup>   
    import { useUserAreaStore } from '@/store/AreaUserStore';
    import { useRouter } from 'vue-router';
    const userAreaStore = useUserAreaStore()
    const router = useRouter()

    const openCollection = (id) => {
        router.push(`/collection_search/${id}`)
    }

</script>
<style scoped>
</style>