<script setup lang="ts">
import { computed } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useKanbanStore } from '@/stores/useKanbanStore'
import type { ColumnDefinition, Card } from '@/types/kanban'
import KanbanCard from './KanbanCard.vue'

const props = defineProps<{
  column: ColumnDefinition
}>()

const store = useKanbanStore()

const columnCards = computed({
  get: () => store.cardsByStatus[props.column.status],
  set: (newList: Card[]) => {
    store.reorderCards(props.column.status, newList)
  },
})
</script>

<template>
  <div class="flex flex-col min-h-0 bg-gray-50 rounded-lg">
    <div class="flex items-center gap-2 p-3 shrink-0">
      <span :class="[column.color, 'w-3 h-3 rounded-full shrink-0']" />
      <span class="font-semibold text-sm text-gray-700">{{ column.label }}</span>
      <span class="ml-auto text-xs text-gray-400 bg-gray-200 rounded-full px-2 py-0.5">{{ columnCards.length }}</span>
    </div>
    <VueDraggable
      v-model="columnCards"
      group="kanban"
      :animation="200"
      ghost-class="opacity-30"
      class="flex-1 overflow-y-auto p-2 space-y-2 min-h-15"
    >
      <KanbanCard
        v-for="card in columnCards"
        :key="card.id"
        :card="card"
      />
    </VueDraggable>
    <p v-if="columnCards.length === 0" class="text-center text-xs text-gray-400 py-8 mx-2 mb-2 border-2 border-dashed border-gray-200 rounded-lg pointer-events-none">
      暫無卡片
    </p>
  </div>
</template>
