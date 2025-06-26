<template>
  <v-card class="relative" elevation="4" v-if="dados?.art" >
    <v-card-title class="bg-blue-darken-2 text-white d-flex align-center">
      <v-icon start icon="mdi-scale-balance"></v-icon>
      <div>
       Mapa Mental
      </div>
    </v-card-title>

    <div class="map-container">
      <div class="controls-panel">
        <v-btn-group density="compact" orientation="vertical" variant="text">
          <v-btn prepend-icon="mdi-magnify-scan" color="blue-darken-1" @click="resetarZoom">Reset Zoom</v-btn>
          <v-btn prepend-icon="mdi-arrow-expand-all" color="green-darken-1" @click="expandirTodos">Expandir</v-btn>
          <v-btn prepend-icon="mdi-arrow-collapse-all" color="red-darken-1" @click="recolherTodos">Recolher</v-btn>
        </v-btn-group>
      </div>

      <v-card class="legend-panel" elevation="2">
        <v-card-text class="pa-2">
          <v-list-item-title class="text-caption font-weight-bold mb-1">Legenda</v-list-item-title>
          <v-list density="compact" nav>
            <v-list-item class="px-1" min-height="20">
              <template v-slot:prepend>
                <div class="legend-dot bg-blue-darken-2"></div>
              </template>
              <div class="legend-text">Nó Central</div>
            </v-list-item>
             <v-list-item class="px-1" min-height="20">
              <template v-slot:prepend>
                <div class="legend-dot" style="background-color: #10b981;"></div>
              </template>
              <div class="legend-text">Nível 1</div>
            </v-list-item>
             <v-list-item class="px-1" min-height="20">
              <template v-slot:prepend>
                <div class="legend-dot" style="background-color: #14b8a6;"></div>
              </template>
              <div class="legend-text">Nível 2</div>
            </v-list-item>
            <v-list-item class="px-1" min-height="20">
              <template v-slot:prepend>
                <div class="legend-line"></div>
              </template>
              <div class="legend-text">Conexão</div>
            </v-list-item>
            <v-list-item class="px-1" min-height="20">
              <template v-slot:prepend>
                <div class="legend-line-dashed"></div>
              </template>
              <div class="legend-text">Vedação</div>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <v-fade-transition>
        <v-card v-if="selectedNode" class="details-panel" elevation="4">
          <v-card-title class="d-flex align-center py-2">
            <span class="font-weight-bold" :style="{ color: selectedNode.cor }">{{ selectedNode.titulo }}</span>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" variant="text" size="small" @click="selectedNode = null"></v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <p v-if="selectedNode.subtitulo" class="text-caption text-grey-darken-1 mb-2">{{ selectedNode.subtitulo }}</p>
            <p class="text-body-2">{{ selectedNode.descricao }}</p>
            <p v-if="selectedNode.tooltip" class="text-caption text-medium-emphasis font-italic mt-2">{{ selectedNode.tooltip }}</p>
          </v-card-text>
        </v-card>
      </v-fade-transition>

      <div ref="containerRef" class="w-100 h-100">
        <svg ref="svgRef" width="100%" height="100%" viewBox="0 0 1000 600"></svg>
      </div>

      <v-tooltip
        v-model="tooltip.visible"
        :text="tooltip.content"
        location="top"
        :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }"
        content-class="tooltip-custom"
        activator="parent"
      >
      </v-tooltip>
    </div>
  </v-card>
</template>

