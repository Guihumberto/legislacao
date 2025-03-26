<template>
    <div class="container">
        <div  v-if="!collectionSelected" >
            <Cards />
            <CardsCollection />
        </div>
        <Chatbot v-else />
    </div>
</template>

<script setup>
    import Cards from '@/components/chat/cards.vue';
    import CardsCollection from '@/components/chat/cardsCollection.vue';
    import Chatbot from '@/components/chat/chatbot.vue';

    import { useCollectionStore } from '@/store/CollectionStore';
    const collectionStore = useCollectionStore()
    
    import { useDocumetStore } from '@/store/DocumentStore';
    const documentStore = useDocumetStore()

    import { computed, onMounted, watch } from 'vue';
    
    import { useRoute } from 'vue-router';
    const route = useRoute()

    const collectionSelected = computed(()=> {
        return route.params.id
    })

    onMounted(async ()=> {
        await documentStore.getListDocuments()
        await collectionStore.getChatWithCollection()
        if(collectionSelected.value) await loadCollection()
    })

    const loadCollection = async ()=> await collectionStore.getChatWithCollection(collectionSelected.value)

    watch(collectionSelected, (newValue, oldValue ) => {
        if(newValue) loadCollection()
    })


</script>

<style scoped>
.container{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: calc(100vh - 140px);
    margin-inline: auto;
}
</style>