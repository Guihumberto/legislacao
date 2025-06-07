<template>
    <v-card class="pa-4 mt-5" elevation="2">
        <v-card-text>
            <v-card>
                <v-card-title class="d-flex align-center">
                Conteúdo
                <v-spacer></v-spacer>
                <v-btn-toggle v-model="viewMode" mandatory>
                    <v-btn value="full">
                    <v-icon>mdi-format-list-bulleted</v-icon>
                    <span class="d-none d-sm-inline ml-1">Completo</span>
                    </v-btn>
                    <v-btn value="normas">
                    <v-icon>mdi-gavel</v-icon>
                    <span class="d-none d-sm-inline ml-1">Normas</span>
                    </v-btn>
                    <v-btn value="json">
                    <v-icon>mdi-code-json</v-icon>
                    <span class="d-none d-sm-inline ml-1">JSON</span>
                    </v-btn>
                </v-btn-toggle>
                </v-card-title>
                
                <v-card-text>
                <!-- Exibição do conteúdo completo -->
                <div v-if="viewMode === 'full'">
                    <v-expansion-panels>
                        <v-expansion-panel
                            v-for="(disciplina, disciplinaIndex) in disciplinas"
                            :key="disciplinaIndex"
                        >
                            <v-expansion-panel-title>
                            {{ disciplina.disciplina }}
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                            <v-list density="compact">
                                <template v-for="(topico, topicoIndex) in disciplina.topicos" :key="topicoIndex">
                                <v-list-item
                                    :class="topico.normas && topico.normas.length ? 'bg-light-blue-lighten-5' : ''"
                                >
                                    <template #prepend>
                                    <v-btn
                                        icon="mdi-pencil"
                                        size="small"
                                        variant="text"
                                        @click="editarTopico(disciplinaIndex, topicoIndex)"
                                    />
                                    </template>
                                    
                                    <v-list-item-title>
                                    {{ topico.numero + ' ' + topico.conteudo }}
                                    </v-list-item-title>

                                    <template #append>
                                    <v-btn
                                        icon="mdi-plus"
                                        size="small"
                                        variant="text"
                                        @click="adicionarSubtopico(disciplinaIndex, topicoIndex)"
                                    />
                                    <v-btn
                                        icon="mdi-delete"
                                        size="small"
                                        variant="text"
                                        color="error"
                                        @click="confirmarExclusao('topico', disciplinaIndex, topicoIndex)"
                                    />
                                    </template>
                                </v-list-item>

                                <!-- Subtópicos -->
                                <v-list-item
                                    v-for="(subtopico, subtopicoIndex) in topico.subtopicos"
                                    :key="subtopicoIndex"
                                    :class="[
                                    'pl-10',
                                    subtopico.normas && subtopico.normas.length ? 'bg-light-blue-lighten-5' : ''
                                    ]"
                                >
                                    <template #prepend>
                                    <v-btn
                                        icon="mdi-pencil"
                                        size="x-small"
                                        variant="text"
                                        @click="editarSubtopico(disciplinaIndex, topicoIndex, subtopicoIndex)"
                                    />
                                    </template>
                                    
                                    <v-list-item-title>
                                    {{ subtopico.numero + ' ' + subtopico.conteudo }}
                                    </v-list-item-title>

                                    <template #append>
                                    <v-btn
                                        icon="mdi-plus"
                                        size="x-small"
                                        variant="text"
                                        @click="adicionarSubSubtopico(disciplinaIndex, topicoIndex, subtopicoIndex)"
                                    />
                                    <v-btn
                                        icon="mdi-delete"
                                        size="x-small"
                                        variant="text"
                                        color="error"
                                        @click="confirmarExclusao('subtopico', disciplinaIndex, topicoIndex, subtopicoIndex)"
                                    />
                                    </template>
                                </v-list-item>

                                <!-- Sub-subtópicos -->
                                <template v-for="(subtopico, subtopicoIndex) in topico.subtopicos" :key="'sub-'+subtopicoIndex">
                                    <v-list-item
                                    v-for="(subSubtopico, subSubtopicoIndex) in subtopico.subtopicos"
                                    :key="subSubtopicoIndex"
                                    :class="[
                                        'pl-16',
                                        subSubtopico.normas && subSubtopico.normas.length ? 'bg-light-blue-lighten-5' : ''
                                    ]"
                                    >
                                    <template #prepend>
                                        <v-btn
                                        icon="mdi-pencil"
                                        size="x-small"
                                        variant="text"
                                        @click="editarSubSubtopico(disciplinaIndex, topicoIndex, subtopicoIndex, subSubtopicoIndex)"
                                        />
                                    </template>
                                    
                                    <v-list-item-title>
                                        {{ subSubtopico.numero + ' ' + subSubtopico.conteudo }}
                                    </v-list-item-title>

                                    <template #append>
                                        <v-btn
                                        icon="mdi-delete"
                                        size="x-small"
                                        variant="text"
                                        color="error"
                                        @click="confirmarExclusao('subsubtopico', disciplinaIndex, topicoIndex, subtopicoIndex, subSubtopicoIndex)"
                                        />
                                    </template>
                                    </v-list-item>
                                </template>
                                </template>
                            </v-list>
                            
                            <!-- Botão para adicionar novo tópico -->
                            <v-btn
                                class="mt-4"
                                color="primary"
                                variant="outlined"
                                @click="adicionarTopico(disciplinaIndex)"
                            >
                                <v-icon left>mdi-plus</v-icon>
                                Adicionar Tópico
                            </v-btn>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </div>

                <!-- Exibição apenas das normas -->
                <div v-else-if="viewMode === 'normas'">
                    <Link_normas 
                        :disciplinas="disciplinas"
                        @normaClicada="handleNormaClicada"
                    />
                    <!-- <v-list lines="two">
                        <template v-for="(disciplina, disciplinaIndex) in disciplinas" :key="disciplinaIndex">
                            <v-list-subheader class="text-h6 text-black"> <v-icon>mdi-arrow-right</v-icon> {{ disciplina.disciplina }}</v-list-subheader>
                            
                            <template v-for="(topico, topicoIndex) in disciplina.topicos" :key="topicoIndex">
                            <template v-if="topico.normas && topico.normas.length > 0">
                                <v-list-item
                                v-for="(norma, normaIndex) in topico.normas"
                                :key="`t-${topicoIndex}-${normaIndex}`"
                                :title="norma"
                                :subtitle="`Tópico ${topico.numero} ${topico.conteudo}`"
                                ></v-list-item>
                            </template>
                            
                            <template v-for="(subtopico, subtopicoIndex) in topico.subtopicos" :key="subtopicoIndex">
                                <template v-if="subtopico.normas && subtopico.normas.length > 0">
                                <v-list-item
                                    v-for="(norma, normaIndex) in subtopico.normas"
                                    :key="`st-${topicoIndex}-${subtopicoIndex}-${normaIndex}`"
                                    :title="norma"
                                    :subtitle="`Subtópico ${subtopico.numero} ${subtopico.conteudo}`"
                                ></v-list-item>
                                </template>
                                
                                <template v-for="(subSubtopico, subSubtopicoIndex) in subtopico.subtopicos" :key="subSubtopicoIndex">
                                <template v-if="subSubtopico.normas && subSubtopico.normas.length > 0">
                                    <v-list-item
                                    v-for="(norma, normaIndex) in subSubtopico.normas"
                                    :key="`sst-${topicoIndex}-${subtopicoIndex}-${subSubtopicoIndex}-${normaIndex}`"
                                    :title="norma"
                                    :subtitle="`Sub-subtópico ${subSubtopico.numero} ${subSubtopico.conteudo}`"
                                    ></v-list-item>
                                </template>
                                </template>
                            </template>
                            </template>
                        </template>
                    </v-list> -->
                </div>

                <!-- Exibição do JSON -->
                <div v-else>
                    <v-btn
                    color="secondary"
                    class="mb-4"
                    @click="copyJSON"
                    :disabled="!disciplinas.length"
                    >
                    <v-icon>mdi-content-copy</v-icon>
                    Copiar JSON
                    </v-btn>
                    <pre class="json-display">{{ JSON.stringify(disciplinas, null, 2) }}</pre>
                </div>
                </v-card-text>
            </v-card>
        </v-card-text>

        <v-card-actions>
            <v-spacer />
                <v-btn 
                    color="primary" 
                    variant="elevated"
                    @click="saveChanges"
                    :disabled="!hasChanges"
                >
                    <v-icon start>mdi-content-save</v-icon>
                    Salvar Alterações
                </v-btn>
        </v-card-actions>
    </v-card>
     <!-- Dialog de Edição -->
    <v-dialog v-model="dialogEdicao" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ tituloDialog }}</span>
        </v-card-title>
        
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="itemEditando.numero"
                  label="Número"
                  required
                />
              </v-col>
              <v-col cols="12" sm="8">
                <v-textarea
                  v-model="itemEditando.conteudo"
                  label="Conteúdo"
                  required
                  rows="3"
                />
              </v-col>
            </v-row>
            
            <!-- Campo para dividir tópico (quando aplicável) -->
            <v-row v-if="modoEdicao === 'topico' || modoEdicao === 'subtopico'">
              <v-col cols="12">
                <v-switch
                  v-model="dividirItem"
                  label="Dividir este item em dois"
                  color="primary"
                />
              </v-col>
            </v-row>

            <!-- Campos para o novo item (quando dividindo) -->
            <template v-if="dividirItem">
              <v-divider class="my-4" />
              <v-row>
                <v-col cols="12">
                  <h4>Novo Item</h4>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="novoItem.numero"
                    label="Número do novo item"
                    required
                  />
                </v-col>
                <v-col cols="12" sm="8">
                  <v-textarea
                    v-model="novoItem.conteudo"
                    label="Conteúdo do novo item"
                    required
                    rows="3"
                  />
                </v-col>
              </v-row>
            </template>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="cancelarEdicao"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="salvarEdicao"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de Confirmação de Exclusão -->
    <v-dialog v-model="dialogExclusao" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">
          Confirmar Exclusão
        </v-card-title>
        
        <v-card-text>
          <p>Tem certeza que deseja excluir este {{ tipoExclusao }}?</p>
          <p class="text-subtitle-2 mt-2">
            <strong>{{ itemParaExcluir.numero }} {{ itemParaExcluir.conteudo }}</strong>
          </p>
          <p class="text-caption text-error mt-2" v-if="temSubitens">
            ⚠️ Atenção: Esta ação também excluirá todos os subitens relacionados.
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            variant="text"
            @click="dialogExclusao = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="excluirItem"
          >
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog para mostrar a legislação -->
    <v-dialog v-model="dialogLegislacao" max-width="800">
      <v-card v-if="legislacaoSelecionada">
        <v-card-title>
          <span class="text-h5">{{ legislacaoSelecionada.nome }}</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogLegislacao = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text>
          <div class="mb-4">
            <strong>ID:</strong> {{ legislacaoSelecionada.id }}
          </div>
          <div class="mb-4">
            <strong>Tipo:</strong> {{ legislacaoSelecionada.tipo }}
          </div>
          <div class="mb-4">
            <strong>Número:</strong> {{ legislacaoSelecionada.numero }}
          </div>
          <div class="mb-4">
            <strong>Ano:</strong> {{ legislacaoSelecionada.ano }}
          </div>
          <div class="mb-4" v-if="legislacaoSelecionada.ementa">
            <strong>Ementa:</strong> {{ legislacaoSelecionada.ementa }}
          </div>
          <div class="mb-4" v-if="legislacaoSelecionada.conteudo">
            <strong>Conteúdo:</strong>
            <div class="mt-2" v-html="legislacaoSelecionada.conteudo"></div>
          </div>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="primary" 
            @click="abrirLegislacaoCompleta"
            v-if="legislacaoSelecionada.url"
          >
            Ver Legislação Completa
          </v-btn>
          <v-btn color="grey" @click="dialogLegislacao = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref, reactive } from 'vue'
    import Link_normas from './link_normas.vue';

    const props = defineProps({
        conteudo: {
            type: Array,
            required: true,
            default: () => []
        }
    })

    const emit = defineEmits(['update:disciplinas'])
    
    const viewMode = ref('full');
    const disciplinas = ref(props.conteudo);    

    const hasChanges = ref(false);

    const saveChanges = () => {
        console.log('Salvando alterações...');  
    }

    const copyJSON = () => {
      const jsonString = JSON.stringify(disciplinas.value, null, 2);
      navigator.clipboard.writeText(jsonString)
        .then(() => {
          alert('JSON copiado para a área de transferência!');
        })
        .catch(err => {
          console.error('Erro ao copiar JSON: ', err);
        });
    }

    // Estado do dialog
    const dialogEdicao = ref(false)
    const dialogExclusao = ref(false)
    const modoEdicao = ref('') // 'topico', 'subtopico', 'subsubtopico'
    const tituloDialog = ref('')
    const dividirItem = ref(false)

    // Estados para exclusão
    const tipoExclusao = ref('')
    const temSubitens = ref(false)
    const itemParaExcluir = reactive({
        numero: '',
        conteudo: ''
    })

    // Índices para exclusão
    const indicesExclusao = reactive({
        disciplina: -1,
        topico: -1,
        subtopico: -1,
        subsubtopico: -1
    })

    // Índices para rastrear o item sendo editado
    const indicesEdicao = reactive({
        disciplina: -1,
        topico: -1,
        subtopico: -1,
        subsubtopico: -1
    })

    // Dados do item sendo editado
    const itemEditando = reactive({
        numero: '',
        conteudo: '',
        normas: []
    })

    // Dados do novo item (quando dividindo)
    const novoItem = reactive({
        numero: '',
        conteudo: '',
        normas: []
    })

    // Função para criar um item vazio
    const criarItemVazio = () => ({
        numero: '',
        conteudo: '',
        normas: [],
        subtopicos: []
    })

    // Funções de edição
    const editarTopico = (disciplinaIndex, topicoIndex) => {    

        const topico = disciplinas.value[disciplinaIndex].topicos[topicoIndex]
        
        modoEdicao.value = 'topico'
        tituloDialog.value = 'Editar Tópico'
        
        indicesEdicao.disciplina = disciplinaIndex
        indicesEdicao.topico = topicoIndex
        indicesEdicao.subtopico = -1
        indicesEdicao.subsubtopico = -1
        
        Object.assign(itemEditando, { ...topico })
        dividirItem.value = false
        
        dialogEdicao.value = true
    }

    const editarSubtopico = (disciplinaIndex, topicoIndex, subtopicoIndex) => {
        const subtopico = disciplinas.value[disciplinaIndex].topicos[topicoIndex].subtopicos[subtopicoIndex]
        
        modoEdicao.value = 'subtopico'
        tituloDialog.value = 'Editar Subtópico'
        
        indicesEdicao.disciplina = disciplinaIndex
        indicesEdicao.topico = topicoIndex
        indicesEdicao.subtopico = subtopicoIndex
        indicesEdicao.subsubtopico = -1
        
        Object.assign(itemEditando, { ...subtopico })
        dividirItem.value = false
        
        dialogEdicao.value = true
    }

    const editarSubSubtopico = (disciplinaIndex, topicoIndex, subtopicoIndex, subSubtopicoIndex) => {
        const subSubtopico = disciplinas.value[disciplinaIndex].topicos[topicoIndex].subtopicos[subtopicoIndex].subtopicos[subSubtopicoIndex]
        
        modoEdicao.value = 'subsubtopico'
        tituloDialog.value = 'Editar Sub-subtópico'
        
        indicesEdicao.disciplina = disciplinaIndex
        indicesEdicao.topico = topicoIndex
        indicesEdicao.subtopico = subtopicoIndex
        indicesEdicao.subsubtopico = subSubtopicoIndex
        
        Object.assign(itemEditando, { ...subSubtopico })
        dividirItem.value = false
        
    dialogEdicao.value = true
    }

    // Funções para adicionar novos itens
    const adicionarTopico = (disciplinaIndex) => {
        modoEdicao.value = 'novo-topico'
        tituloDialog.value = 'Adicionar Novo Tópico'
        
        indicesEdicao.disciplina = disciplinaIndex
        indicesEdicao.topico = -1
        indicesEdicao.subtopico = -1
        indicesEdicao.subsubtopico = -1
        
        Object.assign(itemEditando, criarItemVazio())
        dividirItem.value = false
        
        dialogEdicao.value = true
    }

    const adicionarSubtopico = (disciplinaIndex, topicoIndex) => {
        modoEdicao.value = 'novo-subtopico'
        tituloDialog.value = 'Adicionar Novo Subtópico'
        
        indicesEdicao.disciplina = disciplinaIndex
        indicesEdicao.topico = topicoIndex
        indicesEdicao.subtopico = -1
        indicesEdicao.subsubtopico = -1
        
        Object.assign(itemEditando, criarItemVazio())
        dividirItem.value = false
        
        dialogEdicao.value = true
    }

    const adicionarSubSubtopico = (disciplinaIndex, topicoIndex, subtopicoIndex) => {
        modoEdicao.value = 'novo-subsubtopico'
        tituloDialog.value = 'Adicionar Novo Sub-subtópico'
        
        indicesEdicao.disciplina = disciplinaIndex
        indicesEdicao.topico = topicoIndex
        indicesEdicao.subtopico = subtopicoIndex
        indicesEdicao.subsubtopico = -1
        
        Object.assign(itemEditando, criarItemVazio())
        dividirItem.value = false
        
        dialogEdicao.value = true
    }

    // Salvar edição
    const salvarEdicao = () => {
        const disciplinasAtualizadas = [...disciplinas.value]
        const disciplina = disciplinasAtualizadas[indicesEdicao.disciplina]
        
        switch (modoEdicao.value) {
            case 'topico':
                disciplina.topicos[indicesEdicao.topico] = { ...itemEditando }
                if (dividirItem.value && novoItem.numero && novoItem.conteudo) {
                    disciplina.topicos.splice(indicesEdicao.topico + 1, 0, { ...novoItem, subtopicos: [] })
                }
            break
            
            case 'subtopico':
                disciplina.topicos[indicesEdicao.topico].subtopicos[indicesEdicao.subtopico] = { ...itemEditando }
                if (dividirItem.value && novoItem.numero && novoItem.conteudo) {
                    disciplina.topicos[indicesEdicao.topico].subtopicos.splice(indicesEdicao.subtopico + 1, 0, { ...novoItem, subtopicos: [] })
                }
            break
            
            case 'subsubtopico':
                disciplina.topicos[indicesEdicao.topico].subtopicos[indicesEdicao.subtopico].subtopicos[indicesEdicao.subsubtopico] = { ...itemEditando }
            break
            
            case 'novo-topico':
                disciplina.topicos.push({ ...itemEditando, subtopicos: [] })
            break
            
            case 'novo-subtopico':
                disciplina.topicos[indicesEdicao.topico].subtopicos.push({ ...itemEditando, subtopicos: [] })
            break
            
            case 'novo-subsubtopico':
                disciplina.topicos[indicesEdicao.topico].subtopicos[indicesEdicao.subtopico].subtopicos.push({ ...itemEditando })
            break
        }
        
        emit('update:disciplinas', disciplina)
        cancelarEdicao()
    }

    // Cancelar edição
    const cancelarEdicao = () => {
        dialogEdicao.value = false
        dividirItem.value = false
        Object.assign(itemEditando, criarItemVazio())
        Object.assign(novoItem, criarItemVazio())
    }

    // Funções de exclusão
    const confirmarExclusao = (tipo, disciplinaIndex, topicoIndex, subtopicoIndex = -1, subSubtopicoIndex = -1) => {
        tipoExclusao.value = tipo
        
        indicesExclusao.disciplina = disciplinaIndex
        indicesExclusao.topico = topicoIndex
        indicesExclusao.subtopico = subtopicoIndex
        indicesExclusao.subsubtopico = subSubtopicoIndex
        
        let item
        switch (tipo) {
            case 'topico':
            item = disciplinas.value[disciplinaIndex].topicos[topicoIndex]
            temSubitens.value = item.subtopicos && item.subtopicos.length > 0
            break
            case 'subtopico':
            item = disciplinas.value[disciplinaIndex].topicos[topicoIndex].subtopicos[subtopicoIndex]
            temSubitens.value = item.subtopicos && item.subtopicos.length > 0
            break
            case 'subsubtopico':
            item = disciplinas.value[disciplinaIndex].topicos[topicoIndex].subtopicos[subtopicoIndex].subtopicos[subSubtopicoIndex]
            temSubitens.value = false
            break
        }
        
        Object.assign(itemParaExcluir, {
            numero: item.numero,
            conteudo: item.conteudo
        })
        
        dialogExclusao.value = true
    }

    const excluirItem = () => {
        const disciplinasAtualizadas = [...disciplinas.value]
        const disciplina = disciplinasAtualizadas[indicesExclusao.disciplina]
        
        switch (tipoExclusao.value) {
            case 'topico':
            disciplina.topicos.splice(indicesExclusao.topico, 1)
            break
            case 'subtopico':
            disciplina.topicos[indicesExclusao.topico].subtopicos.splice(indicesExclusao.subtopico, 1)
            break
            case 'subsubtopico':
            disciplina.topicos[indicesExclusao.topico].subtopicos[indicesExclusao.subtopico].subtopicos.splice(indicesExclusao.subsubtopico, 1)
            break
        }
        
        emit('update:disciplinas', disciplina)
        dialogExclusao.value = false
    }

    // Estado reativo
    const dialogLegislacao = ref(false)
    const legislacaoSelecionada = ref(null)

    // Métodos
    const handleNormaClicada = (dados) => {
        console.log('Norma clicada:', dados)
        
        legislacaoSelecionada.value = dados.legislacao
        dialogLegislacao.value = true
    }

    const abrirLegislacaoCompleta = () => {
        if (legislacaoSelecionada.value?.url) {
            window.open(legislacaoSelecionada.value.url, '_blank')
        }
    }

</script>

<style scoped>

</style>