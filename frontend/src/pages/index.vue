<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goNext = () => {
  router.push('/todos')
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-[calc(100vh-0px)] bg-gray-50 dark:bg-slate-900 py-8"
  >
    <header class="w-full max-w-5xl px-4 py-6 text-center">
      <h1 class="text-5xl font-bold text-gray-900 dark:text-white">Todo App</h1>
      <p class="text-xl mt-4 text-gray-700 dark:text-gray-300">
        Zrób porządek w swoich zadaniach i organizuj dzień efektywnie!
      </p>
    </header>

    <section class="w-full max-w-5xl px-4 mt-6">
      <div
        class="mx-auto flex max-w-sm flex-col gap-6 rounded-xl p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
      >
        <h2 class="text-2xl font-semibold text-slate-900 dark:text-slate-200 text-center">
          Witaj w Todo App
        </h2>

        <p class="text-gray-700 dark:text-gray-300 text-center">
          Zacznij dodawać swoje zadania i śledzić postępy każdego dnia.
        </p>

        <button
          @click="goNext"
          class="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition cursor-pointer"
        >
          Przejdź dalej
        </button>
      </div>
    </section>
  </div>
</template>
