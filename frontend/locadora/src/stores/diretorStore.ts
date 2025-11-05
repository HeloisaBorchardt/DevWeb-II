import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/services/axiosApi'
import type { Diretor } from '@/modules/registrations/api/entities/entity'

export type { Diretor }

export const useDiretorStore = defineStore('diretor', () => {
  const diretores = ref<Diretor[]>([])

  async function fetchDiretores() {
    console.log('Buscando diretores do backend...')
    try {
      const response = await api.get('/diretor')
      diretores.value = response.data
      console.log('Diretores carregados:', diretores.value)
    } catch (error) {
      console.error('Erro ao buscar diretores:', error)
    }
  }

  async function addDiretor(nome: string) {
    try {
      const newDiretorData = { nome }
      const response = await api.post('/diretor', newDiretorData)

      const createdDiretor = response.data
      diretores.value.push(createdDiretor)

      console.log('Diretor adicionado:', createdDiretor)
    } catch (error) {
      console.error('Erro ao adicionar diretor:', error)
      throw error
    }
  }

  async function updateDiretor(updatedDiretor: Diretor) {
    try {
      const response = await api.put('/diretor', updatedDiretor)

      const updated = response.data
      const index = diretores.value.findIndex((d) => d.id === updated.id)
      if (index !== -1) {
        diretores.value[index] = updated
      }

      console.log('  Diretor atualizado:', updated)
    } catch (error) {
      console.error('  Erro ao atualizar diretor:', error)
      throw error
    }
  }

  async function deleteDiretor(id: number) {
    try {
      await api.delete(`/diretor/${id}`)
      diretores.value = diretores.value.filter((d) => d.id !== id)
      console.log(`Diretor com ID ${id} excluído com sucesso`)
    } catch (error) {
      console.error('Erro ao deletar diretor:', error)
      throw error
    }
  }

  const getDiretorById = computed(() => (id: number) => {
    return diretores.value.find((d) => d.id === id)
  })

  return { diretores, fetchDiretores, addDiretor, updateDiretor, deleteDiretor, getDiretorById }
})
