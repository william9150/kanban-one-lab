<script setup lang="ts">
import { ref } from 'vue'
import { useKanbanStore } from '@/stores/useKanbanStore'
import type { Card } from '@/types/kanban'
import EditCardModal from './EditCardModal.vue'
import ConfirmDialog from './ConfirmDialog.vue'

const props = defineProps<{
  card: Card
}>()

const store = useKanbanStore()
const showEdit = ref(false)
const showDelete = ref(false)

function confirmDelete() {
  store.deleteCard(props.card.id)
  showDelete.value = false
}
</script>

<template>
  <div class="group relative p-3 bg-white rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing">
    <h3 class="font-medium text-gray-900 text-sm pr-14">{{ card.title }}</h3>
    <p v-if="card.description" class="mt-1 text-xs text-gray-500 line-clamp-2">{{ card.description }}</p>

    <!-- Action buttons: visible on hover (desktop) / always visible on mobile -->
    <div class="absolute top-2 right-2 flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
      <button
        @click.stop="showEdit = true"
        class="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
        title="編輯"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </button>
      <button
        @click.stop="showDelete = true"
        class="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
        title="刪除"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- Edit Modal -->
    <EditCardModal
      v-if="showEdit"
      :card="card"
      @close="showEdit = false"
    />

    <!-- Delete Confirm Dialog -->
    <ConfirmDialog
      v-if="showDelete"
      title="刪除卡片"
      :message="`確定要刪除「${card.title}」嗎？此操作無法復原。`"
      @confirm="confirmDelete"
      @cancel="showDelete = false"
    />
  </div>
</template>
