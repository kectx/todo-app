<script lang="ts" setup>
import { ref } from 'vue'
import Profile from '../Profile.vue'

import TasksIcon from '@/assets/icons/tasks.svg'
import CalendarIcon from '@/assets/icons/calendar.svg'
import ListIcon from '@/assets/icons/list.svg'
import BoardIcon from '@/assets/icons/board.svg'
import ReportsIcon from '@/assets/icons/reports.svg'

const menuDropdown = ref(false)

const currentTab = ref('tasks')

const openMenu = () => {
  menuDropdown.value = !menuDropdown.value
  console.log('Menu opened!')
}

const changeTab = (tab: string) => {
  currentTab.value = tab
  emit('tabChange', tab)
}

const emit = defineEmits(['tabChange'])

const navItems = [
  { key: 'tasks', label: 'Moje zadania', icon: TasksIcon },
  { key: 'calendar', label: 'Kalendarz', icon: CalendarIcon },
  { key: 'list', label: 'Lista', icon: ListIcon },
  { key: 'board', label: 'Tablica', icon: BoardIcon },
  { key: 'reports', label: 'Raporty', icon: ReportsIcon },
]
</script>

<template>
  <aside
    class="dark:bg-primary-dark flex w-80 flex-col justify-between border-r border-gray-200 bg-white p-6 dark:border-gray-700"
  >
    <div class="space-y-8">
      <h1 class="mb-8 text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <nav class="flex flex-col gap-2">
        <span
          v-for="item in navItems"
          :key="item.key"
          :class="[
            'hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary flex cursor-pointer items-center gap-3 rounded-lg px-4 py-2',
            {
              'bg-primary/10 text-primary dark:bg-primary/20 font-semibold':
                currentTab === item.key,
            },
          ]"
          @click="changeTab(item.key)"
        >
          <component :is="item.icon" class="h-6 w-6" />
          <span>{{ item.label }}</span>
        </span>
      </nav>
    </div>
    <Profile :menuDropdown="menuDropdown" @openMenu="openMenu" />
  </aside>
</template>
