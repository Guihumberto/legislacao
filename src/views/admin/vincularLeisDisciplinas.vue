<template>
  <section>
        <div class="container2">
            <div class="d-flex justify-space-between">
                <v-btn variant="outlined" prepend-icon="mdi-arrow-left" @click="$router.push('/home/admin/')">Voltar</v-btn>
              </div>
            <h1 class="text-h5 my-5">Vínculos normas x disciplinas</h1>
            <v-row>
                <v-col cols="12">
                    <v-card color="white">
                        <v-card-text>
                            <!-- Campo de busca -->
                            <v-row>
                                <v-col cols="12" md="8">
                                    <v-text-field
                                        v-model="searchTerm"
                                        density="compact"
                                        label="Buscar normas pelo nome da lei"
                                        prepend-inner-icon="mdi-magnify"
                                        variant="outlined"
                                        clearable
                                        @input="searchNormas"
                                        :loading="loading"
                                    />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-btn
                                        color="primary"
                                        @click="searchNormas"
                                        :loading="loading"
                                        block
                                    >
                                    Buscar
                                    </v-btn>
                                </v-col>
                            </v-row>

                            <!-- Lista de resultados -->
                            <v-row v-if="normas.length > 0">
                                <v-col cols="12">
                                    <v-card variant="outlined">
                                        <v-card-title>
                                            <v-icon left>mdi-format-list-bulleted</v-icon>
                                            Resultados da Busca ({{ normas.length }} normas encontradas)
                                        </v-card-title>
                                        
                                        <v-list>
                                            <v-list-item
                                            v-for="(norma, index) in normas"
                                            :key="norma.id"
                                            class="mb-2"
                                            >
                                            <v-card variant="outlined" width="100%">
                                                <v-card-text>
                                                    <v-row>
                                                        <v-col cols="12" md="8">
                                                        <div class="mb-2">
                                                            <v-chip
                                                            :color="getChipColor(norma.tipo)"
                                                            size="small"
                                                            class="mb-2"
                                                            >
                                                            {{ norma.tipo?.toUpperCase() }}
                                                            </v-chip>
                                                            <v-chip
                                                            color="info"
                                                            size="small"
                                                            class="mb-2 ml-2"
                                                            >
                                                            {{ norma.ano }}
                                                            </v-chip>
                                                            <v-chip
                                                            v-if="norma.sigiloso"
                                                            color="warning"
                                                            size="small"
                                                            class="mb-2 ml-2"
                                                            >
                                                            SIGILOSO
                                                            </v-chip>
                                                            <v-chip
                                                            :color="norma.eficaz ? 'success' : 'error'"
                                                            size="small"
                                                            class="mb-2 ml-2"
                                                            >
                                                            {{ norma.eficaz ? 'EFICAZ' : 'INEFICAZ' }}
                                                            </v-chip>
                                                        </div>
                                                        
                                                        <h3 class="mb-2">{{ norma.title }}</h3>
                                                        <p class="text-body-2 mb-2">{{ norma.description_norm.split(/\s+/).slice(0, 40).join(" ") }} (...)</p>

                                                        <div>
                                                            <v-chip-group><v-chip class="bg-primary" v-for="chip, c in norma.disciplina">{{ chip }}</v-chip></v-chip-group>
                                                        </div>
                                                        
                                                        <div class="text-caption text-medium-emphasis">
                                                            <v-icon size="small">mdi-calendar</v-icon>
                                                            Incluído em: {{ norma.data_include }}
                                                            <span class="ml-4">
                                                            <v-icon size="small">mdi-file-pdf-box</v-icon>
                                                            {{ norma.total_pages }} página(s)
                                                            </span>
                                                        </div>
                                                        </v-col>
                                                        
                                                        <v-col cols="12" md="4">
                                                        <v-card variant="tonal" color="primary">
                                                            <v-card-text>
                                                            <v-autocomplete
                                                                v-model="norma.disciplina"
                                                                :items="listDisciplinas"
                                                                multiple
                                                                label="Nome da Disciplina"
                                                                variant="outlined"
                                                                density="compact"
                                                                prepend-inner-icon="mdi-book-open-variant"
                                                                placeholder="Ex: Direito Administrativo"
                                                                clearable
                                                            />
                                                            
                                                            <v-btn
                                                                color="success"
                                                                size="small"
                                                                @click="vincularDisciplina(norma)"
                                                                block
                                                            >
                                                                <v-icon left>mdi-link-variant</v-icon>
                                                                Vincular Disciplina
                                                            </v-btn>
                                                            </v-card-text>
                                                        </v-card>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>
                                            </v-card>
                                            </v-list-item>
                                        </v-list>
                                    </v-card>
                                </v-col>
                            </v-row>

                            <!-- Mensagem quando não há resultados -->
                            <v-row v-else-if="searchTerm && !loading">
                                <v-col cols="12">
                                    <v-alert
                                        type="info"
                                        variant="tonal"
                                        prominent
                                    >
                                    <v-alert-title>Nenhuma norma encontrada</v-alert-title>
                                    Tente usar termos diferentes para sua busca.
                                    </v-alert>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Snackbar para feedback -->
            <v-snackbar v-model="snackbar.show" :color="snackbar.color">
            {{ snackbar.message }}
            <template v-slot:actions>
                <v-btn variant="text" @click="snackbar.show = false">
                Fechar
                </v-btn>
            </template>
            </v-snackbar>
        </div>
  </section>
