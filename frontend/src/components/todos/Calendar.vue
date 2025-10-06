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
      todos: todos.value.filter((t) => t.dueDate.startsWith(dateString ? dateString : '')),
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

function openAddModal(date: string) {
  selectedDate.value = date
  newTaskText.value = ''
  showAddModal.value = true
}

async function addTask() {
  if (!newTaskText.value.trim() || !selectedDate.value) return
  try {
    const res = await api.post('/api/todos', {
      text: newTaskText.value.trim(),
      dueDate: selectedDate.value,
      done: false,
    })
    if (res.status !== 201) throw new Error('Nie udało się dodać zadania')
    await fetchTodos()
    showAddModal.value = false
  } catch (e) {
    console.error(e)
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
        :key="day.dateString"
        :class="[
          'hover:bg-primary/10 relative min-h-[75px] cursor-pointer rounded-lg border p-2 transition',
          {
            'bg-primary border-primary text-white': day.isToday,
            disabled: day.isPreviousDay,
          },
        ]"
        @click="openAddModal(day.dateString)"
      >
        <div class="text-sm font-semibold">{{ day.date.day }}</div>

        <div v-if="day.todos.length" class="mt-1 space-y-1">
          <div
            v-for="todo in day.todos.slice(0, 2)"
            :key="todo._id"
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
          <div v-if="day.todos.length > 2" class="text-xs text-gray-500">
            +{{ day.todos.length - 2 }}...
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
