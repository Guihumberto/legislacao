import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLoginStore } from '@/store/LoginStore'
import { useSnackStore } from '@/store/snackStore'
import { useForumStore } from './ForumStore'
import api from "@/services/api"

export const usePreferencesStore = defineStore('preferences', () => {
    const foldersForum = ref([])
    const loading = ref(false)
    const error = ref(null)

    const snackStore = useSnackStore()
    const loginStore = useLoginStore() 
    const forumStore = useForumStore()

    // Computed
    const userLogin = computed(() => {
        const data = sessionStorage.getItem('userData') || localStorage.getItem('userData');
        const login = JSON.parse(data).cpf || null     
            
        return loginStore.readLogin?.cpf || login
    })

    // Actions
    const loadFolders = async () => {
        const userId = userLogin.value || 'anonymous'
        const documentId = `folders_${userId}_forum`
        foldersForum.value = []
        
        try {
            const response = await api.get(`user_preferences/_doc/${documentId}`)

            if(!response.data.found){
                console.log('não foram encontrados registros');
                return
            }

            if (response.status === 404) {
                // Documento não existe ainda, não é um erro
                console.log('Nenhuma pasta encontrada para este usuário')
                return
            }

            const result = await response.data
            
            if (result.found && result._source?.folders) {
                const foldersData = result._source.folders
                
                foldersForum.value = foldersData.map(folder => ({
                    ...folder,
                    dragOver: false,
                    items: folder.items.map(savedItem => {
                        // Encontra o item completo no store
                        const fullItem = forumStore.readMyGroup.find(item => item.id === savedItem.id)
                        return fullItem || savedItem
                    })
                }))
            }
        } catch (error) {
            console.error('Erro ao carregar pastas do Elasticsearch:', error)
            snackStore.activeSnack('Erro ao carregar pastas', 'error')
        }
    }

    const saveFolders = async (item) => {
        const userId = userLogin.value || 'anonymous'
        const documentId = `folders_${userId}_forum`
        
        const foldersData = {
            user_id: userId,
            type: "foruns",
            folders: item.map(folder => ({
                id: folder.id,
                name: folder.name,
                items: folder.items.map(item => ({ id: item.id, title: item.title })),
                expanded: folder.expanded
            })),
            updated_at: new Date().toISOString()
        }

        try {
            const response = await api.put(`user_preferences/_doc/${documentId}`, foldersData)
            foldersForum.value = item
            console.log('Pastas salvas no Elasticsearch:', response.data)
        } catch (error) {
            console.log('error ao salvar pasta');
        }
    }

    return {
        foldersForum,
        loading,
        error,
        loadFolders,
        saveFolders,
    }
})
