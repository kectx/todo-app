<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToRegister = () => {
  router.push('/register')
}

const forgotPassword = () => {
  // Implement forgot password logic here
}
</script>
<template>
  <main class="flex flex-grow items-center justify-center">
    <div class="dark:bg-primary-dark w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-2xl">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-black/90 dark:text-white/90">Zaloguj się</h2>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">
          Witaj z powrotem! Proszę podać swoje dane.
        </p>
      </div>
      <form class="space-y-6">
        <div>
          <label class="text-sm font-medium text-black/80 dark:text-white/80" for="email"
            >Email</label
          >
          <input
            autocomplete="email"
            class="bg-primary-light focus:border-primary focus:ring-primary mt-1 block w-full rounded-lg border border-black/10 px-3 py-2 text-black/90 placeholder-black/40 shadow-sm focus:outline-none sm:text-sm dark:border-white/10 dark:bg-black/20 dark:text-white/90 dark:placeholder-white/40"
            id="email"
            name="email"
            required=""
            type="email"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-black/80 dark:text-white/80" for="password"
            >Hasło</label
          >
          <input
            autocomplete="current-password"
            class="bg-primary-light focus:border-primary focus:ring-primary mt-1 block w-full rounded-lg border border-black/10 px-3 py-2 text-black/90 placeholder-black/40 shadow-sm focus:outline-none sm:text-sm dark:border-white/10 dark:bg-black/20 dark:text-white/90 dark:placeholder-white/40"
            id="password"
            name="password"
            required=""
            type="password"
          />
        </div>
        <div class="flex items-center justify-end">
          <div class="text-sm">
            <p class="text-primary hover:text-primary/80 font-medium" @click="forgotPassword">
              Zapomniałem hasła
            </p>
          </div>
        </div>
        <div>
          <button
            class="focus:ring-offset-background-light dark:focus:ring-offset-background-dark bg-primary hover:bg-primary/90 focus:ring-primary flex w-full justify-center rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
            type="submit"
          >
            Zaloguj się
          </button>
        </div>
      </form>
      <div class="mt-8 text-center text-sm text-black/60 dark:text-white/60">
        Nie masz konta?
        <p class="text-primary hover:text-primary/80 font-medium" @click="goToRegister">
          Zarejestruj się
        </p>
      </div>
    </div>
  </main>
</template>
