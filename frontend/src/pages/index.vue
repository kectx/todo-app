<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const text = 'Todo App'
const letters = text.split('')

const goNext = () => {
  router.push('/todos')
}
</script>

<template>
  <div
    class="flex min-h-[calc(100vh-60px)] flex-col items-center justify-center bg-gray-50 py-8 dark:bg-slate-900"
  >
    <header class="w-full max-w-5xl px-4 py-6 text-center">
      <h1 class="header-hover mx-auto w-fit text-5xl font-bold text-gray-900 dark:text-white">
        <span
          v-for="(letter, index) in letters"
          :key="index"
          :class="[
            'animate-erase inline-block',
            {
              'ml-2': index === 4,
            },
          ]"
          :style="{ animationDelay: index * 0.1 + 's' }"
        >
          {{ letter }}
        </span>
      </h1>
      <p class="mt-4 text-xl text-gray-700 dark:text-gray-300">
        Zrób porządek w swoich zadaniach i organizuj dzień efektywnie!
      </p>
    </header>

    <section class="mt-6 w-full max-w-5xl px-4">
      <div
        class="mx-auto flex max-w-sm flex-col gap-6 rounded-xl p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
      >
        <h2 class="text-center text-2xl font-semibold text-slate-900 dark:text-slate-200">
          Witaj w Todo App
        </h2>

        <p class="text-center text-gray-700 dark:text-gray-300">
          Zacznij dodawać swoje zadania i śledzić postępy każdego dnia.
        </p>

        <button
          @click="goNext"
          class="mt-2 animate-bounce cursor-pointer rounded bg-blue-500 px-4 py-2 text-white transition hover:animate-none hover:bg-blue-600"
        >
          Przejdź dalej
        </button>
      </div>
    </section>
  </div>
</template>

<style>
@keyframes erase {
  0%,
  20%,
  100% {
    clip-path: inset(0 0 0 0);
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    clip-path: inset(100% 0 0 0);
    transform: translateY(-20px);
    opacity: 0;
  }
}

.animate-erase {
  display: inline-block;
  animation: erase 3s ease-in-out infinite;
  animation-play-state: running;
  transform-origin: bottom;
}

.header-hover:hover span {
  animation: none;
  clip-path: inset(0 0 0 0);
  transform: translateY(0);
  opacity: 1;
}
</style>
