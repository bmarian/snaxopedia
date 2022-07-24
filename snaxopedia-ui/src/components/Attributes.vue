<template>
  <div class="attributes">{{ attributes }}</div>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import { Bug } from "../types";

const props = defineProps({
  attributes: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
</style>
