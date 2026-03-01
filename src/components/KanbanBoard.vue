<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { COLUMNS } from '@/constants/kanban'
import type { CardStatus } from '@/types/kanban'
import KanbanColumn from './KanbanColumn.vue'

const expandedColumn = ref<CardStatus>(COLUMNS[0]!.status)
const isDragging = ref(false)
const draggedCardId = ref<string | null>(null)
const hoveredStatus = ref<CardStatus | null>(null)

// Store refs to column root elements for hit-testing
const columnRefs = ref<Map<CardStatus, HTMLElement>>(new Map())

function registerColumnRef(status: CardStatus, el: HTMLElement | null) {
  if (el) {
    columnRefs.value.set(status, el)
  } else {
    columnRefs.value.delete(status)
  }
}

function toggleColumn(status: CardStatus) {
  if (!isDragging.value) {
    expandedColumn.value = status
  }
}

function handleGlobalDragOver(e: DragEvent) {
  // Check which column the cursor is over by comparing coordinates
  const x = e.clientX
  const y = e.clientY
  let found: CardStatus | null = null

  for (const [status, el] of columnRefs.value) {
    const rect = el.getBoundingClientRect()
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      found = status
      break
    }
  }

  hoveredStatus.value = found
}

function onDragStart(cardId: string) {
  isDragging.value = true
  draggedCardId.value = cardId
  document.addEventListener('dragover', handleGlobalDragOver, true)
}

function onDragEnd() {
  isDragging.value = false
  draggedCardId.value = null
  hoveredStatus.value = null
  document.removeEventListener('dragover', handleGlobalDragOver, true)
}

onUnmounted(() => {
  document.removeEventListener('dragover', handleGlobalDragOver, true)
})
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
      :hovered-status="hoveredStatus"
      @toggle="toggleColumn(col.status)"
      @drag-start="onDragStart"
      @drag-end="onDragEnd"
      @register-ref="registerColumnRef(col.status, $event)"
    />
  </div>
</template>
