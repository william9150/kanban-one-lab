export enum CardStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  IN_REVIEW = 'in-review',
  DONE = 'done',
}

export interface Card {
  id: string
  title: string
  description: string
  status: CardStatus
  createdAt: number
  updatedAt: number
}

export interface ColumnDefinition {
  status: CardStatus
  label: string
  color: string
}
