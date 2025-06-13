<template>
   <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <div ref="leftPanel" class="panel left-panel" :style="{ width: leftWidth + 'px' }">
                <div class="panel-content">
                    <div>
                            <div class="d-flex align-center justify-space-between mb-5">
                                <v-btn @click="$router.push('/areauser')" variant="text" prepend-icon="mdi-arrow-left">Voltar</v-btn>
                                <h1 class="text-h5 d-flex align-center"> <v-icon color="#030131" size="1.7rem" class="mr-1">mdi-school</v-icon>Concurso</h1>
                                <Details :concurso="edital" />
                            </div>
                            <v-divider class="my-5"></v-divider>
                            <div class="border rounded-lg pa-5 mb-5" style="max-width: 1050px; margin: auto;">
                                <div class="mb-5 d-flex justify-space-between align-center" v-if="!load">
                                    <div>
                                        <h1 class="text-h6">{{ $route.query.cargo }}</h1>
                                        <p>{{ $route.query.concurso }}</p>
                                    </div>
                                    <v-btn 
                                        variant="text" @click="sidebar = !sidebar" 
                                        :icon="sidebar ? 'mdi-arrow-left-bold-box-outline': 'mdi-arrow-right-bold-box-outline'"></v-btn>
                                </div>
                                <div v-else>Carregando....</div>
                                <div v-if="!load">
                                    <v-row v-if="conteudoStore.readConteudoEditalUser.length">
                                        <v-col cols="12" v-if="conteudoStore.readConteudoEditalUser.length > 0">
                                            <v-card color="#ECEFF1" variant="flat" class="border mb-5 pb-5">        
                                                <v-card-title class="d-flex align-center">
                                                    <span v-if="leftWidth > 600">Conteúdo Verticalizado</span>
                                                    <v-spacer></v-spacer>
                                                    <v-btn-toggle v-model="viewMode" mandatory class="mr-2" color="primary" density="compact">
                                                        <v-btn value="full">
                                                            <v-icon>mdi-format-list-bulleted</v-icon>
                                                            <span class="d-none d-sm-inline ml-1">Completo</span>
                                                        </v-btn>
                                                        <v-btn value="normas">
                                                            <v-icon>mdi-gavel</v-icon>
                                                            <span class="d-none d-sm-inline ml-1">Normas</span>
                                                        </v-btn>
                                                    </v-btn-toggle>
                                                </v-card-title>
                                            <v-card-text class="content">
                                                <!-- Exibição do conteúdo completo -->
                                                <div v-if="viewMode === 'full'">
                                                    <v-expansion-panels>
                                                        <v-expansion-panel
                                                            v-for="(disciplina, disciplinaIndex) in conteudoList"
                                                            :key="disciplinaIndex"
                                                        >
                                                            <DisciplinaItem 
                                                                @envSelectItem="selectItem"
                                                                @envSelecDisci="selectActionsDisciplina"
                                                                :disciplinaItem="disciplina" :disciplinaIndex="disciplinaIndex" :filter="filter" />
                                                        </v-expansion-panel>
                                                    </v-expansion-panels>
                                                </div>
                
                                                <!-- Exibição apenas das normas -->
                                                <div v-else-if="viewMode === 'normas'">
                                                    <Link_normas 
                                                        :disciplinas="conteudoStore.readConteudoEditalUser"
                                                        @normaClicada="handleNormaClicada"
                                                    />
                                                </div>
                
                                            </v-card-text>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                    <v-alert v-else variant="outlined" type="info" text="Você ainda não adicionou um edital."></v-alert>
                                </div>
                            </div>
                            <ActionsPrompt :prompt="prompt" />
                    </div>
                </div>
            </div>
            <!-- barra ed ajuste -->
            <div 
                v-if="sidebar"
                ref="divider" 
                class="panel-divider"
                @mousedown="startResize"
                @touchstart="startResize"
                @mouseover="onDividerHover"
                @mouseleave="onDividerLeave"
                >
                <v-icon
                    :color="isDragging || isHovering ? 'primary' : 'grey'"
                    icon="mdi-drag-vertical"
                ></v-icon>
            </div>
            <!-- menu de opcoes -->
            <Transition name="fade">
                <div ref="rightPanel" class="panel right-panel overflow-y-auto" :style="{ width: rightWidth + 'px' }" v-show="sidebar">
                    <div class="panel-content">
                        <v-card-text class="text-center">
                            <Home />
                            <div>
                                <AssuntosRelevantes v-if="options === '1'" :select="selectDisciplina" :usermaster="userMaster"/>
                                <Guia 
                                    @clearDisciplina="clearDisciplina"
                                    v-if="options === '3'" :selectDisciplina="selectDisciplina" :selected="topicoSelected" :usermaster="userMaster" :prompt="prompt" />
                            </div>
                        </v-card-text>
                    </div>
                </div>
            </Transition>
        </div>
   </section>
   <!-- Dialog para mostrar a legislação -->
    <v-dialog v-model="dialogLegislacao" max-width="800">
      <v-card v-if="legislacaoSelecionada">
        <v-card-title  class="bg-primary d-flex align-center justify-space-between">
          <span class="text-h6">{{ legislacaoSelecionada.title }}</span>
          <v-btn variant="text" icon @click="dialogLegislacao = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text>
          <div class="mb-4">
            <div v-if="existForum(legislacaoSelecionada.id)" class="border rounded-lg pa-4 d-flex align-center justify-space-between bg-purple-lighten-5">
              <p class="mb-2">Você possui essa lei adicionada em seu forum.</p>
              <v-btn variant="flat" color="deep-purple-darken-1" @click="$router.push(`/avancado/forumlaw/${existForum(legislacaoSelecionada.id)}?det=false`)">Ir para o forum</v-btn>
            </div>
            <v-btn v-else variant="flat" color="success" @click="$router.push(`/avancado/${legislacaoSelecionada.id}`)">Ir para norma</v-btn>
          </div>
          <div class="mb-4">
            <strong>Tipo:</strong> {{ legislacaoSelecionada.tipo }}
          </div>
          <div class="mb-4">
            <strong>Número:</strong> {{ legislacaoSelecionada.title }}
          </div>
          <div class="mb-4">
            <strong>Ano:</strong> {{ legislacaoSelecionada.ano }}
          </div>
          <div class="mb-4" v-if="legislacaoSelecionada.description_norm">
            <strong>Ementa:</strong> {{ legislacaoSelecionada.description_norm }}
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
    import { onMounted, ref, computed, provide, onUnmounted, watch } from 'vue';

    import Home from '@/components/painel/options/home.vue';
    import ActionsPrompt from '@/components/painel/concurso/actionsPrompt.vue';
    import AssuntosRelevantes from '@/components/painel/options/assuntosRelevantes.vue';
    import Guia from '@/components/painel/options/guia.vue';
    import Details from '@/components/painel/details.vue';
    import DisciplinaItem from '@/components/painel/concurso/disciplinaItem.vue';
    import Link_normas from '@/components/painel/admin/cargoEditar/link_normas.vue';

    import { useGeralStore } from '@/store/GeralStore';
    import { useConteudoEditalStore } from '@/store/concursos/ConteudoEditalStore';
    import { useRevisaoStore } from '@/store/concursos/EditalRevisao';
    import { useRoute } from 'vue-router';
    import { useOptionsStore } from '@/store/concursos/OptionsStore';
    import { useForumStore } from '@/store/ForumStore';

    const forumStore = useForumStore()
    const optionStore = useOptionsStore()
    const route = useRoute()
    const geralStore = useGeralStore()
    const conteudoStore = useConteudoEditalStore()
    const revisaoStore = useRevisaoStore()

    const id = route.params.id
    const load = ref(false)
    const viewMode = ref('full')

    const prompt = ref(null)
    const dialog = ref(false)
    const sidebar = ref(false)
    const options = ref('1')
    const selectDisciplina = ref(null)

    const selectActionsDisciplina = (item) => {
        selectDisciplina.value = {
            id_concurso: item.id_concurso,
            disciplina: item.disciplina
        }
        sidebar.value = true
        topicoSelected.value = { id: null}
    }

    const clearDisciplina = () => {
        selectDisciplina.value = {
            id_concurso: '',
            disciplina: ''
        }
    }

    provide('dialog', dialog)
    provide('options', options)

    const textoInit = ref(null)

    const edital = computed(() => {
        return conteudoStore.readEditalUser
    })

    const filter = ref({
        relevante: false
    })

    const conteudoList = computed(() => {
        const list = conteudoStore.readConteudoEditalUser

        if(topRelevantes.value?.top_relevante?.length){
            let find = list.find(item => item.disciplina == topRelevantes.value.disciplina)
            if(find) find.top_relevante = topRelevantes.value.top_relevante.map(Number);
        }

        if (filter.value.relevante && topRelevantes.value?.top_relevante?.length) {

            const ordem = new Map(topRelevantes.value?.top_relevante.map(Number).map((num, index) => [num, index]));
       
            return list.map(item => {
                if (item.disciplina === topRelevantes.value.disciplina) {
                    const findDisciplina = {
                        ...item,
                        topicos: item.topicos.filter(topico =>
                            topRelevantes.value.top_relevante.includes(topico.numero)
                        ),
                        top_relevante: topRelevantes.value.top_relevante,
                    }
              
                    findDisciplina.topicos = [...findDisciplina.topicos].sort((a, b) => {
                        return (ordem.get(Number(a.numero)) ?? Infinity) - (ordem.get(Number(b.numero)) ?? Infinity);
                    });

                    return findDisciplina;

                }
                return item
            })
        }

        return list
    })

    const topRelevantes = computed(() => {
        const list = revisaoStore.readRevisao
        return list
    })

    const topicoSelected = ref({ id: null })

    const setTopicoSelected = (local, item, topico) => {
        const { disciplina, banca, id, id_concurso, id_edital, top_relevante } = item
        topicoSelected.value = {
            disciplina, 
            banca, 
            id, 
            id_concurso,
            id_edital, 
            top_relevante,
            ...topico
        } 
        sidebar.value = true
        options.value = '3'
    }

    const selectItem = (local, disciplina = null, topico = null, subtopico = null, subsubtopico = null) => {
      setTopicoSelected(local, disciplina, topico)
      prompt.value = null
      if(!userMaster.value) return
      if(local == 'disciplina') {
        const texto = createPrompt(disciplina.topicos, disciplina.disciplina)
        const promptInit = textoInit.value.replace(/\n/g, ' ').trim().replace(/\s+/g, ' ')
        prompt.value = promptInit + texto
        dialog.value = true
      } 
      if(local == 'topico') {
        const texto = createPrompt2(topico, disciplina.disciplina)
        const promptInit = textoInit.value
        prompt.value = (promptInit + texto).replace(/\n/g, ' ').trim().replace(/\s+/g, ' ')
        // dialog.value = true
      }
      if(local == 'subtopico') {
        const texto = createPrompt3(subtopico, disciplina.disciplina, topico.conteudo)
        const promptInit = textoInit.value.replace(/\n/g, ' ');
        prompt.value = promptInit.trim().replace(/\s+/g, ' ')
        // dialog.value = true
      }
      if(local == 'subsubtopico') {
        const texto = createPrompt4(subsubtopico, disciplina.disciplina, topico.conteudo, subtopico.conteudo)
        const promptInit = textoInit.value
        prompt.value = promptInit.replace(/\n/g, ' ').trim().replace(/\s+/g, ' ')
        // dialog.value = true
      }
    }

    const createPrompt = (topicos, disciplina) => {
       if (!topicos || !Array.isArray(topicos) || topicos.length === 0) {
          return "Nenhum tópico encontrado.";
        }

        textoInit.value = `Você é um professor experiente em concursos publicos. Liste os assuntos mais relevantes para se preparar para o cargo de ${edital.value.cargo} 
        do concurso de ${edital.value.concurso}, que vai ser realizado pela  ${edital.value.banca} no ano ${edital.value.ano}, a disciplina da analise e seus assuntos estao relacionados abaixo. 
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
    }

    const createPrompt2 = (item, disciplina) => {
       if (!item?.conteudo || !Array.isArray(item?.subtopicos) || !item?.subtopicos.length) {
          return "Nenhum tópico encontrado.";
        }

        textoInit.value = `Você é um professor experiente em concursos publicos. Liste os assuntos mais relevantes para se preparar para o cargo de ${edital.value.cargo} 
        da ${edital.value.concurso}, que vai ser realizado pela  ${edital.value.banca} no ano ${edital.value.ano}, a disciplina com os assuntos para analise estão relacionados abaixo.
        Liste os pontos importantes com base na recorrencia das questoes que cairam nos concursos anteriores dos ultimos 5 anos, não fuja do tema e procure apenas 
        em outras bancas se houver poucas questoes. Dê preferência a banca ${edital.value.banca} e em cargos relacionados. 
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
    }

    const createPrompt3 = (item, disciplina, topico) => {
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

       textoInit.value = `Você é um professor experiente em concursos publicos. Liste os assuntos mais relevantes para se preparar para o cargo de ${edital.value.cargo} 
        do concurso de ${edital.value.concurso}, que vai ser realizado pela  ${edital.value.banca} no ano ${edital.value.ano}, ${resultado}.
        Liste os pontos importantes com base na recorrencia das questoes que cairam nos concursos anteriores dos ultimos 5 anos, não fuja do tema e procure apenas 
        em outras bancas se houver poucas questoes. Dê preferência a banca ${edital.value.banca} e em cargos relacionados.
        Liste as sumulas e julgados importantes para as provas relacionados e faça um pequeno resumo.`

       return textoInit.value;
    }

    const createPrompt4 = (item, disciplina, topico, subtopico) => {
      if (!item?.conteudo || !Array.isArray(item?.subtopicos) || !disciplina, !topico, !subtopico) {
          return "Nenhum tópico encontrado.";
      }

      let resultado = `na disciplina ${disciplina}, pegando apenas o subtopico ${item.conteudo} dentro do conteudo ${subtopico} do capitulo que trata do Assunto ${topico}`;

      textoInit.value = `Você é um professor experiente em concursos publicos. Liste os assuntos mais relevantes para se preparar para o cargo de ${edital.value.cargo} 
      do concurso de ${edital.value.concurso}, que vai ser realizado pela  ${edital.value.banca} no ano ${edital.value.ano}, exclusivamente ${resultado}. 
      Liste os pontos importantes com base na recorrencia das questoes que cairam nos concursos anteriores dos ultimos 5 anos, não fuja do tema. 
      Use como base outras bancas apenas se houver poucas questoes da ${edital.value.banca}, caso contrario foque nesta e em cargos relacionados ao informado.
      Liste as sumulas e julgados importante para a prova se houver e faça um resumo.`

      return textoInit.value
    }

    const leftPanel = ref(null);
    const rightPanel = ref(null);
    const divider = ref(null);

    // Estado do componente
    const containerWidth = ref(0);
    const leftWidth = ref(0);
    const isDragging = ref(false);
    const isHovering = ref(false);
    const startX = ref(0);
    const startLeftWidth = ref(0);

    watch(sidebar, (newSidebar) => {
       if(!sidebar.value) leftWidth.value = 1050
       if(sidebar.value) leftWidth.value = containerWidth.value / 2 - 10; // Dividir ao meio inicialmente
    })

    // Largura do painel direito calculada
    const rightWidth = computed(() => {
        return containerWidth.value - leftWidth.value - 10; // 10px é a largura do divisor
    });

    // Função auxiliar para obter a posição X do evento (mouse ou touch)
    const getClientX = (e) => {
        return e.touches ? e.touches[0].clientX : e.clientX;
    };

    // Iniciar o redimensionamento
    const startResize = (e) => {
        // Prevenir comportamento padrão para evitar scroll no mobile
        e.preventDefault();

        isDragging.value = true;
        startX.value = e.clientX;
        startLeftWidth.value = leftWidth.value;
        
        // Adicionar evento de mousemove ao documento
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
        document.addEventListener('touchmove', resize, { passive: false });
        document.addEventListener('touchend', stopResize);
        
        if (!e.touches) {
            document.body.style.cursor = 'col-resize';
        }
        document.body.style.userSelect = 'none'; // Impedir seleção de texto durante o arrasto
    };

    // Fazer o redimensionamento
    const resize = (e) => {
        if (!isDragging.value) return;

        // Prevenir scroll no mobile
        e.preventDefault();
        
        const currentX = getClientX(e);
        const delta = currentX - startX.value;
        let newLeftWidth = startLeftWidth.value + delta;
        
        // Limites para o redimensionamento
        const minWidth = 100; // Largura mínima para cada painel
        const maxWidth = containerWidth.value - minWidth - 10; // Largura máxima considerando o divisor
        
        if (newLeftWidth < minWidth) {
            newLeftWidth = minWidth;
        } else if (newLeftWidth > maxWidth) {
            newLeftWidth = maxWidth;
        }
        
        leftWidth.value = newLeftWidth;
    };

    // Parar o redimensionamento
    const stopResize = () => {
        isDragging.value = false;
        
        // Remover eventos de documento
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
        document.removeEventListener('touchmove', resize);
        document.removeEventListener('touchend', stopResize);
        
        // Restaurar o cursor
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    };

        // Manipuladores para estilização do divisor
    const onDividerHover = () => {
        isHovering.value = true;
        document.body.style.cursor = 'col-resize';
    };

    const onDividerLeave = () => {
    if (!isDragging.value) {
        isHovering.value = false;
        document.body.style.cursor = '';
    }
    };

    // Inicializar as dimensões
    const initDimensions = () => {
        if (leftPanel.value && rightPanel.value) {
            const container = leftPanel.value.parentElement;
            containerWidth.value = container.clientWidth;
            leftWidth.value = 1050
        }
    };

    // Atualizar dimensões no redimensionamento da janela
    const handleResize = () => {
        initDimensions();
    };

    //local storage

    const userMaster = computed(() => {
        const data = sessionStorage.getItem('userData') || localStorage.getItem('userData');
        const login = {
            login: JSON.parse(data).cpf,
            password: JSON.parse(data).password
        } 
        return login.login == '01791743390'
        ? true
        : false
    })

    // Estado reativo
    const dialogLegislacao = ref(false)
    const legislacaoSelecionada = ref(null)

    // Métodos
    const handleNormaClicada = (dados) => {
        legislacaoSelecionada.value = dados.legislacao
        dialogLegislacao.value = true
    }

    const abrirLegislacaoCompleta = () => {
        if (legislacaoSelecionada.value?.url) {
            window.open(legislacaoSelecionada.value.url, '_blank')
        }
    }

    const existForum = (id) => {
      const find = forumStore.readMyGroup.find(item => item.idLaw == id)
      if(find) {
        return find.id
      }
      return null
    }

    onMounted(async() => {
        initDimensions();
        window.addEventListener('resize', handleResize);
        load.value = true
        await conteudoStore.getConteudoEditalUser(id)
        await conteudoStore.getEditalOneUser(id)
        await optionStore.getAllRevisoes(conteudoStore.readEditalUser)
        forumStore.getForum()
        load.value = false
        geralStore.changeHeaderNoShow(false)
    })  

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
        document.removeEventListener('touchmove', resize);
        document.removeEventListener('touchend', stopResize);
        optionStore.clearUnMounted()
    });
 
