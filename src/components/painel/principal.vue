<template>
    <div class="wrapper">       
        <v-toolbar class="pa-2 pr-6">
            <v-toolbar-title><v-icon color="teal" class="mr-1">mdi-chart-arc</v-icon>PAINEL DE AVALIAÇÃO</v-toolbar-title>
            <v-spacer></v-spacer>
            <div class="d-flex">
                <div>
                    <v-toolbar-title>{{ readTitlesPaienesl.title }}</v-toolbar-title>
                    <p>{{ readTitlesPaienesl.subtitle }}</p>
                </div>
                <v-btn-toggle v-model="toggle_exclusive" class="ml-5">
                    <v-btn variant="text" icon :disabled="toggle_exclusive == 0">
                        <v-icon size="3rem" color="teal">mdi-arrow-left-drop-circle</v-icon>
                    </v-btn>

                    <v-btn variant="text" icon :disabled="toggle_exclusive == 1">
                        <v-icon size="3rem" color="teal">mdi-arrow-right-drop-circle</v-icon>
                    </v-btn>
                </v-btn-toggle>
            </div>
        </v-toolbar>
        <v-item-group>
            <v-container>
                <v-row justify="center">
                    <v-col cols="12" md="3" v-for="item, i in topicos" :key="i">
                        <v-item v-slot="{ active, toggle }">
                            <v-card 
                                class="d-flex align-center rounded-xl" height="200" :color="active ? 'primary' : 'white'"  @click="toggle"
                                :class="toggle_exclusive == 1 ? 'bg-teal text-white' : ''"
                            >
                                <v-row>
                                    <v-col cols="12" sm="12">
                                        <v-list-item>
                                            <template v-slot:prepend>
                                                <div>
                                                    <v-icon size="50"  :class="toggle_exclusive == 1 ? 'text-white' : 'text-teal'">{{ item.icon }}</v-icon>
                                                    <p  :class="toggle_exclusive == 1 ? 'text-white' : 'text-teal'">{{ item.title }}</p>
                                                    <strong  :class="toggle_exclusive == 1 ? 'text-white' : 'text-teal'">{{ item.qtd }}</strong>
                                                </div>
                                            </template>
                                        </v-list-item>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-item>
                    </v-col>
                </v-row>
            </v-container>
        </v-item-group>
        <v-card class="rounded-lg pa-2 my-1" variant="flat" color="transparent">
            <v-row>
                <v-col>
                    <div class="text-center">
                        <h3>{{ readTitlesPaienesl.titlegrag }}</h3>
                        <v-progress-circular :model-value="value" :rotate="360" :size="200" :width="45" color="teal">
                            <template v-slot:default> <span class="percent">{{ value }} %</span>  </template>
                        </v-progress-circular>
                    </div>
                </v-col>
                <v-col>
                    <v-card height="270px">
                        <v-card-text>
                            <v-icon class="mr-1">mdi-account</v-icon>Verificar Avaliação pelo CPF
                            <v-form @submit.prevent="verificar()" ref="form" class="my-3">
                                <v-text-field
                                    label="CPF"
                                    v-model="cpf"
                                    variant="outlined"
                                    density="compact"
                                    placeholder="999.999.999-99"
                                    v-mask="'###.###.###-##'"
                                    :rules="[rules.required, rules.mincpf]"
                                    clearable
                                    prepend-inner-icon="mdi-numeric"
                                >
                                <template v-slot:append>
                                    <v-btn type="submit" color="teal">Verificar</v-btn>
                                </template>
                            </v-text-field>
                            </v-form>
                            <v-alert :type="this.resposta.type" variant="tonal" v-if="resposta.resp">
                                <div v-html="resposta.text"></div>
                            </v-alert>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>
        <v-card class="rounded-lg mx-2" text="Informações resumidas do primeiro e segundo ciclo.">
            <v-row justify="center">
                <v-col cols="12" sm="6">
                    <v-list
                        subheader
                        > 
                        <v-list-item link>
                            <template v-slot:prepend>
                                <v-icon>mdi-comment-outline</v-icon>
                            </template>
                            34 avaliações com comentários
                        </v-list-item>
                        <v-list-item link>
                            <template v-slot:prepend>
                                <v-icon>mdi-emoticon-outline</v-icon>
                            </template>
                            78 formulários respondidos da pesquisa de satisfação
                        </v-list-item>
                        <v-list-item link>
                            <template v-slot:prepend>
                                <v-icon>mdi-update</v-icon>
                            </template>
                            109 avaliações editadas
                        </v-list-item>
                    </v-list>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-list
                        subheader
                        > 
                        <v-list-item link>
                            <template v-slot:prepend>
                                <v-icon>mdi-numeric-10-box-outline</v-icon>
                            </template>
                            615 avaliações com nota máxima
                        </v-list-item>
                        <v-list-item link>
                            <template v-slot:prepend>
                                <v-icon>mdi-account-group-outline</v-icon>
                            </template>
                            25 é o número de servidores da maior equipe
                        </v-list-item>
                        <v-list-item link>
                            <template v-slot:prepend>
                                <v-icon>mdi-briefcase-outline</v-icon>
                            </template>
                            29 avaliações tratadas
                        </v-list-item>
                    </v-list>
                </v-col>
            </v-row>
        </v-card>
        <p class="pa-2">Desenvolvido internamente pela COTEC/SEFAZ MA</p>
        <v-card class="rounded-lg mx-2">
            <v-row justify="center">
                <v-col cols="12">
                    <v-list
                        subheader
                        two-line
                        class="text-center"
                        > 
                        <v-list-item
                            
                        >
                      
                            <!-- <v-avatar size="60" rounded="0" class="mb-1">
                                <v-img src="../../assets/brasao.png"></v-img>
                            </v-avatar> -->
                         
                            <v-list-item-content>
                            <v-list-item-title >COTEC</v-list-item-title>

                            <v-list-item-subtitle>SEFAZ/MA</v-list-item-subtitle>
                            </v-list-item-content>

                        </v-list-item>
                    </v-list>
                </v-col>
            </v-row>
        </v-card>
        <br>
    </div>
