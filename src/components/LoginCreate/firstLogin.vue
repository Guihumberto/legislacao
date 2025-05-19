<template>
    <v-dialog
      v-model="dialog"
      width="auto"
      persistent
    >
      <v-card
        max-width="400"
        prepend-icon="mdi-account"
        text="Complete seus dados com a informação abaixo para ter acesso a todas as funcionalidades do sistema."
        title="Primeiro Login"
      >
        <v-card-text v-if="!confirmUser">
            <v-form @submit.prevent="confirmCaduser()" ref="form">
                  <v-text-field
                    prepend-inner-icon="mdi-account"
                    label="CPF"
                    placeholder="Digite seu CPF"
                    density="compact"
                    variant="outlined"
                    v-mask="['###.###.###-##']"
                    :rules="[rules.required, rules.mincpf, rules.cpfValido]"
                    v-model="user.cpf"
                    clearable
                    class="mb-2"
                ></v-text-field>
                <v-text-field
                    label="Nome Completo"
                    density="compact"
                    variant="outlined"
                    placeholder="Digite seu nome completo"
                    v-model="user.name"
                    :rules="[rules.required]"
                ></v-text-field>
                <v-text-field
                    label="Apelido"
                    density="compact"
                    variant="outlined"
                    placeholder="Digite como você gostaria de ser chamado"
                    v-model="user.nickname"
                    class="my-2"
                    :rules="[rules.required]"
                ></v-text-field>
                <v-text-field
                    label="Setor"
                    density="compact"
                    variant="outlined"
                    placeholder="Digite o setor que vc está lotado"
                    v-model="user.setor"
                    :rules="[rules.required]"
                    v-if="false"
                ></v-text-field>
                 <div class="actionsform">
                    <v-btn color="grey" variant="text" @click="clear()">Limpar</v-btn>
                    <v-btn color="success" variant="flat" type="submit">Continuar</v-btn>
                </div>
            </v-form>
        </v-card-text>
        <v-card-text v-else>
            <div>
                <p>Verifique os dados abaixo:</p> <br>
                <p><span class="bold">CPF: </span>{{ user.cpf }}</p>
                <p><span class="bold">Nome: </span>{{ user.name }}</p>
                <p><span class="bold">Apelido: </span>{{ user.nickname }}</p>
                <p v-if="user.setor"><span class="bold">Setor: </span>{{ user.setor }}</p>
                <p v-if="user.orgao"> <span class="bold">Orgão: </span>{{ user.orgao }}</p>
            </div>
            <div class="actionsform">
                <v-btn variant="text" @click="confirmUser = false, error.msg = ''">Voltar</v-btn>
                <v-btn variant="flat" color="success" @click="completCaduser()">Salvar e continuar</v-btn>
            </div>
            <v-alert class="mt-5" type="error" :text="error.msg" variant="text" v-if="error.msg"></v-alert>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script setup>
    import { useLoginStore } from '@/store/LoginStore';
    import { ref, inject } from 'vue';
    import { useRouter } from 'vue-router';
    import { mask } from 'vue-the-mask'

    const router = useRouter()
    const loginStore = useLoginStore()

    const form = ref(null)
    const dialog = inject('dialog')
    const confirmUser = ref(false) 

    const rules = {
        required: value => !!value || "campo obrigatório", 
        minfield: (v) => (v||'').length >= 3 || "Mínimo 4 caracteres",
        mincpf: (v) => (v||'').length == 14 || "11 dígitos",
        cpfValido: (v) => loginStore.validarCPF(v) || "CPF inválido"
    }

    const props = defineProps({
        userNew: Object
    })

    const user = ref({
        name: null,
        cpf: null, 
        nickname: null, 
        setor: null,
        cargo: 'autor'
    })

    const error = ref({
        msg: null,
    })

    const clear = () => {
        user.value = {
            name: null, 
            nickname: null, 
            setor: null,
            orgao: null
        }
    }

    confirmUser

    const confirmCaduser = async () => {
        const { valid } = await form.value.validate()
            if(valid){
                confirmUser.value = true
            }
    }

    const completCaduser = async () => {
                const login = { ...loginStore.readLogin }
                login.cpf = user.value.cpf
                login.name = user.value.name
                login.nickname = user.value.nickname
                login.cargo = user.value.cargo
                login.setor = user.value.setor
                const resp = await loginStore.editUser(login)
                if(resp.erro){
                    error.value.msg = resp.msg
                } else {
                    console.log('app:login', loginStore.readLogin);
                    router.push(`/leges`)
                    clear()
                    dialog.value = false
                }        
    }

</script>

<style lang="scss" scoped>
.actionsform{
    display: flex;
    gap: .5rem;
    justify-content: end;
    margin-top: 2rem;
}
.bold{
    font-weight: 700;
}
</style>