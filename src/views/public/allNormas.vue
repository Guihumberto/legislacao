<template>
     <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
             <div>
                <v-btn variant="outlined" prepend-icon="mdi-arrow-left" @click="$router.push('/homepainel')">voltar</v-btn>
             </div>
             <h1 class="text-h4 my-6 text-center grey--text text--darken-3">
                Buscar normas
             </h1>
             <div>
                <v-form @submit.prevent="searchLaw" ref="form">
                    <v-text-field
                        label="Buscar"
                        prepend-inner-icon="mdi-magnify"
                        density="compact"
                        variant="outlined"
                        clearable
                        v-model="search"
                    ></v-text-field>
                    <div class="d-flex justify-center ga-2 mt-5">
                        <v-btn variant="text" :disabled="!search" @click="search = ''">limpar</v-btn>
                        <v-btn color="primary" variant="flat" type="submit" append-icon="mdi-magnify" :disabled="load" :loading="load">Buscar</v-btn>
                    </div>
                </v-form>
             </div>

             <div v-if="lawStore.readLoad">
                carregando...
             </div>

             <div v-else class="mt-10">
                <v-card v-if="listSearch.length" class="pa-6">
                    <v-card-text>
                        <div class="laws-container">
                            <v-fade-transition group>
                                 <v-card
                                    v-for="item in listSearch"
                                    :key="item.id"
                                    class="law-card mb-4"
                                    variant="outlined"
                                    hover
                                    @click="navigateToLaw(item.id)"
                                >
                                    <v-card-text class="pa-6">
                                        <!-- Header com título e status -->
                                        <div class="d-flex align-center justify-space-between mb-3">
                                            <h3 class="law-title text-h6 font-weight-medium">
                                                {{ item.title }}
                                            </h3>
                                        </div>
                                         <div class="law-info mb-4">
                                            <div class="info-grid">
                                            <div class="info-item">
                                                <v-icon class="info-icon" color="primary" size="small">mdi-file-document</v-icon>
                                                <span class="info-label">Páginas:</span>
                                                <span class="info-value">{{ item.total_pages }}</span>
                                            </div>
                                            
                                            <div class="info-item">
                                                <v-icon class="info-icon" color="primary" size="small">mdi-calendar</v-icon>
                                                <span class="info-label">Ano:</span>
                                                <span class="info-value">{{ item.ano }}</span>
                                            </div>
                                            
                                            <div class="info-item">
                                                <v-icon class="info-icon" color="primary" size="small">mdi-update</v-icon>
                                                <span class="info-label">Atualização:</span>
                                                <span class="info-value">{{ item.data_include }}</span>
                                            </div>
                                            </div>
                                        </div>
                                        <div class="law-preview">
                                            <p class="preview-text text-body-2 text-medium-emphasis mb-0">
                                            {{ getPreviewText(item.description_norm) }}
                                            </p>
                                        </div>
                                    </v-card-text>
                                    </v-card>
                            </v-fade-transition>
                        </div>
                    </v-card-text>
                </v-card>
                <v-card class="my-5">
                    <v-card-text>
                        <div
                            v-if="suggestLaws.length"
                            class="law-list"
                        >
                            <div
                            v-for="(item, i) in suggestLaws"
                            :key="i"
                            class="law-item"
                            @click="navigateToLaw(item.id)"
                            >
                            <v-icon size="18" class="me-2" color="primary">mdi-file-document-outline</v-icon>
                            <span>{{ item.title }}</span>
                            </div>
                        </div>
                        <v-alert
                            v-else
                            type="error"
                            variant="outlined"
                            text="Não foram encontradas normas"
                        ></v-alert>
                    </v-card-text>
                </v-card>
             </div>
        </div>
    </section>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    
    import { useGeralStore } from '@/store/GeralStore';
    import { useLawStore } from '@/store/LawsStore';
    
    const geralStore = useGeralStore()
    const lawStore = useLawStore()
    
    const router = useRouter()
    const route = useRoute()
    const search = ref('')
    const load = ref(false)
    
    const suggestLaws = ref([])
    const listSearch = ref([])  

    const navigateToLaw = (id) => {
        router.push(`/avancado/${id}`)
    }

    const searchLaw = async () => {
        load.value = true
        if(!search.value.length) return
        const resp = await lawStore.searchLaw(search.value.trim())
        listSearch.value = resp
        load.value = false
    }

    const getSuggestLaws = async () => {
        const resp = await lawStore.getLawLeisFederais()
        suggestLaws.value = resp
    }

    const getPreviewText = (text) => {
        if (!text) return 'Sem descrição disponível'
        
        const words = text.split(' ')
        if (words.length <= 25) return text
        
        return words.slice(0, 25).join(' ') + '...'
    }

    onMounted(async () => {
       await getSuggestLaws()
    })

</script>

<style scoped>
.law-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.law-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.law-item:hover {
  background-color: #f0f4ff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

@media (min-width: 600px) {
  .law-list {
    grid-template-columns: 1fr 1fr;
  }
}

.laws-container {
  padding: 16px 0;
}

.law-card {
  background: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.law-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: rgb(var(--v-theme-primary));
}

.law-title {
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.4;
  margin: 0;
}

.law-info {
  border-left: 3px solid rgb(var(--v-theme-primary));
  padding-left: 16px;
  background: rgba(var(--v-theme-primary), 0.04);
  border-radius: 0 8px 8px 0;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
}

.info-icon {
  opacity: 0.7;
}

.info-label {
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
  min-width: 80px;
}

.info-value {
  font-weight: 400;
}

.law-preview {
  margin-top: 16px;
  padding: 16px;
  border-radius: 8px;
  border-left: 3px solid rgba(var(--v-theme-secondary), 0.6);
}

.preview-text {
  line-height: 1.6;
  font-style: italic;
}

/* Responsividade */
@media (min-width: 600px) {
  .info-grid {
    flex-direction: row;
    justify-content: space-between;
  }
  
  .info-item {
    flex: 1;
    justify-content: flex-start;
  }
}

/* Animações */
.v-enter-active,
.v-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.v-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Estados de foco para acessibilidade */
.law-card:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.law-card[tabindex="0"] {
  outline: none;
}
</style>