<template>
    <v-card class="my-5 card" variant="flat">
        <v-card-text>
            <v-btn  variant="flat" @click="importType = 'pdf'" class="mr-2" :color="importType == 'pdf' ? 'success': 'grey'">PDF</v-btn>
            <v-btn :disabled="importForm.file" variant="flat" @click="selectImport()" :color="importType == 'copy-content' ? 'success': 'grey'">Copia e cola</v-btn>
        </v-card-text>
        <v-card-text v-if="!confirm">
            <div>
                <v-form @submit.prevent="indexarLaws()" ref="form">
                    <div class="autocompletes px-10">
                        <v-autocomplete
                            clearable
                            label="Fonte"
                            density="compact"
                            :items="generalStore.readTipos"
                            item-value="nome"
                            item-title="mudar"
                            variant="outlined"
                            v-model="importForm.source"
                            prepend-inner-icon="mdi-alpha-f-box"
                            class="autocomplete"
                            prepend-icon="mdi-gavel"
                            :rules="[rules.required]"
                        ></v-autocomplete>
                        <v-autocomplete
                            prepend-inner-icon="mdi-calendar"
                            clearable
                            label="Período"
                            density="compact"
                            :items="generalStore.readPeriodo"
                            variant="outlined"
                            v-model="importForm.year"
                            class="autocomplete"
                            :rules="[rules.required]"
                            :auto-select-first="false"
                           @keydown.enter.prevent="handleCustomInput"
                        ></v-autocomplete>
                     </div>
                     <div class="checkbox">
                        <v-checkbox label="Eficaz" v-model="importForm.eficaz" color="success" hide-details></v-checkbox>
                        <v-checkbox label="Sigiloso" v-model="importForm.sigiloso" color="warning" hide-details></v-checkbox>
                        <v-checkbox label="Revogado" v-model="importForm.revogado" color="error" hide-details></v-checkbox>
                        <v-checkbox v-model="importForm.fav_law" color="amber" label="Incluir nos Destaques" hide-details></v-checkbox>
                    </div>
                    <Transition name="fade">
                        <div v-if="importType == 'pdf'">
                            <v-file-input 
                                label="Selecione a norma"
                                v-model="importForm.file"
                                variant="outlined"
                                density="compact"
                                prepend-inner-icon="mdi-folder"
                                :rules="[rules.required, rules.onlyPdf]"
                            ></v-file-input>
                            <div class="text-right">
                                <v-btn 
                                    variant="flat" color="success"
                                    :disabled="!importForm.file"
                                    type="submit"
                                >Avançar</v-btn>
                            </div>
                        </div>
                    </Transition>
                    <Transition name="fade">
                        <div v-if="importType == 'copy-content'" class="text-right px-10">
                            <v-text-field
                                label="Nome da norma"
                                variant="outlined"
                                density="compact"
                                :rules="[rules.required]"
                                v-model="importForm.name"
                            ></v-text-field>
                            <v-textarea
                                label="Texto"
                                variant="outlined"
                                density="compact"
                                :rules="[rules.required]"
                                v-model="texto"
                                clearable
                            ></v-textarea>
                             
                            <!-- <div class="wrapper-editor">
                                <EditorContent class="editor" :editor="editor" />
                            </div> -->


                            <div class="d-flex ga-2 justify-end mt-2">
                                <v-btn variant="text" color="grey" @click="clear">Limpar</v-btn>
                                <v-btn v-if="!importForm.text.length" color="primary" @click="importarLaw()">Importar</v-btn>
                                <v-btn :loading="adminStore.readLoad" v-else color="success" @click="saveNormaCopyContent">Salvar</v-btn>
                            </div>
                        </div>
                    </Transition>
                </v-form>
            </div>
        </v-card-text>
        <v-card-text v-else>
            <h1 class="text-h6 mb-10"  v-if="!lawSave">Confirme os dados da norma.</h1>
            <h1 class="text-h6 mb-5 d-flex align-center text-error" v-else-if="lawSave.idU == 'error'">
                <v-icon size="1.5rem" class="mr-2">mdi-alert</v-icon>
                Erro
            </h1>
            <h1 class="text-h6 mb-5 d-flex align-center text-success" v-else>
                <v-icon size="1.5rem" class="mr-2">mdi-check-all</v-icon>
                Norma Salva
            </h1>
            <div>
                <v-text-field
                    label="Nome da norma"
                    variant="outlined"
                    density="compact"
                    v-model="importForm.name"
                    clearable
                    v-if="!lawSave"
                ></v-text-field>
                <div class="border pa-2">
                    <p><span class="font-weight-bold">Norma:</span> {{ importForm.name }}</p>
                    <p><span class="font-weight-bold">Ano:</span> {{ importForm.year }}</p>
                    <p><span class="font-weight-bold">Fonte:</span> {{ importForm.source }}</p>
                </div>
                <br>
                Total de página: {{ extractedText.length }}
                <div class="d-flex ga-2 my-5">
                    <v-chip :color="importForm.eficaz ? 'success':'error'" :prepend-icon=" importForm.eficaz ? 'mdi-check':'mdi-close'">Eficaz</v-chip>
                    <v-chip :color="importForm.sigiloso ? 'success':'error'" :prepend-icon=" importForm.sigiloso ? 'mdi-check':'mdi-close'">Sigiloso</v-chip>
                    <v-chip :color="importForm.revogado ? 'success':'error'" :prepend-icon=" importForm.revogado ? 'mdi-check':'mdi-close'">Revogado</v-chip>
                    <v-chip :color="importForm.fav_law ? 'success':'error'" :prepend-icon=" importForm.fav_law ? 'mdi-check':'mdi-close'">Tela de acesso fácil</v-chip>
                </div>
                <div class="my-5 d-flex justify-space-between border pa-2">
                    <div>
                        <v-btn variant="text" color="grey" class="pa-0 mr-2" @click="confirm = false, lawSave = null">voltar</v-btn>
                        <v-btn variant="text" color="primary" class="pa-0" @click="clear()">Limpar</v-btn>
                    </div>
                    <div>
                        <div v-if="lawSave">
                            <div v-if="lawSave.idU == 'error'">
                                {{ lawSave.text }}
                            </div>
                            <div v-else>
                                Norma Salva <br>
                                <router-link :to="`/text/${lawSave.id_law}`">Acessar norma</router-link>
                            </div>
                        </div>
                        <v-btn v-else class="ml-2" color="success" variant="flat" @click="saveNorma()">Salvar</v-btn>
                    </div>
                </div>
                <PublishNews v-if="lawSave?.id_law" :law="lawData" />
                <div v-if="adminStore.readLoad">
                    Salvando...
                </div>

                <PdfViewer :extractedPages="extractedText" />
                
            </div>
        </v-card-text>
        <SpeelsLawText v-if="importType == 'copy-content'" :form="importForm" />
    </v-card>
