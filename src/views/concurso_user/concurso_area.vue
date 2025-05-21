<template>
   <section :class="geralStore.readHeaderShow ? 'resizable-container': 'resizable-container2'">
        <div ref="leftPanel" class="panel left-panel" :style="{ width: leftWidth + 'px' }">
            <div class="panel-content">
                 <div>
                        <div class="d-flex align-center justify-space-between mb-5">
                            <v-btn @click="$router.push('/areauser')" variant="text" prepend-icon="mdi-arrow-left">Voltar</v-btn>
                            <h1 class="text-h5 d-flex align-center"> <v-icon color="#030131" size="1.7rem" class="mr-1">mdi-school</v-icon>Concurso</h1>
                            <Details :concurso="edital" />
                        </div>
                        <v-divider class="my-5"></v-divider>
                        <div class="border rounded-lg pa-5 mb-5">
                            <div class="mb-5 d-flex justify-space-between align-center" v-if="!load">
                                <div>
                                    <h1 class="text-h5">{{ $route.query.cargo }}</h1>
                                    <p>{{ $route.query.concurso }}</p>
                                </div>
                                <v-btn @click="sidebar = !sidebar" :icon="sidebar ? 'mdi-arrow-left': 'mdi-arrow-right'"></v-btn>
                            </div>
                            <div v-else>Carregando....</div>
                            <div v-if="!load">
                                <v-row v-if="conteudoStore.readConteudoEditalUser.length">
                                    <v-col cols="12" v-if="conteudoStore.readConteudoEditalUser.length > 0">
                                        <v-card color="transparent" variant="flat" class="border">        
                                            <v-card-title class="d-flex align-center">
                                                Conteúdo Verticalizado
                                                <v-spacer></v-spacer>
                                                <v-btn-toggle v-model="viewMode" mandatory class="mr-2" color="primary">
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
                                        <v-card-text :class="geralStore.readHeaderShow ? 'content': 'conten2'">
                                            <!-- Exibição do conteúdo completo -->
                                            <div v-if="viewMode === 'full'">
                                                <v-expansion-panels>
                                                    <v-expansion-panel
                                                        v-for="(disciplina, disciplinaIndex) in conteudoList"
                                                        :key="disciplinaIndex"
                                                    >
                                                        <v-expansion-panel-title @click="selectActionsDisciplina(disciplina)">
                                                            <div class="w-100 d-flex justify-space-between align-center">
                                                                <b>{{ disciplina.disciplina }}</b>
                                                                <div>
                                        
                                                                    <v-tooltip text="Filtrar pelas Relevantes" location="top">
                                                                        <template v-slot:activator="{ props }">
                                                                            <v-btn 
                                                                                density="compact"
                                                                                v-if="disciplina?.top_relevante"
                                                                                v-bind="props" variant="text" :color="filter.relevante ? 'primary' : 'grey'" icon="mdi-filter" @click.stop="filter.relevante = !filter.relevante"></v-btn>
                                                                        </template>
                                                                    </v-tooltip>     
                                                                    <v-tooltip text="Analisar disciplina por pontos mais cobrados" location="top">
                                                                        <template v-slot:activator="{ props }">
                                                                            <v-btn 
                                                                                v-if="userMaster"
                                                                                density="compact"
                                                                                v-bind="props" variant="text" color="primary" icon="mdi-chart-line" @click.stop="selectItem('disciplina', disciplina)"></v-btn>
                                                                        </template>
                                                                    </v-tooltip>
                                                                </div>
                                                            </div>
                                                        </v-expansion-panel-title>
                                                    <v-expansion-panel-text>
                                                        
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
                                                    <template v-for="(disciplina, disciplinaIndex) in conteudoStore.readConteudoEditalUser" :key="disciplinaIndex">
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
                                <v-alert v-else variant="outlined" type="info" text="Você ainda não adicionou um edital."></v-alert>
                            </div>
                        </div>
                        <ActionsPrompt :prompt="prompt" />
                </div>
            </div>
        </div>

        <div 
            v-if="sidebar"
            ref="divider" 
            class="panel-divider"
            @mousedown="startResize"
            @mouseover="onDividerHover"
            @mouseleave="onDividerLeave"
            >
            <v-icon
                :color="isDragging || isHovering ? 'primary' : 'grey'"
                icon="mdi-drag-vertical"
            ></v-icon>
        </div>

        <Transition name="fade">
            <div ref="rightPanel" class="panel right-panel" :style="{ width: rightWidth + 'px' }" v-show="sidebar">
                <div class="panel-content">
                    <v-card-text class="text-center">
                        <Home />
                        <p>Disciplina, topico, subtopico selecionado</p>
                        <div :class="geralStore.readHeaderShow ? 'content3': 'conten4'">
                            <AssuntosRelevantes v-if="options === '1'" :select="selectDisciplina" :usermaster="userMaster"/>
                            <Questoes v-if="options === '2'" :select="selectDisciplina" />
                            <Guia v-if="options === '3'" :select="selectDisciplina" />
                            <Resumo v-if="options === '4'" :select="selectDisciplina" />
                        </div>
                    </v-card-text>
                </div>
            </div>
        </Transition>
   </section>
