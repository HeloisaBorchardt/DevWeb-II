<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { useTituloStore, type Titulo } from '@/stores/tituloStore'
import GenericEditModal from '@/components/GenericEditModal.vue'
import { type FormField } from '@/api/entities'

const tituloStore = useTituloStore()

const newName = ref('')
const newYear = ref(new Date().getFullYear())
const newSynopsis = ref('')
const newCategory = ref('')

const isModalVisible = ref(false)
const tituloToEdit = reactive<Partial<Titulo>>({
  id: undefined,
  name: '',
  year: 0,
  synopsis: '',
  category: '',
})

const tituloFields: FormField[] = [
  { key: 'name', label: 'Nome', type: 'text' },
  { key: 'year', label: 'Ano', type: 'number' },
  { key: 'category', label: 'Categoria', type: 'text' },
  { key: 'synopsis', label: 'Sinopse', type: 'text' },
]

const addTitulo = async () => {
  if (newName.value.trim() === '' || newYear.value < 1900) {
    alert('Preencha os campos obrigatórios corretamente.')
    return
  }

  try {
    const newTitulo: Omit<Titulo, 'id'> = {
      name: newName.value.trim(),
      year: Number(newYear.value),
      synopsis: newSynopsis.value.trim(),
      category: newCategory.value.trim(),
    }

    await tituloStore.addTitulo(newTitulo)

    newName.value = ''
    newYear.value = new Date().getFullYear()
    newSynopsis.value = ''
    newCategory.value = ''
  } catch (e) {
    alert('Falha ao criar título. Verifique o console.')
  }
}

const openModalForEdit = (titulo: Titulo) => {
  Object.assign(tituloToEdit, titulo)
  isModalVisible.value = true
}

const handleCloseModal = () => {
  isModalVisible.value = false
  Object.assign(tituloToEdit, { id: undefined, name: '', year: 0, synopsis: '', category: '' })
}

const handleSaveEdit = async (updated: Partial<Titulo> | null) => {
  if (!updated || !updated.id) return

  if ((updated.name || '').trim() === '' || (updated.year || 0) < 1900) {
    alert('Nome e Ano são obrigatórios.')
    return
  }

  try {
    const tituloToSave: Titulo = {
      id: updated.id,
      name: updated.name,
      year: Number(updated.year),
      synopsis: updated.synopsis || '',
      category: updated.category || '',
    } as Titulo

    await tituloStore.updateTitulo(tituloToSave)

    handleCloseModal()
    alert(`Título ID ${updated.id} atualizado com sucesso!`)
  } catch (e) {
    alert('Falha ao salvar a edição. Verifique o console.')
  }
}

const handleDelete = (id: number) => {
  if (confirm(`Tem certeza que deseja excluir o Título ID: ${id}?`)) {
    tituloStore.deleteTitulo(id)
  }
}

onMounted(() => {
  tituloStore.fetchTitulos()
})
</script>

<template>
  <div class="page-container">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-4xl font-bold mb-8 text-primary">Cadastro de Título</h1>

      <form @submit.prevent="addTitulo" class="card mb-8 flex flex-col gap-4">
        <div class="flex gap-4">
          <input v-model="newName" placeholder="Nome do Título" class="input-styled flex-grow" />
          <input
            v-model.number="newYear"
            type="number"
            placeholder="Ano"
            class="input-styled w-24"
          />
        </div>

        <div class="flex gap-4">
          <input
            v-model="newCategory"
            placeholder="Categoria (Ex: Ação)"
            class="input-styled w-1/3"
          />

          <textarea
            v-model="newSynopsis"
            placeholder="Sinopse detalhada do Título"
            rows="3"
            class="input-styled flex-grow resize-none"
          ></textarea>
        </div>

        <div class="flex justify-end">
          <button type="submit" class="btn-primary">
            <i class="mdi mdi-plus"></i> Adicionar Título
          </button>
        </div>
      </form>

      <h2 class="text-2xl font-semibold mb-4 text-secondary">Lista de Títulos</h2>
      <ul class="space-y-3">
        <li
          v-for="titulo in tituloStore.titulos"
          :key="titulo.id"
          class="card flex justify-between items-center"
        >
          <span class="font-medium text-gray-700">
            <span class="text-primary font-bold">{{ titulo.name }}</span> ({{ titulo.year }}) |
            Categoria:
            <span class="text-secondary font-semibold">{{ titulo.category }}</span>
            | Sinopse:
            {{ titulo.synopsis.substring(0, 50) + (titulo.synopsis.length > 50 ? '...' : '') }}
          </span>

          <div class="flex gap-2">
            <button @click="openModalForEdit(titulo)" class="btn-secondary text-sm">
              <i class="mdi mdi-lead-pencil"></i> Editar
            </button>
            <button @click="handleDelete(titulo.id)" class="btn-primary text-sm">
              <i class="mdi mdi-trash-can"></i> Excluir
            </button>
          </div>
        </li>
      </ul>

      <GenericEditModal
        :isVisible="isModalVisible"
        title="Editar Título"
        :initialData="tituloToEdit"
        :formFields="tituloFields"
        @close="handleCloseModal"
        @save="handleSaveEdit"
      />
    </div>
  </div>
</template>
