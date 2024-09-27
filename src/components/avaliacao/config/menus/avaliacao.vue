<template>
    <div class="content">
        
        <div class="d-flex align-center justify-space-between">
            <h2>Avaliação</h2>
            <newAvaliation v-if="edit" />
        </div>
        <v-list>
            <v-list-item>
                <div class="border">
                    <h2 class="mx-2">Ciclo Ativo</h2>
                    <div class="pa-4 d-flex justify-space-between">
                        <div>
                            <v-icon>mdi-calendar-blank</v-icon> Referência: {{ avaliationsList.referencia }} <br>
                            <div class="my-2"><v-icon>mdi-calendar-start</v-icon> Data de Início: {{ avaliationsList.startdate }}</div>
                            <v-icon>mdi-calendar-end</v-icon> Data Final: {{ avaliationsList.enddate }} <br>
                        </div>
                        <div>
                            <v-icon>mdi-power-cycle</v-icon> Status: {{ avaliationsList.status ? 'Ativo' : 'Inativo' }} <br>
                        </div>
                    </div>
                </div>
            </v-list-item>
            <v-list-item v-for="list,l in cicloAvaliations" :key="l">
                <v-form @submit.prevent="editCiclo(list)" class="pa-2" ref="form">
                    <v-text-field
                        label="Referência"
                        variant="outlined"
                        density="compact"
                        v-model="list.referencia"
                        :disabled="idEdit != list.id"
                        prepend-inner-icon="mdi-calendar-blank"
                        :rules="[rules.required, rules.minref]"
                    ></v-text-field>
                    <div class="fields">
                        <v-text-field
                            label="Data de Início"
                            variant="outlined"
                            density="compact"
                            v-model="list.startdate"
                            type="date"
                            class="mr-2"
                            :disabled="idEdit != list.id"
                            prepend-inner-icon="mdi-calendar-check"
                            :rules="[rules.required, rules.mindate]"
                        ></v-text-field>
                        <v-text-field
                            label="Data Fim"
                            variant="outlined"
                            density="compact"
                            type="date"
                            v-model="list.enddate"
                            :disabled="idEdit != list.id"
                            prepend-inner-icon="mdi-calendar-remove"
                            :rules="[rules.required, rules.mindate]"
                        ></v-text-field>
                        <v-btn v-if="idEdit == list.id"  type="submit" color="success" class="mt-1">Salvar</v-btn>
                    </div>  
                </v-form>
                <template v-slot:append>
                    <div class="actions">
                        <v-switch :disabled="idEdit != list.id" density="compact" label="Ativa" color="success" v-model="list.status">Ativa</v-switch>
                        <v-btn density="compact" variant="text" v-if="idEdit != list.id" @click="idEdit = list.id"  type="submit" color="grey" class="mx-2">editar</v-btn>
                        <v-btn density="compact" variant="text" v-else  @click="idEdit = null"  type="submit" color="grey">cancelar</v-btn>
                    </div>
                </template>
            </v-list-item>
        </v-list>
    </div>
</template>

<script>
    import newAvaliation from '@/components/avaliacao/config/menus/addNewAvaliation.vue'

    import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
    const avaliacaoStore = useAvaliacaoStore() 

    export default {
        components:{ newAvaliation },
        data(){
            return{
                edit: true, 
                idEdit: null,
                rules:{
                    required: (value) => !!value || "Campo obrigatório",
                    mindate: (v) => (v||'').length == 10 || "8 dígitos",
                    minref: (v) => (v||'').length == 7 || "6 dígitos"
                }
            }
        },
        computed:{
            avaliationsList(){
                let list = avaliacaoStore.readDadosNewAvaliation
                list.startdate = avaliacaoStore.converterInverseNew(list.startdate)
                list.enddate = avaliacaoStore.converterInverseNew(list.enddate)
                return list
            },
            cicloAvaliations(){
                const list = avaliacaoStore.readListCiclosAvaliations
                return list.sort((a, b) => a.id - b.id)
            }
        },
        methods:{
            async editCiclo(item){
                if(item.status) this.desativar(item)
                avaliacaoStore.editDadosNewAvaliation(item)
                this.idEdit = null
            },
            desativar(item){
                try {
                    const avaliacao = this.cicloAvaliations.filter(x => x.status == true && x.id != item.id)
                    avaliacao.forEach(x => {
                        x.status = false
                        avaliacaoStore.editDadosNewAvaliation(x)
                    })
                } catch (error) {
                    console.log('erro');
                }
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
.actions{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    min-height: 120px;
}
.fields{
    display: flex;
    gap: 3px;
    justify-content: space-around;
}
</style>