import { CardStatus } from '@/types/kanban'
import type { ColumnDefinition } from '@/types/kanban'

export const COLUMNS: ColumnDefinition[] = [
  { status: CardStatus.TODO, label: '待處理 (To Do)', color: 'bg-red-500' },
  { status: CardStatus.IN_PROGRESS, label: '進行中 (In Progress)', color: 'bg-orange-500' },
  { status: CardStatus.IN_REVIEW, label: '待驗收 (In Review)', color: 'bg-blue-500' },
  { status: CardStatus.DONE, label: '已完成 (Done)', color: 'bg-green-500' },
]

export const STORAGE_KEY = 'kanban-cards'
