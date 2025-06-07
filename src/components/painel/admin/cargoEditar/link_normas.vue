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
            @click="abrirNorma(norma)"
            :class="{ 'cursor-pointer': getNormaVinculada(norma) }"
          >
            <template #title>
              <div class="d-flex align-center justify-space-between">
                <span>{{ norma }}</span>
                <div class="d-flex align-center">
                  <v-chip
                    v-if="getNormaVinculada(norma)"
                    size="small"
                    color="primary"
                    variant="outlined"
                    class="ml-2"
                  >
                    ID: {{ getNormaVinculada(norma).id }}
                  </v-chip>
                  <v-icon
                    v-if="getNormaVinculada(norma)"
                    color="success"
                    size="small"
                    class="ml-1"
                  >
                    mdi-link
                  </v-icon>
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
              @click="abrirNorma(norma)"
              :class="{ 'cursor-pointer': getNormaVinculada(norma) }"
            >
              <template #title>
                <div class="d-flex align-center justify-space-between">
                  <span>{{ norma }}</span>
                  <div class="d-flex align-center">
                    <v-chip
                      v-if="getNormaVinculada(norma)"
                      size="small"
                      color="primary"
                      variant="outlined"
                      class="ml-2"
                    >
                      ID: {{ getNormaVinculada(norma).id }}
                    </v-chip>
                    <v-icon
                      v-if="getNormaVinculada(norma)"
                      color="success"
                      size="small"
                      class="ml-1"
                    >
                      mdi-link
                    </v-icon>
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
                @click="abrirNorma(norma)"
                :class="{ 'cursor-pointer': getNormaVinculada(norma) }"
              >
                <template #title>
                  <div class="d-flex align-center justify-space-between">
                    <span>{{ norma }}</span>
                    <div class="d-flex align-center">
                      <v-chip
                        v-if="getNormaVinculada(norma)"
                        size="small"
                        color="primary"
                        variant="outlined"
                        class="ml-2"
                      >
                        ID: {{ getNormaVinculada(norma).id }}
                      </v-chip>
                      <v-icon
                        v-if="getNormaVinculada(norma)"
                        color="success"
                        size="small"
                        class="ml-1"
                      >
                        mdi-link
                      </v-icon>
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
    import { ref, onMounted, computed } from 'vue'

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
    const legislacaoReferencia = ref([])
    const carregandoLegislacao = ref(false)

    // Computed para criar um mapa de normas vinculadas
    const normasVinculadasMap = computed(() => {
        const map = new Map()
        legislacaoReferencia.value.forEach(legislacao => {
            // Aqui você pode ajustar a lógica de comparação conforme necessário
            // Por exemplo, comparação exata, parcial, regex, etc.
            map.set(legislacao.nome.toLowerCase().trim(), legislacao)
        })
        return map
    })

    // Métodos
    const buscarLegislacaoReferencia = async () => {
      console.log('teste');
        carregandoLegislacao.value = true
        try {
            // Substitua pela sua chamada de API
            const response = await fetch('/api/legislacao-referencia')
            const data = await response.json()
            legislacaoReferencia.value = data
        } catch (error) {
            console.error('Erro ao buscar legislação de referência:', error)
        } finally {
            carregandoLegislacao.value = false
        }
    }

    const getNormaVinculada = (nomeNorma) => {
        if (!nomeNorma) return null
        
        // Normaliza o nome da norma para busca
        const nomeNormalizado = nomeNorma.toLowerCase().trim()
        
        // Busca exata primeiro
        let normaEncontrada = normasVinculadasMap.value.get(nomeNormalizado)
        
        if (!normaEncontrada) {
            // Busca parcial/flexível
            for (const [key, legislacao] of normasVinculadasMap.value) {
            if (key.includes(nomeNormalizado) || nomeNormalizado.includes(key)) {
                normaEncontrada = legislacao
                break
            }
            }
    }
    
    return normaEncontrada
    }

    const abrirNorma = (nomeNorma) => {
        const normaVinculada = getNormaVinculada(nomeNorma)
        
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

    // Lifecycle
    onMounted(() => {
        buscarLegislacaoReferencia()
    })

    // Expor métodos se necessário
    defineExpose({
        buscarLegislacaoReferencia,
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