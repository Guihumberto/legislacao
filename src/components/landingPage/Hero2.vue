<template>
  <!-- Seção principal com um gradiente de fundo e centralização vertical -->
  <section class="legal-hero-section d-flex align-center">
    <v-container class="py-16">
      <v-row align="center" justify="center">
        <!-- Coluna do Conteúdo (Esquerda) -->
        <v-col cols="12" lg="6">
          <div class="space-y-8 animate-fade-in-left">
            <div class="space-y-4">
              <!-- Chip "Powered by AI" -->
              <v-chip
                color="primary"
                variant="flat"
                prepend-icon="mdi-creation"
                size="small"
                class="ai-chip"
              >
                Powered by AI
              </v-chip>

              <!-- Título Principal -->
              <h1 class="text-h3 text-md-h2 text-lg-h2 font-weight-bold text-legal-text-primary leading-tight">
                Revolucione seu
                <span class="bg-gradient-primary bg-clip-text text-primary d-block">
                  Estudo da Legislação
                </span>
              </h1>

              <!-- Parágrafo de Descrição -->
              <p class="text-xl text-legal-text-secondary leading-relaxed" style="max-width: 32rem;">
                Plataforma inteligente que transforma como você estuda, analisa e compreende
                a legislação brasileira com o poder da inteligência artificial.
              </p>
            </div>

            <!-- Lista de Funcionalidades -->
            <div class="space-y-4">
              <h3 class="text-h6 font-weight-semibold text-legal-text-primary">
                Principais Funcionalidades:
              </h3>
              <div class="grid-features">
                <div
                  v-for="(feature, index) in features"
                  :key="index"
                  class="feature-item d-flex align-center"
                  :style="{ animationDelay: `${index * 0.1}s` }"
                >
                  <v-icon color="primary" class="mr-3 flex-shrink-0">mdi-check-circle</v-icon>
                  <span class="text-body-1 text-md-body-1">{{ feature }}</span>
                </div>
              </div>
            </div>

            <!-- Botões de Ação (CTA) -->
            <div class="d-flex flex-column flex-sm-row ga-4 pt-4">
              <v-btn
                size="large"
                class="bg-primary cta-button"
                elevation="4"
                @click="$router.push('/login')"
              >
                Começar Gratuitamente
              </v-btn>
              <v-btn
                size="large"
                variant="outlined"
                color="primary"
                class="cta-button-outline"
                @click="lawOpen()"
              >
                Ver Demonstração
              </v-btn>
            </div>
          </div>
        </v-col>

        <!-- Coluna da Imagem (Direita) -->
        <v-col cols="12" lg="6" class="d-none d-lg-block">
          <div class="relative animate-fade-in-right">
            <div class="image-container">
              <!-- Imagem principal com sobreposição de gradiente -->
              <v-card-text class="pa-4">
                <v-responsive :aspect-ratio="16/9">
                  <iframe
                    width="100%"
                    height="100%"
                    :src="videoUrl"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </v-responsive>
              </v-card-text>
            </div>

            <!-- Elemento flutuante "IA Ativa" -->
            <div class="floating-card-top" style="animation-delay: 0.3s;">
              <div class="d-flex align-center ga-2 text-body-2 font-weight-medium text-legal-text-primary">
                <div class="pulse-dot"></div>
                IA Ativa
              </div>
            </div>

            <!-- Elemento flutuante "Última análise" -->
            <div class="floating-card-bottom" style="animation-delay: 0.6s;">
              <div class="text-caption text-legal-text-secondary">Última análise</div>
              <div class="text-body-2 font-weight-bold text-legal-text-primary">+2.847 normas</div>
            </div>
          </div>
        </v-col>
      </v-row>
      <div class="arrow-down-animation">
        <v-icon size="large" color="primary" alpha="0.6"
          >mdi-arrow-down</v-icon
        >
      </div>
    </v-container>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import heroImage from '/leges.png';

const lawOpen = () => {
     window.open('https://www.youtube.com/watch?v=h7JDeHcEAlU', '_blank');
}

