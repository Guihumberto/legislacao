<template>
    <v-form @submit.prevent="addUserElastic()" ref="form">
        <h2 class="text-h6 mb-2">Adicionar usuários</h2>
        <v-text-field
            label="CPF do Usuário"
            placeholder="Digite o cpf do usuário"
            v-model="cpf"
            density="compact"
            variant="outlined"
            :rules="[rules.required, rules.minfield]"
        >
            <template v-slot:append>
                <v-btn color="success" type="submit" variant="flat" :loading="loginStore.readLoad">Adicionar</v-btn>
            </template>
        </v-text-field>
    </v-form>
</template>

<script setup>
    import { ref, computed  } from 'vue';

    import { useLoginStore } from '@/store/LoginStore';
    import { useSnackStore } from '@/store/snackStore';
    const snackStore = useSnackStore()
    const loginStore = useLoginStore()

    const cpf = ref(null)
    const form = ref(null)

    const rules = {
        required: value => !!value || "campo obrigatório", 
        minfield: (v) => (v||'').length == 11 || "CPF possui 11 dígitos",
    }

    const clear = () => {
        cpf.value = null
    }

    const list_users = computed(() => {
        return loginStore.readListUsers.map( x => x.cpf)
    })

    const isCpfExist = () => {
        const user = list_users.value.find(x => x == cpf.value )
        return !!user
    }

    const msgErro = () => {
        cpf.value = ""
        snackStore.activeSnack({text:'Usuário já adicionado', color: 'error' })
    }

    const addUserElastic = async () => {
        const { valid } = await form.value.validate()
        const isExist = isCpfExist()
        if(isExist) msgErro()
        if(valid && !isExist) {
            const objeto = {
                cpf: cpf.value,
            }
            const resp = await loginStore.addUser(objeto.cpf)
            if(resp) msgErro()
            clear()
        }
    }

</script>

<style lang="scss" scoped>

</style>