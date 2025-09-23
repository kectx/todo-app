<script lang="ts" setup>
import Footer from './components/Footer.vue'
</script>

<template>
  <div>
    <main class="bg-primary-light dark:bg-primary-dark">
      <router-view v-slot="{ Component }" class="min-h-[calc(100vh-60px)]">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
