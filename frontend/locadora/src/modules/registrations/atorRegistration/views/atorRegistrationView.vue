<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { useAtorStore, type Ator } from '@/stores/atorStore'
import GenericEditModal from '@/components/GenericEditModal.vue'

const atorStore = useAtorStore()

const newAtornome = ref('')

const isModalVisible = ref(false)
const atorToEdit = reactive<Partial<Ator>>({ id: undefined, nome: '' })

const createAtor = async () => {
  if (newAtornome.value.trim() !== '') {
    try {
      await atorStore.addAtor(newAtornome.value.trim())
      await atorStore.fetchAtores()
      newAtornome.value = ''
      alert('Ator adicionado com sucesso!')
    } catch (e) {
      alert('Falha ao adicionar ator. Verifique o console.')
    }
  }
}

const openModalForEdit = (ator: Ator) => {
  atorToEdit.id = ator.id
  atorToEdit.nome = ator.nome
  isModalVisible.value = true
}

const handleSaveEdit = async (updated: Partial<Ator> | null) => {
  if (!updated) return

  if (updated.id === undefined || (updated.nome || '').trim() === '') {
    alert('Dados inválidos para edição.')
    return
  }

  try {
    await atorStore.updateAtor(updated as Ator)

    isModalVisible.value = false
    atorToEdit.id = undefined
    atorToEdit.nome = ''
    alert('Ator atualizado com sucesso!')
  } catch (e) {
    alert('Falha ao salvar a edição. Verifique o console.')
  }
}

const handleDelete = async (id: number) => {
  if (confirm('Tem certeza que deseja excluir?')) {
    try {
      await atorStore.deleteAtor(id)
      alert('Ator excluído com sucesso!')
    } catch (e) {
      alert('Falha ao excluir. Verifique o console.')
    }
  }
}

onMounted(() => {
  atorStore.fetchAtores()
})
</script>

<template>
  <div class="page-container">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-8 text-primary">Cadastro de Ator</h1>

      <div class="card mb-8 flex gap-3">
        <input
          v-model="newAtornome"
          @keyup.enter="createAtor"
          placeholder="Nome do Novo Ator"
          class="input-styled flex-1"
        />
        <button @click="createAtor" class="btn-primary">
          <i class="mdi mdi-plus"></i> Adicionar Ator
        </button>
      </div>

      <h2 class="text-2xl font-semibold mb-4 text-secondary">Lista de Atores</h2>
      <ul class="space-y-3">
        <li
          v-for="ator in atorStore.atores"
          :key="ator.id"
          class="card flex justify-between items-center"
        >
          <span class="font-medium text-gray-700">{{ ator.id }} - {{ ator.nome }}</span>
          <div class="flex gap-2">
            <button @click="openModalForEdit(ator)" class="btn-secondary text-sm">
              <i class="mdi mdi-lead-pencil"></i> Editar
            </button>
            <button @click="handleDelete(ator.id)" class="btn-primary text-sm">
              <i class="mdi mdi-trash-can"></i> Excluir
            </button>
          </div>
        </li>
      </ul>

      <GenericEditModal
        :isVisible="isModalVisible"
        title="Editar Ator"
        :initialData="{ id: atorToEdit.id, nome: atorToEdit.nome }"
        :formFields="[{ key: 'nome', label: 'Nome', type: 'text' }]"
        @close="isModalVisible = false"
        @save="handleSaveEdit"
      />
    </div>
  </div>
</template>