<script setup>
    import { ref, reactive, onMounted, computed, watch } from 'vue';
    import { storeToRefs } from 'pinia'
    import * as d3 from 'd3';

    import { useMindMapInteractive } from '@/store/forum/mindMapInteractive';
    const mindMapInt = useMindMapInteractive()

    const {
      mindMaps
    } = storeToRefs(mindMapInt)

    const props = defineProps({
      post: Object
    })

    const dados = computed(() => {
      return mindMaps.value.find(map => map.art === props.post.art)
      ? mindMaps.value.find(map => map.art === props.post.art)
      : {}
    })
    
    // --- REFERÊNCIAS DOM ---
    const svgRef = ref(null); // Equivalente ao svgRef do React
    const containerRef = ref(null); // Equivalente ao containerRef do React

    // --- ESTADO REATIVO ---
    const selectedNode = ref(null); // Para o painel de detalhes
    const tooltip = reactive({ visible: false, content: '', x: 0, y: 0 });
    const expandedNodes = ref(new Set(['root'])); // Nós expandidos por padrão

    // --- FUNÇÕES AUXILIARES ---
    const wrapText = (text, maxCharsPerLine = 12) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    words.forEach(word => {
        if (currentLine.length + word.length + 1 <= maxCharsPerLine) {
        currentLine += (currentLine ? ' ' : '') + word;
        } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
        }
    });
    if (currentLine) lines.push(currentLine);
    return lines;
    };

    // --- PROPRIEDADES COMPUTADAS (para performance) ---
    const visibleNodes = computed(() => {
    const nodes = [dados.value?.mapa_mental?.no_central];
    const addChildrenRecursively = (parentId) => {
        if (expandedNodes.value.has(parentId)) {
        dados.value?.mapa_mental?.nos.forEach(node => {
            if (node.pai === parentId) {
            nodes.push(node);
            addChildrenRecursively(node.id);
            }
        });
        }
    };
    addChildrenRecursively('root');
    return nodes;
    });

    const visibleLinks = computed(() => {
    const visibleNodeIds = new Set(visibleNodes.value?.map(n => n?.id));
    return dados.value?.mapa_mental?.conexoes.filter(link =>
        visibleNodeIds.has(link.origem) && visibleNodeIds.has(link.destino)
    );
    });

    // --- MÉTODOS (Lógica de interação) ---
    const toggleNodeExpansion = (nodeId) => {
    const newExpanded = new Set(expandedNodes.value);
    if (newExpanded.has(nodeId)) {
        if (nodeId !== 'root') { // Não permite recolher o nó raiz
        const removeChildrenRecursively = (parentId) => {
            dados.value?.mapa_mental?.nos.forEach(node => {
            if (node.pai === parentId) {
                newExpanded.delete(node.id);
                removeChildrenRecursively(node.id);
            }
            });
        };
        newExpanded.delete(nodeId);
        removeChildrenRecursively(nodeId);
        }
    } else {
        newExpanded.add(nodeId);
    }
    expandedNodes.value = newExpanded;
    };

    const expandirTodos = () => {
    const allNodeIds = new Set(['root', ...dados.value?.mapa_mental?.nos.map(n => n?.id)]);
    expandedNodes.value = allNodeIds;
    };

    const recolherTodos = () => {
    expandedNodes.value = new Set(['root']);
    };

    let zoomBehavior; // Manter referência ao comportamento de zoom

    const resetarZoom = () => {
    if (svgRef.value && zoomBehavior) {
        d3.select(svgRef.value)
        .transition()
        .duration(750)
        .call(zoomBehavior.transform, d3.zoomIdentity);
    }
    };

    // --- LÓGICA DE RENDERIZAÇÃO D3 ---
    const renderMap = () => {
    const svg = d3.select(svgRef.value);
    svg.selectAll('*').remove(); // Limpar SVG anterior

    const width = 1000;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;

    const g = svg.append('g');

    // Configurar zoom
    zoomBehavior = d3.zoom()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
        g.attr('transform', event.transform);
        });
    svg.call(zoomBehavior);

    // Calcular posições dos nós
    const nodePositions = {};
    nodePositions['root'] = { x: centerX, y: centerY };

    // Nível 1
    const nivel1Nodes = visibleNodes.value?.filter(n => n?.nivel === 1);
    nivel1Nodes.forEach((node, index) => {
        const angle = (index * 2 * Math.PI) / nivel1Nodes.length - Math.PI / 2; // Ajuste para começar no topo
        const distance = 250;
        nodePositions[node.id] = {
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance
        };
    });

    // Nível 2
    const nivel2Nodes = visibleNodes.value?.filter(n => n?.nivel === 2);
    nivel2Nodes.forEach(node => {
        const parentPos = nodePositions[node.pai];
        if (parentPos) {
        const siblings = nivel2Nodes.filter(n => n?.pai === node.pai);
        const siblingIndex = siblings.findIndex(n => n?.id === node.id);
        const totalSiblings = siblings.length;
        
        const baseAngle = Math.atan2(parentPos.y - centerY, parentPos.x - centerX);
        const spreadAngle = totalSiblings > 1 ? Math.PI / 3 : 0; // 60 graus
        const angle = baseAngle + (siblingIndex - (totalSiblings - 1) / 2) * (spreadAngle / Math.max(1, totalSiblings - 1));
        const distance = 120;
        
        nodePositions[node.id] = {
            x: parentPos.x + Math.cos(angle) * distance,
            y: parentPos.y + Math.sin(angle) * distance
        };
        }
    });

    // Desenhar links
    g.selectAll('.link')
        .data(visibleLinks.value)
        .enter()
        .append('line')
        .attr('x1', d => nodePositions[d.origem]?.x)
        .attr('y1', d => nodePositions[d.origem]?.y)
        .attr('x2', d => nodePositions[d.destino]?.x)
        .attr('y2', d => nodePositions[d.destino]?.y)
        .attr('stroke', d => d.cor || '#999')
        .attr('stroke-width', d => d.espessura || 2)
        .attr('stroke-dasharray', d => d.tracejada ? '5,5' : 'none')
        .attr('opacity', 0.6);

    // Desenhar nós
    const nodes = g.selectAll('.node')
        .data(visibleNodes.value)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${nodePositions[d.id]?.x || 0}, ${nodePositions[d.id]?.y || 0})`)
        .style('cursor', 'pointer')
        .on('click', (event, d) => {
        event.stopPropagation();
        selectedNode.value = d;
        const hasChildren = dados.value?.mapa_mental.nos.some(node => node.pai === d.id);
        if (hasChildren) {
            toggleNodeExpansion(d.id);
        }
        })
        .on('mouseover', (event, d) => {
        const rect = containerRef.value?.getBoundingClientRect();
        tooltip.content = d.descricao || d.tooltip || d.titulo;
        tooltip.x = event.clientX - rect.left;
        tooltip.y = event.clientY - rect.top;
        tooltip.visible = true;
        })
        .on('mouseout', () => {
        tooltip.visible = false;
        });

    // Círculos e texto...
        nodes.append('circle')
        .attr('r', d => d.nivel === 0 ? 70 : (d.nivel === 1 ? 50 : 40))
        .attr('fill', d => d.cor)
        .attr('stroke', d => d.destaque ? '#FFF' : d.cor)
        .attr('stroke-width', 4)
        .style('filter', 'drop-shadow(3px 5px 2px rgb(0 0 0 / 0.2))');

        nodes.each(function(d) {
        const node = d3.select(this);
        const lines = wrapText(d.titulo, d.nivel === 0 ? 15 : (d.nivel === 1 ? 12 : 10));
        const fontSize = d.nivel === 0 ? 14 : (d.nivel === 1 ? 12 : 10);
        const lineHeight = fontSize * 1.2;
        const startY = -((lines.length - 1) * lineHeight) / 2;

        lines.forEach((line, i) => {
            node.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', startY + i * lineHeight)
            .attr('font-size', `${fontSize}px`)
            .attr('font-weight', d.nivel === 0 ? 'bold' : 'normal')
            .attr('fill', '#fff')
            .style('pointer-events', 'none')
            .text(line);
        });
        });

    // Indicador de expansão
    nodes.each(function(d) {
        const hasChildren = dados.value?.mapa_mental?.nos.some(node => node.pai === d.id);
        if (hasChildren) {
        const node = d3.select(this);
        const radius = (d.nivel === 0 ? 70 : (d.nivel === 1 ? 50 : 40));
        const isExpanded = expandedNodes.value.has(d.id);
        
        const indicatorGroup = node.append('g')
            .attr('transform', `translate(0, ${radius})`); // Posição na parte inferior do círculo

        indicatorGroup.append('circle')
            .attr('r', 10)
            .attr('fill', 'rgba(255, 255, 255, 0.8)')
            .attr('stroke', d.cor)
            .attr('stroke-width', 1.5);
        
        indicatorGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .attr('fill', d.cor)
            .text(isExpanded ? '−' : '+');
        }
    });
    };

    // --- CICLO DE VIDA VUE ---
    onMounted(async () => {
      await renderMap();
    });

    watch(expandedNodes, () => {
      renderMap();
    }, { deep: true });

    </script>

    <style scoped>
    .map-container {
    position: relative;
    width: 100%;
    height: 700px; /* Ajuste a altura conforme necessário */
    background-color: #f8fafc; /* slate-50 */
    overflow: hidden;
    }

    .controls-panel {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 10;
    }

    .legend-panel {
    position: absolute;
    top: 1rem;
    left: 1rem;
    z-index: 10;
    max-width: 200px;
    }

    .details-panel {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    z-index: 10;
    max-width: 380px;
    }

    .legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 8px;
    }

    .legend-line {
        width: 14px;
        height: 3px;
        background-color: #9ca3af;
        margin-right: 8px;
    }
    .legend-line-dashed {
        width: 14px;
        height: 3px;
        background-image: linear-gradient(to right, #ef4444 50%, transparent 50%);
        background-size: 6px 3px;
        margin-right: 8px;
    }

    .legend-text {
    font-size: 0.75rem;
    line-height: 1;
    }

    /* Oculta o tooltip padrão do Vuetify para usar o nosso posicionamento customizado */
    .tooltip-custom {
    display: none;
    }
</style>