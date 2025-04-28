<template>
    <div class="pdf-container">
      <div v-if="extractedPages.length > 0" class="pdf-view">
        <div v-for="page in extractedPages" :key="page.num_page" class="pdf-page">
          <h3 class="page-number">Página {{ page.num_page }}</h3>
          <p class="page-text" v-html="formatText(page.text)"></p>
        </div>
      </div>
    </div>
</template>

<script setup>

    const props = defineProps({
        extractedPages: Array
    })

    const formatText = (text) => {
        // text = text.replace(/\n+/g, "\n");
        // text = text.replace(/\s*\n\s*/g, "\n");
        // text = text.replace(/\s+/g, " ");
        return text.replace(/\n/g, "<br>");
    };

</script>

<style scoped>
/* Estilização geral do container */
.pdf-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

/* Estilização da área que exibe o conteúdo extraído */
.pdf-view {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  background: #fafafa;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* Estilização de cada página */
.pdf-page {
  background: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

/* Número da página */
.page-number {
  text-align: center;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

/* Estilização do texto da página */
.page-text {
  font-family: "Arial", sans-serif;
  font-size: 16px;
  line-height: 1.6;
  white-space: pre-line; /* Mantém as quebras de linha */
  color: #444;
}
</style>