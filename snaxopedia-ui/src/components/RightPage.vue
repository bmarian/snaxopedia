<template>
  <div class="right-page">
    <header class="header"></header>
    <div v-if="selectedBug?.name" class="bug-info">
      <img
        :src="bugImageURL(selectedBug?.name)"
        :alt="selectedBug?.name"
        :title="selectedBug?.name"
        class="bug-image"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "../stores/store";
import { Bug } from "../types";

const store = useStore();
const { selectedBug } = storeToRefs(store);

const locationURL = (locationName: string) =>
  `http://localhost:8000/locations/${locationName}.webp`;
const bugImageURL = (bugName: string) =>
  `http://localhost:8000/bugs/${bugName}.png`;
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
