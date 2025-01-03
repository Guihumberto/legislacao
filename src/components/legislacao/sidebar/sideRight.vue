<template>
    <div class="contentWrapper">
        <div class="d-flex justify-end w-100" v-if="!showBar && listSearchs.length" @click="showBar = true">
            <v-btn variant="text" 
            class="btnHidden ma-1" color="black" icon="mdi-chevron-left"></v-btn>
        </div>
        <div class="sideRight w-100" v-if="showBar && listSearchs.length">
            <h3 class="d-flex justify-space-between align-center"> 
                Histórico
                <v-btn variant="text"  @click="showBar = false" class="btnHidden mb-2" color="grey">Ocultar</v-btn>
            </h3>
            <div>
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
                            <v-icon @click.stop="removeSearch(i)" class="pa-0 ma-0" color="red">mdi-delete</v-icon>
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
        </div>
    </div>
</template>
<script>
    import { useGeneralStore } from '@/store/GeneralStore'
    const generalStore = useGeneralStore()

    export default{
        data(){
            return{
                showBar: true
            }
        },
        computed:{
            listSearchs(){
                return generalStore.readListStore
            },
            listSearchReduzida(){
                const list = this.listSearchs

                const uniqueList = list.filter((item, index, self) => 
                    index === self.findIndex((t) => (
                        t.text === item.text && t.precision === item.precision && t.fonte === item.fonte && t.years === item.years & t.termo === item.termo
                    ))
                );

                return uniqueList
            }
        },
        methods:{
            searchAgain(item, i){
                generalStore.reqChange(true, i)
                this.$router.push(`leges?search=${item.text}&years=${item.years}&fonte=${item.fonte}&termo=${item.termo}&precision=${item.precision}`)
            },
            removeSearch(item){
                generalStore.removeListSearch(item)
            },
            removeAll(){
                generalStore.removeAll()
            }
        }
    }
</script>
<style scoped>
.sideRight{
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
    height: 75vh;
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