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
                    <v-btn color="primary" icon @click="findVinculos" title="Vínculos"><v-icon>mdi-link</v-icon></v-btn>
                    <v-btn icon @click="menu = false" title="Fechar"><v-icon>mdi-close-circle</v-icon></v-btn>
                </v-btn-group>
            </v-card>
        </v-menu>

  </div>
</template>

<script setup>
    import { ref, onMounted, onBeforeUnmount, nextTick, computed, inject } from 'vue'
    import { useCommentStore } from '@/store/CommentStore';
    import { useForumStore } from '@/store/ForumStore';
    const forumStore = useForumStore()

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

    // Variáveis de controle de tempo e texto da última seleção
    let lastExpansionTime  = 0;
    let lastExpandedText  = '';

    const handleSelection = () => {
      const now = Date.now();
      const selection = window.getSelection();

      if (!selection || selection.isCollapsed) {
        menu.value = false;
        return;
      }

      const range = selection.getRangeAt(0);
      const selectedText = selection.toString();

      if(selectedText.length < 10) {
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

        const span = document.createElement('span')
        span.style.position = 'absolute'
        span.style.top = `${rect.top + window.scrollY}px`
        span.style.left = `${rect.left + window.scrollX}px`
        document.body.appendChild(span)

        menuActivator.value = span
        menu.value = true
       
        setTimeout(() => {
            document.body.removeChild(span)
        }, 100)

        return;
      }

      const shouldExpand = () => {
        // Se é uma nova seleção diferente, sempre expande
        if (selectedText !== lastExpandedText) return true;

        // Se for a mesma seleção, mas fora da janela de tempo, expande de novo
        return (now - lastExpansionTime) > 3000;
      };

      if (shouldExpand()) {
        const newRange = range.cloneRange();

        const isWordBoundary = (char) => /\s|\n|\t|[.,;!?()]/.test(char);

        // Expandir INÍCIO
        if (newRange.startContainer.nodeType === Node.TEXT_NODE) {
          const text = newRange.startContainer.textContent;
          let start = newRange.startOffset;
          while (start > 0 && !isWordBoundary(text[start - 1])) {
            start--;
          }
          newRange.setStart(newRange.startContainer, start);
        }

        // Expandir FIM
        if (newRange.endContainer.nodeType === Node.TEXT_NODE) {
          const text = newRange.endContainer.textContent;
          let end = newRange.endOffset;
          while (end < text.length && !isWordBoundary(text[end])) {
            end++;
          }
          newRange.setEnd(newRange.endContainer, end);
        }

        // Atualiza a seleção
        selection.removeAllRanges();
        selection.addRange(newRange);

        // Salva o estado da última expansão
        lastExpansionTime = now;
        lastExpandedText = selection.toString();
      }

      // Posição do menu
      const finalRange = selection.getRangeAt(0);
      const rect = finalRange.getBoundingClientRect();

      if (rect.width === 0 && rect.height === 0) {
        menu.value = false;
        return;
      }

      const span = document.createElement('span');
      span.style.position = 'absolute';
      span.style.top = `${rect.top + window.scrollY}px`;
      span.style.left = `${rect.left + window.scrollX}px`;
      document.body.appendChild(span);

      menuActivator.value = span;
      menu.value = true;

      setTimeout(() => {
        document.body.removeChild(span);
      }, 100);
    };
    

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
    const vincularDispositivo = inject('vincularDispositivo');

    const chamarAncestral = (item, arts = [], idLaw = null) => {  
      if (vincularDispositivo && idLaw) vincularDispositivo(item, arts, idLaw);
      if (vincularDispositivo && !idLaw) vincularDispositivo(item, arts, idLaw);
    };

    const findVinculos = () => {
        const selection = window.getSelection()
        if (!selection.rangeCount) return
        const range = selection.getRangeAt(0)
        const selectedText = range.toString()
        if (!selectedText.trim()) return

        const isArtAlone = extrairArtigos(selectedText)

        if(isArtAlone){
            chamarAncestral(selectedText, isArtAlone, forumStore.readGroupForum._source.idLaw)
            return
        }
        chamarAncestral(selectedText);
    }

    const extrairArtigos = (texto) => {
        const artigosEncontrados = [];

        // Se o texto for apenas um número (ex: 156 ou "156")
        if (/^\d+$/.test(texto.trim())) {
            artigosEncontrados.push(texto.trim());
            return artigosEncontrados;
        }

        // Lista de termos que indicam referência explícita a uma norma
        const termosProibidos = /\b(Constituição|Lei\s*n[º°o\.]*|\d{4}|Decreto|Medida Provisória|Portaria|Instrução Normativa|Resolução|Normativo|Ato|Estatuto|Código|Ordem)/i;

        // Regex que busca "art. 123", "caput do art. 123", etc.
        const regexArtigo = /(?:caput do\s*)?art\.\s*(\d+[A-Z\-º]*)/gi;

        // Regex adicional para pegar números sozinhos seguidos de "desta Lei", etc.
        const regexNumeroDireto = /\b(\d+[A-Z\-º]*)(?=\s+(desta|deste)\s+(Lei|Lei Complementar))/gi;

        let match;

        // Primeiro: verificar padrão clássico "art."
        while ((match = regexArtigo.exec(texto)) !== null) {
            const contexto = texto.slice(match.index, match.index + 100); // trecho de contexto
            if (!termosProibidos.test(contexto)) {
                artigosEncontrados.push(match[1].replace('º', ''));
            }
        }

        // Segundo: verificar padrão iniciado com número direto
        while ((match = regexNumeroDireto.exec(texto)) !== null) {
            const contexto = texto.slice(match.index, match.index + 100);
            if (!termosProibidos.test(contexto)) {
                artigosEncontrados.push(match[1].replace('º', ''));
            }
        }

        return artigosEncontrados.length > 0 ? artigosEncontrados : false;

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

    // Buscar referencias

    // Estado reativo
    const panelState = ref({
        isOpen: false,
        loading: false,
        content: null,
        currentReference: null
    })

    // Padrões de regex melhorados para captura de referências
    const referencePatterns = [
        {
            id: 'article_internal',
            pattern: /\b(art\.?\s*\d+(?:\s*-?[A-Za-z])?)\b/gi,
            type: 'internal_article',
            description: 'Artigo da própria lei',
            icon: 'mdi-file-document-outline',
            color: 'blue'
        },
        {
            id: 'article_external',
            pattern: /\b(art\.?\s*\d+(?:\s*-?[A-Za-z])?\s+da\s+Lei\s+n[ºo°]\s*[\d.-]+(?:\s*,\s*de\s+\d+\s+de\s+\w+\s+de\s+\d+)?(?:\s*\([^)]+\))?)\b/gi,
            type: 'external_article',
            description: 'Artigo de lei externa',
            icon: 'mdi-file-document-multiple-outline',
            color: 'green'
        },
        {
            id: 'paragraph',
            pattern: /\b(§\s*\d+[ºo°]|parágrafo\s+\d+[ºo°]|parágrafo\s+único)\b/gi,
            type: 'paragraph',
            description: 'Parágrafo',
            icon: 'mdi-format-paragraph',
            color: 'orange'
        },
        {
            id: 'inciso',
            pattern: /\b(inciso\s+[IVX]+)\b/gi,
            type: 'inciso',
            description: 'Inciso',
            icon: 'mdi-format-list-numbered',
            color: 'purple'
        },
        {
            id: 'caput',
            pattern: /\b(caput\s+(?:deste\s+artigo|do\s+art\.?\s*\d+))\b/gi,
            type: 'caput',
            description: 'Caput do artigo',
            icon: 'mdi-format-header-1',
            color: 'teal'
        },
        {
            id: 'alinea',
            pattern: /\b(alínea\s+[a-z])\b/gi,
            type: 'alinea',
            description: 'Alínea',
            icon: 'mdi-format-list-bulleted',
            color: 'indigo'
        }
    ]

    const processedContent = computed(() => {
        let processed = props.dispositivo.textlaw
        let referenceIndex = 0

        referencePatterns.forEach(patternObj => {
            processed = processed.replace(patternObj.pattern, (match, p1, offset) => {
            const refId = `ref_${referenceIndex++}`
            const cleanMatch = match.trim()
            
            return `<span 
                class="legal-reference ${patternObj.type}" 
                data-ref-id="${refId}"
                data-reference="${cleanMatch}"
                data-type="${patternObj.type}"
                data-pattern-id="${patternObj.id}"
                onclick="window.handleReferenceClick('${refId}', '${cleanMatch}', '${patternObj.type}', '${patternObj.id}')"
                title="Clique para ver a referência: ${cleanMatch}"
            >${match}</span>`
            })
        })

        return processed
    })

    // Função para lidar com clique na referência
    const handleReferenceClick = async (refId, referenceText, type, patternId) => {
    }

    // Função para buscar conteúdo da referência
    const findReferenceContent = (reference, type) => {
    }

    // Busca no documento atual
    const searchInCurrentDocument = (reference) => {
    }

    onMounted(() => {
        window.handleReferenceClick = handleReferenceClick
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
    .textP {
        user-drag: none;
        user-select: none;
        -webkit-user-drag: none;   /* Para Safari */
        -webkit-user-select: none; /* Para Safari */
        -moz-user-select: none;    /* Para Firefox */
        -ms-user-select: none;     /* Para I/* padrão */
    }
}

.legal-text-system {
  height: 100vh;
  background-color: #fafafa;
}

.main-content {
  height: 100vh;
  overflow-y: auto;
}

.reference-sidebar {
  height: 100vh;
  border-left: 1px solid #e0e0e0;
}

.reference-card {
  height: 100vh;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1;
}

.legal-content {
  line-height: 1.8;
  font-size: 16px;
  text-align: justify;
  font-family: 'Roboto', sans-serif;
}

:deep(.legal-reference) {
  cursor: pointer;
  padding: 2px 6px;
  margin: 0 1px;
  border-radius: 4px;
  transition: all 0.3s ease;
  text-decoration: underline;
  text-decoration-style: dotted;
  text-decoration-thickness: 1px;
  display: inline-block;
  position: relative;
}

:deep(.legal-reference:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  text-decoration: none;
}

:deep(.legal-reference.internal_article) {
  color: #1976d2;
  background-color: rgba(25, 118, 210, 0.1);
  border: 1px solid rgba(25, 118, 210, 0.2);
}

:deep(.legal-reference.external_article) {
  color: #388e3c;
  background-color: rgba(56, 142, 60, 0.1);
  border: 1px solid rgba(56, 142, 60, 0.2);
}

:deep(.legal-reference.paragraph) {
  color: #f57c00;
  background-color: rgba(245, 124, 0, 0.1);
  border: 1px solid rgba(245, 124, 0, 0.2);
}

:deep(.legal-reference.inciso) {
  color: #7b1fa2;
  background-color: rgba(123, 31, 162, 0.1);
  border: 1px solid rgba(123, 31, 162, 0.2);
}

:deep(.legal-reference.caput) {
  color: #00796b;
  background-color: rgba(0, 121, 107, 0.1);
  border: 1px solid rgba(0, 121, 107, 0.2);
}

:deep(.legal-reference.alinea) {
  color: #303f9f;
  background-color: rgba(48, 63, 159, 0.1);
  border: 1px solid rgba(48, 63, 159, 0.2);
}

.content-box {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #1976d2;
}

.content-box :deep(strong) {
  color: #1976d2;
}

</style>