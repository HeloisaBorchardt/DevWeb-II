import { ref } from 'vue'
import api from '@/api/services/axiosApi'
import { defineStore } from 'pinia'

export interface Item {
  numSerie: number
  dtAquisicao: string // YYYY-MM-DD
  tipoItem: string
}

export const useItemStore = defineStore('item', () => {
  const itens = ref<Item[]>([])
  const API_ENDPOINT = '/itens'

  // -------------------------------------------------------------------
  // READ ALL: Buscar todos os Itens
  // -------------------------------------------------------------------
  async function fetchItens() {
    try {
      // GET /api/itens
      const response = await api.get(API_ENDPOINT)
      itens.value = response.data
    } catch (error) {
      console.error('Erro ao buscar itens:', error)
      throw error
    }
  }

  // -------------------------------------------------------------------
  // CREATE: Adicionar um novo Item
  // -------------------------------------------------------------------
  async function addItem(newItem: Omit<Item, 'numSerie'>) {
    try {
      const response = await api.post(API_ENDPOINT, newItem)
      itens.value.push(response.data)
    } catch (error) {
      console.error('Erro ao adicionar item:', error)
      throw error
    }
  }

  // -------------------------------------------------------------------
  // UPDATE: Atualizar Item (PUT)
  // -------------------------------------------------------------------
  async function updateItem(updatedItem: Item) {
    try {
      await api.put(`${API_ENDPOINT}/${updatedItem.numSerie}`, updatedItem)

      const index = itens.value.findIndex((i) => i.numSerie === updatedItem.numSerie)
      if (index !== -1) {
        itens.value[index] = updatedItem
      }
    } catch (error) {
      console.error('Erro ao atualizar item:', error)
      throw error
    }
  }

  async function deleteItem(id: number) {
    try {
      await api.delete(`${API_ENDPOINT}/${id}`)
      itens.value = itens.value.filter((i) => i.numSerie !== id)
    } catch (error) {
      console.error('Erro ao deletar item:', error)
      throw error
    }
  }

  return { itens, fetchItens, addItem, updateItem, deleteItem }
})
