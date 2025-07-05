<template>
  <section>
        <div class="container2">
          <v-container>
             <div class="d-flex justify-space-between mb-5">
                <v-btn variant="outlined" prepend-icon="mdi-arrow-left" @click="$router.push('/home/admin/')">Voltar</v-btn>
            </div>
            <h1 class="text-h5 my-5">Organizador de Disciplinas</h1>
            <v-row>
              <v-col cols="12">
                <v-card>
                  <v-card-title>Configuração de Separadores</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="disciplinaPattern"
                          label="Padrão de Disciplina (ex: ':')"
                          hint="Como reconhecer o final do nome da disciplina"
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="topicoPattern"
                          label="Padrão de Tópico (ex: '1 ')"
                          hint="Como reconhecer o início de um tópico principal"
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="subtopicoPattern"
                          label="Padrão de Subtópico (ex: '1.1 ')"
                          hint="Como reconhecer o início de um subtópico"
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field
                          v-model="subSubtopicoPattern"
                          label="Padrão de Sub-subtópico (ex: '1.1.1 ')"
                          hint="Como reconhecer o início de um sub-subtópico"
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field
                          v-model="quebra"
                          label="Quebra de Linha"
                          hint="reconhece a quebra de linha"
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12">
                <v-card>
                  <v-card-title>Entrada de Conteúdo</v-card-title>
                  <v-card-text>
                    <v-textarea
                      v-model="inputContent"
                      label="Cole seu conteúdo aqui"
                      hint="Cole o texto completo com disciplinas, tópicos e subtópicos"
                      persistent-hint
                      rows="10"
                    ></v-textarea>
                    <v-btn
                      color="primary"
                      class="mt-4"
                      @click="processContent"
                      :disabled="!inputContent"
                    >
                      Processar Conteúdo
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
          
              <v-col cols="12" v-if="disciplinas.length > 0">
                <v-card variant="flat" class="mb-5">
                  <v-card-text>
                    <v-form>
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            label="Banca"
                            v-model="form.banca"
                            :rules="[(v) => !!v || 'Campo obrigatório']"
                            required
                            variant="outlined"
                            density="compact"
                          ></v-text-field>
                        </v-col>
                         <v-col cols="12" sm="6">
                            <v-text-field
                            label="Ano"
                            v-model="form.ano"
                            :rules="[(v) => !!v || 'Campo obrigatório']"
                            required
                            variant="outlined"
                            density="compact"
                          ></v-text-field>
                        </v-col>
                        </v-row>
                        <v-row>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            label="Concurso"
                            v-model="form.concurso"
                            :rules="[(v) => !!v || 'Campo obrigatório']"
                            required
                            variant="outlined"
                            density="compact"
                          ></v-text-field>
                        </v-col>
                         <v-col cols="12" sm="6">
                            <v-text-field
                            label="Cargo"
                            v-model="form.cargo"
                            :rules="[(v) => !!v || 'Campo obrigatório']"
                            required
                            variant="outlined"
                            density="compact"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea
                            label="Descrição"
                            v-model="form.describe"
                            :rules="[(v) => !!v || 'Campo obrigatório']"
                            required
                            variant="outlined"
                            density="compact"
                          ></v-textarea>
                        </v-col>
                      </v-row>
                      <div>
                        <v-btn variant="text" class="mr-2">Limpar</v-btn>
                        <v-btn :disable="load" :loading="load" @click="saveConteudo" color="success">Salvar</v-btn>
                      </div>
                    </v-form>
                  </v-card-text>
                </v-card>
                
                <v-card>
                  <v-card-title class="d-flex align-center">
                    Conteúdo Processado
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
                                  link
                                  :title="topico.numero + ' ' + topico.conteudo"
                                  :class="topico.normas && topico.normas.length ? 'bg-light-blue-lighten-5' : ''"
                                >
                                </v-list-item>
                                
                                <v-list-item link
                                  v-for="(subtopico, subtopicoIndex) in topico.subtopicos"
                                  :key="subtopicoIndex"
                                  :title="subtopico.numero + ' ' + subtopico.conteudo"
                                  :class="[
                                    'pl-10',
                                    subtopico.normas && subtopico.normas.length ? 'bg-light-blue-lighten-5' : ''
                                  ]"
                                >
                                </v-list-item>
                                
                                <template v-for="(subtopico, subtopicoIndex) in topico.subtopicos" :key="'sub-'+subtopicoIndex">
                                  <v-list-item link
                                    v-for="(subSubtopico, subSubtopicoIndex) in subtopico.subtopicos"
                                    :key="subSubtopicoIndex"
                                    :title="subSubtopico.numero + ' ' + subSubtopico.conteudo"
                                    :class="[
                                      'pl-16',
                                      subSubtopico.normas && subSubtopico.normas.length ? 'bg-light-blue-lighten-5' : ''
                                    ]"
                                  >
                                  </v-list-item>
                                </template>
                              </template>
                            </v-list>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </div>

                    <!-- Exibição apenas das normas -->
                    <div v-else-if="viewMode === 'normas'">
                      <v-list lines="two">
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
                      </v-list>
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
              </v-col>
            </v-row>
          </v-container>
        </div>
  </section>
