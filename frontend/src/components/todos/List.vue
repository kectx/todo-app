<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { Todo, GroupedTodo } from '../../types/interfaces'
import api from '../../plugins/axios'

const todos = ref<Todo[]>([])
const isExpanded = ref(false)

const formatDate = (date: string | Date) => new Date(date).toISOString().split('T')[0]

const groupedTodos = computed<GroupedTodo[]>(() => {
  const grouped = new Map<string, Todo[]>()

  const sorted = [...todos.value].sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime()
    const dateB = new Date(b.dueDate).getTime()
    return dateB - dateA
  })

  sorted.forEach((todo) => {
    const dateKey = formatDate(todo.dueDate)
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, [])
    }
    grouped.get(dateKey)!.push(todo)
  })

  return Array.from(grouped.entries())
    .map(([date, todos]) => ({ date, todos }))
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    })
})

const displayedGroups = computed(() => {
  const maxInitialGroups = 3
  if (isExpanded.value || groupedTodos.value.length <= maxInitialGroups) {
    return groupedTodos.value
  }
  return groupedTodos.value.slice(0, maxInitialGroups)
})

const hasMoreGroups = computed(() => {
  return groupedTodos.value.length > 3
})

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

async function fetchTodos() {
  try {
    const res = await api.get('/api/todos')
    todos.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    console.error('Błąd podczas pobierania zadań:', e)
  }
}

onMounted(fetchTodos)
</script>

<template>
  <div class="space-y-8">
    <header class="flex items-center justify-between">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Lista zadań</h2>
    </header>

    <template v-for="(group, groupIndex) in displayedGroups" :key="group.date">
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <div
            class="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600"
          ></div>
          <h3
            class="bg-primary/10 text-primary dark:bg-primary/20 flex items-center gap-2 rounded-full px-4 py-2 text-base font-semibold"
          >
            <span class="text-lg">📅</span>
            {{ group.date }}
            <span
              class="bg-primary/20 text-primary dark:bg-primary/30 ml-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
            >
              {{ group.todos.length }}
            </span>
          </h3>
          <div
            class="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600"
          ></div>
        </div>

        <div class="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
          <div
            v-for="todo in group.todos"
            :key="todo._id"
            class="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="flex items-start gap-4">
              <div
                class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                :class="[
                  todo.done
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600',
                ]"
              >
                <svg
                  v-if="todo.done"
                  class="h-4 w-4 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <p
                  :class="[
                    'leading-relaxed font-medium',
                    todo.done ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white',
                  ]"
                >
                  {{ todo.text }}
                </p>
                <div class="mt-2 flex items-center gap-2">
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                    :class="[
                      todo.done
                        ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                        : 'bg-primary/10 text-primary dark:bg-primary/20',
                    ]"
                  >
                    <span>📌</span>
                    {{ formatDate(todo.dueDate) }}
                  </span>
                  <span
                    v-if="todo.done"
                    class="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  >
                    ✓ Ukończone
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="groupIndex < displayedGroups.length - 1"
        class="my-6 border-t border-gray-200 dark:border-gray-700"
      ></div>
    </template>

    <div v-if="hasMoreGroups" class="flex justify-center pt-6">
      <button
        @click="toggleExpand"
        class="group hover:border-primary hover:bg-primary/5 hover:text-primary dark:hover:border-primary dark:hover:bg-primary/10 flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-all dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
      >
        <span>{{
          isExpanded ? 'Pokaż mniej' : `Pokaż więcej (${groupedTodos.length - 3} więcej)`
        }}</span>
        <svg
          class="h-5 w-5 transition-transform"
          :class="{ 'rotate-180': isExpanded }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>

    <div
      v-if="groupedTodos.length === 0"
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <div class="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
        <span class="text-4xl">📋</span>
      </div>
      <p class="text-lg font-medium text-gray-600 dark:text-gray-400">Brak zadań do wyświetlenia</p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-500">
        Dodaj nowe zadanie, aby zobaczyć je tutaj
      </p>
    </div>
  </div>
</template>