</template>

<script setup>
    import { ref, reactive, onMounted } from 'vue'
    
    import { useLinkLawStore } from '@/store/concursos/LinkLawsDisciplina'
    const linkStore = useLinkLawStore()

    // Estados reativos
    const searchTerm = ref('')
    const loading = ref(false)
    const normas = ref([])

    const listDisciplinas = [
        "Direito Administrativo",
        "Direito Constitucional",
        "Direito Civil",
        "Direito do Trabalho",
        "Direito Empresarial",
        "Direito Penal",
        "Direito Processual Civil",
        "Direito Processual Penal",
        "Direito Tributário",
        "Direito Internacional Público",
        "Direito Internacional Privado",
        "Direito Ambiental",
        "Direito da Família",
        "Direito do Consumidor",
        "Direito Agrário",
        "Direito Previdenciário",
        "Direito Eleitoral",
        "Direito do Financeiro",
        "Legislação Especial"
    ]

    const snackbar = reactive({
        show: false,
        message: '',
        color: 'success'
    })

    // Dados de exemplo para simular uma busca de normas
    const mockNormas = [

    ]

    // Função para buscar normas
    const searchNormas = async () => {
        if (!searchTerm.value || searchTerm.value.trim() === '') {
            normas.value = []
            return
        }

        loading.value = true
    
        try {
            // Simula uma busca com delay
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Filtra as normas mock baseado no termo de busca
            const filteredNormas = mockNormas.filter(norma => 
                norma.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                norma.description_norm.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                norma.tipo.toLowerCase().includes(searchTerm.value.toLowerCase())
            )
            
            // Adiciona campo disciplina vazio para cada norma
            normas.value = filteredNormas.map(norma => ({
                ...norma,
                disciplina: norma.disciplina || []
            }))
            
        } catch (error) {
            showSnackbar('Erro ao buscar normas', 'error')
        } finally {
            loading.value = false
        }
    }

    // Função para vincular disciplina à norma
    const vincularDisciplina = (norma) => {
        if (!norma.disciplina.length) {
            showSnackbar('Por favor, informe o nome da disciplina', 'warning')
            return
        }

        // Adiciona o campo disciplina ao objeto da norma
        const normaAtualizada = {
            ...norma,
            disciplina: norma.disciplina
        }

        // Aqui você faria a chamada para sua API para salvar a vinculação
        linkStore.createVinculos(normaAtualizada)
        
        showSnackbar(`Norma vinculada com sucesso à disciplina: ${norma.disciplina}`, 'success')
    }

    // Função para mostrar mensagens
    const showSnackbar = (message, color = 'success') => {
        snackbar.message = message
        snackbar.color = color
        snackbar.show = true
    }

    // Função para definir cor do chip baseado no tipo
    const getChipColor = (tipo) => {
        const colors = {
            'portarias': 'primary',
            'decretos': 'secondary',
            'leis': 'success',
            'resoluções': 'info',
            'instruções': 'warning'
        }
        return colors[tipo?.toLowerCase()] || 'default'
    }

    onMounted( async () => {
        await linkStore.getAllLaw()
        normas.value = linkStore.readNormas
    })
</script>

<style scoped>
    .v-card {
    transition: all 0.3s ease;
    }

    .v-card:hover {
        box-shadow: 0 4px 8px rgba(0,0,0,0.12);
        background: rgb(236, 234, 234);
    }

    .v-chip {
    margin-right: 4px;
    }
</style>