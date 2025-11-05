<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { useDiretorStore, type Diretor } from '@/stores/diretorStore'
import GenericEditModal from '@/components/GenericEditModal.vue'

const diretorStore = useDiretorStore()

const newDiretornome = ref('')
const isModalVisible = ref(false)
const diretorToEdit = reactive<Partial<Diretor>>({ id: undefined, nome: '' })

const createDiretor = async () => {
  if (newDiretornome.value.trim() !== '') {
    try {
      await diretorStore.addDiretor(newDiretornome.value.trim())
      await diretorStore.fetchDiretores()
      newDiretornome.value = ''
      alert('Diretor adicionado com sucesso!')
    } catch (e) {
      alert('Falha ao adicionar diretor. Verifique o console.')
    }
  }
}

const openModalForEdit = (diretor: Diretor) => {
  diretorToEdit.id = diretor.id
  diretorToEdit.nome = diretor.nome
  isModalVisible.value = true
}

const resetDiretorToEdit = () => {
  Object.assign(diretorToEdit, {
    id: undefined,
    nome: '',
  })
}

const handleSaveEdit = async (updated: Partial<Diretor> | null) => {
  if (!updated) return

  if (updated.id === undefined || (updated.nome || '').trim() === '') {
    alert('Dados inválidos para edição.')
    return
  }

  try {
    await diretorStore.updateDiretor(updated as Diretor)

    isModalVisible.value = false
    diretorToEdit.id = undefined
    diretorToEdit.nome = ''
    alert('Diretor atualizado com sucesso!')
  } catch (e) {
    alert('Falha ao salvar a edição. Verifique o console.')
  }
}

const handleCloseModal = () => {
  isModalVisible.value = false
  resetDiretorToEdit()
}

const handleDelete = async (id: number) => {
  if (confirm('Tem certeza que deseja excluir?')) {
    try {
      await diretorStore.deleteDiretor(id)
      alert('Diretor excluído com sucesso!')
    } catch (e) {
      alert('Falha ao excluir. Verifique o console.')
    }
  }
}

onMounted(() => {
  diretorStore.fetchDiretores()
})
</script>

<template>
  <div class="page-container">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-8 text-primary">Cadastro de Diretor</h1>

      <div class="card mb-8 flex gap-3">
        <input
          v-model="newDiretornome"
          @keyup.enter="createDiretor"
          placeholder="Nome do Novo Diretor"
          class="input-styled flex-1"
        />
        <button @click="createDiretor" class="btn-primary">
          <i class="mdi mdi-plus"></i> Adicionar Diretor
        </button>
      </div>

      <h2 class="text-2xl font-semibold mb-4 text-secondary">Lista de Diretores</h2>
      <ul class="space-y-3">
        <li
          v-for="diretor in diretorStore.diretores"
          :key="diretor.id"
          class="card flex justify-between items-center"
        >
          <span class="font-medium text-gray-700">{{ diretor.id }} - {{ diretor.nome }}</span>
          <div class="flex gap-2">
            <button @click="openModalForEdit(diretor)" class="btn-secondary text-sm">
              <i class="mdi mdi-lead-pencil"></i> Editar
            </button>
            <button @click="handleDelete(diretor.id)" class="btn-primary text-sm">
              <i class="mdi mdi-trash-can"></i> Excluir
            </button>
          </div>
        </li>
      </ul>

      <GenericEditModal
        :isVisible="isModalVisible"
        title="Editar Diretor"
        :initialData="{ id: diretorToEdit.id, nome: diretorToEdit.nome }"
        :formFields="[{ key: 'nome', label: 'Nome', type: 'text' }]"
        @close="handleCloseModal"
        @save="handleSaveEdit"
      />
    </div>
  </div>
</template>
