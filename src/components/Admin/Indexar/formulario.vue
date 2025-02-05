<template>
    <v-card class="my-5 card" variant="flat">
        <v-card-text v-if="!confirm">
            <div>
                <v-form @submit.prevent="indexarLaws()" ref="form">
                    <div class="autocompletes">
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
                        ></v-autocomplete>
                     </div>
                     <div class="checkbox">
                        <v-checkbox label="Eficaz" v-model="importForm.eficaz" color="success" hide-details></v-checkbox>
                        <v-checkbox label="Sigiloso" v-model="importForm.sigiloso" color="warning" hide-details></v-checkbox>
                        <v-checkbox label="Revogado" v-model="importForm.revogado" color="error" hide-details></v-checkbox>
                        <v-checkbox v-model="importForm.fav_law" color="amber" label="Incluir nos Destaques" hide-details></v-checkbox>
                    </div>
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
    </v-card>
</template>

<script setup>
    import { ref, computed } from 'vue';

    import { extractTextFromPdf } from "@/composables/pdfExtractor"; 
    import PdfViewer from './pdfViewer.vue';

    import { useGeneralStore } from '@/store/GeneralStore';
    const generalStore = useGeneralStore()

    import { useAdminStore } from '@/store/AdminStore';
    import PublishNews from './publishNews.vue';
    const adminStore = useAdminStore()

    const confirm = ref(false)
    const lawData = ref({})
    const form = ref(null)

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
        fav_law: false
    })

    const clearimportForm = () => {
        importForm.value = {
            year: 2025,
            source: null,
            name: null,
            file: null,
            eficaz: true,
            sigiloso: false,  
            revogado: false,
            fav_law: false
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