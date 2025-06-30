<template>
  <v-card
    :class="['h-100 d-flex flex-column', { 'popular-card': props.isPopular }]"
    :variant="props.isPopular ? 'outlined' : 'elevated'"
    :elevation="props.isPopular ? 12 : 4"
    :color="props.isPopular ? 'primary' : undefined"
  >
      <v-chip
        v-if="props.isPopular"
        density="compact"
        color="primary"
        variant="elevated"
        class="popular-badge"
      >
        <v-icon start icon="mdi-star-four-points"></v-icon>
        Mais Popular
      </v-chip>
    
  

    <v-card-item class="text-center pa-6">
      <div class="d-flex justify-center mb-4">
        <div 
          class="pa-3 rounded-xl"
          :class="props.isPopular ? 'bg-primary-lighten-4' : 'bg-grey-lighten-4'"
        >
          <slot name="icon">
             <v-icon :color="props.isPopular ? 'primary' : 'grey-darken-1'" size="32"></v-icon>
          </slot>
        </div>
      </div>
      
      <v-card-title class="text-h5 font-weight-bold">{{ props.title }}</v-card-title>
      <div class="my-4">
        <span class="text-h3 font-weight-bold">{{ props.price }}</span>
        <span class="text-medium-emphasis">/mês</span>
      </div>
      <v-card-subtitle class="text-wrap">{{ props.description }}</v-card-subtitle>
    </v-card-item>

    <v-divider class="mx-6"></v-divider>
    
    <v-card-text class="flex-grow-1">
      <v-list class="bg-transparent" lines="one">
        <v-list-item
          v-for="(feature, index) in props.features"
          :key="index"
          class="pa-0"
        >
          <template v-slot:prepend>
            <v-icon color="success" icon="mdi-check-circle-outline" class="mr-3"></v-icon>
          </template>
          <v-list-item-title class="text-body-2">{{ feature }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
    
    <v-card-actions class="pa-6 pt-0">
      <v-btn
        :color="buttonColor"
        :variant="buttonVariant"
        @click="emit('button-click')"
        size="x-large"
        block
        class="font-weight-bold"
      >
        {{ props.buttonText }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';

// Define as propriedades do componente, similar à interface do React
const props = defineProps({
  title: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  features: { type: Array, required: true },
  buttonText: { type: String, required: true },
  isPopular: { type: Boolean, default: false },
  isEnterprise: { type: Boolean, default: false },
});

// Define os eventos que o componente pode emitir
const emit = defineEmits(['button-click']);

// Propriedade computada para a variante do botão, mantendo o template limpo
const buttonVariant = computed(() => {
  if (props.isPopular) return 'elevated';
  if (props.isEnterprise) return 'tonal';
  return 'tonal';
});

// Propriedade computada para a cor do botão
const buttonColor = computed(() => {
  if (props.isPopular) return 'primary';
  if (props.isEnterprise) return 'grey-darken-3';
  return 'blue-grey';
});
</script>

<style scoped>
.popular-badge {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  font-size: 0.7rem;
  font-weight: 500;
}

.popular-card {
  position: relative;
  /* Efeito de escala sutil no hover para destacar */
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

@media (min-width: 960px) {
  .popular-card {
    transform: scale(1.05);
  }
  .popular-card:hover {
    transform: scale(1.08);
  }
}
</style>