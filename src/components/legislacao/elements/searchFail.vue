<template>
    <div>
        <v-alert variant="tonal" type="warning">
            <p>{{ result }}</p>
        </v-alert>
        <v-list>
            <p>Precisa de ajuda para melhorar suas buscas?  <router-link to="/help" class="linkTO">Ajuda</router-link></p>
            <small class="mb-2">Você também pode tentar fazer estas pesquisas:</small>
            <v-list-item link  @click="searchAgain('Substituição tributária')">
                <template v-slot:prepend>
                    <v-icon>mdi-magnify</v-icon>
                </template>
                Substituição tributária
            </v-list-item>
            <v-list-item link  @click="searchAgain('Desistir Processo')">
                <template v-slot:prepend>
                    <v-icon>mdi-magnify</v-icon>
                </template>
                Desistência de Processo Administrativo
            </v-list-item>
        </v-list>
    </div>
</template>

<script setup>

    const props = defineProps({
        result: String
    })

    const emits = defineEmits(['searchAgain'])

    const searchAgain = (item) => {
        emits('searchAgain', item)
    }

</script>

<style lang="scss" scoped>

</style>