<template>
    <section>
        <div class="contWrapper">
            <v-app-bar color="primary" density="compact">
                <v-app-bar-title>RAG Legislativo</v-app-bar-title>
                <v-spacer></v-spacer>
                <v-btn @click="openIndexDialog">
                <v-icon left>mdi-folder-open</v-icon>
                Indexar Documentos
                </v-btn>
            </v-app-bar>
        </div>
        <v-main>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-card>
                <v-card-title>Consulta Legislativa</v-card-title>
                <v-card-text>
                  <v-form @submit.prevent="sendQuery">
                    <v-textarea
                      v-model="query"
                      label="Digite sua consulta sobre legislação"
                      rows="3"
                      auto-grow
                      hide-details
                      :loading="loading"
                      :disabled="loading"
                    ></v-textarea>

                    <v-row class="mt-4">
                      <v-col cols="6">
                        <v-checkbox
                          v-model="formatJson"
                          label="Resposta em formato JSON"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="6" class="text-right">
                        <v-btn
                          color="primary"
                          type="submit"
                          :loading="loading"
                          :disabled="!query"
                        >
                          <v-icon left>mdi-send</v-icon>
                          Enviar
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" v-if="loading">
              <v-card>
                <v-card-text class="text-center">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    size="64"
                  ></v-progress-circular>
                  <div class="mt-4">Processando consulta. Isso pode levar alguns instantes...</div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" v-if="response">
              <v-card class="response-card">
                <v-card-title class="d-flex align-center">
                  <span>Resposta</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    icon
                    @click="copyToClipboard"
                    variant="text"
                  >
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                </v-card-title>
                
                <v-card-text>
                  <div v-if="isJsonResponse">
                    <div class="json-viewer">{{ formattedJsonResponse }}</div>
                  </div>
                  <div v-else>
                    <p style="white-space: pre-line">{{ response.response }}</p>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" v-if="sourcesVisible && sourceDocuments.length > 0">
              <v-card>
                <v-card-title class="d-flex align-center">
                  <span>Fontes Consultadas</span>
                  <v-chip class="ml-2" size="small">{{ sourceDocuments.length }}</v-chip>
                  <v-spacer></v-spacer>
                  <v-btn
                    icon
                    @click="sourcesVisible = false"
                    variant="text"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                
                <v-card-text>
                  <div v-for="(doc, index) in sourceDocuments" :key="index" class="source-document">
                    <strong>{{ doc.metadata.filename }}</strong>
                    <v-chip size="x-small" class="ml-2" color="info">{{ (doc.similarity * 100).toFixed(1) }}% relevante</v-chip>
                    <pre>{{ truncateText(doc.content, 300) }}</pre>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" v-if="response && !sourcesVisible">
              <div class="text-center">
                <v-btn
                  variant="text"
                  @click="fetchSourceDocuments"
                  color="secondary"
                  size="small"
                >
                  <v-icon left>mdi-file-document-multiple</v-icon>
                  Ver documentos consultados
                </v-btn>
              </div>
            </v-col>

            <v-col cols="12" class="mt-6">
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    Histórico de Consultas
                    <template v-slot:actions>
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        @click.stop="clearHistory"
                        v-if="queryHistory.length > 0"
                      >
                        <v-icon>mdi-delete-sweep</v-icon>
                      </v-btn>
                    </template>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-list>
                      <v-list-item
                        v-for="(item, i) in queryHistory"
                        :key="i"
                        @click="loadHistoryItem(item)"
                      >
                        <v-list-item-title>{{ truncateText(item.query, 100) }}</v-list-item-title>
                        <v-list-item-subtitle>{{ formatDate(item.timestamp) }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item v-if="queryHistory.length === 0">
                        <v-list-item-title>Sem consultas recentes</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <v-expansion-panel>
                  <v-expansion-panel-title>
                    Documentos Indexados
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-btn
                      color="primary"
                      variant="outlined"
                      class="mb-4"
                      @click="fetchIndexedDocuments"
                      :loading="loadingDocuments"
                    >
                      <v-icon left>mdi-refresh</v-icon>
                      Atualizar Lista
                    </v-btn>

                    <v-data-table
                      v-if="indexedDocuments.length > 0"
                      :headers="documentHeaders"
                      :items="indexedDocuments"
                      :items-per-page="10"
                      class="elevation-1"
                    >
                      <template v-slot:item.content="{ item }">
                        {{ truncateText(item.content, 100) }}
                      </template>
                    </v-data-table>

                    <v-alert
                      v-else-if="!loadingDocuments"
                      type="info"
                      text="Nenhum documento indexado encontrado."
                    ></v-alert>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-container>
      </v-main>

      <!-- Diálogo para indexar documentos -->
      <v-dialog v-model="indexDialog" max-width="500">
        <v-card>
          <v-card-title>Indexar Documentos</v-card-title>
          <v-card-text>
            <p>Para indexar novos documentos, execute o seguinte comando no terminal:</p>
            <v-alert type="info" class="mb-3">
              <code>python rag-system.py index /caminho/para/seus/documentos</code>
            </v-alert>
            
            <p>Os documentos devem estar em formato .txt, .md ou .pdf</p>
            
            <v-text-field
              v-model="indexPath"
              label="Caminho para os documentos"
              placeholder="/caminho/para/seus/documentos"
              outlined
              dense
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="copyIndexCommand">
              Copiar Comando
            </v-btn>
            <v-btn
              color="primary"
              @click="indexDialog = false"
            >
              Fechar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar para notificações -->
      <v-snackbar v-model="snackbar" :timeout="3000" :color="snackbarColor">
        {{ snackbarText }}
        <template v-slot:actions>
          <v-btn
            color="white"
            variant="text"
            @click="snackbar = false"
          >
            Fechar
          </v-btn>
        </template>
      </v-snackbar>

    </section>
</template>

<script>
import { useGeralStore } from '@/store/GeralStore';
const geralStore = useGeralStore()
export default {
    data() {
        return {
          query: '',
          formatJson: false,
          loading: false,
          loadingDocuments: false,
          response: null,
          sourceDocuments: [],
          sourcesVisible: false,
          queryHistory: [],
          indexedDocuments: [],
          indexDialog: false,
          indexPath: '/caminho/para/seus/documentos',
          snackbar: false,
          snackbarText: '',
          snackbarColor: 'success',
          apiBaseUrl: 'http://localhost:8000',
          documentHeaders: [
            { title: 'Conteúdo', key: 'content', sortable: false },
            { title: 'Arquivo', key: 'metadata.filename', sortable: true },
            { title: 'Fragmento', key: 'metadata.chunk_id', sortable: true }
          ]
        };
      },
      computed: {
        isJsonResponse() {
          if (!this.response) return false;
          return typeof this.response === 'object' && this.response !== null && !this.response.error;
        },
        formattedJsonResponse() {
          if (!this.isJsonResponse) return '';
          return JSON.stringify(this.response, null, 2);
        },
      },
      methods: {
        async sendQuery() {
          if (!this.query.trim()) return;
          
          this.loading = true;
          this.response = null;
          this.sourceDocuments = [];
          this.sourcesVisible = false;
          
          try {
            const response = await fetch(`${this.apiBaseUrl}/query`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                query: this.query,
                format_json: this.formatJson
              })
            });
            
            if (!response.ok) {
              throw new Error('Erro ao enviar consulta');
            }
            
            this.response = await response.json();
            
            // Adicionar à história
            this.addToHistory(this.query, this.response);
            
          } catch (error) {
            console.error('Erro:', error);
            this.showSnackbar('Erro ao processar a consulta: ' + error.message, 'error');
          } finally {
            this.loading = false;
          }
        },
        
        async fetchSourceDocuments() {
          if (!this.query.trim()) return;
          
          this.loadingDocuments = true;
          
          try {
            const response = await fetch(`${this.apiBaseUrl}/query`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                query: this.query,
                format_json: false,
                top_k: 5
              })
            });
            
            if (!response.ok) {
              throw new Error('Erro ao buscar documentos fonte');
            }
            
            const result = await response.json();
            
            // Extrair os documentos fonte do resultado
            if (result && Array.isArray(result)) {
              this.sourceDocuments = result;
            } else if (result && result.sources && Array.isArray(result.sources)) {
              this.sourceDocuments = result.sources;
            } else {
              this.sourceDocuments = [];
            }
            
            this.sourcesVisible = true;
            
          } catch (error) {
            console.error('Erro:', error);
            this.showSnackbar('Erro ao buscar documentos fonte', 'error');
          } finally {
            this.loadingDocuments = false;
          }
        },
        
        async fetchIndexedDocuments() {
          this.loadingDocuments = true;
          
          try {
            const response = await fetch(`${this.apiBaseUrl}/documents`);
            
            if (!response.ok) {
              throw new Error('Erro ao buscar documentos indexados');
            }
            
            const result = await response.json();
            
            if (result && result.documents) {
              this.indexedDocuments = result.documents;
            } else {
              this.indexedDocuments = [];
            }
            
          } catch (error) {
            console.error('Erro:', error);
            this.showSnackbar('Erro ao buscar documentos indexados', 'error');
          } finally {
            this.loadingDocuments = false;
          }
        },
        
        addToHistory(query, response) {
          const historyItem = {
            query,
            response,
            timestamp: new Date().toISOString()
          };
          
          this.queryHistory.unshift(historyItem);
          
          // Limitar o histórico a 20 itens
          if (this.queryHistory.length > 20) {
            this.queryHistory = this.queryHistory.slice(0, 20);
          }
          
          // Salvar no localStorage
          localStorage.setItem('ragQueryHistory', JSON.stringify(this.queryHistory));
        },
        
        loadHistoryItem(item) {
          this.query = item.query;
          this.response = item.response;
        },
        
        clearHistory() {
          this.queryHistory = [];
          localStorage.removeItem('ragQueryHistory');
          this.showSnackbar('Histórico limpo', 'info');
        },
        
        truncateText(text, maxLength) {
          if (!text) return '';
          return text.length > maxLength
            ? text.substring(0, maxLength) + '...'
            : text;
        },
        
        formatDate(dateString) {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toLocaleString();
        },
        
        copyToClipboard() {
          const textToCopy = this.isJsonResponse
            ? JSON.stringify(this.response, null, 2)
            : this.response.response;
            
          navigator.clipboard.writeText(textToCopy)
            .then(() => {
              this.showSnackbar('Resposta copiada para a área de transferência', 'success');
            })
            .catch(err => {
              console.error('Erro ao copiar: ', err);
              this.showSnackbar('Erro ao copiar texto', 'error');
            });
        },
        
        openIndexDialog() {
          this.indexDialog = true;
        },
        
        copyIndexCommand() {
          const command = `python rag-system.py index ${this.indexPath}`;
          navigator.clipboard.writeText(command)
            .then(() => {
              this.showSnackbar('Comando copiado para a área de transferência', 'success');
            })
            .catch(err => {
              console.error('Erro ao copiar: ', err);
              this.showSnackbar('Erro ao copiar comando', 'error');
            });
        },
        
        showSnackbar(text, color = 'success') {
          this.snackbarText = text;
          this.snackbarColor = color;
          this.snackbar = true;
        }
      },
      mounted() {
        geralStore.changeHeaderNoShow()
        // Carregar histórico do localStorage
        const savedHistory = localStorage.getItem('ragQueryHistory');
        if (savedHistory) {
          try {
            this.queryHistory = JSON.parse(savedHistory);
          } catch (e) {
            console.error('Erro ao carregar histórico:', e);
          }
        }
        
        // Carregar documentos indexados
        this.fetchIndexedDocuments();
      }
}

</script>

<style scoped>
    .contWrapper{
        min-height: 49vh;
    }
    .response-card {
      max-height: 500px;
      overflow-y: auto;
    }
    .json-viewer {
      background-color: #f5f5f5;
      border-radius: 4px;
      padding: 16px;
      font-family: monospace;
      white-space: pre-wrap;
    }
    .source-document {
      border-left: 4px solid #1976d2;
      padding-left: 12px;
      margin-bottom: 16px;
    }
    .v-card-text pre {
      white-space: pre-wrap;
      word-break: break-word;
    }

</style>