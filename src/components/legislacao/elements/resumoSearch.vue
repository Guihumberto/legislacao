<template>
    <div class="wrapperesumo">
        <div  @mouseup="handleTextSelection()"  style="position: relative;">
            <p class="font-weight-light" v-html="extrairLinha">
            </p>
            <SelectionSearch 
                :menuPosition="menuPosition"
                :selectedText="selectedText"
                :menu="menu"
            />
        </div>
        <div class="text-right">
            <pageDialog :id="id" :page="page" :searchP="searchP" />
        </div>
    </div>
</template>

<script setup>
    import pageDialog from "@/components/legislacao/dialogs/page"
    import { computed, ref } from "vue"
    import { useRoute } from "vue-router"
    const route = useRoute()
    import SelectionSearch from "./selectionSearch.vue"

    const menu = ref(false)
    const menuPosition = ref({ top: 0, left: 0 });
    const selectedText = ref("")

    const props = defineProps({
        text: true,
        page: Object,
        searchP: String,
        id: String
    })

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
        let palavrasChave = route.query.search.split(' ');

        palavrasChave = excluirStopWords(palavrasChave)

        const escapedKeywords = palavrasChave.map(keyword => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

        const regex = new RegExp(`\\b(${escapedKeywords.join('|')})\\b`, 'gi');
        const textoMarcado = texto.replace(regex, '<b>$1</b>');

        return textoMarcado;
        
    }
    const excluirStopWords = (arrayPrincipal) => {
        const stopWords = ["a", "o", "e", "é", "um", "uma", "com", "de", "do", "da", "para", "por", "em", "os", "as", "isso", "essa", "esse", "isso", "está"];
        const resultado = arrayPrincipal.filter(palavra => !stopWords.includes(palavra));

        return resultado;
    }

    const handleTextSelection = (event) => {
        const selection = window.getSelection();
        if (selection && selection.toString().trim()) {
            selectedText.value = selection.toString().trim();

            const range = selection.getRangeAt(0).getBoundingClientRect();
            menuPosition.value = {
                top: range.top + window.scrollY, 
                left: range.left + window.scrollX,
            }
            menu.value = true;
        } else {
            menu.value = false;
            selectedText.value = ""
        }
    }
        

</script>

<style lang="scss" scoped>
.wrapperesumo{
    padding: .5rem .2rem;
}
</style>