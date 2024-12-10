<template>
    <v-form @submit.prevent="addUserElastic()" ref="form">
        <h2 class="text-h6 mb-2">Adicionar usuários</h2>
        <v-text-field
            label="CPF do Usuário"
            placeholder="Digite o cpf do usuário"
            v-model="nameUser"
            density="compact"
            variant="outlined"
            :rules="[rules.required, rules.minfield]"
        >
            <template v-slot:append>
                <v-btn color="success" type="submit" variant="flat">Adicionar</v-btn>
            </template>
        </v-text-field>
    </v-form>
</template>

<script setup>
    import { ref } from 'vue';

    import { useLoginStore } from '@/store/LoginStore';
    const loginStore = useLoginStore()

    const nameUser = ref(null)
    const password = ref(null)
    const form = ref(null)

    const rules = {
        required: value => !!value || "campo obrigatório", 
        minfield: (v) => (v||'').length >= 3 || "Mínimo 4 caracteres",
    }

    const gerarSenha = () => {
        password.value = 123456
        console.log('gerar senha', password.value);
    }

    const clear = () => {
        nameUser.value = null
        password.value = null
    }

    const addUserElastic = async () => {
        const { valid } = await form.value.validate()
        if(valid) {
            gerarSenha()
            const objeto = {
                cpf: nameUser.value,
                password: password.value,
                perfil: 1,
                adm: false
            }
            loginStore.addUser(objeto.cpf)
            clear()
        }
    }

</script>

<style lang="scss" scoped>

</style>