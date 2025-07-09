import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLoginStore } from '@/store/LoginStore'
import { useSnackStore } from '@/store/snackStore'
import { useMapaMentalStore } from '../concursos/MapasMentaisStore'
import { useOptionsStore } from '../concursos/OptionsStore'
import { useDailyCredits } from "@/store/admin_signature/DailyCreditsStore";

import api from "@/services/api"
import apiChat from "@/services/api_chat"

export const useMindMapInteractive = defineStore('mindMapInt', () => {
    const mindMaps = ref([])
    const loading = ref(false)
    const error = ref(null)

    const snackStore = useSnackStore()
    const loginStore = useLoginStore() 
    const mindMapStore = useMapaMentalStore()
    const optionsStore = useOptionsStore()
    const dailyCredit = useDailyCredits()

    // Computed
    const sortedMindMap = computed(() => {
        const list = mindMaps.value
        return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    })

    const userLogin = computed(() => loginStore.readLogin?.cpf)

    const formatDate = computed(() => {
      const now = new Date();
      
      const day = String(now.getDate()).padStart(2, '0');  // Garante 2 dígitos para o dia
      const month = String(now.getMonth() + 1).padStart(2, '0');  // Meses começam em 0, então somamos 1
      const year = now.getFullYear();
      
      const hours = String(now.getHours()).padStart(2, '0');  // Garante 2 dígitos para a hora
      const minutes = String(now.getMinutes()).padStart(2, '0');  // Garante 2 dígitos para os minutos
      
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    })

    const masterUser = computed(() => optionsStore.readUserMaster)

    // Actions
    const fetchMindMaps = async (id) => {
        loading.value = true
        error.value = null
        try {
            const response = await api.post('mind_maps_int/_search', {
                size: 100,
                query: {
                    "match": {
                        "id_law": id
                    }
                }
            })
            mindMaps.value = response.data.hits?.hits?.map(hit => ({ id: hit._id, ...hit._source })) || []
        } catch (err) {
            error.value = err.response?.data?.message || err.message || 'Erro ao buscar mindmap int'
            console.error('Erro ao carregar posts:', err)
        } finally {
            loading.value = false
        }
    }

    const createMindMap = async (postData) => {
        postData.createdAt = formatDate.value
        try {
            const response = await api.post('blog_law_v2/_doc', postData)
            mindMaps.value.push({id: response.data._id, ...postData})
            console.log('createPost', response);
        } catch (err) {
            error.value = err.response?.data?.message || err.message || 'Erro ao criar post'
            console.error('Erro ao criar post:', err)
        }
    }   

    const infoAPI = async () => {
        try {
            const response = await apiChat.get('forum/info')
            console.log('info', response.data);
            return response.data
        } catch (err) {
            error.value = err.response?.data?.message || err.message || 'Erro ao buscar posts'
            console.error('Erro ao carregar posts:', err)
        }
    }

    const healthAPI = async () => {
        try {
            const response = await apiChat.get('forum/health')
            console.log('helth', response.data);
            return response.data
        } catch (err) {
            error.value = err.response?.data?.message || err.message || 'Erro ao buscar posts'
            console.error('Erro ao carregar posts:', err)
        }
    }

    const genereteMindMapIa = async (postData) => {
        // if(userLogin.value) return

        const arts = [  postData.art, ...postData.arts].map(art => parseInt(art))
        const artsNoRepeat = [...new Set(arts)]
        const dipositivosText =  mindMapStore.getDispositvosForum(artsNoRepeat)

        if(!dipositivosText) return

        postData.createdAt = formatDate.value
        postData.texto = dipositivosText.replace(/<[^>]*>/g, '');

        const hasCredit = await dailyCredit.checkCreditsBalance()

        if(!hasCredit?.remaining){
            infoSnackNoCredits()
            return
        }

        dailyCredit.canUseCredits()

        try {
            const resp = await apiChat.post('forum/gerar_post', postData)
            delete postData.texto
            mindMaps.value.push({ ...postData, ...resp.data.data })
            return resp.data.analysisData
        } catch (err) {
            error.value = err.response?.data?.message || err.message || 'Erro ao criar post'
            console.error('Erro ao criar post:', err)
        }
    }

    const infoSnackNoCredits = () => {
        snackStore.activeSnack('Você não tem créditos suficientes para realizar essa ação', 'error')
    }

    return {
        mindMaps,
        loading,
        error,
        sortedMindMap,
        masterUser,
        fetchMindMaps,
        createMindMap,
        genereteMindMapIa,
        infoAPI,
        healthAPI,
    }
})
