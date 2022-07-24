<template>
  <LeftPage />
  <RightPage />
  <Loading v-if="loading" />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "./stores/store";

import LeftPage from "./components/LeftPage.vue";
import RightPage from "./components/RightPage.vue";
import Loading from "./components/Loading.vue";

const store = useStore();
const { loadSnaxopedia } = store;
const { loading } = storeToRefs(store);

onMounted(() => loadSnaxopedia());
</script>

<style scoped></style>
