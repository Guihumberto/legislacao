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
                            <v-btn class="mb-5" variant="flat" color="success" @click="selectItem('disciplina', disciplina)">Análise da Disciplina</v-btn>
                            <v-list density="compact">
                              <template v-for="(topico, topicoIndex) in disciplina.topicos" :key="topicoIndex">

                                <v-list-item
                                  @click="selectItem('topico', disciplina, topico)"
                                  link
                                  :title="topico.numero + ' ' + topico.conteudo"
                                  :class="topico.normas && topico.normas.length ? 'bg-light-blue-lighten-5' : ''"
                                >
                                </v-list-item>
                                
                                <v-list-item link
                                  @click="selectItem('subtopico', disciplina, topico, subtopico)"
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
                                    @click="selectItem('subsubtopico', disciplina, topico, subtopico, subSubtopico)"
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
    <div class="text-center pa-4">
    <v-dialog
      v-model="dialog"
      width="auto"
    >
      <v-card
        max-width="900"
        max-height="600"
        prepend-icon="mdi-text"
        text="faça pesquisa dos pontos relevantes."
        title="Copiar Prompt"
      >
        <v-card-text class="overflow-y-auto border mx-5" style="max-height: 400px;">
            <div>
                <p class="text-body-1 font-weight-light">{{ prompt }}</p>
            </div>
            
        </v-card-text>
      
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Fechar"
            @click="dialog = false"
          ></v-btn>
          <v-btn variant="text" @click="copiarPrompt" icon="mdi-content-copy"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
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
      inputContent: `DIREITO CONSTITUCIONAL: 1 Evolução constitucional brasileira. 1.1 Assembleia Nacional Constituinte:
antecedentes, convocação, natureza, composição. 1.2 Constituição de 1988: traços essenciais e trajetória. 1.3
Direito constitucional brasileiro e seus institutos: regime constitucional em vigor, legislação, doutrina e
jurisprudência constitucionais. 1.4 Direito constitucional estadual e distrital. 2 Constituição e ordem jurídica.
2.1 Constituição: conceito, sentidos, classificações, características. 2.2 Constituição federal, constituições
estaduais, Lei Orgânica do Distrito Federal e leis orgânicas municipais: características, força normativa, posição
na ordem jurídica interna, relações entre si e com as demais fontes normativas. 2.3 Supremacia constitucional.
2.4 Rigidez constitucional. 3 Normatividade constitucional. 3.1 Normas constitucionais: conceito, espécies,
tipologias, vigência, eficácia, aplicabilidade, colisão. 3.2 Direito constitucional intertemporal: revogação,
recepção, repristinação, constitucionalização, desconstitucionalização. 3.3 Lacuna constitucional e sua
integração. 3.4 Hermenêutica e interpretação constitucional. 3.5 Fontes constitucionais. 3.6 Mutação
constitucional. 3.7 Disposições constitucionais gerais. 3.8 Ato das disposições constitucionais transitórias
(ADCT). 4 Formação e modificação da constituição. 4.1 Poder constituinte: conceito, modalidades, natureza,
titularidade, órgãos, características, limites, formas de expressão. 4.2 Emendas à constituição. 4.3 Revisão
constitucional. 4.4 Especificidades do poder constituinte estadual e distrital. 5 Princípios fundamentais da
ordem constitucional brasileira. 5.1 República, federação, democracia e Estado de direito: caráter
estruturante e normas decorrentes. 5.2 Fundamentos e objetivos da República Federativa do Brasil e
princípios regentes nas suas relações internacionais. 6 Direitos, deveres e garantias fundamentais. 6.1 Teoria
geral e seu regime constitucional em espécie. 6.2 Ações constitucionais. 6.3 Tratados e convenções
internacionais sobre direitos humanos em que a República Federativa do Brasil seja parte e suas repercussões
sobre a ordem jurídica brasileira. 6.4 Responsabilidade internacional do Estado brasileiro e das unidades
subnacionais por violações a direitos humanos. 6.5 Controle de convencionalidade. 7 Organização do Estado.
7.1 Organização político-administrativa da República Federativa do Brasil. 7.2 Forma federativa de Estado:
projeções constitucionais. 7.3 União, estados federados, municípios, Distrito Federal e territórios. 7.4
Intervenção federal e estadual. 7.5 Administração pública: disposições gerais. 7.6 Servidores públicos. 7.7
Militares dos estados, do Distrito Federal e dos territórios. 7.8 Regiões. 8 Organização dos poderes. 8.1
Separação dos poderes: projeções constitucionais. 8.2 Poderes Legislativo, Executivo e Judiciário. 8.3
Tribunais de Contas. 9 Poder Legislativo. 9.1 Congresso Nacional, assembleias legislativas, Câmara Legislativa
Distrital e câmaras municipais: regime constitucional quanto a funções, atribuições, composição,
funcionamento, estrutura, comissões, membros e seus estatutos funcionais. 9.2 Fiscalização contábil,
financeira e orçamentária. 9.3 Tribunais de contas da União, dos estados e do Distrito Federal. 9.4 Tribunais e
conselhos de contas dos municípios. 10 Poder Executivo. 10.1 Presidente da República, governadores dos
estados e do Distrito Federal, prefeitos municipais, respectivos vices: regime constitucional quanto a eleições,
mandato, posse, substituição, sucessão, atribuições, remuneração, limitações, garantias, responsabilidades,
auxiliares e órgãos de consulta. 11 Poder Judiciário. 11.1 Disposições gerais. 11.2 Supremo Tribunal Federal e
Superior Tribunal de Justiça. 11.3 Justiça Federal, do Trabalho, Eleitoral e Militar. 11.4 Justiça dos estados e do
Distrito Federal. 11.5 Conselho Nacional de Justiça. 12 Funções essenciais à justiça. 12.1 Ministério Público.
12.2 Advocacia pública. 12.3 Advocacia privada. 12.4 Defensoria Pública. 12.5 Conselho Nacional do
Ministério Público. 13 Processo legislativo. 13.1 Processo legislativo federal: conceito, espécies normativas,
modalidades, fases. 13.2 Processo legislativo estadual, distrital e municipal: normas constitucionais federais
aplicáveis. 13.3 Elaboração, redação, alteração e consolidação das leis e atos normativos federais e estaduais.
14 Controle de constitucionalidade. 14.1 Controle judicial de constitucionalidade: conceito, histórico,
sistemas, pressupostos, modalidades, órgãos competentes, sujeitos legitimados, objetos de controle, tipos de
inconstitucionalidade, parâmetros de controle, formalidades, procedimentos, julgamentos, decisões, efeitos
das decisões, técnicas de decisão, segurança e estabilidade das decisões. 14.2 Ação direta de
inconstitucionalidade por ação e por omissão. 14.3 Ação declaratória de constitucionalidade. 14.4 Arguição
de descumprimento de preceito fundamental. 14.5 Representação interventiva. 14.6 Incidente de arguição
de inconstitucionalidade. 14.7 Recurso extraordinário. 14.8 Súmula vinculante. 14.9 Reclamação
constitucional. 14.10 Controle de constitucionalidade nos estados e no Distrito Federal. 15 Controle não
judicial de constitucionalidade: órgãos, institutos e procedimentos. 16 Defesa do Estado e das instituições
democráticas. 16.1 Estado de defesa e estado de sítio. 16.2 Forças armadas. 16.3 Segurança pública. 17 Ordem
econômica e financeira. 17.1 Princípios gerais da atividade econômica. 17.2 Política urbana, agrícola e
fundiária. 17.3 Reforma agrária. 17.4 Sistema financeiro nacional. 18 Ordem social. 18.1 Seguridade social.
18.2 Saúde, previdência social e assistência social. 18.3 Educação, cultura e desporto. 18.4 Ciência e
tecnologia. 18.5 Comunicação social. 18.6 Meio ambiente. 18.7 Família, criança, adolescente, jovem e pessoa
idosa. 18.8 Povos indígenas. 19 Direito à saúde. 19.1 Sistema Único de Saúde: princípios e diretrizes. 19.2
Judicialização de políticas públicas de saúde. 19.3 Jurisprudência do STF em matéria de saúde pública. 20
Emendas constitucionais e emendas constitucionais de revisão em espécie. 21 Constituição do Estado do
Piauí.
DIREITO ADMINISTRATIVO: 1 Estado. 1.1 Funções. 1.2 Poderes. 1.3 Repartição das funções entre os poderes.
1.4 Federação. 1.5 Organização federativa e ordem administrativa. 2 Direito administrativo. 2.1 Conceito. 2.2
Origem. 2.3 Evolução histórica. 2.4 Fontes. 3 Administração pública. 3.1 Sentidos amplo e estrito, objetivo e
subjetivo. 3.2 Regime jurídico-administrativo. 3.3 Interesse público. 3.4 Interesses primários e secundários do
Estado. 3.5 Princípios da administração pública (explícitos e implícitos). 3.6 Acesso à informação (Lei Federal
nº 12.527/2011). 3.7 Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018). 4 Poderes da
administração pública. 4.1 Poder normativo. 4.1.1 Finalidade. 4.1.2 Limites. 4.1.3 Objeto. 4.2 Poder disciplinar.
4.2.1 Sindicância e processo administrativo disciplinar. 4.2.2 Lei complementar estadual nº 13/1994 (dispõe
sobre o estatuto dos servidores públicos civis do Piauí, das autarquias e das fundações públicas estaduais).
4.3 Poder de polícia. 4.3.1 Características. 4.3.2 Polícia administrativa e polícia judiciária. 5 Organização
administrativa. 5.1 Pessoas políticas e administrativas. 5.2 Desconcentração e descentralização. 5.3
Administração direta e indireta. 5.4 Órgãos e entidades estatais. 5.5 Autarquias. 5.6 Fundações estatais. 5.7
Empresas públicas e sociedades de economia mista (Lei federal nº 13.303/2016). 5.8 Agências reguladoras.
5.9 Agências executivas. 5.10 Entidades de fiscalização profissional. 6 Terceiro setor. 6.1 Serviços sociais
autônomos. 6.2 Entidades de apoio. 6.3 Organizações da sociedade civil de interesse público (OSCIP) e demais
organizações da sociedade civil (Lei Federal nº 13.019/2014). 7 Atos administrativos. 7.1 Elementos. 7.2
Pressupostos. 7.3 Atributos. 7.4 Classificação. 7.5 Vinculação e discricionariedade. 7.6 Espécies. 7.7 Perfeição,
validade e eficácia. 7.8 Extinção. 7.9 Anulação. 7.10 Revogação. 7.11 Convalidação. 8 Processo administrativo.
8.1 Princípios. 8.2 Fases. 8.3 Procedimentos em espécie. 8.4 Lei federal nº 9.784/1999. 9 Agentes públicos.
9.1 Cargos, empregos e funções públicas. 9.2 Provimento. 9.3 Vacância. 9.4 Servidores públicos. 9.5 Regime
jurídico-constitucional. 9.6 Direitos e vantagens. 9.7 Deveres, proibições e responsabilidades. 9.8 Regime
previdenciário. 10 Militares do estado. 10.1 Regime jurídico-constitucional. 10.2 Lei federal nº 13.954/2019.
11 Serviço público. 11.1 Conceito. 11.2 Distinção com outras atividades estatais. 11.3 Classificação. 11.4
Titularidade. 11.5 Princípios. 11.6 Remuneração. 11.7 Usuários. 11.8 Prestação direta e indireta. 11.9
Concessão, permissão e autorização. 11.10 Parcerias público-privadas. 11.11 Consórcios públicos (Lei federal
nº 11.107/2005). 12 Licitações e contratos administrativos: Lei nº 14.133/2021. 13 Noções de convênios e
instrumentos congêneres. 14 Intervenção do Estado no domínio econômico. 14.1 Ordem econômica. 14.2
Livre iniciativa. 14.3 Regulação estatal. 14.4 Repressão ao abuso do poder econômico. 14.5 Lei
nº 12.529/2011. 14.6 Exploração de atividade econômica pelo Estado: monopólio estatal e competição com
a iniciativa privada. 15 Intervenção do Estado no domínio social. 15.1 Ordem social. 15.2 Políticas públicas.
15.3 Serviços públicos sociais. 15.4 Atividades de fomento. 16 Intervenção do Estado na propriedade privada.
16.1 Requisição. 16.2 Ocupação temporária. 16.3 Servidão administrativa. 16.4 Tombamento. 16.5 Limitação
administrativa. 16.6 Desapropriação. 17 Controle da administração pública. 17.1 Controle interno e externo.
17.2 Controle pela própria administração pública. 17.3 Controle parlamentar. 17.4 Controle pelo tribunal de
contas. 17.5 Controle jurisdicional. 17.6 Prestação de contas. 17.7 Tomada de contas especial. 17.8 Lei
Orgânica do Tribunal de Contas da União. 17.9 Lei Complementar federal nº 101/2000. 17.10 Lei federal
nº 12.846/2013. 18 Lei complementar estadual nº 56/2005 (Lei Orgânica da Procuradoria Geral do Piauí). 19
Bens públicos. 19.1 Conceito e características gerais: definições, regime jurídico, espécies. 19.2 Classificação
dos bens públicos. 19.3 Regime jurídico dos bens públicos. 19.4 Afetação e desafetação. 19.5 Administração,
utilização e proteção: competências, permissões, concessões, autorizações. 19.6 Disposições legais e
jurisprudência aplicável. 20 Política Nacional de Regularização Fundiária Urbana (Lei Federal nº 13.465/2017
e Decreto Federal nº 9.310/2018). 21 Responsabilidade civil do Estado. 22 Atos de improbidade
administrativa: Lei nº 8.429/1992.
DIREITO CIVIL: 1 Lei de Introdução às Normas do Direito Brasileiro. 1.1 Vigência, aplicação, obrigatoriedade,
interpretação e integração das leis. 1.2 Aplicação das leis no tempo. 1.3 Aplicação das leis no espaço. 2 Pessoas
naturais. 2.1 Conceito. 2.2 Início da personalidade. 2.3 Personalidade. 2.4 Capacidade. 2.5 Direitos da
personalidade. 2.6 Nome civil. 2.7 Estado civil. 2.8 Domicílio. 2.9 Ausência. 3 Pessoas jurídicas. 3.1 Disposições
gerais. 3.2 Conceito e elementos caracterizadores. 3.3 Constituição. 3.4 Extinção. 3.5 Capacidade e direitos
da personalidade. 3.6 Domicílio. 3.7 Sociedades de fato. 3.8 Associações. 3.9 Fundações. 3.10 Grupos
despersonalizados. 3.11 Desconsideração da personalidade jurídica. 3.12 Responsabilidade da pessoa jurídica
e dos sócios. 4 Bens. 4.1 Diferentes classes. 4.2 Bens corpóreos e incorpóreos. 4.3 Bens no comércio e fora do
comércio. 5 Fato jurídico. 6 Negócio jurídico. 6.1 Disposições gerais. 6.2 Elementos. 6.3 Representação. 6.4
Condição, termo e encargo. 6.5 Defeitos do negócio jurídico. 6.6 Existência, eficácia, validade, invalidade e
nulidade do negócio jurídico. 6.7 Simulação. 7 Atos jurídicos lícitos e ilícitos. 8 Prescrição e decadência. 9
Prova do fato jurídico. 10 Obrigações. 10.1 Elementos. 10.2 Princípios. 10.3 Boa fé. 10.4 Obrigação complexa
(a obrigação como um processo). 10.5 Obrigações de dar. 10.6 Obrigações de fazer e de não fazer. 10.7
Obrigações alternativas e facultativas. 10.8 Obrigações divisíveis e indivisíveis. 10.9 Obrigações solidárias.
10.10 Obrigações civis e naturais, de meio, de resultado e de garantia. 10.11 Obrigações de execução
instantânea, diferida e continuada. 10.12 Obrigações puras e simples, condicionais, a termo e modais. 10.13
Obrigações líquidas e ilíquidas. 10.14 Obrigações principais e acessórias. 10.15 Transmissão das obrigações.
10.16 Adimplemento e extinção das obrigações. 10.17 Inadimplemento das obrigações. 11 Contratos. 11.1
Princípios. 11.2 Contratos em geral. 11.3 Disposições gerais. 11.4 Interpretação. 11.5 Extinção. 11.6 Espécies
de contratos regulados no Código Civil. 12 Atos unilaterais. 13 Responsabilidade civil. 14 Preferências e
privilégios creditórios. 15 Posse. 16 Direitos reais. 16.1 Disposições gerais. 16.2 Propriedade. 16.3 Superfície.
16.4 Servidões. 16.5 Usufruto. 16.6 Uso. 16.7 Habitação. 16.8 Direito do promitente comprador. 17 Direitos
reais de garantia. 17.1 Características. 17.2 Princípios. 17.3 Penhor, hipoteca e anticrese. 18 Direito das
sucessões. 18.1 Sucessão em geral. 18.2 Sucessão legítima. 18.3 Sucessão testamentária. 18.4 Inventário e
partilha. 19 Lei nº 6.766/1979 (parcelamento do solo urbano). 20 Lei nº 6.015/1973 (registros públicos). 20.1
Registros, presunção de fé pública, prioridade, especialidade, legalidade, continuidade, transcrição, inscrição
e averbação. 20.2 Procedimento de dúvida. 21 Lei nº 8.245/1991 (locação de imóveis urbanos). 21.1
Disposições gerais, locação em geral, sublocações, aluguel, deveres do locador e do locatário, direito de
preferência, benfeitorias, garantias locatícias, penalidades civis, nulidades, locação residencial, locação para
temporada, locação não residencial. 22 Direitos autorais.
DIREITO EMPRESARIAL: 1 Fundamentos do direito empresarial. 1.1 Origem e evolução histórica, autonomia,
fontes e características. 1.2 Teoria da empresa. 1.3 Empresário: conceito, caracterização, inscrição,
capacidade, empresário individual, pequeno empresário. 1.4 Lei Complementar nº 123/2006 (microempresa
e empresa de pequeno porte). 1.5 Prepostos do empresário. 1.6 Institutos complementares: nome
empresarial, estabelecimento empresarial, escrituração. 2 Registro de empresa. 2.1 Órgãos de registro de
empresa. 2.2 Atos de registro de empresa. 2.3 Processo decisório do registro de empresa. 2.4 Inatividade da
empresa. 2.5 Empresário irregular. 2.6 Lei nº 8.934/1994 (registro público de empresas mercantis e atividades
afins). 3 Propriedade industrial. 3.1 Lei nº 9.279/1996 (direitos e obrigações relativos à propriedade
industrial). 3.2 Instituto Nacional da Propriedade Industrial (INPI). 3.3 Propriedade industrial e direitos
autorais. 3.4 Patentes. 3.5 Desenho industrial. 3.6 Marca: espécies. 3.7 Procedimento de registro. 3.8
Indicações geográficas. 4 Direito societário. 4.1 Sociedade empresária: conceito, terminologia, ato
constitutivo. 4.2 Sociedades simples e empresárias. 4.3 Personalização da sociedade empresária. 4.4
Classificação das sociedades empresárias. 4.5 Sociedade irregular. 4.6 Teoria da desconsideração da
personalidade jurídica. 4.7 Desconsideração inversa. 4.8 Regime jurídico dos sócios. 4.9 Sociedade limitada.
4.10 Sociedade anônima. 4.11 Lei nº 6.404/1976 (sociedades por ações). 4.12 Sociedade em nome coletivo.
4.13 Sociedade em comandita simples. 4.14 Sociedade em comandita por ações. 4.15 Operações societárias:
transformação, incorporação, fusão e cisão. 4.16 Relações entre sociedades: coligações de sociedades, grupos
societários, consórcios, sociedade subsidiária integral, sociedade de propósito específico. 4.17 Dissolução,
liquidação e extinção das sociedades. 4.18 Concentração empresarial e defesa da livre concorrência. 5 Direito
falimentar. 5.1 Lei nº 11.101/2005 (recuperação judicial, extrajudicial e falência). 5.2 Recuperação judicial e
extrajudicial. 5.3 Aprovação do plano de recuperação judicial. 5.4 Classificação de créditos e tratamento
aplicável ao crédito tributário. 5.5 Principais atribuições da assembleia-geral de credores, do administrador
judicial e do comitê de credores. 5.6 Hipóteses de decretação de falência. 5.7 Efeitos da falência quanto à
pessoa do falido, quanto às obrigações do falido, quanto aos contratos e quanto aos bens do falido. 5.8
Arrecadação. 5.9 Ação de responsabilidade. 5.10 Pedido de restituição. 5.11 Embargos de terceiros. 5.12
Realização do ativo. 5.13 Pagamento do passivo. 5.14 Encerramento da falência e extinção das obrigações do
falido. 6 Contratos comerciais. 7 Comércio eletrônico.
DIREITO PROCESSUAL CIVIL: 1 Teoria Geral do Processo. Processo e Constituição. Normas fundamentais do
processo e aplicação das normas fundamentais. Fontes do Direito Processual. Direito processual
intertemporal. Sistema de Justiça Multiportas e os meios adequados de solução dos conflitos.
Desjudicialização e Fazenda Pública. Equivalentes jurisdicionais (Lei nº 13.140/2015 e Lei nº 9.307/96).
Arbitragem e Fazenda Pública. Mediação e conciliação no âmbito da Administração Pública. 2 Jurisdição e
Competência. Jurisdição contenciosa e voluntária. Limites da jurisdição nacional e cooperação internacional.
Competências previstas na Constituição Federal. Competência internacional. Homologação de sentença
estrangeira. Carta rogatória. Exequatur. Estrutura judiciária nacional. Órgãos da jurisdição. Competência:
conceito, critérios determinantes, competência interna e internacional, originária e recursal, absoluta e
relativa, modificações e perpetuação da jurisdição. Conexão e continência. Conflitos de competência e de
atribuições. Declaração e reconhecimento de incompetência. 3 Ação e Processo. Ação: conceito, natureza
jurídica, classificações, critérios identificadores, condições da ação, elementos da demanda, cumulação e
concurso de ações, ação declaratória incidental. Processo: noções gerais, relação jurídica processual e
pressupostos processuais. Espécies de processo e de procedimento. Objeto do processo, mérito, questões
preliminares e prejudiciais de mérito. Formação, suspensão e extinção do processo. Poderes, deveres,
faculdades e ônus processuais. 4 Sujeitos do Processo. Juiz: princípios, poderes, deveres, responsabilidade,
impedimentos e suspeições. Auxiliares da Justiça. Partes e procuradores: deveres, responsabilidades,
representação, substituição, sucessão processual. Honorários advocatícios, despesas e multas. Gratuidade
da Justiça. Capacidade processual, capacidade postulatória e legitimação. Ministério Público. Defensoria
Pública. Advocacia privada e pública. 5 Fazenda Pública em juízo. Conceito e características da Fazenda
Pública. Capacidade processual e capacidade postulatória. Prerrogativas processuais. Representação judicial
da Fazenda Pública. Regras processuais diferenciadas da Fazenda Pública. Lei nº 8.437/92. Lei nº 9.469/97.
Lei nº 9.492/97. Lei nº 9.494/97. Lei nº 9.703/98. Lei nº 10.522/2002. 6 Litisconsórcio e Intervenção de
Terceiros. Litisconsórcio: classificação e regime jurídico. Intervenção de terceiros. Distinções entre
intervenção voluntária, provocada e legal. Assistência. Denunciação da lide. Chamamento ao processo.
Incidente de desconsideração da personalidade jurídica. Amicus curiae. Intervenção anômala das pessoas
jurídicas de direito público (Lei nº 9.469/96). 7 Atos e fatos jurídicos processuais: conceito, espécies, atos do
juiz e das partes. Forma, tempo e lugar dos atos processuais. Negócios jurídicos processuais e protocolos
institucionais. Comunicação dos atos processuais. Modalidades de citação e intimação. Invalidades
processuais. Distribuição, registro, autuação e valor da causa. 8 Tutela provisória. Disposições Gerais.
Classificações: tutela de urgência (cautelar e antecipada) e tutela da evidência. Tutela provisória incidental e
antecedente. Requisitos para concessão da tutela provisória. Estabilização. Tutela provisória e Fazenda
Pública. Tutela provisória nos tribunais. Instrumentos de impugnação e revogação da tutela provisória.
Suspensão de segurança, de liminar e de sentença contrárias ao Poder Público. Cabimento e restrições à
concessão de tutela provisória contra a Fazenda Pública. 9 Processo de conhecimento. Procedimento
Comum. Disposições Gerais. Petição inicial. Improcedência liminar do pedido. Audiência de conciliação ou de
mediação. Respostas do réu. Contestação e reconvenção. Revelia: conceito, efeitos materiais e processuais,
e suas exceções. Revelia e a Fazenda Pública. Providências preliminares e saneamento. Do julgamento
conforme o estado do processo. Julgamento antecipado do mérito. Julgamento antecipado parcial do mérito.
Da audiência de instrução e julgamento. Alegações Finais. 10 Direito Probatório: princípios, ônus da prova,
poderes instrutórios do juiz, produção antecipada da prova, regras de experiência. Inversão do ônus da prova.
Meios de prova. Depoimento pessoal, ata notarial, prova documental, testemunhal, pericial, inspeção
judicial. Prova emprestada. Valoração da prova. 11 Sentença e Coisa julgada. Sentença conceito, requisitos,
capítulos, efeitos, publicação, intimação, correção e integração. Liquidação de sentença. Conceito, natureza,
modalidades e procedimento. Remessa necessária. Julgamento das ações relativas às obrigações de fazer, de
não fazer e de entregar coisa. Coisa julgada: conceito, coisa julgada formal, material, limites objetivos,
subjetivos e temporais. Meios de desconstituição da coisa julgada e relativização atípica da coisa julgada.
Coisa julgada e relações jurídicas de trato continuado. A coisa julgada e as demais estabilidades processuais.
12 Procedimentos especiais. Ação monitória, ação de consignação em pagamento, ação de exigir contas,
embargos de terceiro, oposição. Procedimentos de jurisdição voluntária no CPC. Disposições Gerais,
alienação judicial, abertura e cumprimento de testamento, codicilos, herança jacente, interdição. Inventário
e Partilha: modalidades judicial e extrajudicial. Usucapião extrajudicial. 13 Cumprimento da sentença.
Disposições gerais. Conceito e procedimento. Títulos executivos judiciais. Cumprimento definitivo ou
provisório. Cumprimento de obrigação de pagar quantia certa pela Fazenda Pública. Precatório e requisição
de pequeno valor: regime constitucional. Cumprimento da sentença que reconheça a exigibilidade de
obrigação de pagar quantia certa, fazer, não fazer ou entregar coisa. Meios de defesa. Impugnação ao
cumprimento de sentença. 14 Processo de execução. Execução em geral. Títulos executivos extrajudiciais.
Espécies de execução: obrigação de pagar quantia, de fazer, não fazer e entregar coisa. Execução contra a
Fazenda Pública. Embargos à execução e defesa do executado. Suspensão e extinção da execução. Medidas
executivas atípicas. Exceção de pré-executividade. Defesa heterotópica e meios de oposição à execução.
Responsabilidade patrimonial e fraudes patrimoniais. Remição. Execução fiscal. Defesa na execução fiscal.
Medida cautelar fiscal. Execução de decisões dos Tribunais de Contas. 15 Ordem dos processos e dos
processos de competência originária dos tribunais. Deliberação colegiada nos tribunais. Incidente de arguição
de inconstitucionalidade. Conflito de competência. Ação Rescisória. Reclamação. Julgamento ampliado no
colegiado. 16 Recursos e outros meios de impugnação de decisões judiciais. Espécies recursais no CPC. Agravo
interno, agravo de instrumento, apelação, embargos de declaração, recurso ordinário, embargos de
divergência, recurso especial, recurso extraordinário e agravo em recurso especial ou extraordinário. Juízo
de admissibilidade e juízo de mérito. Efeitos dos recursos. Fungibilidade. Preclusão. Repercussão Geral no
recurso extraordinário. Relevância da questão federal no recurso especial. Querela nullitatis insanabilis. 17
Sistema de precedentes. Microssistema de demandas repetitivas. Incidente de Resolução de Demandas
Repetitivas. Suspensão Nacional do Incidente de Resolução de Demandas Repetitivas. Recurso Especial
Repetitivo e Recurso Extraordinário Repetitivo. Incidente de assunção de competência. Precedentes em
controle concentrado de constitucionalidade. Súmula vinculante. Superação (overruling), distinção
(distinguishing), reescrita (overriding), sinalização (signaling) e demais técnicas. Ratio decidendi e obter
dictum. Modulação de efeitos. Sobrestamento e suspensão de processos. Coisa julgada e precedente. 18
Processo Coletivo. Conceito. Princípios. O microssistema processual coletivo. Ações coletivas: ação civil
pública, mandado de segurança coletivo, habeas data coletivo, mandado de injunção coletivo, ação popular,
ação de improbidade administrativa. Ação coletiva de rito comum. Procedimentos. Objeto e classificações.
Tutelas provisórias no processo coletivo. Autocomposição coletiva e compromisso de ajustamento de
conduta. Competência. Legitimação ordinária, extraordinária e autônoma. Pertinência temática.
Legitimidade passiva. Ação coletiva passiva. Representação e substituição processual. Causa de pedir e
pedido nas ações coletivas. Sentença genérica. Liquidação e execução, coletiva e individual. Coisa julgada.
Litispendência, conexão e continência. Intervenção de terceiros. 19 Processo estrutural. Conceito e
características. Fundamentos teóricos e finalidades. Judicialização de políticas públicas. Distinção entre
processo estrutural e tutela coletiva tradicional. Fases do processo estrutural. Diagnóstico, deliberação,
implementação e monitoramento Atuação colaborativa e diálogo institucional. Decisões progressivas,
modulação de efeitos e flexibilização procedimental. 20 Sistemas dos Juizados Especiais: Lei dos Juizados
Especiais Cíveis e Criminais (Lei nº 9.099/1995); Lei dos Juizados Especiais Federais (Lei nº 10.259/2001) e Lei
dos Juizados Especiais da Fazenda Pública (Lei nº 12.153/2009). 21 Ações constitucionais. Mandado de
segurança coletivo e individual (Lei nº 12.016/2009). Habeas data coletivo e individual (Lei nº 9.507/1997).
Mandado de injunção coletivo e individual (Lei nº 13.300/2016). Ações de controle concentrado de
constitucionalidade: ação direta de inconstitucionalidade, ação declaratória de constitucionalidade e ação
direta de inconstitucionalidade por omissão (Lei nº 9.868/1999); arguição de descumprimento de preceito
fundamental (Lei nº 9.882/1999). Objeto, legitimidade, procedimento e efeitos das decisões nas ações de
controle concentrado. Ação civil originária nos tribunais: hipóteses constitucionais e competência. 22
Aspectos Processuais da Lei de introdução às normas do Direito Brasileiro (Decreto-Lei nº 4.657/42) e da Lei
de liberdade econômica (Lei nº 13.874/2019). Análise econômica do processo civil. 23 Processo Tecnológico
e Virtualização da Justiça. Da prática eletrônica dos atos processuais. Lei nº 11.419/2006. Julgamentos
virtuais. Uso da inteligência artificial pelo Poder Judiciário. Transmissão ao vivo dos julgamentos pela TV ou
internet. Impacto das novas tecnologias no acesso à Justiça.
DIREITO AMBIENTAL: 1 Direito ambiental constitucional. 1.1 Meio ambiente como direito fundamental. 1.2
Princípios estruturantes do estado de direito ambiental. 1.3 Competências ambientais legislativa e material.
1.4 Deveres ambientais. 1.5 Instrumentos jurisdicionais. 1.5.1 Ação civil pública, ação penal pública, mandado
de segurança individual e coletivo, ação popular, mandado de injunção ambiental. 1.6 Função ambiental
pública e privada. 1.7 Função social da propriedade. 1.8 Art. 225 da Constituição Federal de 1988. 2 Meio
ambiente e seus aspectos. 2.1 Meio ambiente natural, artificial, cultural e do trabalho. 2.2 Recursos naturais
e meio ambiente como bens ambientais. 2.3 Biodiversidade e desenvolvimento sustentável. 2.4 Direitos
culturais. 3 Princípios de direito ambiental. 3.1 Prevenção, precaução, poluidor-pagador e usuário-pagador,
cooperação, informação, participação, equidade intergeracional. 3.2 Princípios da tutela do patrimônio
cultural. 3.2.1 Cooperação, solidariedade, participação e informação, preservação do sítio e proteção do
entorno, uso compatível com a natureza do bem, pró-monumento, valorização sustentável. 4 Política
Nacional de Meio Ambiente. 4.1 Objetivos. 4.2 Instrumentos de proteção (técnicos e econômicos). 4.3
SISNAMA: estrutura e funcionamento. 4.4 Lei nº 6.938/1981 e suas alterações. 4.5 Decreto nº 99.274/1990
e suas alterações. 4.6 Resolução do CONAMA nº 1/1986 e suas alterações (relatório de impacto ambiental —
EIA-RIMA). 4.7 Resolução do CONAMA nº 237/1997 (licenciamento ambiental). 5 Recursos hídricos. 5.1 Lei
nº 9.433/1997 e suas alterações (Política Nacional de Recursos Hídricos). 5.2 Resolução do CNRH nº 16/2001
e suas alterações. 5.3 Sistema Nacional de Gerenciamento de Recursos Hídricos (SINGREH). 6 Recursos
florestais. 6.1 Lei nº 12.651/2012 e suas alterações. 6.2 Lei nº 11.284/2006 (gestão de florestas públicas).
6.2.1 Gestão e concessão florestais. 7 Espaços territoriais especialmente protegidos. 7.1 Áreas de preservação
permanente e reserva legal. 7.2 Lei nº 9.985/2000 e suas alterações (SNUC). 7.2.1 Tipos de unidades,
objetivos e categorias. 8 Política urbana. 8.1 Diretrizes, instrumentos e competência. 8.2 Artigos 182 e 183
da Constituição Federal. 8.3 Lei nº 10.257/2001 e suas alterações. 9 Responsabilidades. 9.1 Efeito, impacto e
dano ambiental. 9.2 Poluição. 9.3 Responsabilidade administrativa, civil e penal. 9.4 Tutela processual. 9.4.1
STF, STJ e tribunais de justiça estaduais. 9.5 Crimes ambientais: espécies e sanções penais previstas. 9.6 Lei
nº 9.605/1998 e suas alterações. 9.7 Decreto nº 6.514/2008 e suas alterações. 9.8 Lei complementar
nº 140/2011. 9.9 Lei nº 11.405/2007 e Lei nº 12.305/2010. 10 Resolução do CONAMA nº 378/2006 e suas
alterações (empreendimentos potencialmente causadores de impacto ambiental nacional ou regional). 11
Lei nº 12.305/2010 e suas alterações (Política Nacional de Resíduos Sólidos). 12 Lei nº 11.445/2007 e suas
alterações (diretrizes nacionais para o saneamento básico). 13 Sustentabilidade.
DIREITO AGRÁRIO: 1 Direito agrário e política rural. 1.1 Teoria geral do direito agrário. 1.2 Formação histórica
do direito agrário no Brasil. 1.3 Histórico e situação da propriedade territorial rural no Brasil. 1.4 Política
agrária, política agrícola e política fundiária. 1.5 Direito de propriedade e função social da propriedade. 1.6
Atividade agrária e agrariedade. 1.7 Atividade extrativa. 1.8 Produção agrária e proteção ambiental. 1.9
Módulo rural e módulo fiscal. 2 Lei nº 4.504/1964 e suas alterações (Estatuto da Terra). 2.1 Normas gerais de
direito agrário. 2.2 Legislação e doutrina agrárias. 3 Programa Nacional de Reforma Agrária. 3.1 Lei
nº 8.629/1993 e suas alterações. 3.2 Terras devolutas. 3.2.1 Terras devolutas e terras públicas. 3.2.2
Destinação das terras devolutas. 3.2.3 Terras devolutas e o poder público. 3.2.4 Identificação das terras
devolutas. 3.3 Execução e administração da reforma agrária. 3.4 Desapropriação de terras para fins de
reforma agrária. 3.4.1 Leis Complementares nº 76/1993 e nº 88/1996. 3.4.2 Ação discriminatória. 3.4.3 Posse
agrária. 3.4.4 Posse agroecológica. 3.4.5 Ações possessórias. 3.4.6 Espécies de desapropriação. 3.4.7 Fases
da desapropriação. 3.4.8 Indenização. 3.5 Parcelamento e loteamento rural. 3.6 Registros públicos. 3.7 Títulos
da dívida agrária. 4 Bens públicos dominiais: alienação e concessão de terras públicas. 5 Regularização
dominial de terras rurais e de sua ocupação. 5.1 Discriminação administrativa e judicial de terras. 5.2
Arrecadação de imóvel abandonado. 5.3 Legitimação de posse. 5.4 Usucapião especial. 6 Aquisição ou
arrendamento de imóvel rural por pessoas físicas ou jurídicas estrangeiras e na faixa de fronteira. 7
Colonização oficial e particular. 7.1 Empresa rural. 7.1.1 Latifúndio. 7.1.2 Minifúndio. 7.2 Módulo e fração
mínima de parcelamento. 7.3 Indivisibilidade. 8 Sistema nacional de crédito rural. 8.1 Títulos de crédito rural.
9 Organização da vida rural. 9.1 Associativismo, cooperativismo e sindicalismo rural. 9.2 Política nacional de
cooperativismo. 10 Terras indígenas. 10.1 Regime das terras tradicionalmente ocupadas por povos indígenas.
10.2 Demarcação das terras das comunidades indígenas. 10.3 Política Nacional de Desenvolvimento
Sustentável dos Povos e Comunidades Tradicionais; territórios quilombolas. 11 Imóvel rural: conceito e
classificação. 12 Usucapião constitucional rural (art. 191 da Constituição Federal e Lei nº 6.969/1981 e suas
alterações). 13 Imposto territorial rural. 14 Contratos agrários. 15 Justiça agrária. 16 Conflitos agrários. 17
Combate à grilagem e redução de conflitos agrários; Ouvidoria Agrária Nacional; art. 126 da Constituição
Federal; varas especializadas com competência nas questões agrárias no estado do Piauí. 18 Regularização
fundiária no Estado do Piauí: Lei nº 7.294/2019 (dispõe sobre a política de regularização fundiária no Estado
do Piauí e revoga dispositivos da Lei nº 6.709/2015); Lei nº 8.153/2023 (dispõe sobre a Política Estadual de
Regularização Fundiária Urbana, altera a Lei nº 7.884/2022 e revoga dispositivos da Lei nº 7.294/2019).
DIREITO DO TRABALHO: 1 Fontes do direito do trabalho. 1.1 Hierarquia e aplicação das fontes. 1.2
Prevalência do negociado sobre o legislado. 2 Princípios do direito do trabalho. 2.1 Princípios gerais e
específicos. 2.2 Interpretação e aplicação das normas trabalhistas. 3 Relação de trabalho e de emprego. 3.1
Conceitos e distinções. 3.2 Elementos caracterizadores da relação de emprego. 4 Sujeitos da relação de
emprego. 4.1 Empregado: definição e características. 4.2 Empregador: conceito, grupo econômico e
responsabilidade solidária. 4.3 Administração pública como empregadora. 4.4 Contratação nula. 4.5
Terceirização de serviço público. 4.6 Responsabilidade da administração pública nos contratos de
terceirização e de empreitada. 5 Contrato de trabalho. 5.1 Definição, elementos e características. 5.2
Modalidades contratuais: prazo determinado, indeterminado, intermitente, teletrabalho e tempo parcial. 5.3
Contratos afins e distinções. 6 Remuneração e salário: 6.1 Conceitos e distinções. 6.2 Composição salarial:
adicionais, gratificações, prêmios e abonos. 6.3 Formas de remuneração e proteção ao salário. 6.4 Princípio
da igualdade salarial. 7 Duração do trabalho. 7.1 Jornada de trabalho: limites legais, flexibilizações e regimes
especiais (12 × 36, tempo parcial). 7.2 Horas extras, banco de horas e compensação de jornada. 7.3 Trabalho
noturno e em regime de revezamento. 8 Repousos e férias. 8.1 Intervalos intrajornada e interjornada. 8.2
Repouso semanal remunerado e feriados. 8.3 Férias: períodos aquisitivo e concessivo, fracionamento,
remuneração e abono. 9 Alteração do contrato de trabalho. 9.1 Alterações unilaterais e bilaterais. 9.2
Transferência de função e local de trabalho (jus variandi). 9.3 Promoção, rebaixamento e remoção. 10
Suspensão e interrupção do contrato de trabalho. 10.1 Causas, espécies e efeitos. 10.2 Suspensão para
inquérito e disciplinar. 10.3 Licenças e afastamentos. 11 Extinção do contrato de trabalho. 11.1 Modalidades
de rescisão: por iniciativa do empregador, do empregado, por acordo mútuo e outras. 11.2 Aviso prévio:
requisitos, prazos e indenização. 11.3 Justa causa: hipóteses e consequências. 11.4 Estabilidade e garantias
de emprego: gestante, dirigente sindical, acidente de trabalho e outras. 11.5 Fundo de garantia do tempo de
serviço (FGTS): depósitos, saques e hipóteses de movimentação. 12 Negociação coletiva. 12.1 Acordos e
convenções coletivas de trabalho: conceito, validade e eficácia. 12.2 Cláusulas obrigatórias e facultativas.
12.3 Conflitos entre normas coletivas e individuais. 13 Organização sindical. 13.1 Sindicatos: conceito,
funções e representatividade. 13.2 Contribuições sindicais: obrigatoriedade e facultatividade. 13.3 Liberdade
sindical e vedação de interferência estatal. 14 Direito de greve. 14.1 Conceito, fundamentos e limites. 14.2
Procedimentos legais para deflagração. 14.3 Efeitos da greve nas relações de trabalho.
DIREITO PROCESSUAL DO TRABALHO: 1 Princípios e singularidades do direito processual do trabalho 1.1
Conceito. 1.2 Autonomia. 1.3 Princípios gerais. 2 Organização judiciária do trabalho. 2.1 Justiça do Trabalho:
jurisdição e competência. 2.2 Varas do trabalho, tribunais regionais do trabalho e Tribunal Superior do
Trabalho. 2.3 Ministério Público do Trabalho. 2.4 Formas de atuação. 2.5 Inquérito civil e ação civil pública.
2.6 Termo de ajustamento de conduta. 2.7 Corregedoria. 2.8 Reclamação correicional. 3 Procedimentos nos
dissídios individuais. 3.1 Petição inicial: requisitos e indicação dos valores dos pedidos. 3.2 Jus postulandi. 3.3
Inquérito para apuração de falta grave. 3.4 Revelia e confissão. 3.5 Exceções. 3.6 Contestação. 3.7
Reconvenção. 3.8 Partes e procuradores. 3.9 Substituição processual na Justiça do Trabalho. 3.10 Audiência:
procedimentos e consequências da ausência das partes. 3.11 Conciliação. 3.12 Instrução e julgamento. 3.13
Homologações judiciais e extrajudiciais. 3.14 Sentenças líquidas e ilíquidas; impugnação. 4 Procedimentos
nos dissídios coletivos. 4.1 Instauração da instância. 4.2 Conciliação e julgamento. 4.3 Extensão das decisões
e revisão. 4.4 Ação de cumprimento. 5 Prescrição e decadência no direito do trabalho. 6 Provas no processo
do trabalho 6.1 Interrogatórios. 6.2 Confissão e consequências. 6.3 Documentos: oportunidade da juntada e
incidente de falsidade. 6.4 Prova técnica: perícias e honorários periciais. 6.5 Testemunhas: compromisso,
impedimentos e consequências. 6.6 Ônus da prova e sua distribuição. 7 Sentença 7.1 Sentença individual. 7.2
Sentença coletiva. 8 Recursos no processo do trabalho 8.1 Disposições gerais. 8.2 Efeitos suspensivo e
devolutivo. 8.3 Recursos no processo de conhecimento. 8.4 Recursos no processo de execução. 8.5
Honorários advocatícios sucumbenciais. 9 Nulidades dos atos processuais. 9.1 Noções gerais. 9.2 Preclusão.
9.3 Tipos. 9.4 Distinção entre preclusão, perempção, decadência e prescrição. 10 Processo de execução 10.1
Liquidação de sentença. 10.2 Modalidades da execução. 10.3 Embargos do executado. 10.4 Impugnação do
exequente. 10.5 Embargos de terceiro. 10.6 Penhora, avaliação, arrematação, adjudicação e remição. 10.7
Fraude à execução. 10.8 Execução das decisões proferidas contra pessoas jurídicas de direito público. 10.9
Precatórios e Requisições de pequeno valor. 10.10 Incidente de desconsideração da personalidade jurídica.
11 Ação rescisória na Justiça do Trabalho 11.1 Cabimento e juízo competente. 11.2 Hipóteses de
admissibilidade. 11.3 Prazo para propositura e início da contagem. 11.4 Procedimento e recurso. 12 Ações
civis admissíveis no processo trabalhista. 13 Tutela coletiva e difusa. 14 Acordos extrajudiciais 14.1
Homologação judicial de acordo extrajudicial. 14.2 Procedimento e efeitos. 15 Aplicação subsidiária do
Código de Processo Civil.
DIREITO TRIBUTÁRIO: 1 Sistema Tributário Nacional na Constituição Federal. 1.1 Limitações do poder de
tributar. 1.2 Princípios do direito tributário. 1.3 Repartição das receitas tributárias. 2 Tributo. 2.1 Conceito.
2.2 Natureza jurídica. 2.3 Espécies. 2.4 Imposto. 2.5 Taxa. 2.6 Contribuição de melhoria. 2.7 Empréstimo
compulsório. 2.8 Contribuições. 3 Competência tributária. 3.1 Classificação. 3.2 Exercício da competência
tributária. 3.3 Capacidade tributária ativa. 3.4 Imunidade tributária. 3.5 Distinção entre imunidade, isenção e
não incidência. 3.6 Imunidades em espécie. 3.7 Benefícios fiscais de ICMS, crédito fiscal. 4 Fontes do direito
tributário. 4.1 Constituição Federal. 4.2 Leis complementares. 4.3 Leis ordinárias e atos equivalentes. 4.4
Tratados internacionais. 4.5 Atos do Poder Executivo federal com força de lei material. 4.6 Atos exclusivos do
Poder Legislativo. 4.7 Convênios. 4.8 Decretos regulamentares. 4.9 Normas complementares. 5 Vigência,
aplicação, interpretação e integração da legislação tributária. 6 Obrigação tributária. 6.1 Definição e natureza
jurídica. 6.2 Obrigação principal e acessória. 6.3 Fato gerador. 6.4 Sujeito ativo. 6.5 Sujeito passivo. 6.6
Solidariedade. 6.7 Capacidade tributária. 6.8 Domicílio tributário. 6.9 Responsabilidade tributária. 6.10
Responsabilidade dos sucessores. 6.11 Responsabilidade de terceiros. 6.12 Responsabilidade por infrações.
6.13 Substituição tributária. 7 Crédito tributário. 7.1 Constituição do crédito tributário. 7.2 Lançamento. 7.3
Modalidades de lançamento. 7.4 Suspensão do crédito tributário. 7.5 Extinção do crédito tributário. 7.6
Exclusão do crédito tributário. 7.7 Garantias e privilégios do crédito tributário. 7.8 Prescrição e decadência. 8
Administração tributária. 8.1 Fiscalização. 8.2 Dívida ativa. 8.3 Certidões negativas. 9 Impostos da União. 10
Impostos dos estados e do Distrito Federal. 10.1 Imposto de transmissão causa mortis e doação de quaisquer
bens ou direitos (ITCD). 10.2 Imposto sobre operações relativas à circulação de mercadorias e sobre
prestações de serviços de transporte interestadual e intermunicipal e de comunicação (ICMS). 10.3 Imposto
sobre a propriedade de veículos automotores (IPVA). 10.4 Conselho Nacional de Política Fazendária
(CONFAZ). 11 Impostos dos municípios. 12 Legislação federal aplicada. 12.1 Lei nº 5.172/1966 (Sistema
Tributário Nacional e normas gerais de direito tributário). 12.2 Lei complementar nº 123/2006 (Estatuto
Nacional da Microempresa e da Empresa de Pequeno Porte). 12.3 Lei complementar nº 116/2003 (ISSQN).
12.4 Lei complementar nº 87/1996 e suas alterações (imposto dos estados e do Distrito Federal sobre
operações relativas à circulação de mercadorias e sobre prestações de serviços de transporte interestadual
e intermunicipal e de comunicação). 13 Ilícito tributário. 13.1 Ilícito administrativo tributário. 13.2 Ilícito penal
tributário. 13.3 Crimes contra a ordem tributária. 13.4 Lei nº 8.137/1990 (crimes contra a ordem tributária,
econômica e contra as relações de consumo). 14 Norma geral antielisão. 15 Processo administrativo
tributário. 15.1 Princípios. 15.2 Acepções e espécies. 15.3 Determinação e exigência do crédito tributário.
15.4 Representação fiscal para fins penais. 16 Processo judicial tributário. 16.1 Ação de execução fiscal. 16.2
Lei nº 6.830/1980 e suas alterações (execução fiscal). 16.3 Ação cautelar fiscal. 16.4 Ação declaratória da
inexistência de relação jurídico-tributária. 16.5 Ação anulatória de débito fiscal. 16.6 Mandado de segurança.
16.7 Ação de repetição de indébito. 16.8 Ação de consignação em pagamento. 16.9 Ações de controle de
constitucionalidade. 16.10 Ação civil pública. 17 Reforma tributária. 17.1 Emenda Constitucional
nº 132/2023. 17.2 Imposto sobre bens e serviços (IBS) e seu regime jurídico: fato gerador, base de cálculo,
sujeito passivo e alíquotas. 17.3 Contribuição sobre bens e serviços (CBS) e o seu regime jurídico: fato gerador,
base de cálculo, sujeito passivo e alíquotas. 17.4 Lei Complementar nº 214/2025.
DIREITO FINANCEIRO: 1 Direito financeiro. 1.1 Conceito e objeto. 1.2 Direito financeiro na Constituição
Federal de 1988. 2 Sistema Financeiro Nacional. 2.1 Lei nº 4.595/1964. 2.2 Lei nº 4.320/1964 (normas gerais
sobre direito financeiro). 2.3 Lei complementar nº 101/2000 (Lei de Responsabilidade Fiscal). 2.4 Lei
complementar nº 141/2012. 2.5 Estrutura do Sistema Financeiro Nacional. 3 Plano plurianual (PPA), lei de
diretrizes orçamentárias (LDO) e lei orçamentária anual (LOA). 3.1 Conceito de gestão fiscal responsável e
equilíbrio orçamentário. 3.2 Alternativas de financiamento da despesa pública. 3.3 Indicadores de solvência
do setor público. 3.4 Política monetária e fiscal. 3.5 Investimento público. 4 Receitas públicas. 4.1 Conceito e
classificação. 4.2 Alienação de bens. 4.3 Condições para renúncia de receitas. 4.4 Vinculação de receitas. 4.5
Fundos especiais de despesa e investimento. 4.6 receitas não-tributárias. 5 Limitação seletiva de gastos. 5.1
Transferências voluntárias. 5.2 Controle do endividamento. 5.3 Operações de crédito. 5.4 Prestação de
garantias. 5.5 Gestão patrimonial. 5.6 Modalidades de fiscalização. 6 Despesas públicas. 6.1 Conceito e
espécies. 6.2 Execução orçamentária e programação financeira. 6.3 Contingenciamento de dotações. 6.4
Sistemática de pagamento de precatórios. 6.5 Disciplina constitucional dos precatórios. 7 Crédito público:
conceito e classificação. 8 Fundos: instituição e funcionamento. 9 Dívida pública: conceito, evolução,
classificação, disciplina jurídica e processamento). 10 Cessão de direitos creditórios originados de créditos
tributários e não tributários dos entes da Federação. 11 Lei Complementar nº 208, de 2 de julho de 2024.
DIREITO ECONÔMICO: 1 Ordem constitucional econômica: princípios gerais da atividade econômica. 2
Ordem jurídico-econômica: conceito; ordem econômica e regime político. 3 Intervenção do Estado no
domínio econômico; intervenção no direito positivo brasileiro: planejamento, incentivo (fomento) e
regulação. 4 Serviços públicos; concessões: licitação, execução, intervenção e formas de extinção;
arbitragem em contratos de concessão; permissões; parcerias público-privadas (PPP): tipos, requisitos e
garantias; FGP: criação, organização, finalidade e extinção; autorizações vinculadas. 5 Agências reguladoras:
conceito, função regulatória, autonomias decisória e administrativa; atividade normativa das agências
reguladoras. 6 Exploração direta de atividade econômica pelo Estado; empresa pública e sociedade de
economia mista; participação minoritária do Estado em empresas privadas. 7 Defesa da concorrência;
Sistema Brasileiro de Defesa da Concorrência (Lei nº 12.529/2011): estrutura administrativa; funções
preventiva, repressiva e advocacia da concorrência; controle de concentração econômica (atos de
concentração); infrações à ordem econômica e contra a economia popular: inquérito e processo
administrativo de sanção. 8 Direito econômico e políticas públicas em saúde, educação e moradia. 9. Lei de
liberdade econômica (Lei nº 13.874/2019): princípios, garantia de livre iniciativa e análise de impacto
regulatório (AIR).
DIREITO PREVIDENCIÁRIO: 1 Seguridade social: origem e evolução legislativa no Brasil; conceito; organização
e princípios. 2 Emendas Constitucionais nº 20/1998, nº 41/2003, nº 47/2005, nº 70/2012, nº 88/2015 e
nº 103/2019. 3 Aplicação do direito previdenciário. 4 Custeio da seguridade social. 4.1 Sistema de
financiamento, contribuições, isenções, remissão e anistia. 4.2 Hipóteses de incidência de contribuição. 5
Regime geral da previdência social. 5.1 Beneficiários, benefícios e custeio. 5.2 Salário de contribuição:
conceito, parcelas integrantes e excluídas, limites mínimo e máximo; salário-base, enquadramento,
proporcionalidade e reajustamento. 5.3 Planos de benefícios da previdência social: espécies de benefícios e
prestações, disposições gerais e específicas, períodos de carência, salário de benefício, renda mensal do
benefício, reajustamento do valor do benefício. 6 Prescrição e decadência. 7 Regime próprio de previdência
social. 7.1 Beneficiários, benefícios e custeio. 7.2 Disciplina constitucional. 7.3 Normas gerais. 7.4 Lei
nº 9.717/1998 (dispõe sobre regras gerais para a organização e o funcionamento dos regimes próprios de
previdência social dos servidores públicos da União, dos estados, do Distrito Federal e dos municípios, dos
militares dos estados e do Distrito Federal) e suas alterações. 7.5 Lei nº 10.887/2004 (dispõe sobre a aplicação
de disposições da Emenda Constitucional nº 41/2003, altera dispositivos das Leis nº 9.717/1998,
nº 8.213/1991, nº 9.532/1997) e suas alterações. 7.6 Portaria MTP nº 1.467/2022 (disciplina os parâmetros
e as diretrizes gerais para organização e funcionamento dos regimes próprios de previdência social dos
servidores públicos da União, dos estados, do Distrito Federal e dos municípios, em cumprimento à Lei
nº 9.717/1998, aos arts. 1º e 2º da Lei nº 10.887/2004 e à Emenda Constitucional nº 103/2019) e suas
alterações. 8 Regime de previdência dos militares estaduais. 8.1 Normas gerais. 8.2 Art. 42 da Constituição
Federal de 1988. 8.3 Decreto-Lei nº 667/1969 (reorganiza as polícias militares e os corpos de bombeiros
militares dos estados, dos territórios e do Distrito Federal) e suas alterações. 9 Regime de previdência
complementar. 9.1 Previdência complementar do servidor público. 10 Tempo de contribuição para fins
previdenciários; regime de prova; contagem recíproca e compensação financeira. 11 Legislação acidentária.
11.1 Regulamento do seguro de acidentes do trabalho (urbano e rural). 11.2 Moléstia profissional.
LEGISLAÇÃO ESTADUAL: I CONSTITUIÇÃO DO ESTADO DO PIAUÍ. II LEI DE ORGANIZAÇÃO ADMINISTRATIVA
DO ESTADO DO PIAUÍ: 1 Lei nº 7.884/2022 e suas alterações. III LEGISLAÇÃO DOS SERVIDORES CIVIS DO
ESTADO DO PIAUÍ: 1 Lei Complementar nº 13/1994 e suas alterações. 2 Lei nº 5.309/2003 (dispõe sobre a
contratação por tempo determinado no serviço para atender a necessidade temporária de excepcional
interesse público na administração estadual direta, nas autarquias e fundações públicas, sob o regime de
direito administrativo, nos termos do artigo 37, inciso IX, da Constituição Federal) e suas alterações. IV
LEGISLAÇÃO DA PROCURADORIA-GERAL DO ESTADO: 1 Lei Complementar nº 56/2005 (institui a Lei
Orgânica da Procuradoria Geral do Estado do Piauí) e suas alterações. 2 Resolução CSPGE nº 1/2024
(Regimento Interno da Procuradoria-Geral do Estado do Piauí). 3 Decreto nº 19.980/2021 (dispõe sobre a
regulamentação da Câmara de Prevenção e Resolução de Conflitos Administrativos no Âmbito da
Procuradoria Geral do Estado do Piauí – CEMAPI). V LEGISLAÇÃO TRIBUTÁRIA ESTADUAL: 1 Lei
nº 4.257/1989 (disciplina a cobrança do imposto sobre circulação de mercadorias e prestação de serviços de
transporte interestadual e intermunicipal e de comunicação). 2 Lei nº 4.261/1989 (disciplina a cobrança do
imposto sobre transmissão causa mortis e doação de quaisquer bens ou direitos). 3 Lei nº 4.548/1992
(disciplina a cobrança do imposto sobre a propriedade de veículos automotores). 4 Lei nº 6.949/2017 (regula
o processo administrativo tributário, dispõe sobre a estrutura, organização e competência do contencioso
administrativo no âmbito da Secretaria da Fazenda do Estado do Piauí, disciplina a consulta à legislação
tributária e o pedido de restituição de tributos pagos indevidamente.). 5 Lei Complementar nº 130/2009
(dispõe sobre extinção, por transação judicial, de créditos tributários objetos de execução fiscal movida pelo
estado do Piauí). VI LEGISLAÇÃO SOBRE O PATRIMÔNIO IMOBILIÁRIO ESTADUAL E SOBRE REGULARIZAÇÃO
FUNDIÁRIA NO ESTADO DO PIAUÍ: 1 Lei Complementar nº 244/2019 (dispõe sobre o reconhecimento de
domínio previsto no art. 7º, parágrafo único, do ADCT da Constituição do Estado do Piauí); 2 Lei nº 7.294/2019
(dispõe sobre a política de regularização fundiária no estado do Piauí e revoga dispositivos da Lei
nº 6.709/2015); 3 Lei nº 8.153/2023 (dispõe sobre a Política Estadual de Regularização Fundiária Urbana,
altera a Lei nº 7.884/2022 e revoga dispositivos da Lei nº 7.294/2019). VII LEGISLAÇÃO PREVIDENCIÁRIA
ESTADUAL: 1 Emenda Constitucional nº 54/2019 (altera a disciplina do regime próprio de previdência social
no âmbito do Estado do Piauí, prevê regras de transição, disposições transitórias). 2 Capítulo IX do Título III
da Lei Complementar estadual nº 13/1994 (dispõe sobre o Estatuto dos Servidores Públicos Civis do Estado
do Piauí, das autarquias e das fundações públicas estaduais) e suas alterações.
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
        concurso: 'Procuradoria Geral do Estado do Piaui - PGE PI',
        describe: ''
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
    processContent() {
      if (!this.inputContent) return;
      
      // Reset do array de disciplinas
      this.disciplinas = [];
     
      const quebra2 = new RegExp('(?<!\\d)([.:])\\s+', 'g');
      this.inputContent = this.limparTexto(this.inputContent.replace(/\n+/g, ' '));
      this.inputContent = this.inputContent.replace(quebra2, '$1\n')

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
      const normasRegex = /\(?\b(?:Lei(?:s)?(?:\s+Complementar(?:es)?)?|Decreto|Resolução|Emenda Constitucional)(?:\s+(?:federal|estadual|do|da|CSPGE))?\s+n[º°\.]?\s*\d+(?:\.\d+)?\/\d{4}\b\)?/gi;

      
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