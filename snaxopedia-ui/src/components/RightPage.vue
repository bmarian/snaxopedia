<template>
  <div class="right-page">
    <header class="header"></header>
    <div v-if="selectedBug?.name" class="bug-info">
      <p class="bug-name">{{ selectedBug.name }}</p>
      <div class="bug-image-container">
        <span class="bug-image-top-left-triangle">◤</span>
        <span class="bug-image-top-right-triangle">◥</span>
        <div v-if="selectedBug.calories" class="calories-container">
          <span class="calories-title">CALORIES</span>
          <span class="calories-number">{{ selectedBug.calories }}</span>
        </div>
        <img
          :src="bugImageURL(selectedBug.name)"
          :alt="selectedBug.name"
          :title="selectedBug.name"
          class="bug-image"
        />
        <span class="bug-image-bottom-left-triangle">◣</span>
        <span class="bug-image-bottom-right-triangle">◢</span>
      </div>
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
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
}

.bug-info .bug-name {
  color: var(--font-color);
  background-color: var(--accent-blue);

  font-size: 2.5rem;
  padding: 0.2rem 1rem;
  border-radius: 1rem;
}
.bug-info .bug-image-container {
  width: 90%;
  height: 20rem;
  position: relative;

  display: flex;
  justify-content: center;
  align-content: center;

  background-color: var(--no-photo-bug);
  border: 1rem solid var(--fancy-off-white);
  box-shadow: 0px 0px 5px 1px;
}
.bug-info .bug-image-container .bug-image-top-left-triangle,
.bug-info .bug-image-container .bug-image-top-right-triangle,
.bug-info .bug-image-container .bug-image-bottom-left-triangle,
.bug-info .bug-image-container .bug-image-bottom-right-triangle {
  position: absolute;
  color: var(--location-font-color);
  font-size: 7rem;
}
.bug-info .bug-image-container .bug-image-top-left-triangle {
  left: -2rem;
  top: -3.5rem;
}
.bug-info .bug-image-container .bug-image-top-right-triangle {
  right: -2rem;
  top: -3.5rem;
}
.bug-info .bug-image-container .bug-image-bottom-left-triangle {
  left: -2rem;
  bottom: -3.5rem;
}
.bug-info .bug-image-container .bug-image-bottom-right-triangle {
  right: -2rem;
  bottom: -3.5rem;
}

.bug-info .bug-image-container .calories-container {
  position: absolute;
  left: 1.5rem;
  top: 0.5rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.bug-info .bug-image-container .calories-container .calories-title {
  font-size: 2rem;
  color: var(--accent-blue);
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: var(--font-color);
  z-index: 1;
}

.bug-info .bug-image-container .calories-container .calories-number {
  font-size: 1.5rem;
  background-color: var(--fancy-off-white);
  padding: 0.5rem 3.3rem;
  border-radius: 0.2rem;
  margin-top: -0.9rem;
  z-index: 0;
}

.bug-info .bug-image-container .bug-image {
  max-width: 100%;
  max-height: 100%;
  aspect-ratio: 1;
}
</style>
