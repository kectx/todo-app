<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goNext = () => {
  router.push('/todos')
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div class="flex flex-col items-center justify-center p-4">
      <div class="w-full max-w-md text-center">
        <h1 class="mb-4 text-4xl font-bold text-slate-800 dark:text-white">
          Zorganizuj swoje zadania
        </h1>
        <p class="mb-8 text-slate-600 dark:text-slate-300">
          Zacznij zarządzać swoimi zadaniami w prosty i efektywny sposób.
        </p>
        <button
          class="bg-primary hover:bg-primary/90 mb-4 w-full animate-pulse rounded-lg px-6 py-3 font-bold text-white transition-colors duration-300 hover:animate-none"
          @click="goNext"
        >
          Rozpocznij
        </button>
        <p class="text-primary hover:underline" @click="goToLogin">Masz już konto? Zaloguj się</p>
      </div>
    </div>
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
