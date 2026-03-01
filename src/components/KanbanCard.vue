<script setup lang="ts">
import type { Card } from '@/types/kanban'

defineProps<{
  card: Card
}>()
</script>

<template>
  <div class="group relative p-3 bg-white rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing">
    <h3 class="font-medium text-gray-900 text-sm">{{ card.title }}</h3>
    <p v-if="card.description" class="mt-1 text-xs text-gray-500 line-clamp-2">{{ card.description }}</p>
  </div>
</template>
