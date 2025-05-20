<template>
        <section>
            <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
                <v-btn prepend-icon="mdi-arrow-left" variant="text" @click="$router.push('/homepainel')">Voltar</v-btn>
                <div>
                    Em construção...
                </div>
            </div>
        </section>
</template>

<script setup>
  import { useGeralStore } from '@/store/GeralStore';
  const geralStore = useGeralStore()

</script>

<style scoped>

</style>