</template>

<script>
import { usePainelStore }  from '@/store/AvaliacaoPainel'
const avaliacaoPainel = usePainelStore()

import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
const avaliacaoStore = useAvaliacaoStore() 

import {mask} from 'vue-the-mask'

    export default {
        directives:{ mask },
        data(){
            return{
                toggle_exclusive: 1,
                topicos:[
                    {id: 1, icon:'mdi-account-tie', title:'Avaliadores', qtd: 95},
                    {id: 2, icon:'mdi-account-group', title:'Equipes', qtd: 95},
                    {id: 3, icon:'mdi-medal', title:'Avaliações', qtd: 673},
                    {id: 4, icon:'mdi-account-remove', title:'Não Avaliados', qtd: 29},
                ],
                interval: -1,
                value: 95,
                cpf: '',
                rules:{
                    required: (value) => !!value || "Campo obrigatório",
                    mincpf: (v) => (v||'').length == 14 || "11 dígitos",
                    minnome: (v) => (v||'').length > 4 || "mínimo de 4 caracteres"
                },
                resposta:{
                    resp: false, 
                    type: '',
                    text: ''
                }
            }
        },
        watch:{
            toggle_exclusive(a, d){
                if(this.toggle_exclusive == 1){
                    this.topicos = [
                        {id: 1, icon:'mdi-account-tie', title:'Avaliadores', qtd: 95},
                        {id: 2, icon:'mdi-account-group', title:'Equipes', qtd: 95},
                        {id: 3, icon:'mdi-medal', title:'Avaliações', qtd: 673},
                        {id: 4, icon:'mdi-account-remove', title:'Não Avaliados', qtd: 29},
                    ]
                } else {
                    this.topicos = [
                        {id: 1, icon:'mdi-account-tie', title:'Avaliadores', qtd: 94},
                        {id: 2, icon:'mdi-account-group', title:'Equipes', qtd: 94},
                        {id: 3, icon:'mdi-medal', title:'Avaliações', qtd: 674},
                        {id: 4, icon:'mdi-account-remove', title:'Não Avaliados', qtd: 30},
                    ]
                }
            }
        },
        computed:{
            readTitlesPaienesl(){
                return this.toggle_exclusive == 0
                ? {title:"Primeiro Ciclo de Avaliação", subtitle:"Referência: 2º Semestre de 2023", titlegrag:'Avaliações Realizadas no 1º Ciclo'}
                : {title:"Segundo Ciclo de Avaliação", subtitle:"Referência: 1º Semestre de 2024", titlegrag:'Avaliações Realizadas no 2º Ciclo'}
            },
            readServidores(){
                return avaliacaoPainel.readServidores
            },
            readEquipe(){
                return avaliacaoPainel.readEquipes
            },
            readAvaliacoes(){
                return avaliacaoPainel.readAvaliacoes
            },
            readPesquisa(){
                return avaliacaoPainel.readPesquisa
            },
            readPes(){
                let newlist = []

                this.readEquipe.forEach(element => {
                    newlist.push(element.equipe.length)
                });

                return newlist
            }
        },
        methods:{
            async verificar(){
                this.resposta = {
                    resp: false, 
                    type: '',
                    text: ''
                }
                const { valid } = await this.$refs.form.validate()
                if(valid){
                    if(!avaliacaoStore.validarCPF(this.cpf)){
                        this.resposta = {
                            resp: true,
                            type: 'error',
                            text: 'CPF Inválido.'
                        }
                        return
                    }
                    const resp = await avaliacaoPainel.findAvaliacao(this.cpf, '05/2024')
                    if(resp.length == 2){
                        this.resposta = {
                            resp: true,
                            type: 'success',
                            text: 'Sua avaliação foi realizada no primeiro e no segundo ciclo. <a href=https://avaliacao.sefaz.ma.gov.br/avaliacao>Clique aqui</a> para ver as avaliações.'
                        }
                    } 
                    else if (resp.length == 1){
                        if(resp[0]._source.periodo == '05/2024'){
                            this.resposta = {
                                resp: true,
                                type: 'warning',
                                text: 'Sua avaliação foi realizada apenas no primeiro ciclo. <a href=https://avaliacao.sefaz.ma.gov.br/avaliacao>Clique aqui</a> para ver a avaliação.'
                            }
                        } else {
                            this.resposta = {
                                resp: true,
                                type: 'warning',
                                text: 'Sua avaliação foi realizada apenas no segundo ciclo. <a href=https://avaliacao.sefaz.ma.gov.br/avaliacao>Clique aqui</a> para ver a avaliação.'
                            }
                        }
                    }
                    else {
                        this.resposta = {
                            resp: true,
                            type: 'error',
                            text: 'Sua avaliação não foi realizada. Por favor, informe sua chefia imediata.'
                        }
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.wrapper{
    width: min(1080px, 100%);
    margin: 0 auto;
    animation: aparecer .5s ease-in;
}
@keyframes aparecer {
    0%{
        transform: translateY(20px);
        opacity: 0;
    }
    100%{
        transform: translateY(0px);
        opacity: 1;
    }
}
.v-progress-circular {
  margin: 1rem;
}
strong{
    font-size: 2rem;
}
</style>