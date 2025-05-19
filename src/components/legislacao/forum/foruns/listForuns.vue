<template>
    <div class="mt-5">
        <v-list class="pa-0 bg-transparent border rounded">
            <transition-group name="fade">
              <v-list-item
                v-for="(item, i) in forumStore.readMyGroup"
                :key="i"
                color="primary"
                :to="`/avancado/forumlaw/${item.id}`"
                prepend-icon="mdi-forum"
              >
                  <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item>
            </transition-group>
        </v-list>
    </div>
</template>

<script setup>
    import { useForumStore } from '@/store/ForumStore'
    const forumStore = useForumStore()

</script>

<style scoped>

</style>