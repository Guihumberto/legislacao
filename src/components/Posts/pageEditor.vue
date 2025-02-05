<template>
     <div v-if="editor" class="container">
        <div class="toolbar">
          <v-btn-toggle 
            variant="outlined"
            divided
            class="mr-2"
            density="compact" v-model="toggle_exclusive">
            <v-btn @click="editor.chain().focus().setTextAlign('left').run()">
              <v-icon>mdi-format-align-left</v-icon>
            </v-btn>

            <v-btn @click="editor.chain().focus().setTextAlign('center').run()">
              <v-icon>mdi-format-align-center</v-icon>
            </v-btn>

            <v-btn @click="editor.chain().focus().setTextAlign('right').run()">
              <v-icon>mdi-format-align-right</v-icon>
            </v-btn>

            <v-btn @click="editor.chain().focus().setTextAlign('justify').run()">
              <v-icon>mdi-format-align-justify</v-icon>
            </v-btn>
          </v-btn-toggle>
          <v-btn-toggle
              v-model="formatting"
              variant="outlined"
              divided
              multiple
              density="compact"
              class="mr-2"
            >
              <v-btn @click="editor.chain().focus().toggleHighlight().run()">
                <v-icon icon="mdi-format-italic" ></v-icon>
              </v-btn>

              <v-btn @click="editor.chain().focus().toggleBold().run()">
                <v-icon icon="mdi-format-bold"></v-icon>
              </v-btn>

              <v-btn @click="editor.chain().focus().toggleHighlight().run()">
                <v-icon icon="mdi-format-color-fill" ></v-icon>
              </v-btn>

              <v-btn @click="setColor">
                <div class="d-flex align-center flex-column justify-center">
                  <v-icon icon="mdi-format-color-text"></v-icon>

                  <v-sheet
                    color="red"
                    height="4"
                    width="26"
                    tile
                  ></v-sheet>
                </div>
              </v-btn>
          </v-btn-toggle>
          <v-btn-toggle
            variant="outlined"
            divided
            class="mr-2 mt-2"
            density="compact"
            color="deep-grey-accent-3"
            group
          >
            <v-btn value="left" @click="editor.chain().focus().setHorizontalRule().run()">
              <v-icon>mdi-drag-horizontal-variant</v-icon>
            </v-btn>

            <v-btn value="undo" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()">
              <v-icon>mdi-undo</v-icon>
            </v-btn>

            <v-btn value="right" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
              <v-icon>mdi-text</v-icon>
            </v-btn>
            <v-btn value="center" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-btn>
            <v-btn value="center" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
             <v-icon>mdi-order-numeric-ascending</v-icon>
            </v-btn>
          </v-btn-toggle>
          <v-btn-toggle
            variant="outlined"
            divided
            class="mr-2"
            density="compact"
            v-model="text"
            color="deep-grey-accent-3"
            group
          >
            <v-btn value="left" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">
              H1
            </v-btn>

            <v-btn value="center" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
              H2
            </v-btn>

            <v-btn value="right" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">
              H3
            </v-btn>
          </v-btn-toggle>
          
        </div>
        <div class="pageText">
          <editor-content
            :editor="editor"
            class="editor"
          ></editor-content>
        </div>
    </div>
  </template>
  
  <script setup>
    import { ref, onMounted, onBeforeUnmount } from 'vue';
    import { Editor, EditorContent } from '@tiptap/vue-3'
    import StarterKit from '@tiptap/starter-kit';
    
    import TextStyle from '@tiptap/extension-text-style';
    import Color from '@tiptap/extension-color';
    import Highlight from '@tiptap/extension-highlight'
    import TextAlign from '@tiptap/extension-text-align'
    import ListItem from '@tiptap/extension-list-item'

    const alignment = ref(1)
    const formatting = ref([])
    const toggle_exclusive = ref(0)
    const text = ref('center')

    const editor = ref(null)

    const emits = defineEmits(['updateContent'])

    onMounted(()=> {
      editor.value = new Editor({
          editorProps: {
              attributes:{
                  class: 'pa-2'
              }
          },
          content: "<p>Digite seu texto aqui</p>",
          onUpdate({editor}){
            const html = editor.getHTML()
            emits('updateContent', html)
          },
          extensions: [
              StarterKit, 
              TextStyle.configure({ types: [ListItem.name] }),
              Color,
              TextAlign.configure({
                types: ['heading', 'paragraph'],
              }),
              Highlight,
          ]
      })
    })

    onBeforeUnmount (() => {
      console.log('teste destori');
      editor.value.destroy();
    })

    const setColor = () => {
      if (editor.value) {
        editor.value.chain().focus().setColor('#ff0000').run();
      }
    };
  
  </script>
  
  <style scoped>
    .editor input {
      border: 1px solid #ccc;
      padding: 8px;
      border-radius: 4px;
      font-size: 16px;
    }

    /* Remove o outline ao focar no input */
    .editor input:focus {
      outline: none;
      border-color: #ccc; /* Ou mantenha a borda da mesma cor */
    }
  .pageText{
    min-height: 55vh;
    max-width: 900px;
    margin: 20px 0;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 2cm;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .tiptap {
  :first-child {
    margin-top: 0;
  }

  /* List styles */
  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  /* Heading styles */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    text-wrap: pretty;
  }

  h1,
  h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  h4,
  h5,
  h6 {
    font-size: 1rem;
  }

  /* Code and preformatted text styles */
  code {
    background-color: var(--purple-light);
    border-radius: 0.4rem;
    color: var(--black);
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  pre {
    background: var(--black);
    border-radius: 0.5rem;
    color: var(--white);
    font-family: 'JetBrainsMono', monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }
  }

  mark {
    background-color: #FAF594;
    border-radius: 0.4rem;
    box-decoration-break: clone;
    padding: 0.1rem 0.3rem;
  }

  blockquote {
    border-left: 3px solid var(--gray-3);
    margin: 1.5rem 0;
    padding-left: 1rem;
  }

  hr {
    border: none;
    border-top: 1px solid var(--gray-2);
    margin: 2rem 0;
  }
}
  </style>
  