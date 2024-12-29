<template>
    <v-card class="mt-5">
        <v-list lines="two">
            <v-list-item 
                :title="item.title" 
                :subtitle="resumo(item.pages)"
                v-for="item, i in userAreaStore.readDocumentos" :key="i">
                <template v-slot:prepend>
                    <v-icon>
                        mdi-text-box-multiple-outline
                    </v-icon>
                </template>
                
                <template v-slot:append>
                    <OptionsDoc :document="item" />
                </template>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script setup>
    import { useUserAreaStore } from '@/store/AreaUserStore';
    import OptionsDoc from './optionsDoc.vue';
    const userAreaStore = useUserAreaStore()

    const resumo = (item) => {
        const res = item.map(x => x.name_law)
        return res.join(", ")
    }

</script>

<style scoped>
    
</style>