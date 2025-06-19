import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLoginStore } from '@/store/LoginStore'
import { useSnackStore } from '@/store/snackStore'
import api from "@/services/api"

export const useBlogLawStore = defineStore('bloglaw', () => {
    const posts = ref([])
    const loading = ref(false)
    const error = ref(null)

    const snackStore = useSnackStore()
    const loginStore = useLoginStore() 

    // Computed
    const sortedPosts = computed(() => {
        const list = posts.value
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

    // Actions
    const fetchPosts = async (id) => {
        loading.value = true
        error.value = null

        console.log('fetchposts', userLogin.value);
        try {
            const response = await api.get('blog_law/_search', {
                size: 1000,
                sort: [
                    { "createdAt": { "order": "desc" } }
                ],
                query: {
                    "match": {
                        "id_law": id
                    }
                }
            })
            posts.value = response.data.hits?.hits?.map(hit => ({ id: hit._id, ...hit._source })) || []
        } catch (err) {
            error.value = err.response?.data?.message || err.message || 'Erro ao buscar posts'
            console.error('Erro ao carregar posts:', err)
        } finally {
            loading.value = false
        }
    }

    const createPost = async (postData) => {
        postData.createdAt = formatDate.value
        try {
            const response = await api.post('blog_law/_doc', postData)
            posts.value.push({id: response.data._id, ...postData})
            console.log('createPost', response);
        } catch (err) {
            error.value = err.response?.data?.message || err.message || 'Erro ao criar post'
            console.error('Erro ao criar post:', err)
        }
    }   

    return {
        posts,
        loading,
        error,
        sortedPosts,
        fetchPosts,
        createPost
    }
})
