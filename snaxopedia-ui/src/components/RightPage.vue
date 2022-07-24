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
      <Attribute v-if="selectedBug.attributes" :attributes="selectedBug.attributes"/>
      <div v-if="selectedBug.strategy" class="bug-strategy">
        <p class="title">STRATEGY</p>
        <p class="strategy">
          {{ selectedBug.strategy }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "../stores/store";
import { Bug } from "../types";
import Attribute from "./Attributes.vue";

const store = useStore();
const { modifyBug, setLoading } = store;
const { selectedBug } = storeToRefs(store);

const locationURL = (locationName: string) =>
  `http://localhost:8000/locations/${locationName}.webp`;
const bugImageURL = (bugName: string) =>
  `http://localhost:8000/bugs/${bugName}.png`;

const cleanupFormatting = (formattedString: string): string => {
  return formattedString
    .replaceAll(/\[\[(.*?)\|.*?\]\]/g, (_match, $1) => $1)
    .replaceAll(/\[\[(.*?)\]\]/g, (_match, $1) => $1);
};

const parsePageContent = (page: string) => {
  const sections: string[] = page.split(/^==(.*)==$/m);
  let data = null;

  if (!selectedBug.value?.strategy) {
    const strategySectionIndex = sections.findIndex((section) =>
      section.toLowerCase().includes("strategy")
    );
    const strategySection = cleanupFormatting(
      sections[strategySectionIndex + 1]
    );
    data = { strategy: strategySection };
  }

  if (typeof selectedBug.value?.calories === "undefined") {
    const caloriesSection = sections
      .find((section: string) => section.includes("calories"))
      ?.split?.("\n")
      ?.find?.((row: string) => row.includes("calories"));
    const calories = caloriesSection?.match(/[\d,]+/g)?.[0];

    if (calories) data = { ...data, calories };
  }

  if (!selectedBug.value?.attributes) {
    const attributesSection = sections
      .find((section: string) => section.includes("attributes"))
      ?.split?.("\n")
      ?.find?.((row: string) => row.includes("attributes"));
    const attributes = [
      ...(attributesSection?.matchAll(/\[\[.*?Attribute (.*?)\..*?\]\]/g) || []),
    ].map(([_, attribute]) => attribute);

    if (attributes && attributes.length) data = { ...data, attributes };
  }

  if (data) modifyBug(selectedBug.value as Bug, data);
  setLoading(false);
};

watch(selectedBug, async (newValue) => {
  if (!newValue?.name) return;
  const hasAllAttributes = [
    newValue.strategy,
    newValue.attributes,
    newValue.calories,
  ].reduce((acc, attribute) => acc && typeof attribute !== "undefined", true);
  if (hasAllAttributes) return;
  setLoading(true);

  const bugsnaxWikiAuthPage =
    "https://bugsnax.fandom.com/api.php?action=centralauthtoken&origin=*";
  const bugsnaxWikiPage = `https://bugsnax.fandom.com/api.php?action=query&titles=${newValue.name}&gaplimit=5&prop=revisions&rvprop=content&format=json&origin=*`;

  try {
    await fetch(bugsnaxWikiAuthPage, { mode: "cors" });
    const response = await fetch(bugsnaxWikiPage, { mode: "cors" });
    const responseJSON = await response.json();

    const revisions = Object.values(
      // @ts-ignore
      Object.values(responseJSON?.query?.pages)?.[0]?.revisions
    );
    if (!revisions) {
      setLoading(false);
      return;
    }
    // @ts-ignore
    const pageContent = revisions[revisions.length - 1]?.["*"];
    if (!pageContent) {
      setLoading(false);
      return;
    }

    parsePageContent(pageContent);
  } catch (err) {
    console.log(err);
    setLoading(false);
  }
});
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
  overflow-x: hidden;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
}

.bug-info .bug-name {
  color: var(--font-color);
  background-color: var(--accent-blue);

  margin: 1rem;
  font-size: 4rem;
  padding: 0.2rem 1rem;
  border-radius: 1rem;
}
.bug-info .bug-image-container {
  width: 90%;
  max-height: 30%;
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
  color: var(--calories-number-color);
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

.bug-info .bug-strategy {
  width: 90%;
  position: relative;
  margin-top: 1.5rem;
}

.bug-info .bug-strategy .title {
  font-size: 2.5rem;
  position: absolute;
  top: -3rem;
  left: 1rem;

  color: var(--accent-blue);
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: var(--font-color);
}

.bug-info .bug-strategy .strategy {
  padding: 1rem 1rem;
  font-size: 1.2rem;
  border-radius: 1rem;
  color: var(--strategy-color);
  background-color: var(--fancy-off-white);
  white-space: pre-wrap;
}
</style>
