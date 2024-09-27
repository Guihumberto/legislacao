<template>
    <div>
        <div ref="editor"></div>
        <div class="mt-5"> 
            <v-btn variant="text" @click="cancel()" flat>Cancelar</v-btn>
            <v-btn @click="copyPost()" variant="outlined" color="success">Salvar</v-btn>
        </div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import Quill from 'quill'

    export default {
        name: 'EditorTexto',
        data() {
            return {
                quill: null,
                editor: 'null',
                newTexto: ''
            }
        },
        props:{
            texto: String
        },
        watch:{
            texto(antes, depois){
                this.quill.root.innerHTML = this.texto
            }
        },
        methods:{
            copyPost(){
                this.newTexto = this.quill.root.innerHTML
                this.$emit('insertNew', this.newTexto);
            },
            cancel(){
                this.$emit('cancel');
            }
        },
        mounted(){
            this.quill = new Quill(this.$refs.editor, {
                theme: 'snow', // 'snow' é um tema popular
                modules: {
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ['blockquote'],  
                        ['bold', 'italic', 'underline'],
                        [{ 'color': [] }, { 'background': [] }], 
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link'],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],   
                        ['clean']  
                    ],
                },
            });
        }
    }
</script>

<style lang="scss" scoped>
    
</style>