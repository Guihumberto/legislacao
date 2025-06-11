<template>
    <div>
        <div
            ref="editable"
            contenteditable
            class="min-h-[150px], no-drag"
            @mouseup="handleSelection"
            @keyup="handleSelection"
            @keydown="handleKeyDown"
            @paste.prevent
            @dragstart.prevent
            @drop.prevent
            @input="handleInput"
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
            location="top"
            persistent
        >
            <v-card ref="menuRef">
                <v-btn-group variant="plain">     
                    <v-btn icon @click.stop.prevent="applyBold" title="negrito"><v-icon>mdi-format-bold</v-icon></v-btn>
                    <v-btn icon @click.stop.prevent="applyUnderline" :title="'Sublinhar'"> <v-icon>mdi-format-underline</v-icon> </v-btn>
                    <v-btn icon @click.stop.prevent="taxarTexto" :title="'Tachar texto'"><v-icon>mdi-format-strikethrough</v-icon></v-btn>
                    <v-btn icon @click.stop.prevent="applyColor('red')" title="cor do texto vermelho"><v-icon color="red">mdi-format-color-text</v-icon></v-btn>
                    <v-btn icon @click.stop.prevent="applyColor('blue')" title="cor do texto azul"><v-icon color="blue">mdi-format-color-text</v-icon></v-btn>
                    <v-btn icon @click.stop.prevent="removerFormatacao" :title="'Remover formatação'"><v-icon>mdi-format-clear</v-icon></v-btn>
                    <v-btn icon @click="menu = false" title="Fechar"><v-icon>mdi-close-circle</v-icon></v-btn>
                </v-btn-group>
            </v-card>
        </v-menu>

  </div>
</template>

