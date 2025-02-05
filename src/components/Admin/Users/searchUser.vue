<template>
    <div class="my-5 text-right">
        <v-btn @click="showbuscar = !showbuscar" icon="mdi-magnify"></v-btn>
        <v-expand-transition>     
            <v-card v-if="showbuscar" class="mt-5">
                <v-card-text class="text-left">
                    <p class="mb-2">Busque pelo nome, cpf ou lotação do usuário</p>
                    <v-form @submit.prevent="searchElastic()">
                        <v-text-field
                            label="Nome do Usuário"
                            placeholder="Digite o nome do usuário"
                            v-model="search.name"
                            density="compact"
                            variant="outlined"
                            clearable
                        >                
                        </v-text-field>
                        <div class="d-flex">
                            <v-text-field
                                label="CPF do Usuário"
                                placeholder="Digite o cpf do usuário"
                                v-model="search.cpf"
                                density="compact"
                                variant="outlined"
                                clearable
                            >                
                            </v-text-field>
                            <v-text-field
                                label="Lotacão"
                                placeholder="Digite a lotação do usuário"
                                v-model="search.lotacao"
                                density="compact"
                                variant="outlined"
                                class="ml-2"
                                clearable
                            >                
                            </v-text-field>
                        </div>
                        <div class="d-flex justify-space-between align-center">
                            <div class="d-flex">
                                <v-select
                                    label="Perfil"
                                    density="compact"
                                    hide-details
                                    variant="outlined"
                                    class="mr-5"
                                    style="width: 110px;"
                                ></v-select>
                                <v-switch
                                    label="Administrador"
                                    v-model="search.perfilAdm"
                                    density="compact"
                                    color="success"
                                    hide-details
                                ></v-switch>
                            </div>
                            <v-btn color="primary" type="submit" variant="flat" prepend-icon="mdi-magnify">Buscar</v-btn>
                        </div>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-expand-transition>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const showbuscar = ref(false)

    const search = ref({
        name: null, 
        cpf: null, 
        lotacao: null,
        perfilAdm: false
    })

    const searchElastic = () => {
        console.log('buscar');
    }

</script>

<style lang="scss" scoped>

</style>