<template>
  <v-footer class="text-white pa-0" color="grey-darken-4">
    <v-container class="py-16">
      <v-row>
        <v-col cols="12" md="6">
          <h3 class="text-h5 font-weight-bold footer-brand-text mb-4">
            LegisIA
          </h3>
          <p class="text-grey-lighten-1 mb-6" style="max-width: 400px">
            A plataforma mais avançada para estudos jurídicos, powered by AI.
            Transforme sua preparação e acelere sua aprovação.
          </p>
          <div class="d-flex ga-2">
            <v-btn variant="outlined" size="small">Facebook</v-btn>
            <v-btn variant="outlined" size="small">Instagram</v-btn>
            <v-btn variant="outlined" size="small">LinkedIn</v-btn>
          </div>
        </v-col>

        <v-col cols="6" md="3">
          <h4 class="font-weight-bold mb-4">Recursos</h4>
          <ul class="footer-links">
            <li><a href="#">Gerador de Questões</a></li>
            <li><a href="#">Resumos IA</a></li>
            <li><a href="#">Mapas Mentais</a></li>
            <li><a href="#">Flashcards</a></li>
          </ul>
        </v-col>

        <v-col cols="6" md="3">
          <h4 class="font-weight-bold mb-4">Suporte</h4>
          <ul class="footer-links">
            <li><a href="#">Central de Ajuda</a></li>
            <li><a href="#">Contato</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Status</a></li>
          </ul>
        </v-col>
      </v-row>

      <v-divider class="my-12"></v-divider>

      <div class="d-flex flex-column flex-md-row justify-space-between align-center">
        <p class="text-grey-lighten-2 text-sm">
          © {{ new Date().getFullYear() }} LegisIA. Todos os direitos reservados.
        </p>
        <div class="d-flex ga-6 text-sm text-grey-lighten-2 mt-4 mt-md-0 footer-links">
          <a href="#">Termos de Uso</a>
          <a href="#">Política de Privacidade</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </v-container>
  </v-footer>
</template>

<script setup>
// Componente estático, sem necessidade de script.
</script>

<style scoped>
.footer-brand-text {
  background: linear-gradient(to right, #64b5f6, #ffd54f);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.footer-links {
  list-style: none;
  padding: 0;
}
.footer-links li {
  margin-bottom: 0.75rem;
}
.footer-links a {
  text-decoration: none;
  color: inherit;
  opacity: 0.8;
  transition: opacity 0.2s ease-in-out;
}
.footer-links a:hover {
  opacity: 1;
}
</style>