<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { Todo, BoardColumn } from '../../types/interfaces'
import api from '../../plugins/axios'

const todos = ref<Todo[]>([])
const today = new Date().toISOString().split('T')[0]

const formatDate = (date: string | Date) => new Date(date).toISOString().split('T')[0]

function getWeekEnd() {
  const date = new Date()
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  const weekStart = new Date(date.setDate(diff))
  weekStart.setDate(weekStart.getDate() + 6)
  return weekStart.toISOString().split('T')[0]
}

function getNextWeekEnd() {
  const date = new Date()
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  const weekStart = new Date(date.setDate(diff))
  weekStart.setDate(weekStart.getDate() + 13)
  return weekStart.toISOString().split('T')[0]
}

const weekEnd = getWeekEnd()
const nextWeekEnd = getNextWeekEnd()

const boardColumns = computed<BoardColumn[]>(() => {
  const todayTodos: Todo[] = []
  const weekTodos: Todo[] = []
  const nextWeekTodos: Todo[] = []
  const doneTodos: Todo[] = []

  todos.value.forEach((todo) => {
    if (todo.done) {
      doneTodos.push(todo)
    } else {
      const todoDate = formatDate(todo.dueDate)
      if (todoDate === today) {
        todayTodos.push(todo)
      } else if (todoDate > today && todoDate <= weekEnd) {
        weekTodos.push(todo)
      } else if (todoDate > weekEnd && todoDate <= nextWeekEnd) {
        nextWeekTodos.push(todo)
      }
    }
  })

  const sortByDate = (a: Todo, b: Todo) =>
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  const sortByDateDesc = (a: Todo, b: Todo) =>
    new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()

  return [
    {
      id: 'today',
      title: 'Dzisiaj',
      todos: todayTodos.sort(sortByDate),
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      id: 'week',
      title: 'Ten tydzień',
      todos: weekTodos.sort(sortByDate),
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      id: 'nextWeek',
      title: 'Następny tydzień',
      todos: nextWeekTodos.sort(sortByDate),
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      id: 'done',
      title: 'Ukończone',
      todos: doneTodos.sort(sortByDateDesc),
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
  ]
})

const editDialog = ref(false)
const editText = ref('')
const editId = ref<string>('')
const editDate = ref<string>(today)

async function fetchTodos() {
  try {
    const res = await api.get('/api/todos')
    todos.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    console.error('Błąd podczas pobierania zadań:', e)
  }
}

async function toggleTodo(todo: Todo) {
  try {
    const res = await api.put(`/api/todos/${todo._id}`, { done: !todo.done })
    todo.done = res.data.done
  } catch (e) {
    console.error('Błąd podczas aktualizacji zadania:', e)
  }
}

async function deleteTodo(id: string) {
  try {
    await api.delete(`/api/todos/${id}`)
    todos.value = todos.value.filter((t) => t._id !== id)
  } catch (e) {
    console.error('Błąd podczas usuwania zadania:', e)
  }
}

function editTodo(todo: Todo) {
  editId.value = todo._id
  editText.value = todo.text
  editDate.value = formatDate(todo.dueDate)
  editDialog.value = true
}

async function saveEdit() {
  const trimmedText = editText.value.trim()
  if (!trimmedText || !editId.value) return
  if (trimmedText.length > 1000) {
    alert('Tekst zadania nie może przekraczać 1000 znaków')
    return
  }
  try {
    const res = await api.put(`/api/todos/${editId.value}`, {
      text: trimmedText,
      dueDate: editDate.value,
    })

    const todo = todos.value.find((t) => t._id === editId.value)
    if (todo) {
      todo.text = res.data.text
      todo.dueDate = res.data.dueDate
    }

    editDialog.value = false
    editText.value = ''
    editDate.value = today
    editId.value = ''
  } catch (e: any) {
    console.error('Błąd podczas edycji zadania:', e)
    alert(e.response?.data?.error || 'Nie udało się zaktualizować zadania')
  }
}

onMounted(fetchTodos)
</script>

<template>
  <div class="space-y-6">
    <header class="flex items-center justify-between">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Tablica zadań</h2>
    </header>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <div
        v-for="column in boardColumns"
        :key="column.id"
        class="flex flex-col rounded-lg border border-gray-200 dark:border-gray-700"
        :class="column.bgColor"
      >
        <div
          class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700"
          :class="column.bgColor"
        >
          <h3 class="text-lg font-semibold" :class="column.color">
            {{ column.title }}
          </h3>
          <span
            class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
            :class="[
              column.color,
              column.id === 'done'
                ? 'bg-green-200 dark:bg-green-800'
                : 'bg-white/50 dark:bg-black/20',
            ]"
          >
            {{ column.todos.length }}
          </span>
        </div>
        <div class="flex-1 space-y-3 overflow-y-auto p-4">
          <div
            v-for="todo in column.todos"
            :key="todo._id"
            class="group relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-600 dark:bg-gray-800"
          >
            <div class="flex items-start gap-3">
              <input
                type="checkbox"
                :checked="todo.done"
                @change="toggleTodo(todo)"
                class="text-primary focus:ring-primary mt-1 h-5 w-5 cursor-pointer rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                :disabled="column.id === 'done'"
              />
              <div class="flex-1">
                <p
                  :class="[
                    'font-medium',
                    todo.done ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white',
                  ]"
                >
                  {{ todo.text }}
                </p>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDate(todo.dueDate) }}
                </p>
              </div>
            </div>
            <div
              class="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <button
                @click="editTodo(todo)"
                class="text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded px-2 py-1 text-xs"
                title="Edytuj"
              >
                ✏️
              </button>
              <button
                @click="deleteTodo(todo._id)"
                class="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                title="Usuń"
              >
                🗑️
              </button>
            </div>
          </div>
          <div
            v-if="column.todos.length === 0"
            class="py-8 text-center text-sm text-gray-400 dark:text-gray-500"
          >
            Brak zadań
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="editDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      @click.self="editDialog = false"
    >
      <div class="w-96 rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800" @click.stop>
        <h3 class="mb-4 text-lg font-bold text-gray-900 dark:text-white">Edytuj zadanie</h3>
        <input
          v-model="editText"
          type="text"
          placeholder="Treść zadania..."
          class="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <input
          v-model="editDate"
          type="date"
          class="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <div class="flex justify-end gap-2">
          <button
            @click="editDialog = false"
            class="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Anuluj
          </button>
          <button
            @click="saveEdit"
            class="bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 text-white"
          >
            Zapisz
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
