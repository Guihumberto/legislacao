<template>
    <div class="content">
        <h2>Critérios</h2>
        <v-form @submit.prevent="saveInstructions()" ref="form">
            <textEditor :texto="pageInitial.instructions"
                @cancel="editInstructions = true" 
                @insertNew="pageInitial.instructions = $event, saveInstructions()" 
                v-show="!editInstructions"
            />
            <div v-if="editInstructions" class="mb-5"> 
                <p v-html="pageInitial.instructions"></p>
            </div>
            <v-btn v-if="editInstructions" color="grey" @click="editInstructions = false">Editar</v-btn>
        </v-form>
        <v-alert variant="outlined" type="warning">
            Nota Máxima Atual: {{ notaMax }}
        </v-alert>
        <div v-for="item, i in dadosCriterios" :key="i">
            <v-form @submit.prevent="save(item)" ref="form">
                <div>
                    <v-text-field
                        label="Título"
                        variant="outlined"
                        density="compact"
                        v-model="item.name"
                        :disabled="idEdit != item.id"
                    ></v-text-field>
                    <v-textarea
                        label="Descrição"
                        variant="outlined"
                        density="compact"
                        v-model="item.desc"
                        :disabled="idEdit != item.id"
                    ></v-textarea>
                    <div class="d-flex">
                        <v-text-field
                            label="Nota mínima"
                            variant="outlined"
                            density="compact"
                            type="number"
                            class="mr-2"
                            v-model="item.min"
                            :disabled="idEdit != item.id"
                        ></v-text-field>
                        <v-text-field
                            label="Nota Máxima"
                            variant="outlined"
                            density="compact"
                            type="number"
                            v-model="item.max"
                            :disabled="idEdit != item.id"
                        ></v-text-field>
                        <v-btn v-if="idEdit != item.id" color="grey" class="ml-2" @click="editItem(item.id)">Editar</v-btn>
                        <div class="d-flex" v-else>
                            <v-btn  variant="text" color="grey" @click="idEdit = 0">Cancelar</v-btn>
                            <v-btn type="submit" color="success" class="ml-2">Salvar</v-btn>
                        </div>
                    </div>
                </div>
            </v-form>
        </div>
    </div>
</template>

<script>
    import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
    const avaliacaoStore = useAvaliacaoStore() 

    import textEditor from '@/components/avaliacao/config/elements/textEdit.vue'

    export default {
        components: { textEditor },
        data(){
            return{
                editInstructions: true,
                edit: null,
                idEdit: 0
            }
        },
        computed:{
            dadosCriterios(){
                return avaliacaoStore.readDadosCriterios.sort((a, b) => a.id - b.id)
            },
            pageInitial(){
                return avaliacaoStore.readPageInitial
            },
            notaMax(){
                let list = this.dadosCriterios.map(x => parseInt(x.max))
                let soma = list.reduce((acc, valorAtual) => acc + valorAtual, 0)
                return soma
            }
        },
        methods:{
            editItem(id){
                this.idEdit = id
            },
            save(item){
                avaliacaoStore.editCreteriosData(item);
                this.idEdit = 0
            },
            saveInstructions(){
                avaliacaoStore.editPageInitial(this.pageInitial);
                this.editInstructions = true
            }
        },
    }
</script>

<style lang="scss" scoped>
.content{
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>