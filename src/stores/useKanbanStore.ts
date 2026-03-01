import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Card } from '@/types/kanban'
import { CardStatus } from '@/types/kanban'
import { STORAGE_KEY, createDefaultCards } from '@/constants/kanban'
import { generateId } from '@/utils/id'

export const useKanbanStore = defineStore('kanban', () => {
  const cards = ref<Card[]>(loadFromStorage())

  const cardsByStatus = computed(() => {
    const grouped: Record<CardStatus, Card[]> = {
      [CardStatus.TODO]: [],
      [CardStatus.IN_PROGRESS]: [],
      [CardStatus.IN_REVIEW]: [],
      [CardStatus.DONE]: [],
    }
    for (const card of cards.value) {
      grouped[card.status].push(card)
    }
    return grouped
  })

  function uniqueId(): string {
    let id = generateId()
    const existingIds = new Set(cards.value.map((c) => c.id))
    while (existingIds.has(id)) {
      id = generateId()
    }
    return id
  }

  function deduplicateCards(list: Card[]): Card[] {
    const seen = new Set<string>()
    return list.filter((card) => {
      if (seen.has(card.id)) return false
      seen.add(card.id)
      return true
    })
  }

  function persist(): void {
    cards.value = deduplicateCards(cards.value)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards.value))
  }

  function addCard(title: string, description: string): void {
    const now = Date.now()
    const card: Card = {
      id: uniqueId(),
      title: title.trim(),
      description: description.trim(),
      status: CardStatus.TODO,
      createdAt: now,
      updatedAt: now,
    }
    cards.value.push(card)
    persist()
  }

  function updateCard(id: string, updates: Partial<Pick<Card, 'title' | 'description' | 'status'>>): void {
    const card = cards.value.find((c) => c.id === id)
    if (card) {
      Object.assign(card, updates, { updatedAt: Date.now() })
      persist()
    }
  }

  function deleteCard(id: string): void {
    const index = cards.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      cards.value.splice(index, 1)
      persist()
    }
  }

  function reorderCards(status: CardStatus, newList: Card[]): void {
    const newListIds = new Set(newList.map((c) => c.id))
    const otherCards = cards.value.filter((c) => c.status !== status && !newListIds.has(c.id))
    const updatedList = newList.map((c) => ({
      ...c,
      status,
      updatedAt: c.status !== status ? Date.now() : c.updatedAt,
    }))
    cards.value = deduplicateCards([...otherCards, ...updatedList])
    persist()
  }

  function loadFromStorage(): Card[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const parsed: Card[] = raw ? JSON.parse(raw) : createDefaultCards()
      return deduplicateCards(parsed)
    } catch {
      return []
    }
  }

  return { cards, cardsByStatus, addCard, updateCard, deleteCard, reorderCards }
})
