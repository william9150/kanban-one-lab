import { CardStatus } from '@/types/kanban'
import type { Card, ColumnDefinition } from '@/types/kanban'

export const COLUMNS: ColumnDefinition[] = [
  { status: CardStatus.TODO, label: '待處理 (To Do)', color: 'bg-red-500' },
  { status: CardStatus.IN_PROGRESS, label: '進行中 (In Progress)', color: 'bg-orange-500' },
  { status: CardStatus.IN_REVIEW, label: '待驗收 (In Review)', color: 'bg-blue-500' },
  { status: CardStatus.DONE, label: '已完成 (Done)', color: 'bg-green-500' },
]

export const STATUS_BORDER_COLORS: Record<CardStatus, string> = {
  [CardStatus.TODO]: 'border-l-red-500',
  [CardStatus.IN_PROGRESS]: 'border-l-orange-500',
  [CardStatus.IN_REVIEW]: 'border-l-blue-500',
  [CardStatus.DONE]: 'border-l-green-500',
}

export const STORAGE_KEY = 'kanban-cards'

export function createDefaultCards(): Card[] {
  const now = Date.now()
  return [
    {
      id: crypto.randomUUID(),
      title: '更新履歷表',
      description: '檢視並更新個人履歷，包含最新工作經驗、技能和成就',
      status: CardStatus.TODO,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: '準備作品集',
      description: '整理過往專案作品，建立線上作品集、展示個人能力',
      status: CardStatus.TODO,
      createdAt: now - 1000,
      updatedAt: now - 1000,
    },
    {
      id: crypto.randomUUID(),
      title: '投遞履歷-ABC科技公司',
      description: '針對軟體工程師職位客製化履歷和求職信，透過官網投遞申請',
      status: CardStatus.IN_PROGRESS,
      createdAt: now - 2000,
      updatedAt: now - 2000,
    },
    {
      id: crypto.randomUUID(),
      title: '準備面試問題',
      description: '研讀常見面試題目，準備自我介紹和技術問題回答',
      status: CardStatus.IN_PROGRESS,
      createdAt: now - 3000,
      updatedAt: now - 3000,
    },
    {
      id: crypto.randomUUID(),
      title: '第一輪面試-XYZ企業',
      description: '完成HR電話面試，等待技術面試通知',
      status: CardStatus.IN_REVIEW,
      createdAt: now - 4000,
      updatedAt: now - 4000,
    },
    {
      id: crypto.randomUUID(),
      title: '薪資談判-DEF新創',
      description: '收到錄取通知，正在討論薪資福利條件',
      status: CardStatus.IN_REVIEW,
      createdAt: now - 5000,
      updatedAt: now - 5000,
    },
    {
      id: crypto.randomUUID(),
      title: '完成面試準備',
      description: '已完成所有面試技巧練習和模擬面試',
      status: CardStatus.DONE,
      createdAt: now - 6000,
      updatedAt: now - 6000,
    },
    {
      id: crypto.randomUUID(),
      title: '建立LinkedIn檔案',
      description: '優化LinkedIn個人檔案，增加專業網路連結',
      status: CardStatus.DONE,
      createdAt: now - 7000,
      updatedAt: now - 7000,
    },
  ]
}
