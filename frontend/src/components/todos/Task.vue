<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useAccountStore } from '../../store/account'
import axios from 'axios'
import { Todo } from '../../types/interfaces'
import { ActiveDay } from '../../types/enum'

const accountStore = useAccountStore()

const today = new Date().toISOString().split('T')[0]

const formatDate = (date: string | Date) => new Date(date).toISOString().split('T')[0]

const todos = ref<Todo[]>([])

const newTodo = ref('')
const activeTab = ref<
  typeof ActiveDay.TODAY | typeof ActiveDay.UPCOMING | typeof ActiveDay.DONE | typeof ActiveDay.PAST
>(ActiveDay.TODAY)
const editDialog = ref(false)
const editText = ref('')
const editId = ref<string>('')
const editDate = ref<string>(today)

const filteredTodos = computed(() => {
  if (activeTab.value === ActiveDay.TODAY) {
    return todos.value.filter((t) => formatDate(t.dueDate) === today && !t.done)
  }
  if (activeTab.value === ActiveDay.UPCOMING) {
    return todos.value.filter((t) => formatDate(t.dueDate) > today && !t.done)
  }
  if (activeTab.value === ActiveDay.DONE) {
    return todos.value.filter((t) => t.done)
  }
  if (activeTab.value === ActiveDay.PAST) {
    return todos.value.filter((t) => formatDate(t.dueDate) < today && !t.done)
  }
  return todos.value
})

const fetchTodos = async () => {
  if (!accountStore.token) return

  const res = await axios.get('/api/todos', {
    headers: {
      Authorization: `Bearer ${accountStore.token}`,
    },
  })

  todos.value = Array.isArray(res.data) ? res.data : todos.value
}

const addTodo = async () => {
  if (!newTodo.value.trim() || !accountStore.token) return
  const res = await axios.post(
    '/api/todos',
    { text: newTodo.value, dueDate: today },
    {
      headers: {
        Authorization: `Bearer ${accountStore.token}`,
      },
    }
  )
  todos.value.push(res.data)
  newTodo.value = ''
}

const toggleTodo = async (todo: Todo) => {
  if (!accountStore.token) return
  const res = await axios.put(
    `/api/todos/${todo._id}`,
    { done: !todo.done },
    {
      headers: {
        Authorization: `Bearer ${accountStore.token}`,
      },
    }
  )
  todo.done = res.data.done
}
const deleteTodo = async (id: string) => {
  if (!accountStore.token) return
  await axios.delete(`/api/todos/${id}`, {
    headers: {
      Authorization: `Bearer ${accountStore.token}`,
    },
  })
  todos.value = todos.value.filter((t) => t._id !== id)
}

const editTodo = (id: string) => {
  const todo = todos.value.find((t) => t._id === id)
  if (todo) {
    editId.value = todo._id
    editText.value = todo.text
    editDate.value = formatDate(todo.dueDate)
    editDialog.value = true
  }
}

const saveEdit = async () => {
  if (!editText.value.trim() || !editId.value || !accountStore.token) return
  const res = await axios.put(
    `/api/todos/${editId.value}`,
    {
      text: editText.value,
      dueDate: editDate.value,
    },
    {
      headers: {
        Authorization: `Bearer ${accountStore.token}`,
      },
    }
  )

  const todo = todos.value.find((t) => t._id === editId.value)
  if (todo) {
    todo.text = res.data.text
    todo.dueDate = res.data.dueDate
  }

  editDialog.value = false
  editText.value = ''
  editDate.value = ''
  editId.value = ''
}

onMounted(async () => {
  await fetchTodos()
})
</script>

<template>
  <header class="mb-8 flex items-center justify-between">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Moje zadania</h2>
    <form @submit.prevent="addTodo" class="flex gap-2">
      <input
        v-model="newTodo"
        type="text"
        placeholder="Nowe zadanie..."
        class="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      />
      <button
        type="submit"
        class="bg-primary hover:bg-primary/90 rounded-lg px-6 py-2 font-semibold text-white shadow-md transition-colors"
      >
        Dodaj
      </button>
    </form>
  </header>

  <div class="mb-6 flex gap-4 border-b border-gray-200 dark:border-gray-700">
    <button
      @click="activeTab = ActiveDay.TODAY"
      :class="[
        'pb-2 text-sm font-medium',
        activeTab === ActiveDay.TODAY
          ? 'border-primary text-primary border-b-2'
          : 'hover:text-primary text-gray-500 dark:text-gray-400',
      ]"
    >
      Dzisiaj
    </button>
    <button
      @click="activeTab = ActiveDay.UPCOMING"
      :class="[
        'pb-2 text-sm font-medium',
        activeTab === ActiveDay.UPCOMING
          ? 'border-primary text-primary border-b-2'
          : 'hover:text-primary text-gray-500 dark:text-gray-400',
      ]"
    >
      Nadchodzące
    </button>
    <button
      @click="activeTab = ActiveDay.DONE"
      :class="[
        'pb-2 text-sm font-medium',
        activeTab === ActiveDay.DONE
          ? 'border-primary text-primary border-b-2'
          : 'hover:text-primary text-gray-500 dark:text-gray-400',
      ]"
    >
      Ukończone
    </button>
    <button
      @click="activeTab = ActiveDay.PAST"
      :class="[
        'pb-2 text-sm font-medium',
        activeTab === ActiveDay.PAST
          ? 'border-primary text-primary border-b-2'
          : 'hover:text-primary text-gray-500 dark:text-gray-400',
      ]"
    >
      Przeszłe
    </button>
  </div>

  <div class="space-y-4">
    <div
      v-for="todo in filteredTodos"
      :key="todo._id"
      class="dark:bg-primary-dark flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700"
    >
      <div class="flex items-center">
        <input
          class="text-primary focus:ring-primary h-5 w-5 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800"
          type="checkbox"
          :checked="todo.done"
          @change="toggleTodo(todo)"
        />
        <div class="ml-4">
          <p
            :class="[
              'font-medium',
              todo.done ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white',
            ]"
          >
            {{ todo.text }}
          </p>
          <p class="text-xs text-gray-400">Termin: {{ formatDate(todo.dueDate) }}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button
          @click="editTodo(todo._id)"
          class="text-primary/100 hover:bg-primary dark:hover:bg-primary/30 rounded px-3 py-1 text-sm"
        >
          Edytuj
        </button>
        <button
          @click="deleteTodo(todo._id)"
          class="rounded px-3 py-1 text-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
        >
          Usuń
        </button>
      </div>
    </div>
  </div>
  <div v-if="filteredTodos.length === 0" class="mt-8 text-center text-gray-500 dark:text-gray-400">
    Brak zadań do wyświetlenia.
  </div>
  <div v-if="editDialog" class="fixed inset-0 flex items-center justify-center bg-black/30">
    <div class="w-96 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <h3 class="mb-4 text-lg font-bold text-gray-900 dark:text-white">Edytuj zadanie</h3>
      <input
        v-model="editText"
        type="text"
        class="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      />
      <input
        v-model="editDate"
        type="date"
        :min="today"
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
</template>
