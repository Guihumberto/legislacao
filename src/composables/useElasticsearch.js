import { ref } from 'vue'
import api from "@/services/api"

export function useElasticsearch() {
 
  const search = async (index, query) => {
    try {
      const response = await api.post(`${index}/_search`, query)
      
      return response.data
    } catch (error) {
      console.error('Erro no Elasticsearch:', error)
      throw error
    }
  }

  const index = async (indexName, doc, id = null) => {
    try {
      const url = id 
        ? `${indexName}/_doc/${id}`
        : `${indexName}/_doc`
      
      const response = await api.post(url, doc)
      
      return response.data
    } catch (error) {
      console.error('Erro ao indexar documento:', error)
      throw error
    }
  }

  const update = async (indexName, id, doc) => {
    try {
      const response = await api.post(`${indexName}/_update/${id}`, { doc })
      
      return response.data
    } catch (error) {
      console.error('Erro ao atualizar documento:', error)
      throw error
    }
  }

  const deleteDoc = async (indexName, id) => {
    try {
      const response = await api.delete(`${indexName}/_doc/${id}`)
      
      return response.data
    } catch (error) {
      console.error('Erro ao deletar documento:', error)
      throw error
    }
  }

  return {
    search,
    index,
    update,
    deleteDoc
  }
}