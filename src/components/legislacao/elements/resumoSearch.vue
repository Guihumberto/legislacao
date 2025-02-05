<template>
    <div class="wrapperesumo" ref="targetSection">
        <div  @mouseup="selectionGet()"  style="position: relative;">
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
        <div class="d-flex align-center justify-end">
            <v-btn color="grey" size="small" variant="text" title="Ver a página" @click="pageComplete = !pageComplete" :prepend-icon="pageComplete ? 'mdi-plus' : 'mdi-minus'">{{ pageComplete ? 'expandir' : 'recolher' }}</v-btn>
            <pageDialog :id="id" :page="page" :searchP="searchP" />
            <ResumoIA :text="text" />
        </div>
    </div>
</template>

<script setup>
    import { computed, ref, watch } from "vue"
    import { useRoute } from "vue-router"
    const route = useRoute()
    import { useHandleTextSelection  } from '@/composables/handleTextSelection'
    import pageDialog from "@/components/legislacao/dialogs/page"
    import SelectionSearch from "./selectionSearch.vue"
    import ResumoIA from "../dialogs/resumoIA.vue"

    const props = defineProps({
        text: true,
        page: Object,
        searchP: String,
        id: String
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
        const textNovo = textoMark.replace(/\n+/g, '<br>');
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

</script>

<style lang="scss" scoped>
.wrapperesumo{
    padding: .5rem .2rem;
}
</style>