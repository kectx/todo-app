import { DateTime } from 'luxon'

export interface Todo {
  _id: string
  text: string
  done: boolean
  dueDate: string
}

export interface CalendarDay {
  date: DateTime
  dateString: string | null
  isToday: boolean | undefined
  isPreviousDay: boolean
  todos: Todo[]
}
