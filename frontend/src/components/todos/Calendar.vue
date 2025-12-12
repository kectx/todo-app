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
const visibleTooltip = ref<string | null>(null)

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

function toggleTooltip(todoId: string, event: Event) {
  event.stopPropagation()
  if (visibleTooltip.value === todoId) {
    visibleTooltip.value = null
  } else {
    visibleTooltip.value = todoId
  }
}

function isTooltipVisible(todoId: string): boolean {
  return visibleTooltip.value === todoId
}

function closeTooltip() {
  visibleTooltip.value = null
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
  <div class="mx-auto max-w-4xl p-3 pb-6 sm:p-4 sm:pb-8 md:p-6">
    <div class="mt-16 mb-4 flex items-center justify-between gap-2 sm:mb-6 lg:mt-0">
      <button
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm transition-colors hover:bg-gray-200 active:scale-95 sm:h-10 sm:w-10 dark:bg-gray-800 dark:hover:bg-gray-700"
        @click="prevMonth"
        aria-label="Poprzedni miesiąc"
      >
        ←
      </button>
      <h2 class="flex-1 text-center text-base font-semibold capitalize sm:text-lg md:text-xl">
        {{ DateTime.local(currentYear, currentMonth).setLocale('pl').toFormat('LLLL yyyy') }}
      </h2>
      <button
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm transition-colors hover:bg-gray-200 active:scale-95 sm:h-10 sm:w-10 dark:bg-gray-800 dark:hover:bg-gray-700"
        @click="nextMonth"
        aria-label="Następny miesiąc"
      >
        →
      </button>
    </div>

    <div class="grid grid-cols-7 gap-1.5 text-center text-xs sm:gap-2 sm:text-sm md:gap-3 lg:gap-4">
      <div v-for="day in dayWeekShortcuts" :key="day" class="font-semibold text-gray-500">
        {{ day }}
      </div>

      <div
        v-for="day in daysInMonth"
        :key="day.dateString || ''"
        :class="[
          'hover:bg-primary/10 relative flex flex-col rounded-lg border transition-all sm:rounded-xl',
          {
            'bg-primary border-primary text-white shadow-md': day.isToday,
            'border-gray-200 dark:border-gray-700': !day.isToday,
            disabled: day.isPreviousDay,
            'min-h-[70px]': !day.isPreviousDay,
            'md:aspect-square': !isExpanded(day.dateString) || day.todos.length <= 2,
          },
        ]"
      >
        <div class="flex items-start justify-between p-1.5 sm:p-2">
          <div class="text-xs font-semibold sm:text-sm md:text-base">{{ day.date.day }}</div>
          <button
            v-if="!day.isPreviousDay"
            @click.stop="openAddModal(day.dateString || '')"
            class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 sm:h-6 sm:w-6"
            :class="[
              day.isToday
                ? 'bg-white/25 text-white hover:bg-white/35'
                : 'bg-primary/15 text-primary hover:bg-primary/25',
            ]"
            aria-label="Dodaj zadanie"
          >
            <span class="text-[10px] font-bold sm:text-xs">+</span>
          </button>
        </div>

        <div
          v-if="day.todos.length"
          class="flex flex-1 flex-col px-1.5 pb-0.5 sm:px-2 sm:pb-1 md:min-h-0"
        >
          <div
            class="space-y-0.5 sm:space-y-1 md:flex-1"
            :class="{ 'md:overflow-hidden': !isExpanded(day.dateString) && day.todos.length > 2 }"
          >
            <div
              v-for="todo in isExpanded(day.dateString) ? day.todos : day.todos.slice(0, 2)"
              :key="todo._id"
              @click.stop="toggleTooltip(todo._id, $event)"
              @mouseenter="visibleTooltip = todo._id"
              @mouseleave="visibleTooltip = null"
              @touchstart="toggleTooltip(todo._id, $event)"
              :title="todo.text"
              :class="[
                'group relative truncate rounded px-1.5 py-0.5 text-[10px] leading-tight sm:text-xs',
                day.isToday
                  ? 'bg-white/30 text-white hover:bg-white/40'
                  : 'bg-primary/20 text-primary hover:bg-primary/30',
              ]"
            >
              <span>{{ todo.text }}</span>
              <div
                v-if="todo.text.length > 15 && isTooltipVisible(todo._id)"
                class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 max-w-[200px] -translate-x-1/2 rounded-lg bg-gray-900 px-2 py-1.5 text-xs text-white shadow-xl sm:max-w-[250px] dark:bg-gray-800"
              >
                <div class="break-words">{{ todo.text }}</div>
                <div
                  class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800"
                ></div>
              </div>
            </div>
          </div>
          <button
            v-if="day.todos.length > 2"
            @click.stop="(closeTooltip(), toggleExpand(day.dateString, $event))"
            class="mt-0.5 shrink-0 rounded px-1 py-0.5 text-[10px] leading-tight font-medium transition-colors hover:bg-black/5 sm:mt-1 sm:text-xs md:mt-1 dark:hover:bg-white/5"
            :class="[
              day.isToday
                ? 'text-white/90 hover:bg-white/20 hover:text-white'
                : 'text-primary hover:bg-primary/10',
            ]"
          >
            {{ isExpanded(day.dateString) ? '🔼 Zwiń' : `+${day.todos.length - 2} więcej` }}
          </button>
        </div>
        <div v-else-if="!day.isPreviousDay" class="flex flex-1 items-center justify-center">
          <span
            class="text-[10px] opacity-40 sm:text-xs"
            :class="day.isToday ? 'text-white' : 'text-gray-400'"
          >
            Puste
          </span>
        </div>
      </div>
    </div>

    <div
      v-if="showAddModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div
        class="w-[90vw] max-w-sm rounded-lg bg-white p-4 shadow-xl sm:w-80 sm:p-6 dark:bg-gray-900"
      >
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
