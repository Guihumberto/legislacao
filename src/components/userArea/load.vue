<template>
    <div class="load">
        <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
        ></v-progress-circular>
    </div>
</template>
<style scoped>
.load{
    height: 60vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
}
</style>