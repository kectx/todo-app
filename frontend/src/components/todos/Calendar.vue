<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { DateTime, MonthNumbers } from 'luxon'
import { CalendarDay, Todo } from '../../types/interfaces'
import api from '../../plugins/axios'

const today = DateTime.now()
const currentYear = ref(today.year)
const currentMonth = ref<MonthNumbers>(today.month as MonthNumbers)

const todos = ref<Todo[]>([])

const dayWeekShortcuts = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd']

async function fetchTodos() {
  try {
    const res = await api.get('/api/todos')
    todos.value = res.data
  } catch (e) {
    console.error('Błąd podczas pobierania tasków:', e)
  }
}
onMounted(fetchTodos)

const daysInMonth = computed<CalendarDay[]>(() => {
  const start = DateTime.local(currentYear.value, currentMonth.value, 1)
  const end = start.endOf('month')
  const days: CalendarDay[] = []

  const todosByDate = new Map<string, Todo[]>()
  todos.value.forEach((todo) => {
    const dateKey = todo.dueDate.split('T')[0]
    if (!todosByDate.has(dateKey)) {
      todosByDate.set(dateKey, [])
    }
    todosByDate.get(dateKey)!.push(todo)
  })

  for (let i = 1; i <= end.day; i++) {
    const date = DateTime.local(currentYear.value, currentMonth.value, i)
    const dateString = date.toISODate()
    const isToday = date.hasSame(today, 'day')
    const isPreviousDay = date < today.startOf('day')

    days.push({
      date,
      dateString,
      isToday,
      isPreviousDay,
      todos: todosByDate.get(dateString || '') || [],
    })
  }

  return days
})

function prevMonth() {
  const prev = DateTime.local(currentYear.value, currentMonth.value, 1).minus({ months: 1 })
  currentYear.value = prev.year
  currentMonth.value = prev.month as MonthNumbers
}

function nextMonth() {
  const next = DateTime.local(currentYear.value, currentMonth.value, 1).plus({ months: 1 })
  currentYear.value = next.year
  currentMonth.value = next.month as MonthNumbers
}

const showAddModal = ref(false)
const selectedDate = ref<string | null>(null)
const newTaskText = ref('')
const expandedDates = ref<Set<string>>(new Set())

function openAddModal(date: string) {
  selectedDate.value = date
  newTaskText.value = ''
  showAddModal.value = true
}

function toggleExpand(date: string | null, event: Event) {
  if (!date) return
  event.stopPropagation()
  if (expandedDates.value.has(date)) {
    expandedDates.value.delete(date)
  } else {
    expandedDates.value.add(date)
  }
}

function isExpanded(date: string | null): boolean {
  return date ? expandedDates.value.has(date) : false
}

async function addTask() {
  const trimmedText = newTaskText.value.trim()
  if (!trimmedText || !selectedDate.value) return
  if (trimmedText.length > 1000) {
    alert('Tekst zadania nie może przekraczać 1000 znaków')
    return
  }
  try {
    const res = await api.post('/api/todos', {
      text: trimmedText,
      dueDate: selectedDate.value,
      done: false,
    })
    if (res.status !== 201) throw new Error('Nie udało się dodać zadania')
    todos.value.push(res.data)
    showAddModal.value = false
    newTaskText.value = ''
  } catch (e: any) {
    console.error('Błąd podczas dodawania zadania:', e)
    alert(e.response?.data?.error || 'Nie udało się dodać zadania')
  }
}
</script>

<template>
  <div class="mx-auto max-w-4xl p-6">
    <div class="mb-6 flex items-center justify-between">
      <button class="rounded bg-gray-100 px-3 py-1 dark:bg-gray-800" @click="prevMonth">←</button>
      <h2 class="text-xl font-semibold capitalize">
        {{ DateTime.local(currentYear, currentMonth).setLocale('pl').toFormat('LLLL yyyy') }}
      </h2>
      <button class="rounded bg-gray-100 px-3 py-1 dark:bg-gray-800" @click="nextMonth">→</button>
    </div>

    <div class="grid grid-cols-7 gap-4 text-center text-sm">
      <div v-for="day in dayWeekShortcuts" :key="day" class="font-semibold text-gray-500">
        {{ day }}
      </div>

      <div
        v-for="day in daysInMonth"
        :key="day.dateString || ''"
        :class="[
          'hover:bg-primary/10 relative rounded-lg border p-2 transition',
          {
            'bg-primary border-primary text-white': day.isToday,
            disabled: day.isPreviousDay,
            'min-h-[75px]': !isExpanded(day.dateString) || day.todos.length <= 3,
          },
        ]"
      >
        <div class="text-sm font-semibold">{{ day.date.day }}</div>

        <div v-if="day.todos.length" class="mt-1 space-y-1">
          <div
            v-for="todo in isExpanded(day.dateString) ? day.todos : day.todos.slice(0, 2)"
            :key="todo._id"
            @click.stop
            :class="[
              'bg-primary/20 text-primary truncate rounded px-1 text-xs',
              {
                'bg-gray-100 hover:bg-gray-200 dark:bg-gray-100':
                  day.isToday && day.todos.length > 0,
              },
            ]"
          >
            {{ todo.text }}
          </div>
          <button
            v-if="day.todos.length > 2"
            @click="toggleExpand(day.dateString, $event)"
            class="w-full text-xs transition-colors"
            :class="[
              day.isToday ? 'text-white/80 hover:text-white' : 'text-primary hover:text-primary/80',
            ]"
          >
            {{ isExpanded(day.dateString) ? '🔼 Zwiń' : `+${day.todos.length - 2} więcej...` }}
          </button>
        </div>

        <div
          v-if="!day.isPreviousDay"
          @click.stop="openAddModal(day.dateString || '')"
          class="flex cursor-pointer items-center justify-center transition-colors"
          :class="[
            day.todos.length === 0 ? 'absolute inset-0 mt-6' : 'mt-2 flex justify-center',
            day.isToday ? 'text-white/80 hover:text-white' : 'text-primary hover:text-primary/80',
          ]"
        >
          <div
            class="flex h-6 w-6 items-center justify-center rounded-full transition-colors"
            :class="[
              day.isToday ? 'bg-white/20 hover:bg-white/30' : 'bg-primary/10 hover:bg-primary/20',
            ]"
          >
            <span class="text-sm font-bold">+</span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showAddModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div class="w-80 rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
        <h3 class="mb-2 font-semibold">Dodaj zadanie</h3>
        <p class="mb-4 text-sm text-gray-500">Dzień: {{ selectedDate }}</p>

        <input
          v-model="newTaskText"
          placeholder="Wpisz treść zadania..."
          class="mb-4 w-full rounded border px-2 py-1 dark:bg-gray-800"
        />

        <div class="flex justify-end gap-2">
          <button
            class="rounded bg-gray-200 px-3 py-1 dark:bg-gray-700"
            @click="showAddModal = false"
          >
            Anuluj
          </button>
          <button class="bg-primary rounded px-3 py-1 text-white" @click="addTask">Dodaj</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.disabled {
  pointer-events: none;
  opacity: 0.5;
}
</style>
