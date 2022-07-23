<template>
  <div class="right-page">
    <header class="header"></header>
    <div class="bug-info"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
</script>

<style scoped>
.right-page {
  height: 100%;
  width: 50vw;

  overflow-x: hidden;
  overflow-y: auto;
}
.header {
  background-color: var(--accent-blue);
  height: 1.5rem;
  width: 100%;
}
.bug-info {
  height: calc(100% - 1.5rem);
  width: 100%;
}
</style>
