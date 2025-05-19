<template>
     <v-progress-linear
      color="cyan"
      :indeterminate="load"
      model-value="100"
    ></v-progress-linear>
</template>

<script setup>
const props = defineProps({
  load: Boolean
})
</script>

<style lang="scss" scoped>

</style>