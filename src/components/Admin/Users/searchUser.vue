<template>
    <div class="my-5 text-right">
        <v-btn @click="showbuscar = !showbuscar" append-icon="mdi-magnify" variant="text">Buscar Usuários</v-btn>
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
                                    style="width: 150px;"
                                    :items="perfis"
                                    item-title="name"
                                    item-value="id"
                                    v-model="search.perfil"
                                ></v-select>
                                <v-switch
                                    label="Administrador"
                                    v-model="search.perfilAdm"
                                    density="compact"
                                    color="success"
                                    hide-details
                                ></v-switch>
                            </div>
                            <div>
                                <v-btn variant="text" class="mr-2" color="grey" @click="clear">limpar</v-btn>
                                <v-btn color="primary" type="submit" variant="flat" prepend-icon="mdi-magnify">Buscar</v-btn>
                            </div>
                        </div>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-expand-transition>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    import { useLoginStore } from '@/store/LoginStore';
    const loginStore = useLoginStore()

    import { useRouter, useRoute } from 'vue-router';
    const router = useRouter()

    const showbuscar = ref(false)

    const search = ref({
        name: null, 
        cpf: null, 
        lotacao: null,
        perfil: null,
        perfilAdm: false
    })

    const load = ref(false)

    const perfis = [
        {id: 1, name: 'Básico'},
        {id: 2, name: 'Amplo'},
    ]

    const clear = () => {
        search.value = {
            name: null,
            cpf: null,
            lotacao: null,
            perfilAdm: false
        }
    }

    const searchElastic = async () => {
        load.value = true
        loginStore.pagination.page = 1
        await loginStore.searchUsers(search.value)
        load.value = false
        router.push(`users?page=${loginStore.pagination.page}`)
    }

</script>

<style lang="scss" scoped>

</style>