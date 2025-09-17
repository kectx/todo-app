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
  <div class="max-w-md mx-auto mt-10 p-6">
    <h1 class="text-2xl font-bold mb-4 text-center">Todo App</h1>

    <!-- Input -->
    <div class="flex gap-2 mb-6">
      <input
        v-model="newTodo"
        type="text"
        placeholder="New task"
        @keyup.enter="addTodo"
        class="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button @click="addTodo" class="text-white px-4 py-2 rounded hover:bg-blue-600 transition">
        Add
      </button>
    </div>

    <ul class="space-y-3">
      <li
        v-for="todo in todos"
        :key="todo._id"
        class="flex items-center justify-between p-3 rounded shadow-sm"
      >
        <label class="flex items-center gap-3 cursor-pointer flex-1">
          <input
            type="checkbox"
            :checked="todo.done"
            @change="toggleTodo(todo)"
            class="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-400"
          />
          <span
            :class="['transition-all duration-300', todo.done ? 'line-through text-gray-400' : '']"
          >
            {{ todo.text }}
          </span>
        </label>
        <button
          @click="deleteTodo(todo._id)"
          class="text-red-500 hover:text-red-700 transition text-xl"
        >
          🗑
        </button>
      </li>
    </ul>
  </div>
</template>
