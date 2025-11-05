<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { useItemStore, type Item } from '@/stores/itemStore'
import GenericEditModal from '@/components/GenericEditModal.vue'
import { type FormField } from '@/api/entities'

const itemStore = useItemStore()

const newDtAquisicao = ref(new Date().toISOString().substring(0, 10))
const newTipoItem = ref('')

const isModalVisible = ref(false)
const itemToEdit = reactive<Partial<Item>>({ numSerie: undefined, dtAquisicao: '', tipoItem: '' })

const itemFields: FormField[] = [
  { key: 'dtAquisicao', label: 'Data de Aquisição', type: 'date' },
  { key: 'tipoItem', label: 'Tipo do Item', type: 'text' },
]

const addItem = async () => {
  if (newTipoItem.value.trim() === '' || newDtAquisicao.value === '') {
    alert('Preencha a data e o tipo do item corretamente.')
    return
  }

  try {
    const newItem: Omit<Item, 'numSerie'> = {
      dtAquisicao: newDtAquisicao.value,
      tipoItem: newTipoItem.value.trim(),
    }

    await itemStore.addItem(newItem)

    newTipoItem.value = ''
    newDtAquisicao.value = new Date().toISOString().substring(0, 10)
  } catch (e) {
    alert('Falha ao criar item. Verifique o console.')
  }
}

const resetItemToEdit = () => {
  Object.assign(itemToEdit, { numSerie: undefined, dtAquisicao: '', tipoItem: '' })
}

const openModalForEdit = (item: Item) => {
  Object.assign(itemToEdit, item)
  isModalVisible.value = true
}

const handleCloseModal = () => {
  isModalVisible.value = false
  resetItemToEdit()
}

const handleSaveEdit = async (updated: Partial<Item> | null) => {
  if (!updated || !updated.numSerie) return

  if ((updated.tipoItem || '').trim() === '' || updated.dtAquisicao === '') {
    alert('Preencha todos os campos corretamente.')
    return
  }

  try {
    const itemToSave: Item = {
      numSerie: updated.numSerie,
      dtAquisicao: updated.dtAquisicao,
      tipoItem: updated.tipoItem,
    } as Item

    await itemStore.updateItem(itemToSave)

    handleCloseModal()
    alert(`Item ${updated.numSerie} atualizado com sucesso!`)
  } catch (e) {
    console.error('Falha ao salvar a edição:', e)
    alert('Falha ao salvar a edição. Verifique o console.')
  }
}

const handleDelete = (id: number) => {
  if (confirm(`Tem certeza que deseja excluir o Item Série: ${id}?`)) {
    itemStore.deleteItem(id)
  }
}

onMounted(() => {
  itemStore.fetchItens()
})
</script>

<template>
  <div class="page-container">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-4xl font-bold mb-8 text-primary">Cadastro de Item</h1>

      <form @submit.prevent="addItem" class="card mb-8 flex gap-3 flex-wrap">
        <input
          v-model="newDtAquisicao"
          type="date"
          class="input-styled flex-1 min-w-[150px]"
          title="Data de Aquisição"
        />

        <input
          v-model="newTipoItem"
          placeholder="Tipo do Item (Ex: DVD, Blu-Ray)"
          class="input-styled flex-1 min-w-[200px]"
        />

        <button type="submit" class="btn-primary">
          <i class="mdi mdi-plus"></i> Adicionar Item
        </button>
      </form>

      <h2 class="text-2xl font-semibold mb-4 text-secondary">Lista de Itens</h2>
      <ul class="space-y-3">
        <li
          v-for="item in itemStore.itens"
          :key="item.numSerie"
          class="card flex justify-between items-center"
        >
          <span class="font-medium text-gray-700">
            <span class="text-primary font-bold">Série: {{ item.numSerie }}</span> | Aquisição:
            <span class="text-secondary font-semibold">{{ item.dtAquisicao }}</span>
            | Tipo: <span class="text-primary font-semibold">{{ item.tipoItem }}</span>
          </span>

          <div class="flex gap-2">
            <button @click="openModalForEdit(item)" class="btn-secondary text-sm">
              <i class="mdi mdi-lead-pencil"></i> Editar
            </button>
            <button @click="handleDelete(item.numSerie)" class="btn-primary text-sm">
              <i class="mdi mdi-trash-can"></i> Excluir
            </button>
          </div>
        </li>
      </ul>

      <GenericEditModal
        :isVisible="isModalVisible"
        title="Editar Item"
        :initialData="itemToEdit"
        :formFields="itemFields"
        @close="handleCloseModal"
        @save="handleSaveEdit"
      />
    </div>
  </div>
</template>