<script setup>
    import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

    import { useCommentStore } from '@/store/CommentStore';
    const commentStore = useCommentStore()

    const props = defineProps({
        dispositivo: Object,
        search: String
    })

    const highlightText = (text) => {
        if (props.search) {
            const normalize = str =>
                str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

            const originalText = text.textlaw;
            const normalizedText = normalize(originalText);
            const normalizedKeyword = normalize(props.search);

            // Procurar todas as ocorrências preservando os índices
            const indices = [];
            let startIndex = 0;

            while (startIndex < normalizedText.length) {
                const matchIndex = normalizedText.indexOf(normalizedKeyword, startIndex);
                if (matchIndex === -1) break;
                indices.push([matchIndex, matchIndex + normalizedKeyword.length]);
                startIndex = matchIndex + normalizedKeyword.length;
            }

            // Realça as partes do texto original com <mark>
            let highlightedText = '';
            let lastIndex = 0;

            for (const [start, end] of indices) {
                highlightedText += originalText.slice(lastIndex, start);
                highlightedText += '<mark>' + originalText.slice(start, end) + '</mark>';
                lastIndex = end;
            }

            highlightedText += originalText.slice(lastIndex);

            // Formata o início dependendo do tipo de texto
            if (originalText.startsWith('Art')) {
                highlightedText = `<b>${highlightedText.substr(0, 4)}</b>${highlightedText.substr(4)}`;
            } else {
                highlightedText = ` (art. ${text.art}º), ${highlightedText}`;
            }

            return highlightedText;
        } else {
            if (text.textlaw.startsWith('Art')) {
                return `<b>${text.textlaw.substr(0, 4)}</b>${text.textlaw.substr(4)}`;
            } else {
                return text.textlaw;
            }
        }
    };


    const menu = ref(false)
    const menuRef = ref(null)
    const menuActivator = ref(null)
    const editable = ref(null)
    const currentContent = ref('')

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

    const applyBold = () => {
        const selection = window.getSelection()
        if (!selection.rangeCount) return
        const range = selection.getRangeAt(0)

        const selectedText = range.toString()

        if (!selectedText.trim()) return
        
        document.execCommand('bold')
        salvarDispositivo()
        handleInput() // Sincroniza a mudança
    }

    const applyColor = (color) => {
        const selection = window.getSelection()
        if (!selection.rangeCount) return
        const range = selection.getRangeAt(0)

        const selectedText = range.toString()

        if (!selectedText.trim()) return

        document.execCommand('styleWithCSS', false, true)
        document.execCommand('foreColor', false, color)
        salvarDispositivo()
        handleInput() // Sincroniza a mudança
    }

    const applyUnderline = () => {
        const selection = window.getSelection()
        if (!selection.rangeCount) return
        const range = selection.getRangeAt(0)

        const selectedText = range.toString()

        if (!selectedText.trim()) return

        if (selectedText.endsWith(' ')) {
            range.setEnd(range.endContainer, range.endOffset - 1)
            selection.removeAllRanges()
            selection.addRange(range)
        }

        document.execCommand('styleWithCSS', false, true)
        document.execCommand('underline')
        salvarDispositivo()
        handleInput() // Sincroniza a mudança
    }

    const taxarTexto = () => {
        const selection = window.getSelection()
        if (!selection.rangeCount) return
        const range = selection.getRangeAt(0)

        const selectedText = range.toString()

        if (!selectedText.trim()) return

        if (selectedText.endsWith(' ')) {
            range.setEnd(range.endContainer, range.endOffset - 1)
            selection.removeAllRanges()
            selection.addRange(range)
        }

        document.execCommand('styleWithCSS', false, true)
        document.execCommand('strikeThrough')
        salvarDispositivo()
        handleInput() // Sincroniza a mudança
    }

    const removerFormatacao = () => {
        const selection = window.getSelection()
        if (!selection.rangeCount) return
        const range = selection.getRangeAt(0)

        const selectedText = range.toString()

        if (!selectedText.trim()) return

        document.execCommand('removeFormat')
        salvarDispositivo()
        handleInput() // Sincroniza a mudança
    }

    const salvarDispositivo = async () => {
        const editableEl = editable.value
        const selection = window.getSelection()
        const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null

        // Clona o conteúdo para extrair o que precisa
        const div = document.createElement('div')
        div.innerHTML = editableEl.innerHTML

        const primeiroParagrafo = div.querySelector('p')
        const conteudoInterno = primeiroParagrafo ? primeiroParagrafo.innerHTML : div.innerHTML

        const objeto = {
            id: props.dispositivo.id,
            textlaw: conteudoInterno
        }

        await commentStore.saveDispositivoEdit(objeto)

        // Aguarda próximo tick para garantir que o DOM não foi alterado antes de restaurar a seleção
        nextTick(() => {
            if (range && editableEl.contains(range.startContainer)) {
                const selection = window.getSelection()
                selection.removeAllRanges()
                selection.addRange(range)
            }
        })
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

    // Handler para mudanças no conteúdo
    const handleInput = () => {
        if (editable.value) {
            currentContent.value = editable.value.innerHTML
            // Emite a mudança para o componente pai
            updateDispositivo()
        }
    }

    const emit = defineEmits(['update:dispositivo'])

    // Função para atualizar o dispositivo
    const updateDispositivo = () => {
        const updatedDispositivo = {
            ...props.dispositivo,
            // Aqui você deve extrair o texto limpo ou formatado conforme sua lógica
            texto: editable.value?.innerText || '',
            textoFormatado: currentContent.value
        }
        
        // emit('update:dispositivo', updatedDispositivo)
    }

    onMounted(() => {
        document.addEventListener('click', handleClickOutside)
        document.addEventListener('scroll', handleScroll, true)
        
        const el = editable.value;
        if (el) {
            el.addEventListener('dragstart', e => e.preventDefault());
            el.addEventListener('drop', e => e.preventDefault());
        }
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

.no-drag{
    .textP{
    user-drag: none;
    user-select: none;
    -webkit-user-drag: none;   /* Para Safari */
    -webkit-user-select: none; /* Para Safari */
    -moz-user-select: none;    /* Para Firefox */
    -ms-user-select: none;     /* Para I/* padrão */
}
}

</style>