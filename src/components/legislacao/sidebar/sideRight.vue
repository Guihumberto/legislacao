<template>
    <div class="contentWrapper">
        <v-btn variant="text"  @click="geralStore.drawerHistory = false" class=" mb-2" color="grey" v-if="type == 'drawer' && !generalStore.readListStore.length">Fechar</v-btn>
        <div class="d-flex justify-end w-100" v-if="!showBar && generalStore.readListStore.length" @click="showBar = true">
            <v-btn variant="text" 
            class="btnHidden ma-1" color="black" icon="mdi-chevron-left"></v-btn>
        </div>
        <div class="w-100" :class="type == 'screen' ? 'sideRight':'sideRightD'" v-if="showBar && generalStore.readListStore.length">
            <v-btn variant="text"  @click="showBar = false" class="btnHidden mb-2" color="grey" v-if="type == 'screen'">Ocultar</v-btn>
            <v-btn variant="text"  @click="geralStore.drawerHistory = false" class=" mb-2" color="grey" v-if="type == 'drawer'">Fechar</v-btn>
            <h3 class="d-flex justify-space-between align-center"> 
                <v-tabs
                    v-model="tab"
                    align-tabs="center"
                    color="deep-purple-accent-4"
                    density="compact"
                    >
                    <v-tab :value="1">Histórico</v-tab>
                    <v-tab class="pa-0" v-if="generalStore.readAreaTransferencia.length" :value="2">Transferência</v-tab>
                </v-tabs>
            </h3>
            <div v-if="tab == 1">
                <v-btn class="texr-center pa-0 ma-0" size="small" v-if="Object.keys(listSearchReduzida).length" @click="removeAll()" color="red" variant="text">Apagar tudo</v-btn>
                <div class="content">
                    <div v-for="item, i in listSearchReduzida" :key="i" class="mb-2">
                        <small>{{ i }}</small>
                        <v-card 
                            elevation="0" 
                            v-for="search, x in item" :key="x"
                            hover
                            class="mb-1"
                            @click="searchAgain(search, x)"
                        >
                            
                            <v-card-text class="pa-2 d-flex align-center justify-space-between">
                                {{ search.text }}
                                <v-btn @click.stop="removeItem(search)" density="compact" variant="text" color="red" icon="mdi-delete"></v-btn> 
                            </v-card-text>
                            <v-tooltip
                                activator="parent"
                                location="start"
                                width="200"
                            >
                                Texto: {{search.text}} <br>
                                <div v-if="search.termo" v-text="search.termo == 1 ? 'Termo: Frase Exata':'Termo: Qualquer palavra'"></div>
                                <v-chip-group>
                                    <v-chip v-if="search.years.length" v-for="ano, a in search.years" :key="a">{{ano}}</v-chip>
                                </v-chip-group>
                                <v-chip-group>
                                    <v-chip v-if="search.fonte.length" v-for="fonte, f in search.fonte" :key="f">{{fonte}}</v-chip>
                                </v-chip-group>
                            </v-tooltip>
                        </v-card>
                    </div>
                </div>
            </div>
            <div v-if="tab == 2">
                <v-btn 
                    v-if="areadeTransferencia.length" 
                    @click="generalStore.clearAreadeTransferencia, tab = 1" class="text-lowercase" variant="text" color="red">limpar área de transferência</v-btn>
                <div v-for="item, i in areadeTransferencia" :key="i" class="border-b py-3">
                    <div class="d-flex justify-space-between align-center">
                        <span class="font-weight-bold">Texto {{ i+1 }}</span> 
                        <div>
                            <v-btn @click="copyText(item)" density="compact" icon="mdi-content-copy" color="grey" variant="text"></v-btn>
                            <v-btn @click="generalStore.removeItemAT(i)" density="compact" icon="mdi-delete" color="red" variant="text"></v-btn>
                        </div>
                    </div>
                    <small v-if="item.texto_selected">{{ item.texto_selected }}</small><br>
                    <small v-if="item.num_page" class="font-italic">{{ item.nam_law }}, pág. {{ item.num_page }}</small>
                </div>
            </div>
        </div>
    </div>

    <v-dialog
        v-model="dialog"
        width="auto"
      >
        <v-card
          max-width="400"
          prepend-icon="mdi-delete"
          text="Isso excluíra todos os registros da sua busca desde o início."
          title="Excluir tudo"
        >
        <v-alert type="warning" class="mx-2" text="Não é possível reverter a operação."></v-alert>
        <div class="ml-6 mb-5" v-if="historyStore.readLoad">
            Aguarde...
        </div>
          <template v-slot:actions>
            <div class="d-flex justify-end w-100 ga-2 mt-5">
                <v-btn  @click="dialog = false">cancelar</v-btn>
                <v-btn
                  variant="tonal"
                  color="red"
                  text="Excluir"
                  @click="confirmRemoveAll()"
                  :disabled="historyStore.readLoad"
                  :loading="historyStore.readLoad"
                ></v-btn>
            </div>
          </template>
        </v-card>
    </v-dialog>

    <!-- remover item -->
    <v-dialog
        v-model="dialogItem"
        width="auto"
      >
        <v-card
          max-width="400"
          prepend-icon="mdi-delete"
          text="Desja excluir o registro abaixo do seu histórico definitivamente."
          title="Excluir Registro"
        >
            <div class="ml-6 mb-5">
                <p class="font-weight-bold" v-html="itemRemove.text"></p>
            </div>
          <template v-slot:actions>
            <div class="d-flex justify-end w-100 ga-2">
                <v-btn  @click="dialogItem = false">cancelar</v-btn>
                <v-btn
                  variant="tonal"
                  color="red"
                  text="Excluir"
                  @click="confirmRemoveItem()"
                  :disabled="historyStore.readLoad"
                  :loading="historyStore.readLoad"
                ></v-btn>
            </div>
          </template>
        </v-card>
    </v-dialog>

