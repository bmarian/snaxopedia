<template>
  <div v-for="bug in bugs" :key="bug.name">
    <p>{{ bug.name }}</p>
    <p>{{ bug.bug }}</p>
    <p>{{ bug.snack }}</p>
    <p>{{ bug.location }}</p>
    <img
        :src="`http://localhost:8000/bugs/${bug.name}.png`"
        class="logo"
        :alt="bug.name"
    />
    <a href="https://vitejs.dev" target="_blank">

    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const bugs = ref([]);
onMounted(() => {
  fetch("http://localhost:8000/snaxopedia")
    .then((response) => response.json())
    .then((response) => {
      bugs.value = response;
    })
    .catch((err) => console.log(err));
});
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