const videoId = 'h7JDeHcEAlU'; // ID extraído da URL https://www.youtube.com/watch?v=h7JDeHcEAlU

const videoUrl = computed(() => {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1` ;
});

const features = ref([
  "Comentários inteligentes em normas",
//   "Formatação automática de documentos",
  "Geração de questões",
  "Mapas mentais Interativos",
//   "Resumos automatizados",
  "Explicações didáticas com IA",
  "Organização inteligente por temas",
  "Filtros avançados de pesquisa",
  "Relações entre normas e jurisprudência"
]);
</script>

<style scoped>
/* Definição de variáveis de cores para manter a consistência com o tema original */
:root, body {
  --legal-primary: #6d28d9; /* Exemplo: Roxo */
  --legal-secondary: #ede9fe;
  --legal-accent: #c4b5fd;
  --legal-text-primary: #1f2937;
  --legal-text-secondary: #4b5563;
  --bg-subtle: #f5f3ff;
}

/* Estilos para a seção principal */
.legal-hero-section {
  min-height: 100vh;
  background-image: linear-gradient(to top, #f5f3ff, #ffffff); /* Gradiente sutil */
}

/* Estilos para textos e gradientes */
.text-legal-text-primary {
  color: var(--legal-text-primary);
}
.text-legal-text-secondary {
  color: var(--legal-text-secondary);
}
.bg-gradient-primary {
  background: linear-gradient(90deg, var(--legal-primary), var(--legal-accent));
}
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}
.text-transparent {
  color: transparent;
}
.leading-tight {
  line-height: 1.2;
}
.leading-relaxed {
  line-height: 1.75;
}

/* Espaçamento entre elementos */
.space-y-4 > * + * {
  margin-top: 1rem; /* 16px */
}
.space-y-8 > * + * {
  margin-top: 2rem; /* 32px */
}

/* Chip de IA */
.ai-chip {
  background-color: rgba(109, 40, 217, 0.1) !important;
  color: var(--legal-primary) !important;
  font-weight: 500;
}
.ai-chip .v-icon {
  color: var(--legal-primary) !important;
}

/* Grid de funcionalidades */
.grid-features {
  display: grid;
  gap: 0.75rem; /* 12px */
}
.feature-item {
  transition: color 0.3s ease;
  color: var(--legal-text-secondary);
}
.feature-item:hover {
  color: var(--legal-text-primary);
}

/* Botões de Ação */
.cta-button {
  color: white !important;
  transition: opacity 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.cta-button:hover {
  opacity: 0.9;
}
.cta-button-outline {
  border-color: var(--legal-primary);
}

/* Container da Imagem e elementos flutuantes */
.relative {
  position: relative;
}
.image-container {
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem; /* 12px */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
.gradient-overlay {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to top, rgba(109, 40, 217, 0.1), transparent);
}

/* Cards flutuantes */
.floating-card-top, .floating-card-bottom {
  position: absolute;
  background-color: white;
  border-radius: 0.75rem; /* 12px */
  padding: 1rem; /* 16px */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fade-in-up 0.5s ease-out forwards;
}
.floating-card-top {
  top: -1rem;
  right: -1rem;
}
.floating-card-bottom {
  bottom: -1rem;
  left: -1rem;
}

/* Ponto verde pulsante */
.pulse-dot {
  width: 0.75rem; /* 12px */
  height: 0.75rem; /* 12px */
  background-color: #22c55e; /* green-500 */
  border-radius: 9999px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.arrow-down-animation {
  position: absolute;
  margin-top: 10rem;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translate(-50%, 0);
  }
  40% {
    transform: translate(-50%, -20px);
  }
  60% {
    transform: translate(-50%, -10px);
  }
}

/* Animações */
@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}

@keyframes fade-in-left {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.animate-fade-in-left {
  animation: fade-in-left 0.7s ease-out forwards;
}

@keyframes fade-in-right {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.animate-fade-in-right {
  animation: fade-in-right 0.7s ease-out forwards;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animação para os itens da lista de funcionalidades */
.feature-item {
  opacity: 0;
  animation: fade-in-up 0.5s ease-out forwards;
}

</style>
