<script setup lang="ts">
import { ref, computed } from 'vue'

interface Todo {
  _id: string
  text: string
  done: boolean
  dueDate: string
}

const today = new Date().toISOString().split('T')[0]

const todos = ref<Todo[]>([
  { _id: '1', text: 'Zadanie na dzisiaj', done: false, dueDate: today },
  { _id: '2', text: 'Zadanie jutro', done: false, dueDate: '2025-09-19' },
  { _id: '3', text: 'Ukończone zadanie', done: true, dueDate: today },
])

const newTodo = ref('')
const activeTab = ref<'today' | 'upcoming' | 'done'>('today')

const filteredTodos = computed(() => {
  if (activeTab.value === 'today') {
    return todos.value.filter((t) => t.dueDate === today && !t.done)
  }
  if (activeTab.value === 'upcoming') {
    return todos.value.filter((t) => t.dueDate > today && !t.done)
  }
  if (activeTab.value === 'done') {
    return todos.value.filter((t) => t.done)
  }
  return todos.value
})

const addTodo = () => {
  if (!newTodo.value.trim()) return
  todos.value.push({
    _id: Date.now().toString(),
    text: newTodo.value,
    done: false,
    dueDate: today,
  })
  newTodo.value = ''
}

const toggleTodo = (todo: Todo) => {
  todo.done = !todo.done
}

const deleteTodo = (id: string) => {
  todos.value = todos.value.filter((t) => t._id !== id)
}

const editTodo = (id: string) => {
  const todo = todos.value.find((t) => t._id === id)
  if (todo) {
    const newText = prompt('Edytuj zadanie:', todo.text)
    if (newText) todo.text = newText
  }
}
</script>

<template>
  <div class="flex">
    <aside
      class="dark:bg-primary-dark flex w-80 flex-col justify-between border-r border-gray-200 bg-white p-6 dark:border-gray-700"
    >
      <div>
        <h1 class="mb-8 text-xl font-bold text-gray-900 dark:text-white">Moje zadania</h1>
        <nav class="flex flex-col gap-2">
          <a
            class="bg-primary/10 text-primary dark:bg-primary/20 flex items-center gap-3 rounded-lg px-4 py-2 font-semibold"
            href="#"
          >
            <svg
              fill="currentColor"
              height="24"
              viewBox="0 0 256 256"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M56,128a16,16,0,1,1-16-16A16,16,0,0,1,56,128ZM40,48A16,16,0,1,0,56,64,16,16,0,0,0,40,48Zm0,128a16,16,0,1,0,16,16A16,16,0,0,0,40,176Zm176-64H88a8,8,0,0,0-8,8v16a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V120A8,8,0,0,0,216,112Zm0-64H88a8,8,0,0,0-8,8V72a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V56A8,8,0,0,0,216,48Zm0,128H88a8,8,0,0,0-8,8v16a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V184A8,8,0,0,0,216,176Z"
              ></path>
            </svg>
            <span>Moje zadania</span>
          </a>
          <a
            class="hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary flex items-center gap-3 rounded-lg px-4 py-2 text-gray-500 dark:text-gray-400"
            href="#"
          >
            <svg
              class="icon-muted"
              fill="currentColor"
              height="24"
              viewBox="0 0 256 256"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"
              ></path>
            </svg>
            <span>Kalendarz</span>
          </a>
          <a
            class="hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary flex items-center gap-3 rounded-lg px-4 py-2 text-gray-500 dark:text-gray-400"
            href="#"
          >
            <svg
              class="icon-muted"
              fill="currentColor"
              height="24"
              viewBox="0 0 256 256"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"
              ></path>
            </svg>
            <span>Lista</span>
          </a>
          <a
            class="hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary flex items-center gap-3 rounded-lg px-4 py-2 text-gray-500 dark:text-gray-400"
            href="#"
          >
            <svg
              class="icon-muted"
              fill="currentColor"
              height="24"
              viewBox="0 0 256 256"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M216,48H40a8,8,0,0,0-8,8V208a16,16,0,0,0,16,16H88a16,16,0,0,0,16-16V160h48v16a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V56A8,8,0,0,0,216,48ZM88,208H48V128H88Zm0-96H48V64H88Zm64,32H104V64h48Zm56,32H168V128h40Zm0-64H168V64h40Z"
              ></path>
            </svg>
            <span>Tablica</span>
          </a>
          <a
            class="hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary flex items-center gap-3 rounded-lg px-4 py-2 text-gray-500 dark:text-gray-400"
            href="#"
          >
            <svg
              class="icon-muted"
              fill="currentColor"
              height="24"
              viewBox="0 0 256 256"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"
              ></path>
            </svg>
            <span>Raporty</span>
          </a>
        </nav>
      </div>
    </aside>
    <main class="flex-1 p-8">
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

      <!-- 🔥 zakładki -->
      <div class="mb-6 flex gap-4 border-b border-gray-200 dark:border-gray-700">
        <button
          @click="activeTab = 'today'"
          :class="[
            'pb-2 text-sm font-medium',
            activeTab === 'today'
              ? 'border-primary text-primary border-b-2'
              : 'hover:text-primary text-gray-500 dark:text-gray-400',
          ]"
        >
          Dzisiaj
        </button>
        <button
          @click="activeTab = 'upcoming'"
          :class="[
            'pb-2 text-sm font-medium',
            activeTab === 'upcoming'
              ? 'border-primary text-primary border-b-2'
              : 'hover:text-primary text-gray-500 dark:text-gray-400',
          ]"
        >
          Nadchodzące
        </button>
        <button
          @click="activeTab = 'done'"
          :class="[
            'pb-2 text-sm font-medium',
            activeTab === 'done'
              ? 'border-primary text-primary border-b-2'
              : 'hover:text-primary text-gray-500 dark:text-gray-400',
          ]"
        >
          Ukończone
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
              <p class="text-xs text-gray-400">Termin: {{ todo.dueDate }}</p>
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
    </main>
  </div>
</template>

<style scoped>
.icon-muted {
  color: #6b7280;
}
.dark .icon-muted {
  color: #9ca3af;
}
</style>
