<template>
    <section>
        <div class="container">
            <h1 class="text-h5">Histórico de buscas</h1>
            <v-form @submit.prevent="searchGo()" ref="form">
                <v-text-field
                    label="Busca"
                    density="compact"
                    variant="outlined"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="my-5"
                    v-model="search"
                    :rules="[rules.required]"
                ></v-text-field>
            </v-form>
            <v-card>
                <v-list>
                    <v-list-item v-for="item, i in 5">
                        <h3 class="font-weight-bold">24 de janeiro de 2024</h3>
                        <v-list class="mx-0 px-0">
                            <v-list-item v-for="item, i in 5" class="py-0">
                                <small>12:22</small> Lorem ypsulum
                                <template v-slot:append>
                                    <v-btn variant="text" icon="mdi-dots-vertical"></v-btn>
                                </template>
                            </v-list-item>
                        </v-list>
                    </v-list-item>
                </v-list>
            </v-card>
        </div>
    </section>
</template>

<script setup>
    import { ref } from 'vue';

    const search = ref(null)
    const form = ref(null)

    const searchGo = async () => {
            const { valid } = await form.value.validate()
            if(valid){
                console.log(search.value)
            }
    }

    const rules = {
        required: value => !!value || "campo obrigatório", 
        minfield: (v) => (v||'').length >= 3 || "Mínimo 4 caracteres",
    }

</script>

<style scoped>
    section .container{
        min-height: calc(100vh - 400px);
    }
</style>