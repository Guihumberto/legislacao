<template>
     <div class="login">
        <div class="mb-3">
            <h3 v-if="flutuante">Faça seu Login</h3>
            <p class="destaque">Acesse com a senha do SEFAZNET</p>
        </div>
        <v-form ref="form" @submit.prevent="login">
            <v-text-field
                prepend-inner-icon="mdi-account"
                label="CPF"
                placeholder="Digite seu CPF"
                density="compact"
                variant="outlined"
                v-mask="'###.###.###-##'"
                :rules="[rules.required, rules.mincpf]"
                v-model="userLogin.login"
                clearable
            ></v-text-field>
            <v-text-field
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye': 'mdi-eye-off'"
                label="Senha"
                placeholder="Digite sua senha"
                density="compact"
                variant="outlined"
                @click:append-inner.stop="showPassword = !showPassword"
                :type="showPassword ? 'password' : 'text'"
                :rules="[rules.required]"
                v-model="userLogin.password"
                clearable
            >
            </v-text-field>
            <v-btn block color="primary" type="submit" :loading="loadLogin">Entrar</v-btn>
            <div class="d-flex justify-center align-center" v-if="flutuante">
                <relatarErro /> | <about />
            </div>
            <v-expand-transition>
                <div v-if="readErro">
                    <p class="text-error" >{{ readErro }} <v-icon @click="limpar">mdi-close</v-icon></p>
                </div>
            </v-expand-transition>
        </v-form>
    </div>
</template>

<script>
    import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
    const avaliacaoStore = useAvaliacaoStore()  

    import relatarErro from '@/components/avaliacao/parciais/relatarErro.vue'
    import about from '@/components/avaliacao/parciais/about.vue'

    import {mask} from 'vue-the-mask'
    
    export default {
        directives:{
            mask
        },
        components:{ relatarErro, about },
        props:{
            flutuante: Boolean
        },
        data(){
            return{
                rules:{
                    required: (value) => !!value || "Campo obrigatório",
                    mincpf: (v) => (v||'').length == 14 || "11 dígitos",
                    mindn: (v) => (v||'').length == 10 || "8 dígitos",
                },
                loadLogin: false,
                userLogin:{
                    login: '',
                    dn: '',
                    password: '',
                },
                showPassword: true
            }
        },
        computed:{
            readLogin(){
                return avaliacaoStore.readLogin
            },
            readErro(){
                return avaliacaoStore.readErro
            }
        },
        methods:{
            async login(){
                const { valid } = await this.$refs.form.validate()
                if(valid){
                    this.loadLogin = true
                    await avaliacaoStore.login(this.userLogin)
                    this.loadLogin = false
                    
                }
            },
            limpar(){
                avaliacaoStore.limpar()
            }
        }
    }
</script>

<style lang="scss" scoped>
.destaque{
    padding: 2px;
    background: rgb(34, 147, 213);
    color: white;
}
</style>