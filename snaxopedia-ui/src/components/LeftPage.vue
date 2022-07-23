<template>
  <div class="left-page">
    <div v-for="bug in snaxopedia" :key="bug.name">
      <p>{{ bug.name }}</p>
      <p>{{ bug.bug }}</p>
      <p>{{ bug.snack }}</p>
      <img
        :src="`http://localhost:8000/locations/${bug.location}.webp`"
        class="logo"
        :alt="bug.location"
      />
      <img
        :src="`http://localhost:8000/bugs/${bug.name}.png`"
        class="logo"
        :alt="bug.name"
      />
      <a href="https://vitejs.dev" target="_blank"> </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "../stores/store";

const store = useStore();
const { snaxopedia } = storeToRefs(store);
</script>

<style scoped>
.left-page {
  height: 100%;
  width: 50vw;

  overflow-x: hidden;
  overflow-y: auto;
}
</style>
