<script lang="ts" setup>
import { ref } from 'vue'
import { useAccountStore } from '../../store/account'

const accountStore = useAccountStore()

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
</script>

<template>
  <aside
    class="dark:bg-primary-dark flex w-80 flex-col justify-between border-r border-gray-200 bg-white p-6 dark:border-gray-700"
  >
    <div class="space-y-8">
      <h1 class="mb-8 text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <nav class="flex flex-col gap-2">
        <span
          :class="[
            'hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary flex items-center gap-3 rounded-lg px-4 py-2',
            {
              'bg-primary/10 text-primary dark:bg-primary/20 font-semibold': currentTab === 'tasks',
            },
          ]"
          @click="changeTab('tasks')"
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
        </span>
        <span
          :class="[
            'hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary flex items-center gap-3 rounded-lg px-4 py-2',
            {
              'bg-primary/10 text-primary dark:bg-primary/20 font-semibold':
                currentTab === 'calendar',
            },
          ]"
          @click="changeTab('calendar')"
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
        </span>
        <span
          :class="[
            'hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary flex items-center gap-3 rounded-lg px-4 py-2',
            {
              'bg-primary/10 text-primary dark:bg-primary/20 font-semibold': currentTab === 'list',
            },
          ]"
          @click="changeTab('list')"
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
        </span>
        <span
          :class="[
            'hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary flex items-center gap-3 rounded-lg px-4 py-2',
            {
              'bg-primary/10 text-primary dark:bg-primary/20 font-semibold': currentTab === 'board',
            },
          ]"
          @click="changeTab('board')"
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
        </span>
        <span
          :class="[
            'hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary flex items-center gap-3 rounded-lg px-4 py-2',
            {
              'bg-primary/10 text-primary dark:bg-primary/20 font-semibold':
                currentTab === 'reports',
            },
          ]"
          @click="changeTab('reports')"
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
        </span>
      </nav>
    </div>
    <div @click="openMenu">
      <div class="flex items-center">
        <img
          src="../../assets/avatar-placeholder.png"
          alt="Logo"
          height="24"
          width="24"
          class="h-8 w-8"
        />
        <span class="mt-1 ml-2 text-lg font-bold text-gray-900 dark:text-white">TaskMaster</span>
      </div>
      <div class="mt-4" v-if="menuDropdown">
        <div class="w-48 rounded-lg p-4 pl-0">
          <p class="mb-2 text-sm text-gray-700 dark:text-gray-300">Zalogowany jako:</p>
          <p class="font-medium text-gray-900 dark:text-white">
            {{ accountStore.user?.email }}
          </p>
          <button
            @click="accountStore.logout()"
            class="mt-4 w-25 rounded-lg bg-red-500 py-1 text-white hover:bg-red-600"
          >
            Wyloguj
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.icon-muted {
  color: #6b7280;
}
.dark .icon-muted {
  color: #9ca3af;
}
</style>
