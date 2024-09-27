<template>
    <section>
        <div class="container2">
            <div class="dadosAvaliador">
                <img class="imgPrint" src="../assets/brasao.png" alt="">
                <div>
                    <h2>Resumo da Avaliação Individual de Desempenho</h2>
                    <div><span class="spanTag">Avaliador:</span> {{ dadosAvaliador.nome }}</div>
                    <div><span class="spanTag">Matrícula:</span> {{ dadosAvaliador.matricula }}</div> 
                    <div><span class="spanTag">Cargo:</span> {{ dadosAvaliador.cargo }}</div>
                    <div><span class="spanTag">Setor:</span> {{ dadosAvaliador.lotacao }}</div>
                </div>
            </div>
            <div class="min-width: 400px">
                <v-data-table 
                  v-model:search="search" 
                  :items="servdidoresList" class=text-center>
                </v-data-table>
                <v-btn prepend-icon="mdi-arrow-left" variant="text" class="btnPrint mr-2" @click="goTo()">voltar</v-btn>
                <v-btn class="btnPrint" @click="printPage()">Imprimir</v-btn>
            </div>
        </div>
    </section>
</template>

<script>
    import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
    const avaliacaoStore = useAvaliacaoStore() 
    export default {
        data(){
            return{
                 search: ''
            }
        },
        computed:{
            equipe(){
                return avaliacaoStore.readEquipe.equipe
            },
            dadosAvaliador(){
                return avaliacaoStore.readLogin
            },
            avaliacaoEquipe(){
                return avaliacaoStore.readAllAvaliationsServidoresEquipe
            },
            servidores(){
                return avaliacaoStore.readServidores
            },
            servdidoresList(){
                let list = []

                this.avaliacaoEquipe.forEach(a => {
                    this.servidores.forEach(s => {
                        if(a.idServidor == s.id){
                        let objetct = {
                            matricula: s.matricula,
                            nome: s.nome,
                            Assiduidade: a.criterios[0].nota,
                            Disciplina: a.criterios[1].nota,
                            iniciativa : a.criterios[2].nota,
                            Produtividade: a.criterios[3].nota,
                            Responsabilidade: a.criterios[4].nota,
                            Interacao : a.criterios[5].nota,
                            Relacionamento: a.criterios[6].nota,
                            Total: parseInt(a.criterios[0].nota) + parseInt(a.criterios[1].nota) + parseInt(a.criterios[2].nota) + parseInt(a.criterios[3].nota) + parseInt(a.criterios[4].nota) + parseInt(a.criterios[5].nota) + parseInt(a.criterios[6].nota)
                        }
                        list.push(objetct)
                        }
                    })
                })

                return list
            }
        },
        methods:{
            printPage() {
                window.print();
            },
            goTo(){
                this.$router.push('/avaliacao')
            }
        }
    }
</script>

<style lang="scss" scoped>
.container2{
    min-width: 1300px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    min-height: calc(100vh - 550px);
}
.dadosAvaliador{
    display: flex;
    justify-content: flex-start;
    margin-bottom: 2rem;

}
.spanTag{
    font-weight: 700;
}
.btnPrint{
    margin-top: 2rem;
}
.imgPrint{
    height: 130px;
    margin-right: 2rem;
}
@media print {
    .btnPrint {
        display: none;
    }
}
</style>