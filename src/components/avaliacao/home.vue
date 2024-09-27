<template>
    <section>
        <div class="container">
            <div class="centerDiv" v-if="readLoadUpdatePage">
                <load />
            </div>
            <div v-else>
                <div class="title_avaliacao">
                    <div class="title" v-if="readInfoTitle.describle">
                        <div class="text-center">
                            <v-icon size="5rem" color="primary">mdi-poll</v-icon>
                        </div>
                        <h3>SEFAZ MA</h3>
                        <h1 class="mb-7 text-center">{{ readInfoTitle.title }}</h1>
                        <p>{{ readInfoTitle.describle }}</p>
                        <v-alert color="transparent" variant="flat" class="prazo" v-if="readDataLimite">
                            <p v-if="!finalizado" class="text-black text-center font-weight-bold">{{ nameCiclo }} ciclo de avaliação aberto até o dia {{readDataLimite}}.</p>
                        <p v-else  class="text-black text-center font-weight-bold">Período de Avaliação Encerrado</p>
                        </v-alert>
                    </div>
                    <div class="login">
                        <div class="mb-3">
                            <h3>Faça seu login</h3>
                            <p class="destaque">Acesse com a senha do <b>SEFAZNET</b>.</p>
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
                            <entrarEmail class="mt-2" :cpf="userLogin.login" />
                            <div class="d-flex justify-center align-center">
                                <relatarErro /> | <about />
                            </div>
                            <v-expand-transition>
                                <div v-if="readErro">
                                    <p class="texterror" >{{ readErro }} <v-icon @click="limpar">mdi-close</v-icon></p>
                                    <entrarEmail :cpf="userLogin.login" />
                                </div>
                            </v-expand-transition>
                        </v-form>
                    </div>
                </div>
                <v-alert color="transparent" variant="flat" class="prazo d-flex justify-center">
                    <v-card class="rounded-xl pa-3 d-flex justify-center align-center iconcard" color="grey" width="400" variant="outlined" @click="goto()">
                        <v-icon class="mr-2 iconchart" size="50">mdi-chart-arc</v-icon>
                        <p class="text-black"> Painel de Avaliação <br> <small>Resumo dos ciclos de avaliação.</small> </p>
                    </v-card>
                </v-alert>
                <verificarConexao />
            </div>
        </div>
    </section>
</template>

<script>
    import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
    const avaliacaoStore = useAvaliacaoStore()  

    import verificarConexao from '@/components/avaliacao/parciais/verificationApi.vue'
    import relatarErro from '@/components/avaliacao/parciais/relatarErro.vue'
    import about from '@/components/avaliacao/parciais/about.vue'
    import entrarEmail from '@/components/avaliacao/login/emailLogin.vue'
    import load from "@/components/avaliacao/elements/progressLoading.vue";

    import {mask} from 'vue-the-mask'
    
    export default {
        components:{ verificarConexao, relatarErro, about, entrarEmail, load },
        directives:{
            mask
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
            },
            readInfoTitle(){
                return avaliacaoStore.readPageInitial
            },
            readDataLimite(){
                return avaliacaoStore.converter(avaliacaoStore.readDadosNewAvaliation.enddate) 
            },
            readLoadUpdatePage(){
                return avaliacaoStore.readLoadUpdatePage
            },
            nameCiclo(){
                return avaliacaoStore.nameCiclo
            },
            finalizado(){
                return avaliacaoStore.readPeriodoEncerrado
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
            goto(){
                this.$router.push('/painel')
            },
            limpar(){
                avaliacaoStore.limpar()
            }
        }
    }
</script>

<style lang="scss" scoped>
.centerDiv{
    display: grid;
    place-items: center;
    height: 700px;
}
.container{
    min-height: calc(100vh - 558px);
    color: #212121;
}

.title_avaliacao .title h3{
    font-size: 1.5em;
    font-weight: 500;
    text-align: center;
}
.title_avaliacao{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4rem;
    min-height: 40vh;
}
.title_avaliacao .title{
    width: 48%;
    transition: 1s ease;
    animation: slideLeft 1s ease-in;
    font-family: 'Poppins', sans-serif;
}
@keyframes slideLeft {
    0%{
        opacity: 0;
        transform: translateX(100px);
    }
    100%{
        opacity: 1;
        transform: translateX(0);
    }
}

.title h1{
    line-height: 1.1;
    font-weight: 500;
    font-size: 2.2em;
}
.login{
    padding: 2rem;
    min-height: 350px;
    width: 45%;
    text-align: center;
    border: 1px solid #d2d2d7;
    border-radius: 16px;
    background: #e9ecec;
    transition: 1s ease;
    animation: aparecer 1s ease-in;
    z-index: 5;
}
@keyframes aparecer {
    0%{
        opacity: 0;
        transform: scale(.8);
    }
    100%{
        opacity: 1;
        transform: scale(1);
    }
}
.prazo{
    animation: demora 1s ease-in;
    opacity: 1
}
@keyframes demora {
    0%{
        opacity: 0;
    }
    100%{
        opacity: 1;
    }
}

.login h3{
    font-size: 2rem;
    font-weight: 700;
}
.icons_goup{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    animation: aparecer 1s ease-in;
}
@media (max-width:900px) {
    .title_avaliacao{
        flex-direction: column;
        gap: 2rem;
        text-align: center;
    }
    .title_avaliacao .title, .login{
        width: 100%;
    }
}
.destaque{
    padding: 2px;
    background: rgb(34, 147, 213);
    color: white;
}
.texterror{
    color: red;
    font-size: 1rem;
    border: 1px solid red;
    padding: 2px 0;
    margin-bottom: 2px;
}
.iconchart {
    transition: 1s ease;
}
.iconcard:hover .iconchart{
    color: teal;
    transform: rotate(55deg);
}
</style>