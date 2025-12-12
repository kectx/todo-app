<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAccountStore } from '../store/account'

const accountStore = useAccountStore()

defineProps<{
  menuDropdown: boolean
}>()

const emit = defineEmits(['openMenu'])

const showEditModal = ref(false)
const editUsername = ref('')
const editAvatar = ref<string | null>(null)
const avatarFile = ref<File | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')

const displayName = computed(() => {
  return accountStore.user?.username || accountStore.user?.email || 'Użytkownik'
})

const defaultAvatar = '/avatar-placeholder.png'

const displayAvatar = computed(() => {
  if (accountStore.user?.avatar) {
    return accountStore.user.avatar
  }
  return defaultAvatar
})

function openEditModal() {
  editUsername.value = accountStore.user?.username || ''
  editAvatar.value = accountStore.user?.avatar || null
  avatarFile.value = null
  errorMessage.value = ''
  showEditModal.value = true
}

function handleAvatarSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Plik musi być obrazem'
    return
  }

  if (file.size > 50000) {
    errorMessage.value = 'Obraz jest zbyt duży (max 50KB)'
    return
  }

  avatarFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    const img = new Image()
    img.onload = () => {
      if (img.width > 48 || img.height > 48) {
        errorMessage.value = 'Obraz musi być maksymalnie 48x48px'
        return
      }
      editAvatar.value = result
      errorMessage.value = ''
    }
    img.src = result
  }
  reader.readAsDataURL(file)
}

function removeAvatar() {
  editAvatar.value = null
  avatarFile.value = null
}

async function saveProfile() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const trimmedUsername = editUsername.value.trim()
    if (trimmedUsername.length > 30) {
      errorMessage.value = 'Nazwa użytkownika nie może przekraczać 30 znaków'
      isLoading.value = false
      return
    }

    await accountStore.updateProfile(trimmedUsername || undefined, editAvatar.value || undefined)

    showEditModal.value = false
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || 'Nie udało się zaktualizować profilu'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div @click="emit('openMenu')" class="cursor-pointer">
    <div class="flex items-center">
      <img
        :src="displayAvatar"
        alt="Avatar"
        class="h-8 w-8 rounded-full object-cover"
        @error="
          (e) => {
            ;(e.target as HTMLImageElement).src = defaultAvatar
          }
        "
      />
      <span class="ml-2 text-lg font-bold text-gray-900 dark:text-white">{{ displayName }}</span>
    </div>
    <div class="mt-4" v-if="menuDropdown">
      <div class="w-48 rounded-lg p-4 pl-0">
        <p class="mb-2 text-sm text-gray-700 dark:text-gray-300">Zalogowany jako:</p>
        <p class="font-medium text-gray-900 dark:text-white">
          {{ accountStore.user?.email }}
        </p>
        <button
          @click.stop="openEditModal"
          class="bg-primary hover:bg-primary/90 mt-3 w-full rounded-lg px-3 py-2 text-sm text-white"
        >
          Edytuj profil
        </button>
        <button
          @click.stop="accountStore.logout()"
          class="mt-2 w-full rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
        >
          Wyloguj
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="showEditModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    @click.self="showEditModal = false"
  >
    <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800" @click.stop>
      <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Edytuj profil</h3>

      <div
        v-if="errorMessage"
        class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
      >
        {{ errorMessage }}
      </div>

      <div class="space-y-4">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Avatar (max 48x48px, 50KB)
          </label>
          <div class="flex items-center gap-4">
            <div class="relative">
              <img
                :src="editAvatar || defaultAvatar"
                alt="Preview"
                class="h-16 w-16 rounded-full border-2 border-gray-300 object-cover dark:border-gray-600"
                @error="
                  (e) => {
                    ;(e.target as HTMLImageElement).src = defaultAvatar
                  }
                "
              />
            </div>
            <div class="flex-1 space-y-2">
              <label
                class="flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <input type="file" accept="image/*" class="hidden" @change="handleAvatarSelect" />
                Wybierz obraz
              </label>
              <button
                v-if="editAvatar"
                @click="removeAvatar"
                class="w-full rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-600 dark:bg-gray-700 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Usuń avatar
              </button>
            </div>
          </div>
        </div>

        <div>
          <label
            for="username"
            class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Nazwa użytkownika
          </label>
          <input
            id="username"
            v-model="editUsername"
            type="text"
            placeholder="Wprowadź nazwę użytkownika"
            maxlength="30"
            class="focus:border-primary focus:ring-primary w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ editUsername.length }}/30 znaków
          </p>
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <button
            @click="showEditModal = false"
            :disabled="isLoading"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Anuluj
          </button>
          <button
            @click="saveProfile"
            :disabled="isLoading"
            class="bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
          >
            {{ isLoading ? 'Zapisywanie...' : 'Zapisz' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
