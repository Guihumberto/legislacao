<template>
    <div>
        <div
            ref="editable"
            contenteditable
            class="min-h-[150px]"
            @mouseup="handleSelection"
            @keyup="handleSelection"
            @keydown="handleKeyDown"
            @paste.prevent
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
            transition="scale-transition"
            :activator="menuActivator"
            offset-y
            location-strategy="connected"
        >
            <v-card ref="menuRef">
                <v-btn-group variant="plain">     
                    <v-btn icon @click="applyBold" title="negrito"><v-icon>mdi-format-bold</v-icon></v-btn>
                    <v-btn icon @click="applyUnderline" :title="'Sublinhar'"> <v-icon>mdi-format-underline</v-icon> </v-btn>
                    <v-btn icon @click="applyColor('red')" title="cor do texto vermelho"><v-icon color="red">mdi-format-color-text</v-icon></v-btn>
                    <v-btn icon @click="applyColor('blue')" title="cor do texto azul"><v-icon color="blue">mdi-format-color-text</v-icon></v-btn>
                    <v-btn icon @click="removerFormatacao" :title="'Remover formatação'"><v-icon>mdi-format-clear</v-icon></v-btn>
                    <v-btn icon @click="menu = false" title="Fechar"><v-icon>mdi-close-circle</v-icon></v-btn>
                </v-btn-group>
            </v-card>
        </v-menu>

  </div>
</template>

<script setup>
    import { ref, onMounted, onBeforeUnmount } from 'vue'

    import { useCommentStore } from '@/store/CommentStore';
    const commentStore = useCommentStore()

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

    const menu = ref(false)
    const menuRef = ref(null)
    const menuActivator = ref(null)
    const editable = ref(null)

    const handleSelection =() => {
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

    const handleKeyDown = (event) => {
        if (event.ctrlKey || event.metaKey) {
            return // permite atalhos como Ctrl+B, Ctrl+U
        }
        event.preventDefault() // bloqueia digitação normal
    }

    function applyBold() {
        document.execCommand('bold')
        menu.value = false
        salvarDispositivo()
    }

    function applyColor(color) {
        document.execCommand('styleWithCSS', false, true)
        document.execCommand('foreColor', false, color)
        menu.value = false
        salvarDispositivo()
    }

    function applyUnderline() {
        document.execCommand('underline')
        menu.value = false
        salvarDispositivo()
    }

    const removerFormatacao = () => {
        document.execCommand('removeFormat')
        menu.value = false
    }

    const salvarDispositivo = () => {
        const div = document.createElement('div')
        div.innerHTML = editable.value.innerHTML

        const primeiroParagrafo = div.querySelector('p')
        const conteudoInterno = primeiroParagrafo ? primeiroParagrafo.innerHTML : div.innerHTML

        const objeto = {
            id: props.dispositivo.id,
            textlaw: conteudoInterno
        }

        commentStore.saveDispositivoEdit(objeto)
    }

    const handleClickOutside = (event) => {
        const clickedInsideEditable = editable.value?.contains(event.target)
        // const clickedInsideMenu = menuRef.value?.contains(event.target)

        if (!clickedInsideEditable) {
            menu.value = false
        }
    }

    const handleScroll = () => {
        menu.value = false
    }

    onMounted(() => {
        document.addEventListener('click', handleClickOutside)
        document.addEventListener('scroll', handleScroll, true)
    })

    onBeforeUnmount(() => {
        document.removeEventListener('click', handleClickOutside)
        document.removeEventListener('scroll', handleScroll, true)
    })

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