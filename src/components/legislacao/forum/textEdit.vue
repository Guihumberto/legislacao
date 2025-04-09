<template>
    <div class="p-4">
        <div
            ref="editable"
            contenteditable
            class="min-h-[150px]"
            @mouseup="handleSelection"
            @keyup="handleSelection"
        >
            <p 
                :class="dispositivo.estrutura ? 'estrutura': ''"
                :title="`Artigo ${dispositivo.art}`"
                v-html="highlightText(dispositivo)">
            </p>
        </div>

        <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :activator="menuActivator"
            offset-y
            location-strategy="connected"
        >
            <v-card>
                <v-btn-group variant="plain">     
                    <v-btn icon @click="applyBold"><v-icon>mdi-format-bold</v-icon></v-btn>
                    <v-btn icon @click="applyUnderline" :title="'Sublinhar'">
                        <v-icon>mdi-format-underline</v-icon>
                    </v-btn>
                    <v-btn icon @click="applyColor('red')"><v-icon color="red">mdi-format-color-text</v-icon></v-btn>
                    <v-btn icon @click="applyColor('blue')"><v-icon color="blue">mdi-format-color-text</v-icon></v-btn>
                </v-btn-group>
            </v-card>
        </v-menu>
  </div>
</template>

<script setup>
    import { ref } from 'vue'

    const menu = ref(false)
    const menuActivator = ref(null)
    const editable = ref(null)

    const props = defineProps({
        dispositivo: Object,
        search: String
    })

    const highlightText = (text) => {
        if(props.search) {
            const normalize = str => 
            str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            
            const normalizedText = normalize(text.textlaw);
            const normalizedKeyword = normalize(props.search);
            const regex = new RegExp(`(${normalizedKeyword})`, 'gi');
            
            let highlightedText = normalizedText.replace(regex, '<mark>$1</mark>');
    
            if(text.textlaw.startsWith('Art')) {    
                highlightedText = `<b>${highlightedText.substr(0, 4)}</b> ${highlightedText.substr(4)}`
            } 
            else {
                highlightedText = ` (art. ${text.art}º), ${highlightedText}`
            }
    
            return highlightedText;
        } else {
            if(text.textlaw.startsWith('Art')){
                return `<b>${text.textlaw.substr(0, 4)}</b> ${text.textlaw.substr(4)}`
            } else {
                return text.textlaw
            }
        }
    }

    function handleSelection() {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) {
        menu.value = false
        return
    }

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) {
        menu.value = false
        return
    }

  // Cria um span como referência para o menu aparecer acima da seleção
  const span = document.createElement('span')
    span.style.position = 'absolute'
    span.style.top = `${rect.top + window.scrollY}px`
    span.style.left = `${rect.left + window.scrollX}px`
    document.body.appendChild(span)

    menuActivator.value = span
    menu.value = true

    // Limpa o span depois que o menu aparecer
    setTimeout(() => {
        document.body.removeChild(span)
    }, 100)
}

function applyBold() {
  document.execCommand('bold')
  menu.value = false
}

function applyColor(color) {
  document.execCommand('styleWithCSS', false, true)
  document.execCommand('foreColor', false, color)
  menu.value = false
}

function applyUnderline() {
  document.execCommand('underline')
  menu.value = false
}

</script>

<style scoped>
[contenteditable]:focus {
  outline: none;
}

.estrutura{
    background: rgb(234, 232, 232);
    padding: .5rem;
    text-align: center;
    font-weight: 440;
}

</style>