</template>

<script>
import { useConteudoEditalStore } from '@/store/concursos/ConteudoEditalStore';
const conteudoStore = useConteudoEditalStore()

import ActionsPrompt from '@/components/painel/concurso/actionsPrompt.vue';

export default {
  components:{
    ActionsPrompt
  },
  data() {
    return {
      disciplinaPattern: ':',
      topicoPattern: '^\\d+\\s',
      subtopicoPattern: '^\\d+\\.\\d+\\s',
      subSubtopicoPattern: '^\\d+\\.\\d+\\.\\d+\\s',
      inputContent: ``,
      disciplinas: [],
      viewMode: 'full',
      quebra: '/([.:])/g',
      banca: 'CESPE/CEBRASPE',
      ano: '2025',
      concurso: 'PGE-PI',
      cargo: 'procurador geral do estado do piaui',
      prompt: null,
      dialog: false,
      textoIn: null,
      load: false,
      form:{
        cargo: 'Procurador Geral do Estado',
        banca: 'CESPE/CEBRASPE',
        ano: 2025, 
        concurso: 'POLÍCIA FEDERAL',
        describe: 'EDITAL Nº 1 – PF – POLICIAL, DE 20 DE MAIO DE 2025'
      }
    }
  },
  computed:{
    textoInit(){
      return this.textoIn
    }
  },
  methods: {
    limparTexto(texto) {
        return texto
            .normalize('NFD') // Decompõe os caracteres acentuados
            .replace(/[\u0300-\u036f]/g, '') // Remove os sinais diacríticos (acentos)
            .replace(/ç/g, 'c') // Substitui cedilha minúsculo
            .replace(/Ç/g, 'C') // Substitui cedilha maiúsculo
            .replace(/-/g, ''); // Remove hifens
    },
    processarTexto(texto) {
      // Etapa 1: substituir dois pontos por ponto onde apropriado
      // Captura padrões como "1 Alguma coisa:"
      texto = texto.replace(/(\d+)\s([^\n:]+?):/g, (match, numero, titulo) => {
        return `${numero} ${titulo}.`;
      });

      // Etapa 2: identificar blocos numerados e seus conteúdos após o ponto
      texto = texto.replace(/(\d+)\s([^\n.]+)\.\s*((?:.|\n)*?)(?=\d+\s|$)/g, (match, numero, titulo, conteudo) => {
        // Substitui ; por ponto e separa por frases
        const partes = conteudo
          .split(';')
          .map(p => p.trim())
          .filter(p => p.length > 0);

        // Numera as partes com base no número principal
        const numeradas = partes.map((parte, idx) => `${numero}.${idx + 1} ${parte.replace(/\.$/, '')}.`);

        return `${numero} ${titulo}.\n${numeradas.join('\n')}\n`;
      });

      return texto;
    },
    processContent() {
      if (!this.inputContent) return;
      
      // Reset do array de disciplinas
      this.disciplinas = [];
     
      const quebra2 = new RegExp('(?<!\\d)([.:])\\s+', 'g');
      this.inputContent = this.limparTexto(this.inputContent.replace(/\n+/g, ' '));
      this.inputContent = this.inputContent.replace(quebra2, '$1\n')
      // this.inputContent = this.processarTexto(this.inputContent);

      console.log(this.inputContent);

      // console.log(JSON.stringify(this.inputContent));
      
      // Split por linhas
      const lines = this.inputContent.split('\n').filter(line => line.trim() !== '');
      
      let currentDisciplina = null;
      let currentTopico = null;
      let currentSubtopico = null;
      let currentSubSubtopico = null;
      
      // Expressões regulares para detecção
      const disciplinaRegex = new RegExp(`([A-Z]+(?:\\s+[A-Z]+)+)${this.disciplinaPattern}`);
      const topicoRegex = new RegExp(this.topicoPattern);
      const subtopicoRegex = new RegExp(this.subtopicoPattern);
      const subSubtopicoRegex = new RegExp(this.subSubtopicoPattern);
      
      // Expressão regular para detectar normas
      const normasRegex = /\b(?:Lei(?:s)?(?:\s+Complementar(?:es)?)?|Decreto|Resolução|Emenda Constitucional)(?:\s+(?:federal|estadual|do|da|CSPGE))?\s+n[º°\.]?\s*\d{1,5}(?:\.\d+)?(?:\/\d{4})?(?:, de \d{1,2} de [a-zç]+ de \d{4})?/gi;


      
      for (const line of lines) {
        // Verifica se é uma disciplina
        const disciplinaMatch = line.match(disciplinaRegex);
        
        if (disciplinaMatch) {
          currentDisciplina = {
            disciplina: disciplinaMatch[1].trim(),
            topicos: []
          };
          this.disciplinas.push(currentDisciplina);
          currentTopico = null;
          currentSubtopico = null;
          currentSubSubtopico = null;
          continue;
        }
        
        // Se não temos uma disciplina atual, ignora a linha
        if (!currentDisciplina) continue;
        
        // Verifica se é um sub-subtópico (precisamos verificar na ordem inversa)
        if (subSubtopicoRegex.test(line)) {
          if (!currentSubtopico) {
            // Se não temos um subtópico atual, precisamos encontrar ou criar um
            if (!currentTopico) continue; // Se nem tópico temos, ignoramos
            
            // Extrair o número do sub-subtópico (ex: "3.2.1" de "3.2.1 Algum texto")
            const numeroCompleto = line.match(/^\d+\.\d+\.\d+/)[0];
            const partes = numeroCompleto.split('.');
            const numeroTopico = partes[0];
            const numeroSubtopico = `${partes[0]}.${partes[1]}`;
            
            // Verificar se o tópico atual corresponde
            if (currentTopico.numero !== numeroTopico) {
              // Procurar o tópico correto
              let topicoEncontrado = currentDisciplina.topicos.find(t => t.numero === numeroTopico);
              if (!topicoEncontrado) {
                // Se não encontrou, criar um novo tópico inferido
                topicoEncontrado = {
                  numero: numeroTopico,
                  conteudo: `[Tópico ${numeroTopico}]`,
                  subtopicos: [],
                  normas: []
                };
                currentDisciplina.topicos.push(topicoEncontrado);
              }
              currentTopico = topicoEncontrado;
            }
            
            // Procurar ou criar o subtópico
            let subtopicoEncontrado = currentTopico.subtopicos.find(st => st.numero === numeroSubtopico);
            if (!subtopicoEncontrado) {
              // Se não encontrou, criar um novo subtópico inferido
              subtopicoEncontrado = {
                numero: numeroSubtopico,
                conteudo: `[Subtópico ${numeroSubtopico}]`,
                subtopicos: [],
                normas: []
              };
              currentTopico.subtopicos.push(subtopicoEncontrado);
            }
            currentSubtopico = subtopicoEncontrado;
          }
          
          // Agora que temos certeza que existe um subtópico, podemos adicionar o sub-subtópico
          const numero = line.match(/^\d+\.\d+\.\d+/)[0];
          const conteudo = line.replace(/^\d+\.\d+\.\d+\s+/, '').trim();
          
          // Extrair normas do conteúdo
          const normas = [];
          let match;
          const normasRegexLocal = new RegExp(normasRegex);
          while ((match = normasRegexLocal.exec(conteudo)) !== null) {
            normas.push(match[0]);
          }
          
          currentSubSubtopico = {
            numero,
            conteudo,
            normas: normas.length > 0 ? normas : []
          };
          
          currentSubtopico.subtopicos.push(currentSubSubtopico);
          continue;
        }
        
        // Verifica se é um subtópico
        if (subtopicoRegex.test(line)) {
          if (!currentTopico) {
            // Se não temos um tópico atual, precisamos encontrar ou criar um
            // Extrair o número do subtópico (ex: "1.2" de "1.2 Algum texto")
            const numeroCompleto = line.match(/^\d+\.\d+/)[0];
            const partes = numeroCompleto.split('.');
            const numeroTopico = partes[0];
            
            // Procurar o tópico correto
            let topicoEncontrado = currentDisciplina.topicos.find(t => t.numero === numeroTopico);
            if (!topicoEncontrado) {
              // Se não encontrou, criar um novo tópico inferido
              topicoEncontrado = {
                numero: numeroTopico,
                conteudo: `[Tópico ${numeroTopico}]`,
                subtopicos: [],
                normas: []
              };
              currentDisciplina.topicos.push(topicoEncontrado);
            }
            currentTopico = topicoEncontrado;
          }
          
          const numero = line.match(/^\d+\.\d+/)[0];
          const conteudo = line.replace(/^\d+\.\d+\s+/, '').trim();
          
          // Extrair normas do conteúdo
          const normas = [];
          let match;
          const normasRegexLocal = new RegExp(normasRegex);
          while ((match = normasRegexLocal.exec(conteudo)) !== null) {
            normas.push(match[0]);
          }
          
          currentSubtopico = {
            numero,
            conteudo,
            subtopicos: [],
            normas: normas.length > 0 ? normas : []
          };
          
          currentTopico.subtopicos.push(currentSubtopico);
          currentSubSubtopico = null;
          continue;
        }
        
        // Verifica se é um tópico
        if (topicoRegex.test(line)) {
          const numero = line.match(/^\d+/)[0];
          const conteudo = line.replace(/^\d+\s+/, '').trim();
          
          // Extrair normas do conteúdo
          const normas = [];
          let match;
          const normasRegexLocal = new RegExp(normasRegex);
          while ((match = normasRegexLocal.exec(conteudo)) !== null) {
            normas.push(match[0]);
          }
          
          currentTopico = {
            numero,
            conteudo,
            subtopicos: [],
            normas: normas.length > 0 ? normas : []
          };
          
          currentDisciplina.topicos.push(currentTopico);
          currentSubtopico = null;
          currentSubSubtopico = null;
          continue;
        }
      }
    },
    copyJSON() {
      const jsonString = JSON.stringify(this.disciplinas, null, 2);
      navigator.clipboard.writeText(jsonString)
        .then(() => {
          alert('JSON copiado para a área de transferência!');
        })
        .catch(err => {
          console.error('Erro ao copiar JSON: ', err);
        });
    },
    async saveConteudo(){
      this.load = true
      const jsonString = JSON.stringify(this.disciplinas, null, 2);
      await conteudoStore.createConteudoEdital(this.disciplinas, this.form)
      // await conteudoStore.createConcurso(this.form)
      this.load = false
    },
    copiarPrompt(){
       const jsonString = JSON.stringify(this.disciplinas, null, 2);
       navigator.clipboard.writeText(this.prompt, jsonString)
    },
    selectItem(local, disciplina = null, topico = null, subtopico = null, subsubtopico = null) {
      this.prompt = null
      if(local == 'disciplina') {
        const texto = this.createPrompt(disciplina.topicos, disciplina.disciplina)
        const promptInit = this.textoInit.replace(/\n/g, ' ').trim().replace(/\s+/g, ' ')
        this.prompt = promptInit + texto
        this.dialog = true
      } 
      if(local == 'topico') {
        const texto = this.createPrompt2(topico, disciplina.disciplina)
        const promptInit = this.textoInit
        this.prompt = (promptInit + texto).replace(/\n/g, ' ').trim().replace(/\s+/g, ' ')
        this.dialog = true
      }
      if(local == 'subtopico') {
        const texto = this.createPrompt3(subtopico, disciplina.disciplina, topico.conteudo)
        const promptInit = this.textoInit.replace(/\n/g, ' ');
        this.prompt = promptInit.trim().replace(/\s+/g, ' ')
        this.dialog = true
      }
      if(local == 'subsubtopico') {
        const texto = this.createPrompt4(subsubtopico, disciplina.disciplina, topico.conteudo, subtopico.conteudo)
        const promptInit = this.textoInit
        this.prompt = promptInit.replace(/\n/g, ' ').trim().replace(/\s+/g, ' ')
        this.dialog = true
      }
    },
    createPrompt(topicos, disciplina){
       if (!topicos || !Array.isArray(topicos) || topicos.length === 0) {
          return "Nenhum tópico encontrado.";
        }

        this.textoIn = `Você é um professor experiente em concursos publicos. Liste os assuntos mais relevantes para se preparar para o cargo de ${this.cargo} 
        do concurso de ${this.concurso}, que vai ser realizado pela  ${this.banca} no ano ${this.ano}, a disciplina da analise e seus assuntos estao relacionados abaixo. 
        Liste os assuntos que devo focar(se interessante use pareto como método), com base na recorrencia das questoes que cairam nos concursos anteriores dos ultimos 5 anos
        da mesma banca e em cargos relacionados. Liste por cada assunto as sumulas e julgados importantes para as provas e faça um pequeno resumo. segue os assuntos: `

        let resultado = `Disciplina: ${disciplina}\n`;

        // Percorre cada tópico principal
        topicos.forEach(topico => {
          resultado += `Assunto: ${topico.numero} ${topico.conteudo}\n`;

          // Verifica se existem subtópicos no primeiro nível
          if (topico.subtopicos && topico.subtopicos.length > 0) {
            topico.subtopicos.forEach(subtopico => {
              resultado += `${subtopico.numero} ${subtopico.conteudo}\n`;

              // Verifica se existem subtópicos no segundo nível
              if (subtopico.subtopicos && subtopico.subtopicos.length > 0) {
                subtopico.subtopicos.forEach(subsubtopico => {
                  resultado += `${subsubtopico.numero} ${subsubtopico.conteudo}\n`;
                });
              }
            });
          }
        });

        return resultado;
    },
    createPrompt2(item, disciplina){
       if (!item?.conteudo || !Array.isArray(item?.subtopicos) || !item?.subtopicos.length) {
          return "Nenhum tópico encontrado.";
        }

        this.textoIn = `Você é um professor experiente em concursos publicos. Liste os assuntos mais relevantes para se preparar para o cargo de ${this.cargo} 
        da ${this.concurso}, que vai ser realizado pela  ${this.banca} no ano ${this.ano}, a disciplina com os assuntos para analise estão relacionados abaixo.
        Liste os pontos importantes com base na recorrencia das questoes que cairam nos concursos anteriores dos ultimos 5 anos, não fuja do tema e procure apenas 
        em outras bancas se houver poucas questoes. Dê preferência a banca ${this.banca} e em cargos relacionados. 
        Liste as sumulas e julgados importantes para a prova e faça um resumo. segue os assuntos: `

        let resultado = `Disciplina: ${disciplina}\nAssunto: ${item.conteudo} `;

        if (item.subtopicos.length > 0) {
            item.subtopicos.forEach(subtopico => {
              resultado += `com foco exclusivo nos tópicos: ${subtopico.numero} ${subtopico.conteudo}\n`;

              // Verifica se existem subtópicos no segundo nível
              if (subtopico.subtopicos.length > 0) {
                  subtopico.subtopicos.forEach(subsubtopico => {
                  resultado += `${subsubtopico.numero} ${subsubtopico.conteudo}\n`;
                });
              }
            });
        }

        return resultado
    },
    createPrompt3(item, disciplina, topico){
       if (!item?.conteudo || !Array.isArray(item?.subtopicos) || !disciplina, !topico) {
          return "Nenhum tópico encontrado.";
       }


       let resultado = `Foque no conteudo ${item.conteudo} do assunto ${topico} referente a disciplina ${disciplina}`;

       if (item.subtopicos.length > 0) {
          resultado += ' apenas no que se refere apenas a estes subtopicos'
          item.subtopicos.forEach(subtopico => {
              resultado += `${subtopico.numero} ${subtopico.conteudo}\n`;
          })
       }

       this.textoIn = `Você é um professor experiente em concursos publicos. Liste os assuntos mais relevantes para se preparar para o cargo de ${this.cargo} 
        do concurso de ${this.concurso}, que vai ser realizado pela  ${this.banca} no ano ${this.ano}, ${resultado}.
        Liste os pontos importantes com base na recorrencia das questoes que cairam nos concursos anteriores dos ultimos 5 anos, não fuja do tema e procure apenas 
        em outras bancas se houver poucas questoes. Dê preferência a banca ${this.banca} e em cargos relacionados.
        Liste as sumulas e julgados importantes para as provas relacionados e faça um pequeno resumo.`

       return this.textoIn;
    },
    createPrompt4(item, disciplina, topico, subtopico){
      if (!item?.conteudo || !Array.isArray(item?.subtopicos) || !disciplina, !topico, !subtopico) {
          return "Nenhum tópico encontrado.";
      }

      let resultado = `na disciplina ${disciplina}, pegando apenas o subtopico ${item.conteudo} dentro do conteudo ${subtopico} do capitulo que trata do Assunto ${topico}`;

      this.textoIn = `Você é um professor experiente em concursos publicos. Liste os assuntos mais relevantes para se preparar para o cargo de ${this.cargo} 
      do concurso de ${this.concurso}, que vai ser realizado pela  ${this.banca} no ano ${this.ano}, exclusivamente ${resultado}. 
      Liste os pontos importantes com base na recorrencia das questoes que cairam nos concursos anteriores dos ultimos 5 anos, não fuja do tema. 
      Use como base outras bancas apenas se houver poucas questoes da ${this.banca}, caso contrario foque nesta e em cargos relacionados ao informado.
      Liste as sumulas e julgados importante para a prova se houver e faça um resumo.`

      return this.textoIn
    },
  }
};
</script>

<style>
.json-display {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  max-height: 400px;
  overflow: auto;
  font-family: monospace;
  white-space: pre-wrap;
}
</style>