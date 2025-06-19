<template>
    <div class="my-5">
        <!-- Botão para criar nova pasta -->
        <div class="mb-4 d-flex justify-end align-center">
            <v-btn
                color="primary"
                variant="outlined"
                prepend-icon="mdi-folder-plus"
                @click="createFolder"
            >
                Nova Pasta
            </v-btn>
        </div>

        <!-- Dialog para criar/editar pasta -->
        <v-dialog v-model="folderDialog" max-width="400">
        <v-card>
            <v-card-title>
            {{ editingFolder ? 'Editar Pasta' : 'Criar Nova Pasta' }}
            </v-card-title>
            <v-card-text>
            <v-text-field
                v-model="folderName"
                label="Nome da pasta"
                variant="outlined"
                autofocus
                @keyup.enter="saveFolder"
            ></v-text-field>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="folderDialog = false">Cancelar</v-btn>
            <v-btn color="primary" @click="saveFolder">
                {{ editingFolder ? 'Salvar' : 'Criar' }}
            </v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>

        <!-- Lista de pastas e itens -->
        <v-list class="pa-0 bg-transparent border rounded">
        <!-- Pastas -->
        <div v-for="folder in folders" :key="'folder-' + folder.id">
            <v-list-item
            class="folder-item"
            :class="{ 'drag-over': folder.dragOver }"
            @dragover.prevent="onDragOver(folder)"
            @dragleave="onDragLeave(folder)"
            @drop="onDrop(folder)"
            >
            <template #prepend>
                <v-icon :icon="folder.expanded ? 'mdi-folder-open' : 'mdi-folder'"></v-icon>
            </template>
            
            <v-list-item-title @click="toggleFolder(folder)">
                {{ folder.name }}
            </v-list-item-title>
            
            <template #append>
                <div class="d-flex align-center">
                <v-chip size="small" class="mr-2">
                    {{ folder.items.length }}
                </v-chip>
                <v-btn
                    icon="mdi-pencil"
                    size="small"
                    variant="text"
                    @click.stop="editFolder(folder)"
                ></v-btn>
                <v-btn
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    color="error"
                    @click.stop="deleteFolder(folder)"
                ></v-btn>
                </div>
            </template>
            </v-list-item>

            <!-- Itens dentro da pasta -->
            <v-expand-transition>
            <div v-show="folder.expanded" class="folder-content">
                <transition-group name="fade">
                <v-list-item
                    v-for="item in folder.items"
                    :key="'folder-item-' + item.id"
                    class="folder-item-child"
                    color="primary"
                    :to="`/avancado/forumlaw/${item.id}`"
                    draggable="true"
                    @dragstart="(e) => onDragStart(e, item, folder)"
                >
                    <template #prepend>
                    <v-icon icon="mdi-forum" class="ml-4"></v-icon>
                    </template>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                    <template #append>
                    <v-btn
                        icon="mdi-close"
                        size="small"
                        variant="text"
                        @click.stop="removeFromFolder(item, folder)"
                    ></v-btn>
                    </template>
                </v-list-item>
                </transition-group>
            </div>
            </v-expand-transition>
        </div>

        <!-- Área de drop para itens sem pasta -->
        <v-divider v-if="folders.length > 0 && unorganizedItems.length > 0" class="my-2"></v-divider>
        
        <!-- Itens não organizados -->
        <div
            class="unorganized-area"
            :class="{ 'drag-over': unorganizedDragOver }"
            @dragover.prevent="onDragOverUnorganized"
            @dragleave="onDragLeaveUnorganized"
            @drop="onDropUnorganized"
        >
            <v-list-subheader v-if="unorganizedItems.length > 0">
            Itens não organizados
            </v-list-subheader>
            <transition-group name="fade">
            <v-list-item
                v-for="item in unorganizedItems"
                :key="'unorganized-' + item.id"
                color="primary"
                :to="`/avancado/forumlaw/${item.id}`"
                prepend-icon="mdi-forum"
                draggable="true"
                @dragstart="(e) => onDragStart(e, item, null)"
            >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
            </transition-group>
        </div>
        </v-list>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted, watch } from 'vue'
    import { useForumStore } from '@/store/ForumStore'
    const forumStore = useForumStore()

    const props = defineProps({
        foldersES: {
            type: Array,
            default: () => []
        }
    })

    // Estados reativos
    const folders = ref([])
    const folderDialog = ref(false)
    const folderName = ref('')
    const editingFolder = ref(null)
    const draggedItem = ref(null)
    const draggedFromFolder = ref(null)
    const unorganizedDragOver = ref(false)

    const emits = defineEmits(['saveFoldersForum'])

    // Computed para itens não organizados
    const unorganizedItems = computed(() => {
        const organizedItemIds = new Set()
        folders.value.forEach(folder => {
            folder.items.forEach(item => {
            organizedItemIds.add(item.id)
            })
        })
        
        return forumStore.readMyGroup.filter(item => !organizedItemIds.has(item.id))
    })

    // Funções para gerenciar pastas
    const createFolder = () => {
        folderName.value = ''
        editingFolder.value = null
        folderDialog.value = true
    }

    const editFolder = (folder) => {
        folderName.value = folder.name
        editingFolder.value = folder
        folderDialog.value = true
    }

    const saveFolder = () => {
        if (!folderName.value.trim()) return
        
        if (editingFolder.value) {
            editingFolder.value.name = folderName.value.trim()
        } else {
            const newFolder = {
                id: Date.now(),
                name: folderName.value.trim(),
                items: [],
                expanded: true,
                dragOver: false
            }
            folders.value.push(newFolder)
        }
        
        folderDialog.value = false
        saveFoldersToStorage()
    }

    const deleteFolder = (folder) => {
        if (confirm(`Tem certeza que deseja excluir a pasta "${folder.name}"?`)) {
            const index = folders.value.indexOf(folder)
            folders.value.splice(index, 1)
            saveFoldersToStorage()
        }
    }

    const toggleFolder = (folder) => {
        folder.expanded = !folder.expanded
        // saveFoldersToStorage()
    }

    // Funções de drag and drop
    const onDragStart = (event, item, fromFolder) => {
        draggedItem.value = item
        draggedFromFolder.value = fromFolder

        // Criar uma imagem leve de arraste
        const dragImage = document.createElement('div')
        dragImage.textContent = item.name
        dragImage.style.position = 'absolute'
        dragImage.style.top = '-9999px'
        dragImage.style.left = '-9999px'
        dragImage.style.fontSize = '14px'
        dragImage.style.padding = '4px 8px'
        dragImage.style.background = '#eee'
        dragImage.style.border = '1px solid #ccc'
        dragImage.style.borderRadius = '4px'

        document.body.appendChild(dragImage)

        event.dataTransfer.setDragImage(dragImage, 0, 0)

        // Limpa o DOM temporário
        setTimeout(() => {
            document.body.removeChild(dragImage)
        }, 0)
    }
    
    const onDragOver = (folder) => {
        folder.dragOver = true
    }

    const onDragLeave = (folder) => {
        folder.dragOver = false
    }

    const onDrop = (folder) => {
        folder.dragOver = false
        
        if (!draggedItem.value) return
        
        // Remove o item da pasta atual se existir
        if (draggedFromFolder.value) {
            const index = draggedFromFolder.value.items.indexOf(draggedItem.value)
            draggedFromFolder.value.items.splice(index, 1)
        }
        
        // Adiciona o item na nova pasta se não estiver já nela
        if (!folder.items.find(item => item.id === draggedItem.value.id)) {
            folder.items.push(draggedItem.value)
            folder.expanded = true
        }
        
        draggedItem.value = null
        draggedFromFolder.value = null
        saveFoldersToStorage()
    }

    const onDragOverUnorganized = () => {
        unorganizedDragOver.value = true
    }

    const onDragLeaveUnorganized = () => {
        unorganizedDragOver.value = false
    }

    const onDropUnorganized = () => {
        unorganizedDragOver.value = false
        
        if (!draggedItem.value || !draggedFromFolder.value) return
        
        // Remove o item da pasta atual
        const index = draggedFromFolder.value.items.indexOf(draggedItem.value)
        draggedFromFolder.value.items.splice(index, 1)
        
        draggedItem.value = null
        draggedFromFolder.value = null
        saveFoldersToStorage()
    }

    const removeFromFolder = (item, folder) => {
        const index = folder.items.indexOf(item)
        folder.items.splice(index, 1)
        saveFoldersToStorage()
    }

    // Persistência de dados
    const saveFoldersToStorage = () => {
        const foldersData = folders.value.map(folder => ({
            id: folder.id,
            name: folder.name,
            items: folder.items.map(item => ({ id: item.id, title: item.title })),
            expanded: folder.expanded
        }))
        // localStorage.setItem('forum-folders', JSON.stringify(foldersData))
        emits('saveFoldersForum', foldersData)
    }

    const loadFoldersFromStorage = () => {
        folders.value = props.foldersES
    }

    watch(
        () => props.foldersES,
        (newFolders) => {
            loadFoldersFromStorage()
        },
        { deep: true }
    )

    // Inicialização
    onMounted(async () => {
        await loadFoldersFromStorage()
    })
</script>

<style scoped>
    .folder-item {
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .folder-item.drag-over {
        background-color: rgba(var(--v-theme-primary), 0.1);
    }

    .folder-content {
        background-color: rgba(0, 0, 0, 0.02);
        border-left: 3px solid rgba(var(--v-theme-primary), 0.3);
        margin-left: 16px;
    }

    .folder-item-child {
        padding-left: 8px;
    }

    .unorganized-area.drag-over {
        background-color: rgba(var(--v-theme-surface), 0.1);
        border: 2px dashed rgba(var(--v-theme-primary), 0.5);
        border-radius: 4px;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: all 0.3s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }

    /* Estilos para drag and drop */
    [draggable="true"] {
        cursor: grab;
    }

    [draggable="true"]:active {
        cursor: grabbing;
    }
</style>