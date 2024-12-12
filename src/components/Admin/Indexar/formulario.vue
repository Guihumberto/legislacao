<template>
    <v-card class="mt-5">
        <v-card-text>
            <div>
                <v-file-input 
                    label="Selecione a norma"
                    v-model="file"
                ></v-file-input>
                <v-btn 
                    variant="flat" color="success"
                    :disabled="!file"
                    @click="indexarLaws()"
                >importar</v-btn>
            </div>
        </v-card-text>
        <v-card-text v-if="confirm">
            <h1 class="text-h6">Documento importado com sucesso!</h1>
            <div>
                Norma: Lei n 7.7799/2020<br>
                Ano: 2020<br>
                Fonte: Lei Estadual<br>
                Total de página: 55 <br>
                <router-link to="text/">Ira para norma</router-link>
            </div>
            <div class="mt-5">
                <v-btn variant="text" color="primary" class="pa-0" @click="clear()">Limpar</v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup>
    import { ref } from 'vue';

    const file = ref(null)
    const confirm = ref(false)

    const indexarLaws = () => {
        file.value = null
        confirm.value = true
    }

    const clear = () => {
        file.value = null
        confirm.value = false
    }

</script>

<style lang="scss" scoped>

</style>