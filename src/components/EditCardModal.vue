<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useKanbanStore } from '@/stores/useKanbanStore'
import { COLUMNS } from '@/constants/kanban'
import type { Card } from '@/types/kanban'
import type { CardStatus } from '@/types/kanban'

const props = defineProps<{
  card: Card
}>()

const emit = defineEmits<{
  close: []
}>()

const store = useKanbanStore()
const editTitle = ref('')
const editDescription = ref('')
const editStatus = ref<CardStatus>(props.card.status)

watch(
  () => props.card,
  (card) => {
    editTitle.value = card.title
    editDescription.value = card.description
    editStatus.value = card.status
  },
  { immediate: true }
)

function handleSave() {
  if (!editTitle.value.trim()) return
  store.updateCard(props.card.id, {
    title: editTitle.value.trim(),
    description: editDescription.value.trim(),
    status: editStatus.value,
  })
  emit('close')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="emit('close')" />
      <div class="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">編輯卡片</h2>
        <form @submit.prevent="handleSave" class="space-y-4">
          <div>
            <label for="edit-title" class="block text-sm font-medium text-gray-700 mb-1">標題 *</label>
            <input
              id="edit-title"
              v-model="editTitle"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label for="edit-desc" class="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              id="edit-desc"
              v-model="editDescription"
              rows="3"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>
          <div>
            <label for="edit-status" class="block text-sm font-medium text-gray-700 mb-1">狀態</label>
            <select
              id="edit-status"
              v-model="editStatus"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option v-for="col in COLUMNS" :key="col.status" :value="col.status">
                {{ col.label }}
              </option>
            </select>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              @click="emit('close')"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="!editTitle.trim()"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              儲存
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
