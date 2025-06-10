<template>
  <div class="mind-node" :class="[`level-${level}`, `type-${node.type}`]">
    <div
      class="node-content"
      :class="{ 'has-children': hasChildren, 'expanded': node.expanded }"
      @click="toggleNode"
    >
      <div class="node-header">
            <v-icon
            v-if="hasChildren"
            class="expand-icon"
            :class="{ 'rotated': node.expanded }"
            size="small"
            >
            mdi-chevron-right
            </v-icon>
            <v-icon
            v-else-if="node.icon"
            class="node-icon"
            size="small"
            :color="getNodeColor(node.type)"
            >
            {{ node.icon }}
            </v-icon>

            <div class="node-text">
            <div class="node-title" :class="`title-${node.type}`">
                {{ node.title }}
            </div>
            <div v-if="node.subtitle" class="node-subtitle">
                {{ node.subtitle }}
            </div>
            <div v-if="node.description" class="node-description">
                {{ node.description }}
            </div>
            </div>
        </div>
    </div>

    <transition-group
      name="node-children"
      tag="div"
      class="children-container"
      v-if="hasChildren && node.expanded"
    >
      <MindMapNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
        @toggle="$emit('toggle', $event)"
        class="child-node"
      />
    </transition-group>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import MindMapNode from './mindMapNode.vue';


const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
  level: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['toggle']);

const hasChildren = computed(() => {
  return props.node.children && props.node.children.length > 0;
});

const toggleNode = () => {
  if (hasChildren.value) {
    // Note: It's usually better to emit an event to update the parent's data
    // rather than directly modifying a prop, especially in a recursive component.
    // Here, we assume 'node' prop is part of a larger reactive object passed down,
    // and its mutation will be reflected. For strict one-way data flow,
    // you'd emit a 'update:expanded' event.
    props.node.expanded = !props.node.expanded;
    emit('toggle', props.node.id);
  }
};

const getNodeColor = (type) => {
  const colors = {
    root: 'primary',
    concept: 'blue',
    definition: 'green',
    category: 'orange',
    exclusion: 'red',
    special: 'purple',
    item: 'grey',
  };
  return colors[type] || 'grey';
};
</script>

<style scoped>
/* Adicione seus estilos CSS aqui */
.mind-node {
  margin-left: 20px;
  border-left: 2px solid #eee;
  padding-left: 10px;
}

.node-content {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 0;
}

.node-header {
  display: flex;
  align-items: center;
}

.expand-icon {
  transition: transform 0.2s ease-in-out;
}

.expand-icon.rotated {
  transform: rotate(90deg);
}

.node-text {
  margin-left: 5px;
}

.node-title {
  font-weight: bold;
}

.children-container {
  overflow: hidden; /* Needed for transition-group to work */
}

/* Transições para os filhos */
.node-children-enter-active, .node-children-leave-active {
  transition: all 0.5s ease;
}
.node-children-enter-from, .node-children-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>