<script setup lang="ts">
import { useAccountStore } from '../store/account'

const accountStore = useAccountStore()

defineProps<{
  menuDropdown: boolean
}>()

const emit = defineEmits(['openMenu'])
</script>

<template>
  <div @click="emit('openMenu')" class="cursor-pointer">
    <div class="flex items-center">
      <img
        src="../assets/avatar-placeholder.png"
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
</template>
