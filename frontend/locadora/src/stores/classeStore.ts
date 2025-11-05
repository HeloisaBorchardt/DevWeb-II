import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/services/axiosApi'
import type { Classe } from '@/modules/registrations/api/entities/entity'

export type { Classe }

export const useClasseStore = defineStore('classe', () => {
  const classes = ref<Classe[]>([])

  async function fetchClasses() {
    console.log('Buscando classes do backend...')
    try {
      const response = await api.get('/classe')
      classes.value = response.data
      console.log('Classes carregadas:', classes.value)
    } catch (error) {
      console.error('Erro ao buscar classes:', error)
    }
  }

  async function addClasse(newClasse: Omit<Classe, 'id'>) {
    console.log('Adicionando nova classe...', newClasse)
    try {
      const response = await api.post('/classe', newClasse)
      const createdClasse = response.data

      classes.value.push(createdClasse)
      console.log('Classe criada com sucesso:', createdClasse)
    } catch (error) {
      console.error('Erro ao adicionar classe:', error)
      throw error
    }
  }

  async function updateClass(updatedClass: Classe) {
    console.log('Atualizando classe...', updatedClass)
    try {
      // Trocando PUT por POST para evitar o bloqueio de CORS. ver com a Heloara

      await api.post(`/classe`, updatedClass)

      const index = classes.value.findIndex((c) => c.id === updatedClass.id)
      if (index !== -1) {
        classes.value[index] = updatedClass
        console.log('Classe atualizada com sucesso:', updatedClass)
      }
    } catch (error) {
      console.error('Erro ao atualizar classe:', error)
      throw error
    }
  }

  async function deleteClasse(id: number) {
    console.log(`Excluindo classe com ID ${id}...`)
    try {
      await api.delete(`/classe/${id}`)

      classes.value = classes.value.filter((c) => c.id !== id)
      console.log('Classe excluída com sucesso. ID:', id)
    } catch (error) {
      console.error('Erro ao deletar classe:', error)
      throw error
    }
  }

  const getClassById = computed(() => (id: number) => {
    return classes.value.find((c) => c.id === id)
  })

  return {
    classes,
    fetchClasses,
    addClasse,
    updateClass,
    deleteClasse,
    getClassById,
  }
})
