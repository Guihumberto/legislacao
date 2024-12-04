<template>
    <v-card class="mt-5">
        <v-list lines="two">
            <v-list-item title="Nova" subtitle="lorem odsadsa dsad sadsadsa">
                <template v-slot:prepend>
                    <v-icon>
                        mdi-text-box-multiple-outline
                    </v-icon>
                </template>
                <template v-slot:append>
                    <v-icon>
                        mdi-dots-vertical
                    </v-icon>
                </template>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script setup>

</script>

<style scoped>
    
</style>