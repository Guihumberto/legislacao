<template>
  <section>
        <div class="container2">
          <v-container>
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
      inputContent: `
LÍNGUA PORTUGUESA: 1 Compreensão e interpretação de textos de gêneros variados. 2 Reconhecimento
de tipos e gêneros textuais. 3 Domínio da ortografia oficial. 4 Domínio dos mecanismos de coesão textual.
4.1 Emprego de elementos de referenciação, substituição e repetição, de conectores e de outros
elementos de sequenciação textual. 4.2 Emprego de tempos e modos verbais. 5 Domínio da estrutura
morfossintática do período. 5.1 Emprego das classes de palavras. 5.2 Relações de coordenação entre
orações e entre termos da oração. 5.3 Relações de subordinação entre orações e entre termos da oração.
5.4 Emprego dos sinais de pontuação. 5.5 Concordância verbal e nominal. 5.6 Regência verbal e nominal.
5.7 Emprego do sinal indicativo de crase. 5.8 Colocação dos pronomes átonos. 6 Reescrita de frases e
parágrafos do texto. 6.1 Significação das palavras. 6.2 Substituição de palavras ou de trechos de texto. 6.3
Reorganização da estrutura de orações e de períodos do texto. 6.4 Reescrita de textos de diferentes
gêneros e níveis de formalidade. 7 Correspondência oficial (conforme Manual de Redação da Presidência
da República). 7.1 Aspectos gerais da redação oficial. 7.2 Finalidade dos expedientes oficiais. 7.3
Adequação da linguagem ao tipo de documento. 7.4 Adequação do formato do texto ao gênero.
INFORMÁTICA TEC: 1 Componentes de um computador (hardware e software). 2 Noções de sistemas
operacionais. 1,1 Windows, Android e iOS. 3 Navegadores de Internet, webmail e ferramentas de
produtividade do Microsoft Office 365 (Word, Excel, Outlook, Powerpoint, OneDrive, Teams). 4 Noções
de segurança da informação. 4.1 Responsabilidades e deveres dos usuários de serviços de TI. 4.2 Malware
vírus, worms, cavalos de Troia (trojans), spyware, ransomware, backdoor, zero-day exploits e keyloggers.
4.3 Phishing, baiting e engenharia social- métodos e canais utilizados. 4.4 Aplicativos para segurança -
antivírus, Endpoint Detection and Response (EDR), firewall, anti-spyware, gerenciadores de senhas. 4.5
Múltiplos Fatores de Autenticação (MFA). 4.6 Assinatura e certificação digital. 5 Computação em nuvem -
conceitos envolvidos, vantagens e desvantagens. 6 Noções de bancos de dados. 6.1 Conceitos básicos e
características. 6.2 Dados estruturados e não estruturados. 6.3 Banco de dados relacionais. 6.4 Chaves e
relacionamentos. 7 Noções de redes de computadores. 7.1 Tipos - locais (LAN), metropolitanas (MAN) e
de longa distância (WAN). 7.2 Internet e Intranet. 7.3 Arquitetura TCP/IP, NAT. 7.4 Acesso remoto a
computadores - VPN, RDP. 8 Noções de programação. 8.1 Linguagem Python. 8.2 Low-Code/No-Code. 9
Metadados de arquivos. 10 Noções de aprendizado de máquina. 10.1 Mineração de dados - conceituação
e características. 10.2 Big data - conceito, premissas e aplicação. 10.3 IA Generativa - principais
características.
NOÇÕES DE DIREITO ADMINISTRATIVO: 1 Noções de organização administrativa. 1.1 Centralização,
descentralização, concentração e desconcentração. 1.2 Administração direta e indireta. 1.3 Autarquias,
fundações, empresas públicas e sociedades de economia mista. 2 Ato administrativo. 2.1 Conceito,
requisitos, atributos, classificação e espécies. 3 Agentes públicos. 3.1 Legislação pertinente. 3.1.1 Lei nº
8.112/1990 e suas alterações. 3.1.2 Disposições constitucionais aplicáveis. 3.2 Disposições doutrinárias.
3.2.1 Conceito. 3.2.2 Espécies. 3.2.3 Cargo, emprego e função pública. 4 Poderes administrativos. 4.1
Hierárquico, disciplinar, regulamentar e de polícia. 4.2 Uso e abuso do poder. 5 Licitação. 5.1 Princípios.
5.2 Contratação direta - dispensa e inexigibilidade. 5.3 Modalidades. 5.4 Tipos. 5.5 Procedimento. 6
Controle da Administração Pública. 6.1 Controle exercido pela Administração Pública. 6.2 Controle
judicial. 6.3 Controle legislativo. 7 Responsabilidade civil do Estado. 7.1 Responsabilidade civil do Estado
no direito brasileiro. 7.1.1 Responsabilidade por ato comissivo do Estado. 7.1.2 Responsabilidade por
omissão do Estado. 7.2 Requisitos para a demonstração da responsabilidade do Estado. 7.3 Causas
excludentes e atenuantes da responsabilidade do Estado. 8 Regime jurídico-administrativo. 8.1 Conceito.
8.2 Princípios expressos e implícitos da Administração Pública.
NOCOES DE DIREITO CONSTITUCIONAL:
1 Direitos e garantias fundamentais.
1.1 direitos e deveres individuais e coletivos.
1.2 direito a vida, a liberdade, a igualdade, a seguranca e a propriedade.
1.3 direitos sociais.
1.4 nacionalidade.
1.5 cidadania e direitos politicos.
1.6 partidos politicos.
1.7 garantias constitucionais individuais.
1.8 garantias dos direitos coletivos, sociais e politicos.
2 Poder Executivo.
2.1 forma e sistema de governo.
2.2 chefia de Estado e chefia de governo.
3 Defesa do Estado e das instituicoes democraticas.
3.1 seguranca publica.
3.2 organizacao da seguranca publica.
4 Ordem social.
4.1 base e objetivos da ordem social.
4.2 seguridade social.
4.3 meio ambiente.
4.4 familia, crianca, adolescente, idoso, indigenas.
4.2 seguridade social. meio ambiente. 4.3 família, criança, adolescente, idoso, indígenas.
NOÇÕES DE DIREITO PENAL E DE DIREITO PROCESSUAL PENAL: 1 Princípios básicos. 2 Aplicação da lei
penal. 2.1 A lei penal no tempo e no espaço. 2.2 Tempo e lugar do crime. 2.3 Territorialidade e
extraterritorialidade da lei penal. 3 O fato típico e seus elementos. 3.1 Crime consumado e tentado. 3.2
Ilicitude e causas de exclusão. 3.3 Excesso punível. 4 Crimes contra a pessoa. 5 Crimes contra o patrimônio.
6 Crimes contra a fé pública. 7 Crimes contra a Administração Pública. 8 Inquérito policial. 8.1 Histórico,
natureza, conceito, finalidade, características, fundamento, titularidade, grau de cognição, valor
probatório, formas de instauração, notitia criminis, delatio criminis, procedimentos investigativos,
indiciamento, garantias do investigado e conclusão. 9 Prova. 9.1 Exame do corpo de delito e perícias em
geral. 9.1.1 Perícias regulamentadas no CPP. 9.1.2 Requisição de perícia. 9.1.3 Formalidades e obrigações
impostas ao perito. 9.1.4 Nova perícia e atuação do Assistente técnico. 9.2 Cadeia de custódia da prova.
9.2.1 Conceito de cadeia de custódia. 9.2.2 Importância da cadeia de custódia. 9.2.3 Etapas da cadeia de
custódia. 9.2.4 Atores envolvidos com a cadeia de custódia. 9.2.5 Efeitos jurídicos da inobservância da
cadeia de custódia da prova pericial. 9.3 Requisitos e ônus da prova. 9.4 Nulidade da prova. 9.5
Documentos de prova. 9.6 Reconhecimento de pessoas e coisas. 9.7 Acareação. 9.8 Indícios. 9.9 Busca e
apreensão. 10 Restrição de liberdade. 10.1 Prisão em flagrante. 11. Função pericial do Estado e a perícia
no contexto processual brasileiro. 11.1 A Perícia Criminal Federal. 11.2 Polícias Científicas Estaduais. 12
Lei nº 12.030, de 17 de setembro de 2009.
NOÇÕES DE CRIMINALÍSTICA: 1 Conceitos básicos em Criminalística. 1.1 Inter-relação entre os Conceitos
de Ciências Forenses, Criminalística e Perícia. 1.2 Perícia criminal e civil. 1.3 Vestígio, Evidência e Indício.
1.4 Teoria dos vestígios (Princípio de Locard). 1.5 Classificação dos vestígios quanto a sua natureza. 1.5.1
Vestígios Biológicos. 1.5.2 Vestígios Físicos. 1.5.3 Vestígios Químicos. 1.5.4 Vestígios Morfológicos. 1.5.5
Microvestígios. 1.6 Relação dos vestígios com os fatos e com o autor. 1.7 Fotografia Pericial. 1.7.1
Legislação aplicada às fotografias periciais oficiais. 1.7.2 Princípios e técnicas de fotografia na
Criminalística. 2 Noções sobre as principais áreas da Criminalística Moderna e exames realizados. 3 Locais
de crime. 3.1 Definição de Local de crime. 3.2 O local como fonte de informação. 3.3 Isolamento e
preservação de locais de crime. 3.4 Processamento pericial de locais de crime. 3.4.1 Busca de vestígios.
3.4.2 Documentação do local (Fixação). 3.4.3 Coleta de vestígios. 3.4.4 Acondicionamento e transporte de
vestígios. 3.4.5 Liberação do local. 3.5 Locais de crime contra a vida. 3.5.1 O exame perinecriscópico. 3.5.2
Tanatologia forense. 3.5.2.1 Sinais de morte. 3.5.2.1 Cronotanatognose e alterações cadavéricas. 3.5.3
Traumatologia Forense aplicada à locais de crime. 3.5.3.1 Lesões produzidas por agentes mecânicos,
físicos e físico-químicos. 4 Balística Forense. 4.1 Conceito de arma de fogo. 4.2 Calibre real e nominal das
armas de fogo. 4.3 Identificação das armas de fogo. 4.4 O cartucho de munição e seus elementos. 4.5
Resíduos do tiro. 4.6 Efeitos do tiro e distância do tiro. 5 Princípios e elementos de um Laudo Pericial. 5.1
Objetivos principais a buscar. 6 Avanços e perspectivas de futuro em Ciências Forenses. 6.1
Rastreabilidade de metais preciosos. 6.2 Análise de isótopos como ferramenta para resposta a questões
forenses. 6.3 Banco de dados em Criminalística. 6.3.1 Banco de Perfis Genéticos. 6.3.2 Banco de Perfis
Balísticos.
DIREITOS HUMANOS: 1 Direitos humanos na Constituição Federal de 1988 n. 2 Sistema internacional de
proteção dos direitos humanos. 3 Convenção para a Prevenção e Punição ao Crime de Genocídio. 4
Convenção Relativa ao Estatuto dos Refugiados. Protocolo sobre o Estatuto dos Refugiados. 5 Convenção
sobre a Eliminação de Todas as Formas de Discriminação Racial. 6 Convenção sobre a Eliminação de Todas
as Formas de Discriminação contra a Mulher. 7 Convenção contra a Tortura e Outros Tratamentos ou
Penas Cruéis, Desumanos ou Degradantes. 8 Convenção Internacional para a Proteção de Todas as
Pessoas contra o Desaparecimento Forçado. 9 Regras mínimas da ONU para o tratamento de pessoas
presas. 10 Princípios Básicos sobre o Uso da Força e Armas de Fogo (adotado pelo 8º Congresso das
Nações Unidas para a Prevenção do Crime e o Tratamento dos Delinquentes, em Havana, Cuba, de 27 de
agosto a 07 de setembro de 1990). 11 Lei nº 13.060, de 22 de dezembro de 2014 - Disciplina o uso dos
instrumentos de menor potencial ofensivo pelos agentes de segurança pública, em todo o território
nacional. 12 Decreto nº 12.341, de 23 de dezembro de 2024 - Regulamenta a Lei nº 13.060, de 22 de
dezembro de 2014, para disciplinar o uso da força e dos instrumentos de menor potencial ofensivo pelos
profissionais de segurança pública.
RACIOCÍNIO LÓGICO: 1 Estruturas lógicas. 2 Lógica de argumentação analogias, inferências, deduções e
conclusões. 3 Lógica sentencial (ou proposicional). 3.1 Proposições simples e compostas. 3.2 Tabelas
verdade. 3.3 Equivalências. 3.4 Leis de Morgan. 3.5 Diagramas lógicos. 4 Lógica de primeira ordem. 5
Princípios de contagem e probabilidade. 6 Operações com conjuntos. 7 Raciocínio lógico envolvendo
problemas aritméticos, geométricos e matriciais.
GENÉTICA FORENSE: 1 Fundamentos Teóricos e Conceituais. 1.1 Biologia dos tecidos e das células. 1.1.1 Conceitos básicos da
célula e dos tecidos animais e vegetais. 1.1.2 Química célula. 1.1.3 Biomoléculas estrutura e função.
1.1.4 Proteínas e enzimas. 1.1.5 Mecanismos de ação e cinética enzimática. 1.1.6 Inibição enzimática.
1.1.7 Função e interação dos componentes e revestimentos celulares. 1.1.8 Divisão celular mitose e
meiose. 1.2 Estrutura e Propriedades do DNA/RNA. 1.2.1 DNA e RNA Composição química, estrutura e
função dos ácidos nucléicos, replicação, transcrição, tradução, mutação, recombinação, regulação gênica
e reparo do DNA, propriedades físico-químicas (desnaturação, hibridização). 1.2.2 Genoma Humano
Organização cromossômica, estrutura dos genes, DNA nuclear, DNA mitocondrial. 1.2.3 Genoma Não
Humano Noções de genoma nuclear, mitocondrial e plastidial de espécies animais, vegetais e fúngicas.
1.3 Polimorfismos Genéticos e Herança. 1.3.1 STR (Short Tandem Repeats) Repetições curtas em tandem,
padrão de herança mendeliana - aplicações forenses. 1.3.2 SNP (Single Nucleotide Polymorphism)
Variações de base única, aplicações em ancestralidade, fenotipagem e outras. 1.3.3 Marcadores
Uniparentais Cromossomo Y (herança paterna) e DNA mitocondrial (herança materna). 1.3.4 Aplicações
forenses. 2 Metodologias e Técnicas em Genética Forense. 2.1 Vestígio Biológico. 2.2 Coleta de vestígio
biológico em local de crime. 2.3 Cadeia de Custódia de Vestígio Biológico. 2.4 Tipos de Amostras
biológicas. 2.4.1 Amostras questionadas. 2.4.2 Amostras de referência. 2.5 Testes diagnósticos para
sangue, sêmen e saliva. 2.6 Técnicas de Amostragem. 2.7 Técnicas de Extração e Purificação do DNA. 2.8
Quantificação do DNA em tempo real. 2.9 Técnica da PCR (reação em cadeia da polimerase). 2.10
Amplificação do DNA. 2.11 Eletroforese em placa e capilar. 2.12 Sequenciamento. 2.12.1 Método de
Sanger. 2.12.2 Sequenciamento massivo paralelo. 2.13 Tecnologias emergentes 2.13.1 DNA rápido.
2.13.2 Predição Fenotípica. 2.13.3 Genealogia Genética Forense. 3 Genética de Populações. 3.1 Estrutura
de populações. 3.2 Padrões de herança genética. 3.3 Estimativa de frequências alélicas e genotípicas. 3.4
Equilíbrio de Hardy-Weinberg e aplicações do Teorema de Hardy-Weinberg. 3.5 Parâmetros populacionais
(estatística de Wright). 3.6 Desequilíbrio de ligação. 3.7 Endogamia. 3.8 Gargalo genético. 3.9 Análise
filogenética. 3.10 Seleção natural, mutação, deriva, fluxo gênico. 3.11 Evolução molecular. 4 Estatística e
probabilidade aplicados à Genética Forense. 4.1 Teorema de Bayes. 4.2 Cálculo da razão de
verossimilhança (LR). 4.3 Avaliação estatística da evidência nos casos de coincidência de perfis genéticos.
4.4 Avaliação da evidência em Casos de Vínculos Genéticos. 5 Gestão da Qualidade. 5.1 Processo de
acreditação laboratorial. 5.2 Estrutura normativa aplicável à Genética Forense. 5.3 Norma ISO/IEC 17025
princípios e aplicações. 5.4 Requisitos técnicos para a realização de auditorias nos laboratórios e bancos
que compõem a Rede Integrada de Bancos de Perfis Genéticos (Resolução nº 12, de 01 de agosto de 2019
– Comitê Gestor da RIBPG). 5.5 Ensaios Interlaboratoriais. 5.6 Testes de Proficiência. 6 Bancos de Dados
de Perfis Genéticos. 6.1 Bases de funcionamento dos Bancos de Perfis Genéticos – BPGs. 6.2 Histórico dos
BPGs. 6.3 Rede Integrada de Bancos de Perfis Genéticos. 6.4 Legislação aplicada aos bancos de perfis
genéticos.
`,
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