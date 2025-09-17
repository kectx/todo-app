<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Todo {
  _id: string
  text: string
  done: boolean
}

const todos = ref<Todo[]>([
  { _id: '1', text: 'Sample Task 1', done: false },
  { _id: '2', text: 'Sample Task 2', done: true },
])
const newTodo = ref('')

const fetchTodos = async () => {
  const res = await axios.get('/api/todos')
  todos.value = Array.isArray(res.data) ? res.data : todos.value
}

const addTodo = async () => {
  if (!newTodo.value.trim()) return
  const res = await axios.post('/api/todos', { text: newTodo.value })
  todos.value.push(res.data)
  newTodo.value = ''
}

const toggleTodo = async (todo: Todo) => {
  const res = await axios.put(`/api/todos/${todo._id}`, { done: !todo.done })
  todo.done = res.data.done
}

const deleteTodo = async (id: string) => {
  await axios.delete(`/api/todos/${id}`)
  todos.value = todos.value.filter((t) => t._id !== id)
}

onMounted(fetchTodos)
</script>

<template>
  <div class="flex min-h-screen flex-col bg-gray-50 dark:bg-slate-900">
    <header class="py-6 text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
    </header>

    <main class="flex items-start gap-6 px-8 py-4">
      <aside class="w-1/3 rounded-xl bg-white p-4 shadow dark:bg-slate-800">
        <h2 class="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">Twoje zadania</h2>
        <ul class="space-y-3">
          <li
            v-for="todo in todos"
            :key="todo._id"
            class="flex items-center justify-between rounded bg-gray-50 p-3 shadow-sm dark:bg-slate-700"
          >
            <label class="flex flex-1 cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                :checked="todo.done"
                @change="toggleTodo(todo)"
                class="h-5 w-5 rounded text-blue-500 focus:ring-2 focus:ring-blue-400"
              />
              <span
                :class="[
                  'transition-all duration-300',
                  todo.done ? 'text-gray-400 line-through' : '',
                ]"
              >
                {{ todo.text }}
              </span>
            </label>
            <button
              @click="deleteTodo(todo._id)"
              class="text-xl text-red-500 transition hover:text-red-700"
            >
              🗑
            </button>
          </li>
        </ul>
      </aside>

      <section class="min-h-[300px] flex-1 rounded-xl bg-white p-4 shadow dark:bg-slate-800">
        <h2 class="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
          Dodaj nowe zadanie
        </h2>
        <!-- formularz -->
      </section>
    </main>
  </div>
</template>
