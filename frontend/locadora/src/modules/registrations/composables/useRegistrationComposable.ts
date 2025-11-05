// src/composables/useRegistrationLogic.ts

import { ref } from 'vue'
import type { Ref } from 'vue'
import type { FormField } from '@/api/entities'
import { useAtorStore } from '@/stores/atorStore' // Exemplo: Importa o store de Ator
import { useDiretorStore } from '@/stores/diretorStore' // Exemplo: Importa o store de Diretor
import { useClasseStore } from '@/stores/classeStore' // Exemplo: Importa o store de Classe

// Define o tipo para os stores que possuem as ações CRUD
type CrudStore<T> = {
  items: Ref<T[]>
  fetchItems: () => Promise<void>
  addItem: (data: Omit<T, 'id'>) => Promise<void>
  updateItem: (data: T) => Promise<void>
  deleteItem: (id: number) => Promise<void>
}

// Define o composable que recebe o nome do store e os campos do formulário
export function useRegistrationLogic<T extends { id: number }>(
  storenome: 'ator' | 'diretor' | 'classe',
  fields: FormField[],
) {
  // ---------------------------------------------------
  // 1. DADOS BASE (Store e Tipagem)
  // ---------------------------------------------------

  // Mapeia o nome da string para a instância real da store (requer alguma adaptação de tipos)
  // Nota: Na prática com Typescript e Pinia, essa tipagem é complexa.
  // Vamos simplificar injetando os stores.

  let store: any
  let fetchItems: () => Promise<void>
  let addItem: (data: any) => Promise<void>
  let updateItem: (data: any) => Promise<void>
  let deleteItem: (id: number) => Promise<void>
  let items: Ref<T[]>

  if (storenome === 'ator') {
    const atorStore = useAtorStore()
    store = atorStore
    fetchItems = atorStore.fetchAtores
    addItem = (data: any) => atorStore.addAtor(data.nome) // Adapta para a função que só recebe 'nome'
    updateItem = atorStore.updateAtor
    deleteItem = atorStore.deleteAtor
    items = store.atores as Ref<T[]>
  } else if (storenome === 'diretor') {
    const diretorStore = useDiretorStore()
    store = diretorStore
    fetchItems = diretorStore.fetchDiretores
    addItem = (data: any) => diretorStore.addDiretor(data.nome) // Adapta
    updateItem = diretorStore.updateDiretor
    deleteItem = diretorStore.deleteDiretor
    items = store.diretores as Ref<T[]>
  } else if (storenome === 'classe') {
    const classStore = useClassStore()
    store = classStore
    fetchItems = classStore.fetchClasses
    addItem = classStore.addClass
    updateItem = classStore.updateClass
    deleteItem = classStore.deleteClass
    items = store.classes as Ref<T[]>
  } else {
    throw new Error(`Store ${storenome} não é reconhecida.`)
  }

  // ---------------------------------------------------
  // 2. ESTADO GENÉRICO DO MODAL E CRUD
  // ---------------------------------------------------
  const isModalVisible = ref(false)
  const itemToEdit = ref<T | null>(null)
  const formFields = ref<FormField[]>(fields)
  const currentItemData = ref<Record<string, any>>({}) // Estado para criação (POST)

  // ---------------------------------------------------
  // 3. FUNÇÕES DE CRIAÇÃO (POST)
  // ---------------------------------------------------

  const handleAddItem = async (data: Record<string, any>) => {
    try {
      // Remove o ID antes de enviar para criação
      const { id, ...itemData } = data

      // Chamada adaptada para o método addItem da store (que lida com a API)
      await addItem(itemData as Omit<T, 'id'>)

      // Limpar os dados de criação ou dar feedback
      console.log('Item adicionado com sucesso!')
      return true // Sucesso na criação
    } catch (e) {
      console.error(`Falha ao adicionar ${storenome}:`, e)
      return false // Falha na criação
    }
  }

  // ---------------------------------------------------
  // 4. FUNÇÕES DO MODAL (EDIÇÃO)
  // ---------------------------------------------------

  const startEdit = (item: T) => {
    itemToEdit.value = item
    isModalVisible.value = true
  }

  const handleSave = async (updatedData: T) => {
    try {
      await updateItem(updatedData)
      console.log(`Item ID ${updatedData.id} atualizado com sucesso!`)
      closeModal()
    } catch (e) {
      console.error(`Falha ao salvar a edição de ${storenome}:`, e)
      // Você pode re-lançar o erro ou lidar com ele
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm(`Tem certeza que deseja excluir o item ID ${id}?`)) {
      try {
        await deleteItem(id)
      } catch (e) {
        console.error(`Falha ao excluir ${storenome}:`, e)
      }
    }
  }

  const closeModal = () => {
    isModalVisible.value = false
    itemToEdit.value = null
  }

  // ---------------------------------------------------
  // 5. RETORNO
  // ---------------------------------------------------
  return {
    // Estado
    items,
    isModalVisible,
    itemToEdit,
    formFields,

    // Ações CRUD
    fetchItems,
    handleAddItem,
    handleDelete,

    // Ações de Modal
    startEdit,
    handleSave,
    closeModal,
  }
}
