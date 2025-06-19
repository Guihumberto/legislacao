<template>
  <div class="mapa-mental-container">
    <div ref="mapaMentalRef" class="mapa-mental"></div>
    
    <!-- Tooltip -->
    <div 
      v-if="tooltipVisible" 
      :style="tooltipStyle"
      class="tooltip"
    >
      {{ tooltipContent }}
    </div>
    
    <!-- Controles -->
    <div class="controles">
      <button @click="resetarZoom">Reset Zoom</button>
      <button @click="expandirTodos">Expandir Todos</button>
      <button @click="recolherTodos">Recolher Todos</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'

// Props
const props = defineProps({
  dados: {
    type: Object,
    required: true
  }
})

// Refs
const mapaMentalRef = ref(null)
const tooltipVisible = ref(false)
const tooltipContent = ref('')
const tooltipStyle = ref({})

// Estado
const simulation = ref(null)
const svg = ref(null)

// Configurações
const config = {
  width: 1000,
  height: 600,
  nodeRadius: 40,
  linkDistance: 150,
  colors: {
    nivel0: '#2563eb',
    nivel1: '#10b981',
    nivel2: '#f59e0b',
    nivel3: '#ef4444'
  }
}

// Funções
const initializeMapa = () => {
  const container = mapaMentalRef.value
  
  // Limpar container anterior
  d3.select(container).selectAll("*").remove()
  
  // Criar SVG
  svg.value = d3.select(container)
    .append("svg")
    .attr("width", config.width)
    .attr("height", config.height)
    .call(d3.zoom().on("zoom", (event) => {
      svg.value.select("g").attr("transform", event.transform)
    }))
  
  const g = svg.value.append("g")
  
  // Processar dados
  const nodes = processarNos()
  const links = processarLinks()
  
  // Criar simulação
  simulation.value = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(config.linkDistance))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(config.width / 2, config.height / 2))
    .force("collision", d3.forceCollide().radius(config.nodeRadius + 10))
  
  // Desenhar links
  const link = g.append("g")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("stroke", d => d.cor || "#999")
    .attr("stroke-width", d => d.espessura || 2)
    .attr("stroke-dasharray", d => d.tracejada ? "5,5" : "none")
  
  // Desenhar nós
  const node = g.append("g")
    .selectAll("g")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
  
  // Círculos dos nós
  node.append("circle")
    .attr("r", d => d.nivel === 0 ? 60 : config.nodeRadius)
    .attr("fill", d => d.cor || config.colors[`nivel${d.nivel}`])
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .on("mouseover", mostrarTooltip)
    .on("mouseout", ocultarTooltip)
    .on("click", clickNo)
  
  // Texto dos nós
  node.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .attr("font-size", d => d.nivel === 0 ? "14px" : "12px")
    .attr("font-weight", d => d.nivel === 0 ? "bold" : "normal")
    .attr("fill", "#fff")
    .text(d => truncateText(d.titulo, d.nivel === 0 ? 15 : 10))
  
  // Atualizar posições
  simulation.value.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
    
    node.attr("transform", d => `translate(${d.x},${d.y})`)
  })
}

const processarNos = () => {
  const nodes = []
  
  // Nó central
  if (props.dados.mapa_mental.no_central) {
    nodes.push({
      ...props.dados.mapa_mental.no_central,
      x: config.width / 2,
      y: config.height / 2,
      fx: config.width / 2, // Fixar nó central
      fy: config.height / 2
    })
  }
  
  // Outros nós
  if (props.dados.mapa_mental.nos) {
    nodes.push(...props.dados.mapa_mental.nos)
  }
  
  return nodes
}

const processarLinks = () => {
  if (!props.dados.mapa_mental.conexoes) return []
  
  return props.dados.mapa_mental.conexoes.map(conexao => ({
    source: conexao.origem,
    target: conexao.destino,
    ...conexao
  }))
}

const mostrarTooltip = (event, d) => {
  tooltipContent.value = d.descricao || d.tooltip || d.titulo
  tooltipVisible.value = true
  
  const rect = mapaMentalRef.value.getBoundingClientRect()
  tooltipStyle.value = {
    position: 'absolute',
    left: `${event.clientX - rect.left + 10}px`,
    top: `${event.clientY - rect.top - 10}px`,
    zIndex: 1000
  }
}

const ocultarTooltip = () => {
  tooltipVisible.value = false
}

const clickNo = (event, d) => {
  console.log('Nó clicado:', d)
  // Implementar lógica de expansão/colapso
}

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// Funções de drag
const dragstarted = (event, d) => {
  if (!event.active) simulation.value.alphaTarget(0.3).restart()
  d.fx = d.x
  d.fy = d.y
}

const dragged = (event, d) => {
  d.fx = event.x
  d.fy = event.y
}

const dragended = (event, d) => {
  if (!event.active) simulation.value.alphaTarget(0)
  if (d.id !== 'root') { // Não desafixar o nó central
    d.fx = null
    d.fy = null
  }
}

// Controles
const resetarZoom = () => {
  svg.value.transition().duration(750).call(
    d3.zoom().transform,
    d3.zoomIdentity
  )
}

const expandirTodos = () => {
  // Implementar lógica de expansão
  console.log('Expandir todos os nós')
}

const recolherTodos = () => {
  // Implementar lógica de colapso
  console.log('Recolher todos os nós')
}

// Lifecycle
onMounted(() => {
  initializeMapa()
})

watch(() => props.dados, () => {
  if (props.dados) {
    initializeMapa()
  }
}, { deep: true })
</script>

<style scoped>
.mapa-mental-container {
  position: relative;
  width: 100%;
  height: 600px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.mapa-mental {
  width: 100%;
  height: 100%;
}

.tooltip {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  max-width: 200px;
  word-wrap: break-word;
  pointer-events: none;
}

.controles {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
}

.controles button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.controles button:hover {
  background: #1d4ed8;
}

.node {
  cursor: pointer;
}

.node circle {
  transition: all 0.2s ease;
}

.node:hover circle {
  stroke-width: 3px;
  filter: brightness(1.1);
}
</style>