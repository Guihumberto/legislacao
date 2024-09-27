<template>
    <v-chip v-if="notaMedia" :title="avaliacaoFinal.name" :color="avaliacaoFinal.color" :prepend-icon="avaliacaoFinal.icon">
        {{ notaMedia }}
    </v-chip>
</template>

<script>
import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
const avaliacaoStore = useAvaliacaoStore() 

    export default {
        props:{
            servidor: Object
        },
        computed:{
            allAvaliations(){
                return avaliacaoStore.readAllAvaliationsServidoresEquipe.find(x => x.idServidor == this.servidor.id)
            },
            notaMedia(){
                if(this.allAvaliations){
                    let notalist = this.allAvaliations.criterios.map( x=> parseInt(x.nota))
                    let soma = notalist.reduce((acc, valorAtual) => acc + valorAtual, 0)
                    return soma
                }
                return null
            },
            avaliacaoFinal(){
                let name
                let icon
                let color
                let score = this.notaMedia

                switch(true){
                    case (score <= 20):
                    name = 'Crítico'
                    icon = 'mdi-emoticon-cry-outline'
                    color = 'red-accent-2'
                    break
                    case (score <= 40):
                    name = 'Baixo'
                    icon = 'mdi-emoticon-sad-outline'
                    color = 'red-accent-1'
                    break
                    case (score <= 60):
                    name = 'Regular'
                    icon = 'mdi-emoticon-neutral-outline'
                    color = 'deep-purple-lighten-3'
                    break
                    case (score <= 80):
                    name = 'Bom'
                    icon = 'mdi-emoticon-happy-outline'
                    color = 'green-accent-3'
                    break
                    case (score <= 100):
                    name = 'Ótimo'
                    icon = 'mdi-medal-outline'
                    color = 'green-accent-5'
                    break
                    default:
                    name = '-'
                    icon = 'mdi-help'
                    color = 'green-lighten-5'
                }
                return {name, icon, color, score}
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>