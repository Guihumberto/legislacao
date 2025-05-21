<template>
   <section>
         <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
          <v-btn prepend-icon="mdi-arrow-left" variant="text" @click="$router.push('/homepainel')">Voltar</v-btn>
          <v-container>
            <h1 class="text-h5 mt-5" v-if="$route.query.concurso != 'undefined'">{{ $route.query.concurso }}</h1>
            <h2 class="text-h6 mb-5" v-if="$route.query.concurso != 'undefined'">{{ route.query.cargo }}</h2>
            <v-alert type="info" text="Não há conteúdo a ser selecionado" v-if="$route.query.concurso == 'undefined' && !conteudoStore.getLoading"></v-alert>
            <div v-if="conteudoStore.getLoading">Carregando...</div>
            <v-row>  
              <v-col cols="12" v-if="!conteudoStore.getLoading && conteudoStore.getConteudoEdital.length > 0">
                <v-card>
                  <v-card-title class="d-flex align-center">
                    Conteúdo Verticalizado
                    <v-spacer></v-spacer>
                    <v-btn-toggle v-model="viewMode" mandatory class="mr-2">
                      <v-btn value="full">
                        <v-icon>mdi-format-list-bulleted</v-icon>
                        <span class="d-none d-sm-inline ml-1">Completo</span>
                      </v-btn>
                      <v-btn value="normas">
                        <v-icon>mdi-gavel</v-icon>
                        <span class="d-none d-sm-inline ml-1">Normas</span>
                      </v-btn>
                    </v-btn-toggle>
                    <v-btn v-if="importSuccess" color="success" append-icon="mdi-login-variant" @click="$router.push('/areauser')">acessar</v-btn>
                    <v-btn v-else @click="importar" color="primary" :disabled="load" :loading="load">
                      <v-icon>mdi-import</v-icon>
                      <span class="d-none d-sm-inline ml-1">IMPORTAR</span>
                    </v-btn>
                  </v-card-title>
                  
                  <v-card-text>
                    <!-- Exibição do conteúdo completo -->
                    <div v-if="viewMode === 'full'">
                      <v-expansion-panels>
                        <v-expansion-panel
                          v-for="(disciplina, disciplinaIndex) in conteudoStore.getConteudoEdital"
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
                      <v-list lines="two" >
                        <template v-for="(disciplina, disciplinaIndex) in conteudoStore.getConteudoEdital" :key="disciplinaIndex">
                          <v-list-subheader class="text-h6 text-black"> <v-icon>mdi-arrow-right</v-icon> {{ disciplina.disciplina }}</v-list-subheader>   
                          <template v-for="(topico, topicoIndex) in disciplina.topicos" :key="topicoIndex">
                            <template v-if="topico.normas && topico.normas.length > 0">
                              <v-list-item
                                v-for="(norma, normaIndex) in topico.normas"
                                 prepend-icon="mdi-book"
                                :key="`t-${topicoIndex}-${normaIndex}`"
                                :title="norma"
                                :subtitle="`Tópico ${topico.numero} ${topico.conteudo}`"
                                class="ml-5"
                              ></v-list-item>
                            </template>
                            
                            <template v-for="(subtopico, subtopicoIndex) in topico.subtopicos" :key="subtopicoIndex">
                              <template v-if="subtopico.normas && subtopico.normas.length > 0">
                                <v-list-item
                                  v-for="(norma, normaIndex) in subtopico.normas"
                                  prepend-icon="mdi-book"
                                  :key="`st-${topicoIndex}-${subtopicoIndex}-${normaIndex}`"
                                  :title="norma"
                                  :subtitle="`Subtópico ${subtopico.numero} ${subtopico.conteudo}`"
                                   class="ml-5"
                                ></v-list-item>
                              </template>
                              
                              <template v-for="(subSubtopico, subSubtopicoIndex) in subtopico.subtopicos" :key="subSubtopicoIndex">
                                <template v-if="subSubtopico.normas && subSubtopico.normas.length > 0">
                                  <v-list-item
                                    v-for="(norma, normaIndex) in subSubtopico.normas"
                                     prepend-icon="mdi-book"
                                    :key="`sst-${topicoIndex}-${subtopicoIndex}-${subSubtopicoIndex}-${normaIndex}`"
                                    :title="norma"
                                    :subtitle="`Sub-subtópico ${subSubtopico.numero} ${subSubtopico.conteudo}`"
                                     class="ml-5"
                                  ></v-list-item>
                                </template>
                              </template>
                            </template>
                          </template>
                        </template>
                      </v-list>
                    </div>

                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </div>
   </section>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';

  import ActionsPrompt from '@/components/painel/concurso/actionsPrompt.vue';

  import { useConteudoEditalStore } from '@/store/concursos/ConteudoEditalStore';
  import { useGeralStore } from '@/store/GeralStore';
  import { useRoute } from 'vue-router';
  
  const conteudoStore = useConteudoEditalStore()
  const geralStore = useGeralStore()
  const route = useRoute()
  const id_concurso = route.params.id

  const viewMode = ref('full')
  const load = ref(false)
  const importSuccess = ref(false)

  const importar = async () => {
    load.value = true;
    const resp = await conteudoStore.importConteudoEditalUser(id_concurso)
    if(resp) importSuccess.value = true;
    load.value = false;
  }

  const selectItem = (item) => {
    load.value = true;
    console.log('item', item);  
    load.value = false
  }

  onMounted(async () => {
    await conteudoStore.getConteudo(id_concurso);
    conteudoStore.getEdital(id_concurso)
  });


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