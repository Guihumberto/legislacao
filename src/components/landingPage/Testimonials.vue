<template>
  <v-sheet
    class="py-16 text-white"
    color="#101844"
    theme="dark"
  >
    <v-container>
      <div class="text-center mb-16">
        <h2 class="text-h3 text-md-h2 font-weight-bold mb-6">
          Histórias de <span class="text-yellow-accent-4">Sucesso</span>
        </h2>
        <p
          class="text-h6 font-weight-regular text-blue-lighten-4 mx-auto"
          style="max-width: 700px"
        >
          Veja como nossa plataforma tem transformado a vida de estudantes e
          profissionais do direito.
        </p>
      </div>

      <v-row>
        <v-col
          v-for="(testimonial, index) in testimonials"
          :key="index"
          cols="12"
          md="4"
        >
          <v-card
            class="fill-height pa-4 testimonial-card"
            color="rgba(255, 255, 255, 0.1)"
            elevation="0"
          >
            <v-card-text>
              <div class="d-flex align-center mb-6">
                <v-avatar color="yellow-accent-4" class="mr-4">
                  <span class="text-black font-weight-bold">{{
                    testimonial.avatar
                  }}</span>
                </v-avatar>
                <div>
                  <h4 class="font-weight-bold text-white">
                    {{ testimonial.name }}
                  </h4>
                  <p class="text-blue-lighten-3 text-sm">
                    {{ testimonial.role }}
                  </p>
                </div>
              </div>

              <v-rating
                :model-value="testimonial.rating"
                color="yellow-accent-4"
                density="compact"
                readonly
                class="mb-4"
              ></v-rating>

              <p class="text-blue-lighten-4 font-italic">
                "{{ testimonial.content }}"
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup>
import { ref } from "vue";

const testimonials = ref([
  {
    name: "Maria Silva",
    role: "Aprovada TRF 1ª Região",
    content:
      "A plataforma foi fundamental na minha aprovação. As questões geradas por IA eram incrivelmente precisas e me ajudaram a identificar pontos fracos.",
    avatar: "MS",
    rating: 5,
  },
  {
    name: "João Santos",
    role: "Advogado - OAB SP",
    content:
      "Incrível como a IA consegue gerar resumos tão didáticos. Economizei horas de estudo e consegui focar no que realmente importa.",
    avatar: "JS",
    rating: 5,
  },
  {
    name: "Ana Costa",
    role: "Concurso Público Federal",
    content:
      "Os mapas mentais gerados automaticamente me ajudaram a visualizar conexões entre temas que eu nunca tinha percebido antes.",
    avatar: "AC",
    rating: 5,
  },
]);
</script>

<style scoped>
.testimonial-card {
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  transition: background-color 0.3s ease-in-out;
}
.testimonial-card:hover {
  background-color: rgba(255, 255, 255, 0.15) !important;
}
</style>