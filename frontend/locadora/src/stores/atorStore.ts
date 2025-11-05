import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/services/axiosApi'
import type { Ator } from '@/modules/registrations/api/entities/entity'

export type { Ator }

export const useAtorStore = defineStore('ator', () => {
  const atores = ref<Ator[]>([])

  async function fetchAtores() {
    console.log('Buscando atores do backend...')
    try {
      const response = await api.get('/ator')
      atores.value = response.data
      console.log('Atores carregados:', atores.value)
    } catch (error) {
      console.error(' Erro ao buscar atores:', error)
    }
  }

  async function addAtor(nome: string) {
    try {
      const newAtorData = { nome }
      const response = await api.post('/ator', newAtorData)

      const createdActor = response.data
      atores.value.push(createdActor)

      console.log(' Ator adicionado:', createdActor)
    } catch (error) {
      console.error(' Erro ao adicionar ator:', error)
      throw error
    }
  }

  async function updateAtor(updatedAtor: Ator) {
    try {
      const response = await api.put('/ator', updatedAtor)

      const updated = response.data
      const index = atores.value.findIndex((a) => a.id === updated.id)
      if (index !== -1) {
        atores.value[index] = updated
      }

      console.log('  Ator atualizado:', updated)
    } catch (error) {
      console.error('  Erro ao atualizar ator:', error)
      throw error
    }
  }

  async function deleteAtor(id: number) {
    try {
      await api.delete(`/ator/${id}`)
      atores.value = atores.value.filter((a) => a.id !== id)
      console.log(`🗑️ Ator com ID ${id} excluído com sucesso`)
    } catch (error) {
      console.error('  Erro ao deletar ator:', error)
      throw error
    }
  }

  const getAtorById = computed(() => (id: number) => {
    return atores.value.find((a) => a.id === id)
  })

  return { atores, fetchAtores, addAtor, updateAtor, deleteAtor, getAtorById }
})
