<template>
    <div class="container">
        <Cards v-if="!collectionSelected" />
        <Chatbot v-else />
    </div>
</template>

<script setup>
    import Cards from '@/components/chat/cards.vue';
    import Chatbot from '@/components/chat/chatbot.vue';

    import { useCollectionStore } from '@/store/CollectionStore';
    const collectionStore = useCollectionStore()


    import { computed, onMounted, watch } from 'vue';
    
    import { useRoute } from 'vue-router';
    const route = useRoute()

    const collectionSelected = computed(()=> {
        return route.params.id
    })

    onMounted(()=> {
        if(collectionSelected.value) loadCollection()
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
    max-width: 1080px;
    margin-inline: auto;
}

</style>