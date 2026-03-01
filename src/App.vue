<script setup lang="ts">
import AddCardForm from '@/components/AddCardForm.vue'
import KanbanBoard from '@/components/KanbanBoard.vue'
import ToastNotification from '@/components/ToastNotification.vue'
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden bg-blue-500">
    <div class="flex flex-col flex-1 min-h-0 max-w-330 w-full mx-auto">
      <header class="shrink-0 px-4 py-4 text-center">
        <h1 class="text-xl font-bold text-white">Kanban 看板管理系統</h1>
        <p class="text-sm text-blue-100 mt-1">拖拉卡片，輕鬆管理任務進度</p>
      </header>
      <AddCardForm />
      <KanbanBoard />
    </div>
    <ToastNotification />
  </div>
</template>
