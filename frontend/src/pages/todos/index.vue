<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const todos = ref([])
const newTodo = ref('')

const fetchTodos = async () => {
  const res = await axios.get('/api/todos')
  todos.value = res.data
}

const addTodo = async () => {
  if (!newTodo.value.trim()) return
  const res = await axios.post('/api/todos', { text: newTodo.value })
  todos.value.push(res.data)
  newTodo.value = ''
}

const toggleTodo = async (todo) => {
  const res = await axios.put(`/api/todos/${todo._id}`, { done: !todo.done })
  todo.done = res.data.done
}

const deleteTodo = async (id) => {
  await axios.delete(`/api/todos/${id}`)
  todos.value = todos.value.filter((t) => t._id !== id)
}

onMounted(fetchTodos)
</script>

<template>
  <v-container>
    <h1>Todo App</h1>

    <v-text-field v-model="newTodo" label="New task" @keyup.enter="addTodo" />
    <v-btn @click="addTodo">Add</v-btn>

    <v-list>
      <v-list-item v-for="todo in todos" :key="todo._id">
        <v-list-item-action>
          <v-checkbox v-model="todo.done" @change="toggleTodo(todo)" />
        </v-list-item-action>
        <v-list-item-title :class="{ 'text-decoration-line-through': todo.done }">
          {{ todo.text }}
        </v-list-item-title>
        <v-btn icon @click="deleteTodo(todo._id)">🗑</v-btn>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<style>
.text-decoration-line-through {
  text-decoration: line-through;
}
</style>
