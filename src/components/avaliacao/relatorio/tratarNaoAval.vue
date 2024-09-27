<template>
    <div class="text-center pa-4">
      <v-btn @click="dialog = true">
        Tratar Não avaliados
      </v-btn>
  
      <v-dialog
        v-model="dialog"
        width="auto"
      >
        <v-card
          max-width="800"
          prepend-icon="mdi-update"
          text="Faça o tratamento dos servidores não avaliados."
          title="Tratar Não Avaliados"
        >
        <v-card-text v-if="!confirm">
            <v-form @submit.prevent="salvar()" ref="form">
                <v-text-field
                    label="Referência"
                    variant="outlined"
                    density="compact"
                    v-model="form.referencia"
                    :rules="[rules.required, rules.mincpf]"
                ></v-text-field>
                <v-radio-group label="Motivo da não avaliação" inline v-model="form.idTratamento" :rules="[rules.required]">
                    <v-radio :label="item.name" :value="item.id" v-for="item, i in motivo" :key="i"></v-radio>
                </v-radio-group>
                <v-textarea
                    label="Observação"
                    v-model="form.obs"
                    variant="outlined"
                    density="compact"
                ></v-textarea>
                <v-btn color="success" type="submit">Prosseguir</v-btn>
            </v-form>
            <v-list select-strategy="classic">
                <v-list-item v-for="item, i in readListNaAvaliados" :key="i">
                    <template v-slot:prepend="{ isActive }">
                        <v-list-item-action start>
                            <v-checkbox-btn :model-value="isActive" @click="listServidores.push(item.id)" class="border-b py-2"></v-checkbox-btn>
                        </v-list-item-action>
                    </template>
                    {{ item.matricula }} - {{ item.nome }} <br>
                    {{ item.cargo }}
                </v-list-item>
            </v-list>
        </v-card-text>
        <v-card-text v-else>
            <v-alert type="info">
                Confirma o tratamento para os servidores abaixo?
            </v-alert>
            <div class="border my-5 pa-2">
                Motivo: {{ form.idTratamento }} - {{  motivo.find( x => x.id == form.idTratamento).name }} <br>
                Observação: {{ form.obs }}
            </div>
            <div>
                <v-list class="border">
                    <v-list-item v-for="item, i in listServidores" :key="i">
                        <div>
                            {{ naoavaliados.find(x => x.id == item).nome }} <br>
                            {{ item }}
                        </div>
                        <template v-slot:append>
                            <v-btn variant="text" color="red" @click="remove(item)" icon="mdi-delete"></v-btn>
                        </template>
                    </v-list-item>
                </v-list>
            </div>
        </v-card-text>
          <template v-slot:actions>
            <v-btn
              text="Fechar"
              @click="dialog = false"
            ></v-btn>
            <v-btn
              class="ms-auto"
              color="primary"
              text="confirmar operação"
              @click="saveElastic()"
            ></v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
</template>

<script>
 import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
 const avaliacaoStore = useAvaliacaoStore() 

  export default {
    data () {
      return {
        dialog: false,
        listServidores:[],
        form:{
            idTratamento: 0,
            obs: '',
            referencia: '05/2024'
        },
        motivo:[
            {id:1, name: 'afastamento, licença'},
            {id:2, name: 'vacância, exoneração'},
            {id:3, name: 'Outro motivo'},
        ],
        confirm: false,
        rules:{
            required: (value) => !!value || "Campo obrigatório",
            mincpf: (v) => (v||'').length == 7 || "7 dígitos",
        },
      }
    },
    props:{
        naoavaliados: Array
    },
    computed:{
        readTratados(){
            return avaliacaoStore.readNaoAvaliados.map(x => x.idServidor)
        },
        readListNaAvaliados(){
            const itemsSet = new Set(this.readTratados);
            const filteredObjects = this.naoavaliados.filter(obj => !itemsSet.has(obj.id));
            return filteredObjects
        }
    },
    methods:{
        salvar(){
            this.confirm = true
        },
        remove(item){
            this.listServidores = this.listServidores.filter(x => x != item)
        },
        saveElastic(){
            this.listServidores.forEach(x => {
                const objeto = {
                    idServidor: x,
                    motivo: this.form.idTratamento,
                    obs: this.form.obs,
                    referencia: '05/2024'
                }
            avaliacaoStore.tratarNaoAvaliados(objeto)

            })
            this.dialog = false
        }
    }
  }
</script>