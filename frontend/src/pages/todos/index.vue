<script setup lang="ts">
import Sidebar from '../../components/UI/Sidebar.vue'
import Task from '../../components/todos/Task.vue'
import Calendar from '../../components/todos/Calendar.vue'
import List from '../../components/todos/List.vue'
import Board from '../../components/todos/Board.vue'
import { ref } from 'vue'

const currentTab = ref('tasks')

const changeTab = (tab: string) => {
  currentTab.value = tab
}
</script>

<template>
  <div class="flex">
    <Sidebar @tabChange="changeTab" />
    <main class="flex-1 p-8">
      <Task v-if="currentTab === 'tasks'" />
      <Calendar v-if="currentTab === 'calendar'" />
      <List v-if="currentTab === 'list'" />
      <Board v-if="currentTab === 'board'" />
    </main>
  </div>
</template>