</template>
<script setup>
    import { ref, computed, watch } from 'vue'
    import { useRouter } from 'vue-router'
    import { useGeneralStore } from '@/store/GeneralStore'
    const generalStore = useGeneralStore()

    import { useHistoryStore } from '@/store/HistoryStore'
    const historyStore = useHistoryStore()

   
    import { useSnackStore } from '@/store/snackStore';
    const snackStore = useSnackStore()
    
    import { useGeralStore } from '@/store/GeralStore';

    const geralStore = useGeralStore()

    const props = defineProps({
        type: String
    })

    const router = useRouter()
    const showBar =  ref(true)

    const tab = ref(1)

    const dialog = ref(false)
    const dialogItem = ref(false)
    const itemRemove = ref(null)

    const listSearchReduzida = computed(() => {
            const list = generalStore.readListStore
            const uniqueList = list.filter((item, index, self) => 
                index === self.findIndex((t) => (
                    t.text === item.text && t.precision === item.precision && t.fonte === item.fonte && t.years === item.years & t.termo === item.termo
                ))
            );

            return groupByDate(uniqueList)
    })

    const groupByDate = (history) => {
        try {
            const today = new Date().toISOString().split('T')[0]; // Data de hoje em "YYYY-MM-DD"
    
            const grouped = history.reduce((acc, item) => {
            const date = new Date(item.date);
            const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
    
            const label = formattedDate === today ? "Hoje" : formattedDate.split('-').reverse().join('/'); // "DD/MM/YYYY"
    
            if (!acc[label]) {
                acc[label] = [];
            }
    
            acc[label].push(item);
            return acc;
            }, {});
    
            // Ordena as chaves, mantendo "Hoje" no topo se existir
            return Object.fromEntries(
                Object.entries(grouped).sort(([a], [b]) => {
                    if (a === "Hoje") return -1;
                    if (b === "Hoje") return 1;
                    return b.localeCompare(a); // Ordena do mais recente para o mais antigo
                })
            );
            
        } catch (error) {
            console.log('error sidebar rigth');
        }
    }

    const areadeTransferencia = computed(() => {
        const list = generalStore.readAreaTransferencia.map(x => x)
        return list
    })

    watch(listSearchReduzida, (newValue, oldValue) => {
        tab.value = 1
    });

    watch(areadeTransferencia, (newValue, oldValue) => {
        tab.value = 2
    });
    
    const searchAgain = (item, i) => {
        generalStore.reqChange(true, i, item)
    }

    const copyText = (item) => {
        navigator.clipboard.writeText(item.texto_selected);
        snackStore.activeSnack('Texto copiado', 'primary')
    }

    const removeAll = () => {
        dialogItem.value = false
        dialog.value = true
    }

    const confirmRemoveAll = async () => {
        await historyStore.removeAll()
        generalStore.removeAll()
        dialog.value = false
    }

    const removeItem = (item) => {
        itemRemove.value = {...item}
        dialog.value = false
        dialogItem.value = true
    }

    const confirmRemoveItem = async () => {
        await historyStore.removeItem(itemRemove.value)
        generalStore.removeListSearch(itemRemove.value.id)
        dialogItem.value = false
    }
        
</script>
<style scoped>
.sideRight, .sideRightD{
    background: rgb(235, 233, 233);
    padding: .5rem;
    transition: 1s ease;
}
.sideRight h3{
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
}
.content{
    overflow-y: auto;
    height: 70vh;
}
@keyframes slideLeft {
    0%{
        transform: translateX(300px);
    }
    100%{
        transform: translateX(0);
    }
}
@media (max-width: 700px) {
    .sideRight{
        display: none;
    }
    .btnHidden{
        display: none;
    }
}
*::-webkit-scrollbar{
    width: 8px;
    height: 0.4rem;
  }
  
  *::-webkit-scrollbar-track{
    background: rgb(232, 224, 224);
    border-radius: 8px;
  }

  *::-webkit-scrollbar-thumb{
    background: rgb(138, 135, 135);
    border-radius: 20px;
  }
</style>