</template>

<script setup>
    import { onMounted, ref, computed, provide, onUnmounted, watch } from 'vue';

    import Home from '@/components/painel/options/home.vue';
    import ActionsPrompt from '@/components/painel/concurso/actionsPrompt.vue';
    import AssuntosRelevantes from '@/components/painel/options/assuntosRelevantes.vue';
    import Questoes from '@/components/painel/options/questoes.vue';
    import Resumo from '@/components/painel/options/resumo.vue';
    import Guia from '@/components/painel/options/guia.vue';
    import Details from '@/components/painel/details.vue';

    import { useGeralStore } from '@/store/GeralStore';
    import { useConteudoEditalStore } from '@/store/concursos/ConteudoEditalStore';
    import { useRevisaoStore } from '@/store/concursos/EditalRevisao';
    import { useRoute } from 'vue-router';
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
            if(find) find.top_relevante = topRelevantes.value.top_relevante
        }

        if (filter.value.relevante && topRelevantes.value?.top_relevante?.length) {
            return list.map(item => {
            if (item.disciplina === topRelevantes.value.disciplina) {
                return {
                ...item,
                topicos: item.topicos.filter(topico =>
                    topRelevantes.value.top_relevante.includes(topico.numero)
                ),
                top_relevante: topRelevantes.value.top_relevante,
                }
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


    const selectItem = (local, disciplina = null, topico = null, subtopico = null, subsubtopico = null) => {
      prompt.value = null
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
        dialog.value = true
      }
      if(local == 'subtopico') {
        const texto = createPrompt3(subtopico, disciplina.disciplina, topico.conteudo)
        const promptInit = textoInit.value.replace(/\n/g, ' ');
        prompt.value = promptInit.trim().replace(/\s+/g, ' ')
        dialog.value = true
      }
      if(local == 'subsubtopico') {
        const texto = createPrompt4(subsubtopico, disciplina.disciplina, topico.conteudo, subtopico.conteudo)
        const promptInit = textoInit.value
        prompt.value = promptInit.replace(/\n/g, ' ').trim().replace(/\s+/g, ' ')
        dialog.value = true
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
       if(!sidebar.value) leftWidth.value = 900
    })

    // Largura do painel direito calculada
    const rightWidth = computed(() => {
    return containerWidth.value - leftWidth.value - 10; // 10px é a largura do divisor
    });

    // Iniciar o redimensionamento
    const startResize = (e) => {
    isDragging.value = true;
    startX.value = e.clientX;
    startLeftWidth.value = leftWidth.value;
    
    // Adicionar evento de mousemove ao documento
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
    
    // Alterar o cursor durante o arrasto
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none'; // Impedir seleção de texto durante o arrasto
    };

    // Fazer o redimensionamento
    const resize = (e) => {
    if (!isDragging.value) return;
    
    const delta = e.clientX - startX.value;
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
        leftWidth.value = containerWidth.value / 2 - 5; // Dividir ao meio inicialmente
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

    onMounted(async() => {
        initDimensions();
        window.addEventListener('resize', handleResize);
        load.value = true
        await conteudoStore.getConteudoEditalUser(id)
        conteudoStore.getEditalOneUser(id)
        load.value = false
    })  

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
    });
 
</script>

<style scoped>
    .resizable-container {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 80vh;
    overflow: hidden;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    height: 79vh;
    }

    .resizable-container2 {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 80vh;
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
        height: 64vh;
        overflow-y: auto;
    }

    .content3{
        height: 70vh;
        overflow-y: auto;
    }

    .conten4{
        height: 79vh;
        overflow-y: auto;
    }

    .panel-divider {
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
</style>