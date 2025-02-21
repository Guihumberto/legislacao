<template>
    <div class="contentWrapper">
        <div class="d-flex justify-end w-100" v-if="!showBar && generalStore.readListStore.length" @click="showBar = true">
            <v-btn variant="text" 
            class="btnHidden ma-1" color="black" icon="mdi-chevron-left"></v-btn>
        </div>
        <div class="w-100" :class="type == 'screen' ? 'sideRight':'sideRightD'" v-if="showBar && generalStore.readListStore.length">
            <v-btn variant="text"  @click="showBar = false" class="btnHidden mb-2" color="grey" v-if="type == 'screen'">Ocultar</v-btn>
            <v-btn variant="text"  @click="geralStore.drawerHistory = false" class="btnHidden mb-2" color="grey" v-if="type == 'drawer'">Fechar</v-btn>
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
                <v-btn class="texr-center pa-0 ma-0" size="small" v-if="listSearchReduzida.length > 1" @click="removeAll()" color="red" variant="text">Apagar tudo</v-btn>
                <div class="content">
                    <v-card 
                        elevation="0" 
                        v-for="item, i in listSearchReduzida" :key="i" 
                        class="mb-1" hover 
                        @click="searchAgain(item, i)">
                        <v-card-text class="pa-2 d-flex align-center justify-space-between">
                            <div>
                                {{ item.text }}
                                <v-icon size="small" color="success" v-if="item.precision" title="precisão">mdi-check</v-icon>
                            </div>
                            <v-icon @click.stop="generalStore.removeListSearch(i)" class="pa-0 ma-0" color="red">mdi-delete</v-icon>
                        </v-card-text>
                        <v-tooltip
                            activator="parent"
                            location="start"
                        >
                        Texto: {{item.text}} <br>
                        <div v-if="item.termo" v-text="item.termo == 1 ? 'Termo: Frase Exata':'Termo: Qualquer palavra'"></div>
                        <v-chip-group>
                            <v-chip v-if="item.years.length" v-for="ano, a in item.years" :key="a">{{ano}}</v-chip>
                        </v-chip-group>
                        <v-chip-group>
                            <v-chip v-if="item.fonte.length" v-for="fonte, f in item.fonte" :key="f">{{fonte}}</v-chip>
                        </v-chip-group>
                        <div v-if="item.precision">com precisão</div>
                    </v-tooltip>
                    </v-card>
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
          <template v-slot:actions>
            <div class="d-flex justify-end w-100 ga-2">
                <v-btn  @click="dialog = false">cancelar</v-btn>
                <v-btn
                  variant="tonal"
                  color="red"
                  text="Excluir"
                  @click="confirmRemoveAll()"
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

    const listSearchReduzida = computed(() => {
            const list = generalStore.readListStore
            const uniqueList = list.filter((item, index, self) => 
                index === self.findIndex((t) => (
                    t.text === item.text && t.precision === item.precision && t.fonte === item.fonte && t.years === item.years & t.termo === item.termo
                ))
            );

            return uniqueList
    })

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
        generalStore.reqChange(true, i)
        router.push(`leges?search=${item.text}&years=${item.years}&fonte=${item.fonte}&termo=${item.termo}&precision=${item.precision}`)
    }

    const copyText = (item) => {
        navigator.clipboard.writeText(item.texto_selected);
        snackStore.activeSnack('Texto copiado', 'primary')
    }

    const removeAll = () => {
        dialog.value = true
    }

    const confirmRemoveAll = () => {
        generalStore.removeAll()
        dialog.value = false
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
    height: 100vh;
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