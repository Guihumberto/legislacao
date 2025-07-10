<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <v-card class="main-card" >
                <v-card-text class="pa-8">
                    <!-- Seção de título -->
                    <div class="section-header" v-if="!load">
                        <div class="title-wrapper">
                            <h2 class="section-title">Minhas Normas</h2>
                            <p class="section-subtitle">Gerencie suas normas</p>
                        </div>
                        <v-icon color="primary" size="3rem">mdi-book-outline</v-icon>
                    </div>

                    <!-- Loading state -->
                 
                    <div v-if="load" class="loading-container">
                        <v-progress-circular
                            indeterminate
                            color="primary"
                            size="64"
                            width="4"
                        ></v-progress-circular>
                        <p class="loading-text">Carregando suas normas...</p>
                    </div>
    

                    <!-- Conteúdo principal -->
                    <div v-if="!load" class="content-section">
                      <v-card class="editais-card" v-if="forumStore.readMyGroup.length"  elevation="2">
                        <v-card-text>
                            <div class="text-right">
                                  <v-btn
                                      variant="text"
                                      prepend-icon="mdi-check-circle"
                                      @click="$router.push('/permissoes')"
                                      title="permissões"
                                      icon="mdi-lock"
                                  >
                                  </v-btn>
                                  <ConfigMyGroup :groups="forumStore.readMyGroup" />
                            </div>
                            <ListForuns  @saveFoldersForum="saveFoldersForum" :foldersES="preferencesStore.foldersForum" />
                        </v-card-text>
                      </v-card>  

                       <!-- Estado vazio -->
                      <v-card v-else class="empty-state-card mb-10" elevation="2">
                          <v-card-text class="text-center pa-8">
                              <div class="empty-icon-wrapper">
                                  <v-icon class="empty-icon" color="grey-lighten-1" size="5rem">
                                      mdi-book-outline
                                  </v-icon>
                              </div>
                              <h3 class="empty-title">Nenhuma normas adicionada</h3>
                              <p class="empty-subtitle">
                                  Você ainda não adicionou nenhuma norma.
                              </p>
                              <v-btn 
                                  color="primary" 
                                  variant="elevated"
                                  size="large"
                                  class="empty-action-btn"
                                  @click="$router.push('/homepainel')"
                                  prepend-icon="mdi-plus"
                              >
                                  Adicionar Normas
                              </v-btn>
                          </v-card-text>
                      </v-card>
                    </div>
                </v-card-text>
            </v-card>
        </div>
    </section>
</template>

<script setup>
    import { ref, onMounted } from 'vue';

    import { useGeralStore } from '@/store/GeralStore';
    import { useForumStore } from '@/store/ForumStore'
    import { usePreferencesStore } from '@/store/PreferencesUsersStore';

    import ListForuns from '@/components/legislacao/forum/foruns/listForuns.vue';
    import ConfigMyGroup from '@/components/dialogs/configMyGroup.vue';
    import Loading from '@/components/partiaslLayout/loading.vue';

    const geralStore = useGeralStore()
    const forumStore = useForumStore()
    const preferencesStore = usePreferencesStore()

    const load = ref(false)

    const saveFoldersForum = async (event) => {
        await preferencesStore.saveFolders(event);
    }

    onMounted(async () => {
        load.value = true
        await preferencesStore.loadFolders()
        await setTimeout(async () => {
            load.value = false
        }, 800 )
    })
    
</script>

<style scoped>
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

@keyframes float {
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-10px);
    }
}

/* Header */
.header-section {
    animation: fadeInUp 0.6s ease-out;
    margin-top: 2rem;
    margin-bottom: 2rem;
}

.page-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.title-icon {
    animation: pulse 2s infinite;
}

.custom-divider {
    background: linear-gradient(90deg, #030131, #6366f1, transparent);
    height: 2px;
    border: none;
}
.main-card {
    margin-top: 2rem;
    animation: fadeInUp 0.8s ease-out 0.2s both;
    border-radius: 16px;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    margin-bottom: 2rem;
    min-height: 30rem;
}

.main-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    animation: slideInRight 0.8s ease-out 0.4s both;
}

.title-wrapper {
    flex: 1;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
}

.section-subtitle {
    color: #64748b;
    font-size: 1rem;
    margin: 0;
}

.header-decoration {
    animation: float 3s ease-in-out infinite;
    opacity: 0.7;
}

/* Loading */
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.3s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    animation: fadeInUp 0.6s ease-out;
}

.loading-text {
    margin-top: 1rem;
    color: #64748b;
    font-size: 1.1rem;
}

/* Content section */
.content-section {
    animation: fadeInUp 0.8s ease-out 0.6s both;
}

/* Lista de editais */
.editais-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.editais-list {
    background: transparent;
    padding: 0;
}

.edital-item {
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    transition: all 0.3s ease;
    cursor: pointer;
    animation: fadeInUp 0.6s ease-out both;
}

.edital-item:hover {
    background: linear-gradient(90deg, #f8fafc, #f1f5f9);
    transform: translateX(8px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.edital-item:last-child {
    border-bottom: none;
}

/* Animação escalonada para itens */
.item-0 { animation-delay: 0.1s; }
.item-1 { animation-delay: 0.2s; }
.item-2 { animation-delay: 0.3s; }
.item-3 { animation-delay: 0.4s; }
.item-4 { animation-delay: 0.5s; }

.item-avatar {
    transition: all 0.3s ease;
}

.edital-item:hover .item-avatar {
    transform: scale(1.1);
}

.item-title {
    font-weight: 600;
    color: #1e293b;
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
}

.item-subtitle {
    color: #64748b;
    font-size: 0.95rem;
}

.action-btn {
    transition: all 0.3s ease;
}

.edital-item:hover .action-btn {
    transform: translateX(4px);
    color: #6366f1 !important;
}

/* Estado vazio */
.empty-state-card {
    border-radius: 12px;
    border: 2px dashed #e2e8f0;
    background: linear-gradient(135deg, #fafbff 0%, #f0f4ff 100%);
    animation: fadeInUp 0.8s ease-out 0.4s both;
}

.empty-icon-wrapper {
    margin-bottom: 1.5rem;
}

.empty-icon {
    animation: float 4s ease-in-out infinite;
}

.empty-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #475569;
    margin-bottom: 0.75rem;
}

.empty-subtitle {
    color: #64748b;
    font-size: 1rem;
    margin-bottom: 2rem;
    line-height: 1.5;
}

.empty-action-btn {
    border-radius: 8px;
    padding: 0.75rem 2rem;
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0.025em;
    transition: all 0.3s ease;
}

.empty-action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
}

@media (max-width: 768px) {
    .section-header {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
    }
    
    .header-decoration {
        order: -1;
    }
    
    .edital-item {
        padding: 1rem;
    }
    
    .edital-item:hover {
        transform: none;
    }
    
    .page-title {
        font-size: 1.5rem;
    }
    
    .main-card {
        margin: 0 0.5rem;
    }
}

/* Melhorias de acessibilidade */
.edital-item:focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
}

.empty-action-btn:focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
}

/* Transições suaves para modo escuro (se aplicável) */
* {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
</style>