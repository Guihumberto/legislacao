<template>
    <div class="pa-2">
        <div class="comment-box" v-for="item, i in forumStore.readComments" :key="i">
            <div class="profile-pic"></div>
            <div class="comment-content">
                <div class="username">{{ item.user_name }}</div>
                <div class="timestamp">{{ item.data_include }}</div>
                <div class="comment-text">{{ item.text }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
        import { useForumStore } from '@/store/ForumStore';
        const forumStore = useForumStore()

</script>

<style scoped>

</style>