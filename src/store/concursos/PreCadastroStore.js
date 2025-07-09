import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLoginStore } from '@/store/LoginStore'
import { useSnackStore } from '@/store/snackStore'
import api from "@/services/api"

export const usePrecadastroStore = defineStore('precadstro', () => {
    const listUser = ref([])
    const loading = ref(false)
    const error = ref(null)

    const snackStore = useSnackStore()
    const loginStore = useLoginStore() 

    const userLogin = computed(() => loginStore.readLogin)
    const listPrecadstro = computed(() => listUser.value)

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

    const fetchPrecadstro = async (id) => {
        loading.value = true
        error.value = null
        try {
            const response = await api.post('precadastro/_search', {
                size: 1000
            })
            listUser.value = response.data.hits?.hits?.map(hit => ({ id: hit._id, ...hit._source })) || []
        } catch (err) {
            error.value = err.response?.data?.message || err.message || 'Erro ao buscar posts'
            console.error('Erro ao carregar posts:', err)
            return error.value
        } finally {
            loading.value = false
        }
    }

    const createPrecadastro = async (emailCad) => {

        const { email = 'null', name, nickname } = userLogin.value

        const postData = {
            emailCad,
            createdAt: formatDate.value,
            email, 
            name, 
            nickname
        }

        try {
            const response = await api.post('precadastro/_doc', postData)
            listUser.value.push({id: response.data._id, ...postData})
            snackStore.activeSnack('Cadastro realizado com sucesso!', 'success')
            return response
        } catch (err) {
            error.value = err.response?.data?.message || err.message || 'Erro ao criar post'
            snackStore.activeSnack('Erro ao cadastrar!', 'error')
            console.error('Erro ao criar post:', err)
            return error.value
        }
    }   

    return {
        listPrecadstro,
        loading,
        error,
        fetchPrecadstro,
        createPrecadastro,
    }
})
