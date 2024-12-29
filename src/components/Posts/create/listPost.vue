<template>
     <v-list
      lines="three"
      class="pa-0"
    >   
        <v-list-item v-for="item, i in postStore.readPosts" :key="i" link>
            <template v-slot:prepend>
                <v-avatar>
                    <v-icon>mdi-forum</v-icon>
                </v-avatar>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>    
            <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>    
            <template v-slot:append>
                <div v-if="postStore.readLoad">
                    Aguarde...
                </div>
                <div v-else class="d-flex">
                    <v-switch
                        label="Publicar"
                        v-model="item.publish"
                        color="success"
                        hide-details
                        density="compact"
                        @update:model-value="postStore.editPost(item)"
                    ></v-switch>
                   <v-btn @click.stop="router.push(`/myposts/create/${item.id}`)" class="mx-2" variant="text" color="grey" icon="mdi-pencil"></v-btn>
                   <v-btn @click.stop="deletePost(item)" variant="text" color="red" icon="mdi-delete"></v-btn>
                </div>
            </template>
        </v-list-item>
    </v-list>
    <Pagination />
</template>

<script setup>
    import router from '@/router';
import Pagination from './pagination.vue';

    import { usePostStore } from '@/store/PostStore';
    const postStore = usePostStore()

    const deletePost = (item) => {
        item.active = false
        postStore.editPost(item)
    }

</script>

<style lang="scss" scoped>

</style>