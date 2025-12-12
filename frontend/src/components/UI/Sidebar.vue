<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Profile from '../Profile.vue'

import TasksIcon from '@/assets/icons/tasks.svg'
import CalendarIcon from '@/assets/icons/calendar.svg'
import ListIcon from '@/assets/icons/list.svg'
import BoardIcon from '@/assets/icons/board.svg'

const menuDropdown = ref(false)
const sidebarOpen = ref(false)
const currentTab = ref('tasks')

const openMenu = () => {
  menuDropdown.value = !menuDropdown.value
}

const changeTab = (tab: string) => {
  currentTab.value = tab
  emit('tabChange', tab)
  sidebarOpen.value = false
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const emit = defineEmits(['tabChange'])

const navItems = [
  { key: 'tasks', label: 'Moje zadania', icon: TasksIcon },
  { key: 'calendar', label: 'Kalendarz', icon: CalendarIcon },
  { key: 'list', label: 'Lista', icon: ListIcon },
  { key: 'board', label: 'Tablica', icon: BoardIcon },
]

const handleResize = () => {
  if (window.innerWidth >= 1024) {
    sidebarOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div>
    <button
      v-if="!sidebarOpen"
      @click="toggleSidebar"
      class="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-lg transition-opacity lg:hidden dark:bg-gray-800"
      aria-label="Toggle menu"
    >
      <svg
        class="h-6 w-6 text-gray-900 dark:text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          v-if="!sidebarOpen"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
        <path
          v-else
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      @click="closeSidebar"
    ></div>

    <aside
      :class="[
        'dark:bg-primary-dark fixed left-0 top-0 z-40 flex h-full w-80 flex-col justify-between border-r border-gray-200 bg-white p-6 transition-transform duration-300 dark:border-gray-700 lg:relative lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <div class="space-y-8">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <button
            @click="closeSidebar"
            class="lg:hidden"
            aria-label="Close menu"
          >
            <svg
              class="h-6 w-6 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav class="flex flex-col gap-2">
          <span
            v-for="item in navItems"
            :key="item.key"
            :class="[
              'hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary flex cursor-pointer items-center gap-3 rounded-lg px-4 py-2 transition-colors',
              {
                'bg-primary/10 text-primary dark:bg-primary/20 font-semibold':
                  currentTab === item.key,
              },
            ]"
            @click="changeTab(item.key)"
          >
            <component :is="item.icon" class="h-6 w-6 shrink-0" />
            <span>{{ item.label }}</span>
          </span>
        </nav>
      </div>
      <Profile :menuDropdown="menuDropdown" @openMenu="openMenu" />
    </aside>
  </div>
</template>

