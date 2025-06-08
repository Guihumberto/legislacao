<template>
  <v-list lines="two">
    <template v-for="(disciplina, disciplinaIndex) in disciplinas" :key="disciplinaIndex">
      <v-list-subheader class="text-h6 text-black">
        <v-icon>mdi-arrow-right</v-icon> {{ disciplina.disciplina }}
      </v-list-subheader>
      
      <template v-for="(topico, topicoIndex) in disciplina.topicos" :key="topicoIndex">
        <template v-if="topico.normas && topico.normas.length > 0">
          <v-list-item
            v-for="(norma, normaIndex) in topico.normas"
            :key="`t-${topicoIndex}-${normaIndex}`"
            :subtitle="`Tópico ${topico.numero} ${topico.conteudo}`"
            @click="abrirNorma(disciplina.disciplina, norma)"
            class="{ 'cursor-pointer': getNormaVinculada(norma) }"
          >
            <template #title>
              <div class="d-flex align-center justify-space-between">
                <span>{{ norma }}</span>
                <div class="d-flex align-center">
                
                </div>
              </div>
            </template>
          </v-list-item>
        </template>
        
        <template v-for="(subtopico, subtopicoIndex) in topico.subtopicos" :key="subtopicoIndex">
          <template v-if="subtopico.normas && subtopico.normas.length > 0">
            <v-list-item
              v-for="(norma, normaIndex) in subtopico.normas"
              :key="`st-${topicoIndex}-${subtopicoIndex}-${normaIndex}`"
              :subtitle="`Subtópico ${subtopico.numero} ${subtopico.conteudo}`"
              @click="abrirNorma(disciplina.disciplina, norma)"
              class="{ 'cursor-pointer': getNormaVinculada(norma) }"
            >
              <template #title>
                <div class="d-flex align-center justify-space-between">
                  <span>{{ norma }}</span>
                  <div class="d-flex align-center">
                   
                  </div>
                </div>
              </template>
            </v-list-item>
          </template>
          
          <template v-for="(subSubtopico, subSubtopicoIndex) in subtopico.subtopicos" :key="subSubtopicoIndex">
            <template v-if="subSubtopico.normas && subSubtopico.normas.length > 0">
              <v-list-item
                v-for="(norma, normaIndex) in subSubtopico.normas"
                :key="`sst-${topicoIndex}-${subtopicoIndex}-${subSubtopicoIndex}-${normaIndex}`"
                :subtitle="`Sub-subtópico ${subSubtopico.numero} ${subSubtopico.conteudo}`"
                @click="abrirNorma(disciplina.disciplina, norma)"
                class="{ 'cursor-pointer': getNormaVinculada(norma) }"
              >
                <template #title>
                  <div class="d-flex align-center justify-space-between">
                    <span>{{ norma }}</span>
                    <div class="d-flex align-center">
                     
                    </div>
                  </div>
                </template>
              </v-list-item>
            </template>
          </template>
        </template>
      </template>
    </template>
  </v-list>
</template>

<script setup>
    import { ref, computed } from 'vue'

    import { useLinkLawStore } from '@/store/concursos/LinkLawsDisciplina'
    const linkNormas = useLinkLawStore()

    // Props
    const props = defineProps({
        disciplinas: {
            type: Array,
            required: true
        }
    })

    // Emits
    const emit = defineEmits(['normaClicada'])

    // Estado reativo
    const legislacaoReferencia = ref({})
    const carregandoLegislacao = ref(false)

    const findLaw = async (item) => {
        carregandoLegislacao.value = true
        try {
            const response = await linkNormas.findLinkNormas(item)
            const data = await response
            legislacaoReferencia.value = data
        } catch (error) {
            console.error('Erro ao buscar legislação de referência:', error)
            legislacaoReferencia.value = {}
        } finally {
            carregandoLegislacao.value = false
        }
    }

    const getNormaVinculada = computed(() => {
        return legislacaoReferencia.value
    })

    const extrairAno = (texto) => {
      const match = texto.match(/\b(19|20)\d{2}\b/);
      return match ? parseInt(match[0]) : null;
    }

    const abrirNorma = async (disciplina, nomeNorma) => {
        const item = {
          disciplina,
          nomeNorma,
          ano: extrairAno(nomeNorma)
        }
        await findLaw(item)
        const normaVinculada = getNormaVinculada.value
        
        if (normaVinculada) {
            // Emite evento com os dados da norma vinculada
            emit('normaClicada', {
              nome: nomeNorma,
              legislacao: normaVinculada
            })
        } else {
            console.log('Norma não encontrada no sistema:', nomeNorma)
        }
    }

    // Expor métodos se necessário
    defineExpose({
        getNormaVinculada
    })
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>