<script setup lang="ts">
import { ref } from 'vue'
import { useKanbanStore } from '@/stores/useKanbanStore'
import { useToastStore } from '@/stores/useToastStore'

const store = useKanbanStore()
const toast = useToastStore()
const title = ref('')
const description = ref('')
const titleInput = ref<HTMLInputElement | null>(null)

function handleSubmit() {
  if (!title.value.trim()) return
  store.addCard(title.value, description.value)
  title.value = ''
  description.value = ''
  titleInput.value?.focus()
  toast.show('卡片已成功新增到待處理欄位!')
}
</script>

<template>
  <div class="shrink-0 bg-white border-b border-gray-200 px-4 py-3">
    <form @submit.prevent="handleSubmit" class="flex flex-col sm:flex-row gap-2 items-stretch sm:items-start">
      <div class="flex-1 min-w-0">
        <label for="card-title" class="block text-xs font-medium text-gray-600 mb-1">標題 *</label>
        <input
          id="card-title"
          ref="titleInput"
          v-model="title"
          type="text"
          placeholder="輸入卡片標題"
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div class="flex-1 min-w-0">
        <label for="card-desc" class="block text-xs font-medium text-gray-600 mb-1">描述</label>
        <textarea
          id="card-desc"
          v-model="description"
          rows="2"
          placeholder="輸入卡片描述（選填）"
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>
      <button
        type="submit"
        :disabled="!title.trim()"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer"
      >
        新增卡片
      </button>
    </form>
  </div>
</template>
