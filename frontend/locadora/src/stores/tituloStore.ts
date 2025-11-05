import { ref } from 'vue'
import api from '@/api/services/axiosApi'
import { defineStore } from 'pinia'

// Interface Titulo (Em português)
export interface Titulo {
  id: number
  name: string
  year: number
  synopsis: string
  category: string
}

// Store com o nome Titulo
export const useTituloStore = defineStore('titulo', () => {
  const titulos = ref<Titulo[]>([]) // Plural em português
  // O endpoint deve ser ajustado no backend para '/api/titulos'
  const API_ENDPOINT = '/api/titulos'

  // READ ALL
  async function fetchTitulos() {
    try {
      const response = await api.get(API_ENDPOINT)
      titulos.value = response.data
    } catch (error) {
      console.error('Erro ao buscar títulos:', error)
      throw error
    }
  }

  // CREATE
  async function addTitulo(newTitulo: Omit<Titulo, 'id'>) {
    try {
      const response = await api.post(API_ENDPOINT, newTitulo)
      titulos.value.push(response.data)
    } catch (error) {
      console.error('Erro ao adicionar título:', error)
      throw error
    }
  }

  // UPDATE
  async function updateTitulo(updatedTitulo: Titulo) {
    try {
      await api.put(`${API_ENDPOINT}/${updatedTitulo.id}`, updatedTitulo)

      const index = titulos.value.findIndex((t) => t.id === updatedTitulo.id)
      if (index !== -1) {
        titulos.value[index] = updatedTitulo
      }
    } catch (error) {
      console.error('Erro ao atualizar título:', error)
      throw error
    }
  }

  // DELETE
  async function deleteTitulo(id: number) {
    try {
      await api.delete(`${API_ENDPOINT}/${id}`)
      titulos.value = titulos.value.filter((t) => t.id !== id)
    } catch (error) {
      console.error('Erro ao deletar título:', error)
      throw error
    }
  }

  return { titulos, fetchTitulos, addTitulo, updateTitulo, deleteTitulo }
})
