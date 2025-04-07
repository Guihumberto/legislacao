<template>
     <v-btn 
        prepend-icon="mdi-chevron-up" variant="text" @click="upPoint">
        <template v-slot:append>
            <v-badge
            color="info"
            :content="comment?.point"

            ></v-badge>
        </template>
    </v-btn>
    <v-btn 
        prepend-icon="mdi-chevron-down" variant="text" @click="downPoint" >
        <template v-slot:append>
            <v-badge
            color="error"
            :content="comment?.point"
            ></v-badge>
        </template>
    </v-btn>    
</template>

<script setup>

    const props = defineProps({
        comment: {
            type: Object,
            required: true
        }
    })


    const upPoint = () => {
        props.comment.point = 1
    }

    const downPoint = () => {
        props.comment.point = - 1
    }
    
</script>

<style scoped>

</style>