<template>
    <div class="content">
        <h2>Página Inicial</h2>
        <form @submit.prevent="save()" ref="form">
            <v-text-field
                label="Título da da aplicação"
                variant="outlined"
                density="compact"
                v-model="pageInitial.title"
                :disabled="edit"
            ></v-text-field>
            <v-textarea
                label="Descrição inicial"
                variant="outlined"
                density="compact"
                v-model="pageInitial.describle"
                :disabled="edit"
            ></v-textarea>
            <v-switch label="Finalizar Ciclo" v-model="encerrar" color="success" @click="save()"></v-switch>
            <v-btn v-if="edit" @click="edit = false">Editar</v-btn>
            <div v-else>
                <v-btn @click="edit = true" variant="text">Cancelar</v-btn>
                <v-btn type="submit" color="success">Salvar</v-btn>
            </div>
        </form>
    </div>
</template>

<script>
    import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
    const avaliacaoStore = useAvaliacaoStore() 

    export default {
        data(){
            return{
                edit: true,
                encerrar: false
            }
        },
        computed:{
            pageInitial(){
                return avaliacaoStore.readPageInitial
            }
        },
        methods: {
            save(){
                this.pageInitial.finalizarciclo = this.encerrar
                avaliacaoStore.editPageInitial(this.pageInitial);
                this.edit = true
            }
        }
    }
</script>

<style lang="scss" scoped>
.content{
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>