<script lang="ts" setup>
import { ref } from 'vue'
import { useAccountStore } from '../store/account'

const accountStore = useAccountStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
</script>
<template>
  <main class="flex flex-grow items-center justify-center">
    <div class="dark:bg-primary-dark w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-2xl">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-black/90 dark:text-white/90">Dołącz do nas!</h2>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">
          Zarejestruj się podając poniżej swoje dane.
        </p>
      </div>
      <form class="space-y-6" @submit.prevent="accountStore.register(email, password)">
        <div>
          <label class="text-sm font-medium text-black/80 dark:text-white/80" for="email"
            >Email</label
          >
          <input
            v-model="email"
            autocomplete="email"
            class="bg-primary-light focus:border-primary focus:ring-primary mt-1 block w-full rounded-lg border border-black/10 px-3 py-2 text-black/90 placeholder-black/40 shadow-sm focus:outline-none sm:text-sm dark:border-white/10 dark:bg-black/20 dark:text-white/90 dark:placeholder-white/40"
            id="email"
            name="email"
            required
            type="email"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-black/80 dark:text-white/80" for="password"
            >Hasło</label
          >
          <input
            v-model="password"
            class="bg-primary-light focus:border-primary focus:ring-primary mt-1 block w-full rounded-lg border border-black/10 px-3 py-2 text-black/90 placeholder-black/40 shadow-sm focus:outline-none sm:text-sm dark:border-white/10 dark:bg-black/20 dark:text-white/90 dark:placeholder-white/40"
            id="password"
            name="password"
            required
            type="password"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-black/80 dark:text-white/80" for="confirm-password"
            >Powtórz hasło</label
          >
          <input
            v-model="confirmPassword"
            class="bg-primary-light focus:border-primary focus:ring-primary mt-1 block w-full rounded-lg border border-black/10 px-3 py-2 text-black/90 placeholder-black/40 shadow-sm focus:outline-none sm:text-sm dark:border-white/10 dark:bg-black/20 dark:text-white/90 dark:placeholder-white/40"
            id="confirm-password"
            name="confirm-password"
            required
            type="password"
          />
        </div>
        <div>
          <button
            class="focus:ring-offset-background-light dark:focus:ring-offset-background-dark bg-primary hover:bg-primary/90 focus:ring-primary flex w-full justify-center rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
            type="submit"
          >
            Zarejestruj się
          </button>
        </div>
      </form>
    </div>
  </main>
</template>
