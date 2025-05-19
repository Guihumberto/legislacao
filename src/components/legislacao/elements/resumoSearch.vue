<template>
    <div class="wrapperesumo" ref="targetSection">
        <v-expand-transition>
            <div  @mouseup="selectionGet()"  style="position: relative;" v-if="hidden">
                <v-expand-transition>
                    <p class="font-weight-light" v-html="extrairLinha" v-if="pageComplete">
                    </p>
                    <p class="font-weight-light" v-html="newTexto" v-else></p>
                </v-expand-transition>
                <SelectionSearch 
                    :menuPosition="menuPosition"
                    :selectedText="selectedText"
                    :menu="menu"
                    :searchP="searchP"
                    :page="page"
                />
            </div>
        </v-expand-transition>
        <div class="d-flex align-center justify-end">
            <transition name="fade">
                <div v-if="last_access">
                    <v-tooltip width="100" :text="`Visto ${last_access}x `">
                        <template v-slot:activator="{ props }">
                            <v-icon color="grey" v-bind="props">mdi-check</v-icon>
                        </template>
                    </v-tooltip>
                </div>
            </transition>
            <transition name="fade">
                <div v-if="accessed_at">
                    <v-tooltip width="120" :text="`Visto agora ${ useDateNow(accessed_at, false, true) }`">
                        <template v-slot:activator="{ props }">
                            <v-icon color="blue-accent-1" v-bind="props">mdi-check-all</v-icon>
                        </template>
                    </v-tooltip>
                </div>
            </transition>
            <v-btn 
                :title="hidden ? 'ocultar prévia da página' : 'mostrar prévia da página'" 
                :icon="hidden ? 'mdi-eye' : 'mdi-eye-off'" color="grey" variant="text" @click="hidden = !hidden"></v-btn>
            <v-btn 
                color="grey" size="small" variant="text" title="Ver a página" 
                @click="expandAction" :prepend-icon="pageComplete ? 'mdi-plus' : 'mdi-minus'">{{ pageComplete ? 'expandir' : 'recolher' }}</v-btn>
            <pageDialog :id="id" :page="page" :searchP="searchP" @last_accessed="last_accessed" />
            <ResumoIA :text="text" :page="page" />
        </div>
    </div>
</template>

<script setup>
    import { computed, ref, watch } from "vue"
    import { useDateNow } from "@/composables/dateFormat"

    import { useAccessedNormsStore } from "@/store/NormsAccessedStore"
    const accessedStore = useAccessedNormsStore()

    import { useRoute } from "vue-router"
    const route = useRoute()
  
    import { useHandleTextSelection  } from '@/composables/handleTextSelection'
    import pageDialog from "@/components/legislacao/dialogs/page"
    import SelectionSearch from "./selectionSearch.vue"
    import ResumoIA from "../dialogs/resumoIA.vue"

    const hidden = ref(true)

    const accessed_at = ref(null)


    const props = defineProps({
        text: true,
        page: Object,
        searchP: String,
        id: String
    })

    const last_access = computed(() => {
        if(accessedStore.readAccessed.length){
            if(accessedStore.readAccessed.map(x=> x.id).includes(props.page.id)){
                return accessedStore.readAccessed.filter(x=> x.id == props.page.id).length
            }
            return false
        }
        return false
    })

    const pageComplete = ref(true)

    const extrairLinha = computed(()=> {
                let texto = markSearch()
                let regex = /<b>.*?<\/b>/;

                const linhas = texto.split('\n');
                const linhasFiltradas = ['(...)'];

                linhas.forEach(linha => {
                    if(linha.match(regex)){
                        linhasFiltradas.push(linha)
                    }
                });
                let novo_array = linhasFiltradas.slice(0, 5)
                novo_array.push('(...)')
                linhasFiltradas.push('(...)')

                if(novo_array.length <= 2) {
                    let texto_cortado = [props.text.replace('\n', '<br><br>').substring(0,500), "...", "<br>", "(...)"]
                    return texto_cortado.join('')
                }
                
                return novo_array.join('<br>');

    })
     
    const markSearch = () => {
        let texto = props.text
        if(route.query.search) {
            let palavrasChave = route.query.search.split(' ');
    
            palavrasChave = excluirStopWords(palavrasChave)
    
            const escapedKeywords = palavrasChave.map(keyword => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    
            const regex = new RegExp(`\\b(${escapedKeywords.join('|')})\\b`, 'gi');
            const textoMarcado = texto.replace(regex, '<b>$1</b>');
    
            return textoMarcado;
        } else {
            return texto
        }
        
    }

    watch(pageComplete, (newPage) => {
        if(pageComplete.value == true) {
            deslocarTela()
        }
    })

    const newTexto = computed(() => {
        let textoMark = markSearch()
        const textNovo = textoMark.replace(/(?:\s|\n)Art\. /g, '<br><br>Art. ')
                                  .replace(/\.\n/g, '.<br><br>')
                                  .replace(/\:\n/g, ':<br><br>')
                                  .replace(/\;\n/g, ';<br><br>')
                                  .replace(/MARANHÃO\n\s*/g, 'MARANHÃO<br><br>')
                                  .replace(/\n+/g, ' '); //.replace(/\n\;/g, '<br> kkkkk<br>')
                                
        return textNovo
    })

    const excluirStopWords = (arrayPrincipal) => {
        const stopWords = ["a", "o", "e", "é", "um", "uma", "com", "de", "do", "da", "para", "por", "em", "os", "as", "isso", "essa", "esse", "isso", "está"];
        const resultado = arrayPrincipal.filter(palavra => !stopWords.includes(palavra));

        return resultado;
    }

    const { selectionGet, selectedText, menu, menuPosition } = useHandleTextSelection()

    const targetSection = ref(null);
    const deslocarTela = () => {
        targetSection.value.scrollIntoView({behavior: "smooth"})
    }

    const expandAction = () => {
        pageComplete.value = !pageComplete.value
        hidden.value = true
        if(!pageComplete.value) last_accessed()
    }

    const last_accessed = () => {
        accessed_at.value = Date.now()
        const objeto = {
            id: props.page.id,
            name: props.page.page_to_norma.title,
            num_page: props.page.num_page
        }
        accessedStore.saveAccess(objeto, 'page')
    }

</script>

<style lang="scss" scoped>
.wrapperesumo{
    padding: .5rem .2rem;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>