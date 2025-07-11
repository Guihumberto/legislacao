<template>
  <v-card
    class="card-norma"
    height="160"
    hover
    @click="$emit('click')"
  >
    <div class="d-flex flex-column justify-space-between h-100 pa-4">
      <div class="d-flex align-start">
        <v-avatar
          class="icon-container me-3"
          color="blue-grey-lighten-5"
          rounded="lg"
          size="40"
        >
          <v-icon :icon="icone || 'mdi-file-document-outline'" color="primary" />
        </v-avatar>
        <div class="flex-grow-1">
          <h3 class="font-weight-medium text-sm text-high-emphasis leading-tight">
            {{ truncateText(titulo, 45) }}
          </h3>
        </div>
      </div>

      <div>
        <p class="text-xs text-medium-emphasis leading-relaxed">
          {{ truncateText(subtitulo, 85) }}
        </p>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
// Define as propriedades que o componente aceita
defineProps<{
  titulo: string;
  subtitulo: string;
  icone?: string; // Ícone será uma string do Material Design Icons (ex: 'mdi-book-open')
}>();

// Define os eventos que o componente pode emitir
defineEmits<{
  (e: 'click'): void;
}>();

// Função para truncar o texto
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};
</script>

<style scoped>
.card-norma {
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border: 1px solid rgba(0, 0, 0, 0.12); /* Equivalente a border-card-border */
}

/* Efeito de elevação no hover, similar ao hover:-translate-y-1 */
.card-norma:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.icon-container {
  transition: transform 0.2s ease-in-out;
}

.card-norma:hover .icon-container {
  transform: scale(1.1);
}

/* Classes de utilidade para o texto */
.text-sm {
  font-size: 0.875rem; /* 14px */
}

.text-xs {
  font-size: 0.75rem; /* 12px */
}

.leading-tight {
  line-height: 1.25;
}

.leading-relaxed {
  line-height: 1.625;
}
</style>