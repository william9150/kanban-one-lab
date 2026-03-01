<script setup lang="ts">
import KanbanBoard from '@/components/KanbanBoard.vue'
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden bg-gray-100">
    <header class="shrink-0 bg-white border-b border-gray-200 px-4 py-3">
      <h1 class="text-xl font-bold text-gray-800">Kanban Board</h1>
    </header>
    <KanbanBoard />
  </div>
</template>
