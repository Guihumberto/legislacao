<template>
   <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <!-- Header com animação -->
            <div class="header-section">
                <h1 class="page-title"> 
                    <v-icon color="#030131" size="1.9rem" class="title-icon">mdi-account</v-icon>
                    Área do Usuário
                </h1>
                <v-divider class="custom-divider"></v-divider>
            </div>

            <!-- Card principal com animação -->
            <v-card class="main-card" elevation="8">
                <v-card-text class="pa-8">
                    <!-- Seção de título -->
                    <div class="section-header" v-if="!load">
                        <div class="title-wrapper">
                            <h2 class="section-title">Painel de Editais</h2>
                            <p class="section-subtitle">Gerencie seus concursos</p>
                        </div>
                        <v-icon class="header-decoration" color="primary" size="3rem">mdi-clipboard-list-outline</v-icon>
                    </div>

                    <!-- Loading state -->
                    <div v-if="load" class="loading-container">
                        <v-progress-circular
                            indeterminate
                            color="primary"
                            size="64"
                            width="4"
                        ></v-progress-circular>
                        <p class="loading-text">Carregando seus editais...</p>
                    </div>

                    <!-- Conteúdo principal -->
                    <div v-if="!load" class="content-section">
                        <!-- Lista de editais -->
                        <v-card 
                            v-if="conteudoStore.readEditarUser.length" 
                            class="editais-card"
                            elevation="2"
                        >
                            <v-list class="editais-list">
                                <v-list-item 
                                    v-for="(item, i) in conteudoStore.readEditarUser" 
                                    :key="item.id"
                                    @click="navigateToEdital(item)"
                                    class="edital-item"
                                    :class="`item-${i}`"
                                >
                                    <template v-slot:prepend>
                                        <v-avatar class="item-avatar" color="primary" variant="tonal">
                                            <v-icon>mdi-account-tie</v-icon>
                                        </v-avatar>
                                    </template>

                                    <v-list-item-title class="item-title">
                                        {{ item.cargo }}
                                    </v-list-item-title>
                                    
                                    <v-list-item-subtitle class="item-subtitle">
                                        {{ item.concurso }}
                                    </v-list-item-subtitle>

                                    <template v-slot:append>
                                        <v-menu>
                                            <template v-slot:activator="{ props }">
                                                <v-btn
                                                    variant="text"
                                                    color="primary"
                                                    v-bind="props"
                                                    icon="mdi-dots-vertical"
                                                    class="action-btn"
                                                >
                                                
                                                </v-btn>
                                            </template>
                                            <v-list class="pa-0">
                                                <v-list-item
                                                    :append-icon="menu.icon"
                                                    v-for="(menu, index) in menuItems"
                                                    :key="index"
                                                    :value="index"
                                                    @click="handleMenuClick(menu, item)"
                                                >
                                                    <v-list-item-title>{{ menu.title }}</v-list-item-title>
                                                </v-list-item>
                                            </v-list>
                                        </v-menu>
                                    </template>
                                </v-list-item>
                            </v-list>
                        </v-card>

                        <!-- Estado vazio -->
                        <v-card v-else class="empty-state-card" elevation="2">
                            <v-card-text class="text-center pa-8">
                                <div class="empty-icon-wrapper">
                                    <v-icon class="empty-icon" color="grey-lighten-1" size="5rem">
                                        mdi-clipboard-outline
                                    </v-icon>
                                </div>
                                <h3 class="empty-title">Nenhum edital encontrado</h3>
                                <p class="empty-subtitle">
                                    Você ainda não adicionou nenhum edital ao seu painel
                                </p>
                                <v-btn 
                                    color="primary" 
                                    variant="elevated"
                                    size="large"
                                    class="empty-action-btn"
                                    @click="$router.push('/homepainel')"
                                    prepend-icon="mdi-plus"
                                >
                                    Adicionar Editais
                                </v-btn>
                            </v-card-text>
                        </v-card>
                    </div>
                </v-card-text>
            </v-card>
        </div>
        <DeleteConcursoArea :delete="itemDelete" @delete="actionDeleteItem"/>
    </section>
</template>

<script setup>
    import { onMounted, provide, ref } from 'vue';
    import { useGeralStore } from '@/store/GeralStore';
    import { useConteudoEditalStore } from '@/store/concursos/ConteudoEditalStore';
    import { useRouter } from 'vue-router';
    import DeleteConcursoArea from '@/components/painel/concurso/deleteConcursoArea.vue';
    const router = useRouter()
    
    const geralStore = useGeralStore()
    const conteudoStore = useConteudoEditalStore()
    
    const load = ref(false)
    const itemDelete = ref({})
    const dialog = ref(false)
    provide('dialog', dialog)

    const navigateToEdital = (item) => {
        const route = `/areauser/concurso/${item.id}?concurso=${item.concurso}&cargo=${item.cargo}`
        router.push(route)
    }

    const menuItems = [
        { id: 1, icon:'mdi-arrow-right', title: 'Entrar' },
        { id: 2, icon:'mdi-delete', title: 'Apagar' },
    ]

    const handleMenuClick = (item, delItem) => {
        if(item.id == 1) {
            navigateToEdital(delItem)
        }
        if(item.id == 2) {
            itemDelete.value = delItem
            dialog.value = true
        }
    }

    const actionDeleteItem = async() => {
        await conteudoStore.deleteEditalUser(itemDelete.value.id)
        dialog.value = false
    }

    onMounted(async() => {
        load.value = true
        await conteudoStore.getEditalUser()
        load.value = false
    })
</script>

<style scoped>
/* Animações globais */
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

/* Card principal */
.main-card {
    animation: fadeInUp 0.8s ease-out 0.2s both;
    border-radius: 16px;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.main-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

/* Seção header */
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

/* Responsividade */
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