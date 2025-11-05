<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useClasseStore, type Classe } from '@/stores/classeStore'
import GenericEditModal from '@/components/GenericEditModal.vue'
import { type FormField } from '@/api/entities'

const classeStore = useClasseStore()
const newClassenome = ref('')
const newClassevalor = ref(0.0)
const newClasseDeadline = ref(1)

const isModalVisible = ref(false)

const classToEdit = reactive<Partial<Classe>>({
  //retirar o type
  id: undefined,
  nome: '',
  valor: 0.0,
  prazoDevolucao: 1,
})

const classFields: FormField[] = [
  { key: 'nome', label: 'Nome da Classe', type: 'text' },
  { key: 'valor', label: 'Valor (R$)', type: 'number', step: '0.01' },
  { key: 'data', label: 'Prazo (Dias)', type: 'number' },
]

const addClasse = async () => {
  if (
    newClassenome.value.trim() !== '' &&
    newClassevalor.value > 0 &&
    newClasseDeadline.value > 0
  ) {
    const newClasse: Omit<Classe, 'id'> = {
      nome: newClassenome.value.trim(),
      valor: newClassevalor.value,
      prazoDevolucao: newClasseDeadline.value,
    }
    try {
      await classeStore.addClasse(newClasse)
      await classeStore.fetchClasses()
      newClassenome.value = ''
      newClassevalor.value = 0.0
      newClasseDeadline.value = 1
      alert('Classe adicionada com sucesso!')
    } catch (e) {
      alert('Falha ao adicionar classe. Verifique o console.')
    }
  }
}

const resetClassToEdit = () => {
  Object.assign(classToEdit, { id: undefined, nome: '', valor: 0.0, data: 1 })
}

const openModalForEdit = (classe: Classe) => {
  Object.assign(classToEdit, classe)
  isModalVisible.value = true
}

const handleCloseModal = () => {
  isModalVisible.value = false
  resetClassToEdit()
}

const handleSaveEdit = async (updated: Partial<Classe> | null) => {
  if (!updated) return

  if (
    updated.id === undefined ||
    (updated.nome || '').trim() === '' ||
    (updated.valor || 0) <= 0 ||
    (updated.prazoDevolucao || 0) <= 0
  ) {
    alert('Dados inválidos para edição. Valor e Prazo devem ser maiores que zero.')
    return
  }

  try {
    const classToSave: Classe = {
      id: updated.id,
      nome: updated.nome,
      valor: Number(updated.valor),
      prazoDevolucao: Number(updated.prazoDevolucao),
    } as unknown as Classe

    await classeStore.updateClass(classToSave)

    handleCloseModal()
    alert(`Classe ID ${updated.id} atualizada com sucesso!`)
  } catch (e) {
    console.error('Falha ao salvar a edição:', e)
    alert('Falha ao salvar a edição. Verifique o console.')
  }
}

const handleDelete = async (id: number) => {
  if (confirm('Tem certeza que deseja excluir?')) {
    try {
      await classeStore.deleteClasse(id)
      alert('Classe excluída com sucesso!')
    } catch (e) {
      alert('Falha ao excluir. Verifique o console.')
    }
  }
}

onMounted(() => {
  classeStore.fetchClasses()
})
</script>

<template>
  <div class="page-container">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-4xl font-bold mb-8 text-primary">Cadastro de Classe</h1>

      <form @submit.prevent="addClasse" class="card mb-8 flex gap-3 flex-wrap">
        <input
          v-model="newClassenome"
          placeholder="Nome da Classe"
          class="input-styled flex-1 min-w-[200px]"
        />
        <input
          v-model.number="newClassevalor"
          type="number"
          step="0.01"
          placeholder="Preço (R$)"
          class="input-styled w-32"
        />
        <input
          v-model.number="newClasseDeadline"
          type="number"
          placeholder="Prazo (Dias)"
          class="input-styled w-36"
        />
        <button type="submit" class="btn-primary">
          <i class="mdi mdi-plus"></i> Adicionar Classe
        </button>
      </form>

      <h2 class="text-2xl font-semibold mb-4 text-secondary">Lista de Classes</h2>
      <ul class="space-y-3">
        <li
          v-for="classeItem in classeStore.classes"
          :key="classeItem.id"
          class="card flex justify-between items-center"
        >
          <span class="font-medium text-gray-700">
            <span class="text-primary font-bold">{{ classeItem.nome }}</span> | Valor:
            <span class="text-secondary font-semibold"
              >R$
              {{
                classeItem.valor !== null && classeItem.valor !== undefined
                  ? classeItem.valor.toFixed(2)
                  : '0.00'
              }}</span
            >
            | Prazo:
            <span class="text-primary font-semibold">{{ classeItem.prazoDevolucao }} dias</span>
          </span>
          <div class="flex gap-2">
            <button @click="openModalForEdit(classeItem)" class="btn-secondary text-sm">
              <i class="mdi mdi-lead-pencil"></i> Editar
            </button>
            <button @click="handleDelete(classeItem.id)" class="btn-primary text-sm">
              <i class="mdi mdi-trash-can"></i> Excluir
            </button>
          </div>
        </li>
      </ul>

      <GenericEditModal
        :isVisible="isModalVisible"
        title="Editar Classe"
        :initialData="{
          id: classToEdit.id,
          nome: classToEdit.nome,
          valor: classToEdit.valor,
          prazoDevolucao: classToEdit.prazoDevolucao,
        }"
        :formFields="classFields"
        @close="handleCloseModal"
        @save="handleSaveEdit"
      />
    </div>
  </div>
</template>
