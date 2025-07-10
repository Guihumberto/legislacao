<template>
  <v-sheet
    class="hero-section d-flex align-center justify-center text-white"
    min-height="100vh"
    theme="dark"
  >
    <div class="hero-bg-decoration"></div>

    <v-container class="text-center relative-z-10">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <div class="mb-6">
            <v-chip
              color="yellow-darken-3"
              variant="flat"
              label
              class="backdrop-blur"
            >
              🚀 Revolucione seus estudos jurídicos
            </v-chip>
          </div>

          <h1
            class="text-h2 text-md-h1 font-weight-bold mb-6 text-gradient-animated"
          >
            Domine a Legislação com
            <span class="d-block text-yellow-accent-4"
              >Inteligência Artificial</span
            >
          </h1>

          <p
            class="text-h6 text-md-h5 font-weight-regular text-blue-lighten-4 mx-auto mb-8"
            style="max-width: 700px"
          >
            A plataforma mais completa para estudo da legislação. Comente a
            a norma, gere questões, crie resumos e muito mais com o poder da
            IA.
          </p>

          <div
            class="d-flex flex-column flex-sm-row justify-center ga-4 mb-12"
          >
            <v-btn
              size="x-large"
              color="yellow-accent-4"
              class="text-black font-weight-bold"
              elevation="4"
              @click="$router.push('/login')"
            >Começar Gratuitamente</v-btn
            >
            <v-btn size="x-large" variant="outlined" class="backdrop-blur"
              >Ver Demonstração</v-btn
            >
          </div>

          <v-row justify="center" class="mx-auto" style="max-width: 600px">
            <v-col cols="6" md="4">
              <div class="text-h4 font-weight-bold text-yellow-accent-4">
                Questões
              </div>
              <div class="text-blue-lighten-3 text-sm">Geradas por IA e de Bancas</div>
            </v-col>
            <v-col cols="6" md="4">
              <div class="text-h4 font-weight-bold text-yellow-accent-4">
                Relações
              </div>
              <div class="text-blue-lighten-3 text-sm">entre normas e jurisprudência</div>
            </v-col>
            <v-col cols="6" md="4">
              <div class="text-h4 font-weight-bold text-yellow-accent-4">
                Esquemas
              </div>
              <div class="text-blue-lighten-3 text-sm">Interativos</div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <div class="arrow-down-animation">
        <v-icon size="large" color="white" alpha="0.6"
          >mdi-arrow-down</v-icon
        >
      </div>
    </v-container>
  </v-sheet>
</template>

<script setup>
// Nenhuma lógica de script necessária para este componente estático.
</script>

<style scoped>
.hero-section {
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    to bottom right,
    rgb(14, 21, 58),
    rgb(27, 43, 113),
    rgb(14, 21, 58)
  );
}
.hero-bg-decoration {
  position: absolute;
  inset: 0;
  background-image: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
  opacity: 0.3;
}
.relative-z-10 {
  position: relative;
  z-index: 10;
}
.text-gradient-animated {
  background: linear-gradient(
    to right,
    white,
    rgb(211, 224, 255),
    rgb(255, 238, 179)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.backdrop-blur {
  backdrop-filter: blur(5px);
  background-color: rgba(255, 255, 255, 0.1) !important;
}
.arrow-down-animation {
  position: absolute;
  bottom: -10rem;
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
</style>