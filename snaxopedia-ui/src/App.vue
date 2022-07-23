<template>
  <LeftPage />
  <RightPage />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useStore } from "./stores/store";

import LeftPage from "./components/LeftPage.vue";
import RightPage from "./components/RightPage.vue";

const store = useStore();
const { loadSnaxopedia } = store;
onMounted(() => loadSnaxopedia());
</script>

<style scoped></style>