</template>

<script setup>
    import { ref, computed, watch } from 'vue';

    import { useRouter } from 'vue-router';
    const router = useRouter()

    import { extractTextFromPdf } from "@/composables/pdfExtractor"; 
    import PdfViewer from './pdfViewer.vue';

    import { useGeneralStore } from '@/store/GeneralStore';
    const generalStore = useGeneralStore()
    

    import { useAdminStore } from '@/store/AdminStore';
    import PublishNews from './publishNews.vue';
    const adminStore = useAdminStore()
    
    import SpeelsLawText from './speelsLawText.vue';

    const confirm = ref(false)
    const lawData = ref({})
    const form = ref(null)

    const importType = ref('pdf')

    const rules = {
        required: value => !!value || "campo obrigatório", 
        minfield: (v) => (v||'').length >= 3 || "Mínimo 4 caracteres",
        onlyPdf: file => file[0] && file[0].name?.toLowerCase().endsWith(".pdf") || "Apenas arquivos .pdf são permitidos"
    }

    const importForm = ref({
        year: 2025,
        source: null,
        name: null,
        file: null,
        eficaz: true,
        sigiloso: false,  
        revogado: false,
        fav_law: false,
        text: []
    })

    watch(() => ({ year: importForm.value.year, source: importForm.value.source }), (newVal, oldVal) => {
        router.push(`importar?source=${importForm.value.source}&year=${importForm.value.year}`)
        }, { deep: true }
    )

    const handleCustomInput = (value) => {
        const inputValue = event.target.value;
        if (inputValue) {
            importForm.value.year = inputValue; // Define o valor digitado no v-model
        }
    };

    const clearimportForm = () => {
        importForm.value = {
            year: 2025,
            source: null,
            name: null,
            file: null,
            eficaz: true,
            sigiloso: false,  
            revogado: false,
            fav_law: false,
            name: null, 
            text: []
        }
    }

    const indexarLaws = async () => {
        const { valid } = await form.value.validate()
            if(valid){
                importForm.value.name = importForm.value.file[0].name.replace(/\.pdf$/, "");
                handleFile(importForm.value.file)
                confirm.value = true
            }
    }

    const clear = () => {
        clearimportForm()
        confirm.value = false
        lawSave.value = ref(null)
        texto.value = null
        editor.commands.clearContent()
    }

    const extractedText = ref("");

    const handleFile = async (item) => {
        const file = item[0]
        if (file) {
            extractedText.value = await extractTextFromPdf(file);
        }
    };

    const formatDate = computed(() => {
        const now = new Date();
        
        const day = String(now.getDate()).padStart(2, '0');  // Garante 2 dígitos para o dia
        const month = String(now.getMonth() + 1).padStart(2, '0');  // Meses começam em 0, então somamos 1
        const year = now.getFullYear();
        
        const hours = String(now.getHours()).padStart(2, '0');  // Garante 2 dígitos para a hora
        const minutes = String(now.getMinutes()).padStart(2, '0');  // Garante 2 dígitos para os minutos
        
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    })

    const lawSave = ref(null)

    const saveNorma = async () => {
        const law = {
            tipo: importForm.value.source,
            ano: importForm.value.year,
            sigiloso: importForm.value.sigiloso,
            revogado: importForm.value.revogado,
            fonte: 'pdf',
            description_norm: extractedText.value[0].text,
            total_pages: extractedText.value.length,
            eficaz: importForm.value.eficaz,
            id: Date.now(),
            path: `./legislacao/${importForm.value.source}/${importForm.value.year}/${importForm.value.name}.pdf`,
            page_to_norma: { name : "norma"},
            title: importForm.value.name,
            data_include: formatDate.value
        }

        lawData.value = { ...law }

        const resp = await adminStore.indexarNorma(law, extractedText.value);
        lawSave.value = resp
    }

    const emits = defineEmits(['importType'])

    const selectImport = () => {
        importType.value = 'copy-content'
        emits('importType', importType.value)
    }

    const texto = ref(null)
    const limit = 2550

    const importarLaw = () => {
        // texto.value = editor.getHTML()
        // console.log(texto.value);
        const text = dividirTextoParaPaginas(texto.value, limit)
        importForm.value.text = text
        editor.commands.clearContent()
    }

    const dividirTextoParaPaginas = (texto, limiteCaracteres) => {
        const linhas = texto.split("\n");
        let paginas = [];
        let paginaAtual = "";
        let caracteresNaPagina = 0;
        let numeroPagina = 1;

        for (let linha of linhas) {
            if (caracteresNaPagina + linha.length > limiteCaracteres) {
                paginas.push({ num_page: numeroPagina, text: paginaAtual.trim() });
                numeroPagina++;
                paginaAtual = ""; // Reinicia a página
                caracteresNaPagina = 0;
            }

            // Adiciona a linha à página atual
            paginaAtual += linha + "\n";
            caracteresNaPagina += linha.length;
        }

        // Adiciona a última página se houver conteúdo restante
        if (paginaAtual.trim().length > 0) {
            paginas.push({ num_page: numeroPagina, text: paginaAtual.trim() });
        }

        return paginas;
    }

    const saveNormaCopyContent = async () => {
        const law = {
            tipo: importForm.value.source,
            ano: importForm.value.year,
            sigiloso: importForm.value.sigiloso,
            revogado: importForm.value.revogado,
            fonte: 'web',
            description_norm: importForm.value.text[0].text,
            total_pages: importForm.value.text.length,
            eficaz: importForm.value.eficaz,
            id: Date.now(),
            path: `./legislacao/${importForm.value.source}/${importForm.value.year}/${importForm.value.name}.pdf`,
            page_to_norma: { name : "norma"},
            title: importForm.value.name,
            data_include: formatDate.value
        }

        lawData.value = { ...law }

        const resp = await adminStore.indexarNorma(law, importForm.value.text);
        lawSave.value = resp
        console.log('salvo');
        clear()
    }

    import { Editor, EditorContent } from '@tiptap/vue-3'
    import StarterKit from '@tiptap/starter-kit';

    const editor = new Editor({
        extensions: [StarterKit],
        content: '<p>Texto com <s>tachado</s></p>',
    })

</script>

<style lang="scss" scoped>
.autocomplete{
    width: 50%;
}
.autocompletes{
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 1rem;
}
.checkbox{
    display: flex;
    gap: 1rem;
    margin-left: 1.9rem;
    margin-bottom: 1rem;
}
.card{
    animation: aparecer 2s ease;
    transition: 1s ease;
}
.editor{
    padding: 1rem;
    border: 1px solid #c2bfbf;
    border-radius: 10px;
    text-align: left;
    font-size: 15px;
    line-height: 1.5;
}
.wrapper-editor{
    max-height: 30vh;
    overflow-y: auto;
}
.editor s, del{
    text-decoration: line-through !important;
}
s, del {
    text-decoration: line-through !important;
}
@media (max-width: 500px) {
    .autocomplete{
        width: 100%;
    }
    .autocompletes{
        flex-direction: column;
        gap: 0;
    }
    .checkbox{
       flex-direction: column;
        gap: 0;
        margin-left: 1.9rem;
    }
    .autocomplete:nth-child(2){
        margin-left: 2.8rem;
        width: 92%;
    }
}
</style>