</script>

<style scoped>
    .container {
        display: flex;
        justify-content: center;
        width: 100%;
        overflow: hidden;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        height: calc(100vh - 137px);
        transition: 1s ease;
    }
    .container2{
        display: flex;
        justify-content: center;
        width: 100%;
        overflow: hidden;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        height: calc(100vh - 16px);
        transition: 1s ease;
    }
    .resizable-container2 {
        display: flex;
        justify-content: center;
        width: 100%;
        overflow: hidden;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        height: 88.3vh;
    }
    .panel {
        height: 100%;
        overflow: hidden;
    }
    .panel-content {
        padding: 16px;
        height: 100%;
    }
    .content{
        height: 55vh;
        overflow-y: auto;
    }
    .conten2{
        height: 70vh;
        overflow-y: auto;
    }
    .content3{
        height: 75vh;
        overflow-y: auto;
    }
    .conten4{
        height: 84vh;
        overflow-y: auto;
    }
     .content::-webkit-scrollbar, .content2::-webkit-scrollbar, .content3::-webkit-scrollbar, .content4::-webkit-scrollbar {
        width: 8px; /* largura da barra */
    }
    .content::-webkit-scrollbar-track, .content2::-webkit-scrollbar-track, .content3::-webkit-scrollbar-track, .content4::-webkit-scrollbar-track {
        background: #f1f1f1; /* trilho da barra */
        border-radius: 4px;
    }

    .content::-webkit-scrollbar-thumb, .content2::-webkit-scrollbar-thumb, .content3::-webkit-scrollbar-thumb, .content4::-webkit-scrollbar-thumb {
        background-color: #888; /* "botão" da barra */
        border-radius: 4px;
    }

    .content::-webkit-scrollbar-thumb:hover,  .content2::-webkit-scrollbar-thumb:hover, .content3::-webkit-scrollbar-thumb:hover,  .content4::-webkit-scrollbar-thumb:hover {
        background-color: #555; /* ao passar o mouse */
    }
    /* Firefox */
    .content, .content2, .content3, .content4 {
        scrollbar-width: thin;            /* largura fina */
        scrollbar-color: #888 #f1f1f1;    /* cor do "polegar" e trilho */
    }
    .panel-divider {
        touch-action: none; 
        min-width: 20px;
        width: 10px;
        height: 100%;
        background-color: #f5f5f5;
        cursor: col-resize;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
    }
    .panel-divider:hover {
        background-color: #e0e0e0;
    }
    .right-panel{
        transition: 1s ease-in-out;
    }
    .fade-enter-from, .fade-leave-to {
        opacity: 0;
        transform: translatex(30px);
    }

    @media (max-width: 768px) {
        .panel-divider {
            min-width: 30px;
            padding: 10px 5px;
        }
    }

    
</style>