<template>
  <div class="left-page">
    <header class="header"><span class="title">Snaxopedia</span></header>
    <div class="locations-list">
      <div
        class="group"
        v-for="group in bugsGroupedByLocation"
        :key="group.location"
      >
        <h2 class="group-title">
          <img
            :src="locationURL(group.location)"
            :alt="group.location"
            :title="group.location"
            class="location-image"
          />
          <span>{{ group.location }}</span>
        </h2>
        <ul class="group-bugs">
          <li class="bug" v-for="bug in group.bugs" :key="bug.name">
            <img
              :src="bugImageURL(bug.name)"
              :alt="bug.name"
              :title="bug.name"
              class="bug-image"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "../stores/store";

const store = useStore();
const { getBugsGroupedByLocation: bugsGroupedByLocation } = storeToRefs(store);
const locationURL = (locationName: string) =>
  `http://localhost:8000/locations/${locationName}.webp`;
const bugImageURL = (bugName: string) =>
  `http://localhost:8000/bugs/${bugName}.png`;
</script>

<style scoped>
.left-page {
  height: 100%;
  width: 50vw;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;

  background-color: var(--accent-blue);
  height: 5rem;
  width: 100%;
}

.header .title {
  color: var(--font-color);
  font-size: 2.5rem;
}

.locations-list {
  height: calc(100% - 5rem);
  width: 100%;
  overflow-y: auto;
}

.group-title {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-wrap: nowrap;
}

.group-title .location-image {
  transform: rotate(-15deg);
  width: 10rem;
}

.group-title span {
  position: relative;
  color: var(--location-font-color);
  text-shadow: 2px 2px var(--text-shadow);
  font-size: 3rem;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: var(--font-color);
  -webkit-text-fill-color: var(--location-font-color);
}

.group-bugs {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  margin: 0;
  padding: 0;
}

.group-bugs .bug {
  background-color: var(--no-photo-bug);
  margin: 0.3rem;
  border-radius: 1rem;
}

.group-bugs .bug:hover {
  background-color: var(--accent-blue);
  border: 0.3rem solid var(--font-color);
  margin: 0rem;
  border-radius: 1rem;
}

.group-bugs .bug .bug-image {
  width: 9rem;
}
</style>
