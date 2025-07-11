<template>
      <v-container>
        <div class="text-center mb-12">
          <h1 class="text-h4 text-sm-h3 font-weight-bold text-grey-darken-4 mb-4">
            Normas e Legislação
          </h1>
          <p class="text-body-1 text-grey-darken-1 mx-auto" style="max-width: 600px;">
            Acesse as principais normas organizadas por concurso, disciplina e tipo de legislação.
          </p>
        </div>

        <div class="d-flex flex-column ga-12">
          <section v-for="(secao, index) in secoes" :key="index" class="d-flex flex-column ga-6">
            <div class="border-s-4 border-primary ps-4">
              <h2 class="text-h5 font-weight-semibold text-grey-darken-3">
                {{ secao.titulo }}
              </h2>
            </div>

            <v-row>
              <v-col
                v-for="norma in secao.normas"
                :key="norma.id"
                cols="12"
                sm="6"
                lg="4"
                xl="3"
              >
                <NormaCard
                  :titulo="norma.titulo"
                  :subtitulo="norma.subtitulo"
                  :icone="norma.icone"
                  @click="handleCardClick(norma)"
                />
              </v-col>
            </v-row>
          </section>
        </div>
      </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NormaCard from '@/components/painel/NormaCard.vue';

// Interfaces para tipagem dos dados
interface Norma {
  id: string;
  titulo: string;
  subtitulo: string;
  icone?: string; // Ícones MDI
}

interface SecaoNormas {
  titulo: string;
  normas: Norma[];
}

// Dados das normas e seções
const secoes = ref<SecaoNormas[]>([
  {
    titulo: "Por Concurso",
    normas: [
      { id: "1", titulo: "Concurso TRT 2023 - Edital Completo", subtitulo: "Regulamentação completa para o concurso do Tribunal Regional do Trabalho 2023", icone: 'mdi-school-outline' },
      { id: "2", titulo: "Concurso Polícia Civil SP - Normas Gerais", subtitulo: "Diretrizes e normas para o concurso da Polícia Civil do Estado de São Paulo", icone: 'mdi-shield-outline' },
      { id: "3", titulo: "Concurso INSS 2024 - Regulamento", subtitulo: "Normas específicas para o concurso do Instituto Nacional do Seguro Social", icone: 'mdi-account-group-outline' },
      { id: "4", titulo: "Concurso Banco do Brasil - Edital", subtitulo: "Regulamentação para seleção de funcionários do Banco do Brasil", icone: 'mdi-file-document-outline' }
    ]
  },
  {
    titulo: "Por Disciplina",
    normas: [
      { id: "5", titulo: "Direito Constitucional", subtitulo: "Normas fundamentais da Constituição Federal Brasileira de 1988", icone: 'mdi-book-open-page-variant-outline' },
      { id: "6", titulo: "Direito Administrativo", subtitulo: "Legislação sobre administração pública e serviços administrativos", icone: 'mdi-scale-balance' },
      { id: "7", titulo: "Direito Penal", subtitulo: "Código Penal Brasileiro e normas penais complementares", icone: 'mdi-shield-outline' },
      { id: "8", titulo: "Direito Civil", subtitulo: "Código Civil e legislação civil complementar atualizada", icone: 'mdi-account-group-outline' }
    ]
  },
  {
    titulo: "Por Tipo de Norma",
    normas: [
      { id: "9", titulo: "Leis Federais", subtitulo: "Compilação das principais leis federais em vigor no Brasil", icone: 'mdi-book-open-page-variant-outline' },
      { id: "10", titulo: "Decretos Executivos", subtitulo: "Decretos do Poder Executivo Federal com relevância jurídica", icone: 'mdi-file-document-outline' },
      { id: "11", titulo: "Resoluções CNJ", subtitulo: "Resoluções do Conselho Nacional de Justiça", icone: 'mdi-scale-balance' }
    ]
  }
]);

// Função para lidar com o clique no card
const handleCardClick = (norma: Norma) => {
  console.log("Clicou na norma:", norma.titulo);
  // Aqui você implementaria a navegação para a norma específica,
  // por exemplo, com o Vue Router: router.push(`/normas/${norma.id}`)
};
</script>