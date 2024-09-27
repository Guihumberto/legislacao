<template>
      <v-card
        prepend-icon="mdi-flower-tulip"
        title="Pesquisa de Satisfação"
      >
        <v-card-text v-if="startSearch">
            <v-form @submit.prevent="save()" ref="form">
                <div v-for="item, i in questionario" :key="i" class="my-2">
                    <p class="my-2"><span class="id">{{ item.id }}.</span> {{ item.ask }}</p>
                    <v-sheet
                        class="d-flex align-center pr-4 pa-2 mr-2"
                        color="#DEDFEA"
                        min-width="550"
                        rounded="lg"
                    >
                        <v-slider
                            density="compact"
                            :max="3"
                            :ticks="item.answer"
                            show-ticks="always"
                            step="1"
                            tick-size="4"
                            color="green"
                            track-color="green"
                            thumb-color="green"
                            v-model="item.nota"
                        ></v-slider>
                    </v-sheet>
                </div>
                <div>
                    <p><span class="id">{{ sugestao.id }}.</span> {{ sugestao.ask }}</p>
                    <v-textarea
                        class="mt-2"
                        label="Resposta"
                        placeholder="opcional"
                        v-model="sugestao.answer"
                        density="compact"
                        variant="outlined"
                    ></v-textarea>
                </div>
                <div class="d-flex justify-end mt-3">
                    <v-btn variant="text" @click="$emit('fechardialog')">cancelar</v-btn>
                    <v-btn color="success" type="submit">Enviar</v-btn>
                </div>
            </v-form>
        </v-card-text>
        <v-card-text v-else>
            <div v-if="readPesquisaAtual">
                <v-alert type="success" variant="tonal">Sua avaliação do sistema foi enviado com sucesso</v-alert>
                <div class="mt-5 d-flex justify-end">
                    <v-btn @click="$emit('fechardialog')" class="mr-2" variant="text">
                        FEchar
                    </v-btn>
                </div>
                
            </div>
            <div v-else>
                <p>Agora que você terminou a avaliação da sua equipe, considere avaliar o sistema de avaliação individual da SEFAZ MA.</p>
                <div class="mt-5 d-flex justify-end">
                    <v-btn @click="$emit('fechardialog')" class="mr-2" variant="text">
                        Não, Obrigado
                    </v-btn>
        
                    <v-btn @click="startSearch = true" color="success">
                        VAMOS NESSA
                    </v-btn>
                </div>
            </div>
        </v-card-text>
        
      </v-card>
</template>

<script>
import { useAvaliacaoStore } from '@/store/AvaliacaoStore';
const avaliacaoStore = useAvaliacaoStore()

    export default {
        data () {
            return {
                dialog: false,
                startSearch: false,
                questionario:[
                    {
                        id: 1,
                        ask: 'O sistema foi fácil de usar?',
                        answer:{
                            0: 'Não sei',
                            1: 'Fácil',
                            2: 'Normal',
                            3: 'Difícil',
                        },
                        nota: 0
                    },
                    {
                        id: 2,
                        ask: 'A interface do sistema é intuitiva?',
                        answer:{
                            0: 'Não sei',
                            1: 'Intuitiva',
                            2: 'Normal',
                            3: 'Pouco Intuitiva',
                        },
                        nota: 0
                    },
                    {
                        id: 3,
                        ask: 'Como você avalia sua experiência geral com o sistema?',
                        answer:{
                            0: 'Não sei',
                            1: 'Excelente',
                            2: 'Boa',
                            3: 'Ruim',
                        },
                        nota: 0
                    },
                    {
                        id: 4,
                        ask: 'Você recebeu suporte adequado quando precisou?',
                        answer:{
                            0: 'Não precisei',
                            1: 'Sempre',
                            2: 'Algumas vezes',
                            3: 'Nunca',
                        },
                        nota: 0
                    },
                    {
                        id: 5,
                        ask: 'Qual é o seu nível de satisfação geral com o sistema?',
                        answer:{
                            0: 'Não sei',
                            1: 'Satisfeito',
                            2: 'Normal',
                            3: 'Insatisfeito',
                        },
                        nota: 0
                    },
                ],
                sugestao:{
                    id: 6,
                    ask: 'Você tem alguma sugestão ou feedback para melhorar o sistema?',
                    answer: ''
                }
            }
        },
        computed:{
            readPesquisaAtual(){
                return avaliacaoStore.readPesquisaSatisfacaoAtual
            }
        },
        methods:{
            save(){
                let notas = this.questionario.map(x => {
                    return{
                        id: x.id,
                        nota: x.nota
                    }
                })
                notas.push({id:this.sugestao.id, nota: this.sugestao.answer})
                avaliacaoStore.savePesquisaSatisfacao(notas)
                this.startSearch = false
            }
        },
        created(){
            avaliacaoStore.getPesquisaSatisfacao()
        }
    }
</script>

<style lang="scss" scoped>

</style>