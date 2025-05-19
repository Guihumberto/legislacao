<template>
    <div class="rich-editor">
      <div class="editor-menu" v-if="editor">
        <v-btn-group variant="outlined" density="comfortable" class="mr-2">
          <v-btn :class="{ 'bg-primary': editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()">
            <v-icon>mdi-format-bold</v-icon>
          </v-btn>
          <v-btn :class="{ 'bg-primary': editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()">
            <v-icon>mdi-format-italic</v-icon>
          </v-btn>
          <v-btn :class="{ 'bg-primary': editor.isActive('underline') }" @click="editor.chain().focus().toggleUnderline().run()">
            <v-icon>mdi-format-underline</v-icon>
          </v-btn>
          <v-btn :class="{ 'bg-primary': editor.isActive('subscript') }" @click="editor.chain().focus().toggleSubscript().run()">
            <v-icon>mdi-format-subscript</v-icon>
          </v-btn>
        </v-btn-group>
  
        <v-btn-group variant="outlined" density="comfortable" class="mr-2">
          <v-btn :class="{ 'bg-primary': editor.isActive('bulletList') }" @click="editor.chain().focus().toggleBulletList().run()">
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>
          <v-btn :class="{ 'bg-primary': editor.isActive('orderedList') }" @click="editor.chain().focus().toggleOrderedList().run()">
            <v-icon>mdi-format-list-numbered</v-icon>
          </v-btn>
        </v-btn-group>
  
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn variant="outlined" density="comfortable" v-bind="props">
              <v-icon>mdi-palette</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <div class="d-flex flex-wrap">
                <v-btn
                  v-for="color in colors"
                  :key="color.value"
                  :style="{ backgroundColor: color.value }"
                  class="ma-1"
                  size="small"
                  @click="setColor(color.value)"
                  min-width="30"
                  min-height="30"
                ></v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
  
      <div class="editor-content">
        <editor-content :editor="editor" class="content" />
      </div>
  
      <v-card-text class="pt-0 pb-0">
        <div class="text-caption text-right">
          {{ modelValue?.length || 0 }} / {{ maxLength }} caracteres
        </div>
      </v-card-text>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
  import { Editor, EditorContent } from '@tiptap/vue-3'
  import StarterKit from '@tiptap/starter-kit'
  import Underline from '@tiptap/extension-underline'
  import TextStyle from '@tiptap/extension-text-style'
  import Color from '@tiptap/extension-color'
  import Subscript from '@tiptap/extension-subscript'
  
  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    maxLength: {
      type: Number,
      default: 1000,
    },
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  const colors = [
    { name: 'Preto', value: '#000000' },
    { name: 'Vermelho', value: '#FF0000' },
    { name: 'Verde', value: '#00FF00' },
    { name: 'Azul', value: '#0000FF' },
    { name: 'Amarelo', value: '#FFFF00' },
    { name: 'Roxo', value: '#800080' },
    { name: 'Laranja', value: '#FFA500' },
    { name: 'Cinza', value: '#808080' },
  ]
  
  const editor = ref(null)
  
  onMounted(() => {
    editor.value = new Editor({
      content: props.modelValue,
      extensions: [
        StarterKit,
        Underline,
        TextStyle,
        Color,
        Subscript,
      ],
      editorProps: {
        attributes: {
          class: 'editor-input',
        },
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML()
        emit('update:modelValue', html)
      },
    })
    
    if (props.disabled) {
      editor.value.setEditable(!props.disabled)
    }
  })
  
  watch(() => props.modelValue, (newValue) => {
    // Evita loop infinito verificando se o conteúdo atual é diferente
    const currentContent = editor.value?.getHTML()
    if (editor.value && newValue !== currentContent) {
      editor.value.commands.setContent(newValue, false)
    }
  })
  
  watch(() => props.disabled, (newValue) => {
    if (editor.value) {
      editor.value.setEditable(!newValue)
    }
  })
  
  watch(() => props.modelValue, (newValue) => {
    // Evita loop infinito verificando se o conteúdo atual é diferente
    const currentContent = editor.value?.getHTML()
    if (newValue !== currentContent) {
      editor.value?.commands.setContent(newValue, false)
    }
  })
  
  watch(() => props.disabled, (newValue) => {
    if (editor.value) {
      editor.value.setEditable(!newValue)
    }
  })
  
  function setColor(color) {
    editor.value?.chain().focus().setColor(color).run()
  }
  
  onBeforeUnmount(() => {
    editor.value?.destroy()
  })
  </script>
  
  <style scoped>
  .rich-editor {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    overflow: hidden;
    text-align: left;
  }
  
  .editor-menu {
    display: flex;
    padding: 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    background-color: #f5f5f5;
    flex-wrap: wrap;
  }
  
  .editor-content {
    padding: 12px;
    min-height: 150px;
    max-height: 400px;
    overflow-y: auto;
  }
  
  .editor-input {
    outline: none;
    min-height: 120px;
  }
  
  :deep(.ProseMirror) {
    outline: none;
    min-height: 120px;
  }
  
  :deep(.ProseMirror p) {
    margin: 0;
  }
  
  /* Estilos para recuo adequado das listas */
  :deep(.ProseMirror ul),
  :deep(.ProseMirror ol) {
    padding-left: 24px;
    margin: 8px 0;
  }
  
  :deep(.ProseMirror li) {
    margin-bottom: 4px;
  }
  
  :deep(.ProseMirror li p) {
    margin: 0;
  }
  
  /* Estilos explícitos para formatação */
  :deep(.ProseMirror em) {
    font-style: italic !important;
  }
  
  :deep(.ProseMirror u) {
    text-decoration: underline !important;
  }
  
  :deep(.ProseMirror strong) {
    font-weight: bold !important;
  }
  </style>