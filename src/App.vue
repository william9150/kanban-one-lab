<script setup lang="ts">
import AddCardForm from '@/components/AddCardForm.vue'
import KanbanBoard from '@/components/KanbanBoard.vue'
import ToastNotification from '@/components/ToastNotification.vue'
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden bg-gray-100">
    <div class="flex flex-col flex-1 min-h-0 max-w-330 w-full mx-auto">
      <header class="shrink-0 bg-white border-b border-gray-200 px-4 py-3">
        <h1 class="text-xl font-bold text-gray-800">Kanban Board</h1>
      </header>
      <AddCardForm />
      <KanbanBoard />
    </div>
    <ToastNotification />
  </div>
</template>
