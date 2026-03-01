<script setup lang="ts">
import { COLUMNS } from '@/constants/kanban'
import KanbanColumn from './KanbanColumn.vue'
</script>

<template>
  <div class="flex-1 min-h-0 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto lg:overflow-hidden">
    <KanbanColumn
      v-for="col in COLUMNS"
      :key="col.status"
      :column="col"
    />
  </div>
</template>
