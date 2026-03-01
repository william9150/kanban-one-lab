<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useKanbanStore } from '@/stores/useKanbanStore'
import { useToastStore } from '@/stores/useToastStore'
import { CardStatus } from '@/types/kanban'
import type { ColumnDefinition, Card } from '@/types/kanban'
import { STATUS_LABELS, STATUS_DIVIDER_COLORS } from '@/constants/kanban'
import KanbanCard from './KanbanCard.vue'

const props = defineProps<{
  column: ColumnDefinition
  expanded: boolean
  isDragging: boolean
  draggedCardId: string | null
  hoveredStatus: CardStatus | null
}>()

const emit = defineEmits<{
  toggle: []
  dragStart: [cardId: string]
  dragEnd: []
  registerRef: [el: HTMLElement | null]
}>()

const store = useKanbanStore()
const toast = useToastStore()
const columnEl = ref<HTMLElement | null>(null)

const columnCards = computed({
  get: () => store.cardsByStatus[props.column.status],
  set: (newList: Card[]) => {
    store.reorderCards(props.column.status, newList)
  },
})

const isContentVisible = computed(() => props.expanded || props.isDragging)
const isSourceColumn = computed(() => props.draggedCardId !== null && columnCards.value.some((c) => c.id === props.draggedCardId))
const showDropHighlight = computed(() =>
  props.isDragging && props.hoveredStatus === props.column.status && !isSourceColumn.value
)

onMounted(() => emit('registerRef', columnEl.value))
onUnmounted(() => emit('registerRef', null))

function onDragStart(evt: { oldIndex: number }) {
  const card = columnCards.value[evt.oldIndex]
  if (card) {
    emit('dragStart', card.id)
  }
}

function onDragAdd() {
  showToastForMove()
}

function showToastForMove() {
  if (props.column.status === CardStatus.DONE) {
    toast.show('太棒了! 任務完成!')
  } else {
    toast.show(`卡片已移動到「${STATUS_LABELS[props.column.status]}」!`)
  }
}

function onColumnDragOver(e: DragEvent) {
  if (props.isDragging) {
    e.preventDefault()
  }
}

function onColumnDrop(e: DragEvent) {
  e.preventDefault()
  if (!props.draggedCardId) return

  const alreadyHere = columnCards.value.some((c) => c.id === props.draggedCardId)
  if (alreadyHere) return

  store.updateCard(props.draggedCardId, { status: props.column.status })
  showToastForMove()
}
</script>

<template>
  <div
    ref="columnEl"
    class="flex flex-col min-h-0 rounded-lg transition-all duration-150 bg-gray-50 overflow-hidden"
    :class="{ 'opacity-50 ring-2 ring-blue-400': showDropHighlight }"
    @dragover="onColumnDragOver"
    @drop="onColumnDrop"
  >
    <!-- Header: clickable on mobile for accordion -->
    <div
      class="shrink-0 sm:cursor-default cursor-pointer select-none"
      @click="emit('toggle')"
    >
      <div class="flex items-center justify-center gap-2 p-3">
        <span :class="[column.color, 'w-3 h-3 rounded-full shrink-0']" />
        <span class="font-semibold text-sm text-gray-700">{{ column.label }}</span>
        <span class="text-xs text-gray-400 bg-gray-200 rounded-full px-2 py-0.5">{{ columnCards.length }}</span>
        <!-- Chevron indicator: mobile only, hidden during drag -->
        <svg
          v-if="!isDragging"
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 text-gray-400 transition-transform sm:hidden"
          :class="{ 'rotate-180': expanded }"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
      <div :class="[STATUS_DIVIDER_COLORS[column.status], 'border-b-2 mx-3']" />
    </div>
    <!-- Content: always visible on sm+, accordion on mobile, all visible during drag -->
    <div :class="['sm:contents', isContentVisible ? 'contents' : 'hidden']">
      <div class="flex-1 overflow-y-auto scrollbar-hide p-2 space-y-2">
        <p v-if="columnCards.length === 0" class="text-center text-xs text-gray-400 py-8 border-2 border-dashed border-gray-200 rounded-lg pointer-events-none">
          暫無卡片
        </p>
        <VueDraggable
          v-model="columnCards"
          group="kanban"
          :animation="200"
          ghost-class="opacity-30"
          :empty-insert-threshold="200"
          class="space-y-2 min-h-full"
          @start="onDragStart"
          @end="emit('dragEnd')"
          @add="onDragAdd"
        >
          <KanbanCard
            v-for="card in columnCards"
            :key="card.id"
            :card="card"
          />
        </VueDraggable>
      </div>
    </div>
  </div>
</template>
