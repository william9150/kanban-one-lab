<script setup lang="ts">
import { ref } from 'vue'
import { COLUMNS } from '@/constants/kanban'
import type { CardStatus } from '@/types/kanban'
import KanbanColumn from './KanbanColumn.vue'

const expandedColumn = ref<CardStatus>(COLUMNS[0].status)
const isDragging = ref(false)
const draggedCardId = ref<string | null>(null)

function toggleColumn(status: CardStatus) {
  if (!isDragging.value) {
    expandedColumn.value = status
  }
}

function onDragStart(cardId: string) {
  isDragging.value = true
  draggedCardId.value = cardId
}

function onDragEnd() {
  isDragging.value = false
  draggedCardId.value = null
}
</script>

<template>
  <div class="flex-1 min-h-0 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto lg:overflow-hidden">
    <KanbanColumn
      v-for="col in COLUMNS"
      :key="col.status"
      :column="col"
      :expanded="expandedColumn === col.status"
      :is-dragging="isDragging"
      :dragged-card-id="draggedCardId"
      @toggle="toggleColumn(col.status)"
      @drag-start="onDragStart"
      @drag-end="onDragEnd"
    />
  </div>
</template>
