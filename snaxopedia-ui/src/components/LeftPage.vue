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
          <li
            v-for="bug in group.bugs"
            :key="bug.name"
            :class="[
              'bug',
              { 'has-photo': bug.hasBeenPhotographed },
              { 'is-selected': bug.isSelected },
            ]"
            @click="setSelectedBug(bug)"
          >
            <img
              :src="bugImageURL(bug.name)"
              :alt="bug.name"
              :title="bug.name"
              class="bug-image"
            />
            <span
              v-if="bug.hasBeenSeen"
              class="has-been-seen on material-symbols-outlined"
              @click.stop="
                changeBugStatus(bug, {
                  hasBeenSeen: false,
                  hasBeenPhotographed: false,
                })
              "
              >visibility</span
            >
            <span
              v-else
              class="has-been-seen off material-symbols-outlined"
              @click.stop="changeBugStatus(bug, { hasBeenSeen: true })"
              >visibility_off</span
            >

            <span
              v-if="bug.hasBeenPhotographed"
              class="has-been-photographed on material-symbols-outlined"
              @click.stop="changeBugStatus(bug, { hasBeenPhotographed: false })"
              >check_circle</span
            >
            <span
              v-else
              class="has-been-photographed off material-symbols-outlined"
              @click.stop="
                changeBugStatus(bug, {
                  hasBeenSeen: true,
                  hasBeenPhotographed: true,
                })
              "
            >
              circle</span
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "../stores/store";
import { Bug } from "../types";

const store = useStore();
const { setSelectedBug, modifyBug } = store;
const { getBugsGroupedByLocation: bugsGroupedByLocation } = storeToRefs(store);

const locationURL = (locationName: string) =>
  `http://localhost:8000/locations/${locationName}.webp`;
const bugImageURL = (bugName: string) =>
  `http://localhost:8000/bugs/${bugName}.png`;

const changeBugStatus = (
  bug: Bug,
  data: {
    hasBeenSeen?: boolean;
    hasBeenPhotographed?: boolean;
    isSelected?: boolean;
  }
) => {
  modifyBug(bug, data);
};
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
  position: relative;
}

.group-bugs .bug .bug-image {
  width: 9rem;
}

.group-bugs .bug .has-been-seen,
.group-bugs .bug .has-been-photographed {
  position: absolute;
  bottom: -0.2rem;
  background-color: var(--font-color);
  border-radius: 1rem;
  font-size: 2rem;
  cursor: pointer;
}

.group-bugs .bug .has-been-seen {
  left: -0.2rem;
}

.group-bugs .bug .has-been-photographed {
  right: -0.2rem;
}

.group-bugs .bug .has-been-seen.off,
.group-bugs .bug .has-been-photographed.off {
  color: var(--icon-color);
}

.group-bugs .bug .has-been-seen.on,
.group-bugs .bug .has-been-photographed.on {
  color: var(--seen-green);
}

.group-bugs .bug .has-been-seen.off:hover,
.group-bugs .bug .has-been-photographed.off:hover {
  color: var(--seen-green);
}

.group-bugs .bug.has-photo {
  background-color: var(--has-photo-bug);
}

.group-bugs .bug:hover,
.group-bugs .bug.is-selected {
  background-color: var(--accent-blue);
  border: 0.3rem solid var(--font-color);
  margin: 0rem;
  border-radius: 1rem;
}
</style>
