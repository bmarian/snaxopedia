<template>
  <div class="attributes">
    <span
      v-for="attribute in attributes"
      :key="attribute"
      :class="['attribute-label', attribute.toLowerCase()]"
      >{{ attribute.toUpperCase() }}</span
    >
  </div>
</template>

<script setup lang="ts">
import { Bug } from "../types";

defineProps({
  attributes: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.attributes {
  margin-top: 1rem;
  width: 90%;

  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  align-items: center;
}

.attributes .attribute-label {
  color: var(--font-color);
  font-size: 1.6rem;
  padding: 0.3rem 1rem;
  margin: 0.3rem;
  border-radius: 0.5rem;

  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: var(--attribute-brown-outline);
}

.attributes .attribute-label.aggressive {
  background-color: #c23343;
}

.attributes .attribute-label.sweet {
  background-color: #ca5aa0;
}

.attributes .attribute-label.frosty {
  background-color: #87b2bd;
}

.attributes .attribute-label.fruity {
  background-color: #e5be60;
}

.attributes .attribute-label.evasive {
  background-color: #daaa20;
}

.attributes .attribute-label.red {
  background-color: #86222f;
}

.attributes .attribute-label.breakable {
  background-color: #3eacad;
}

.attributes .attribute-label.meaty {
  background-color: #883214;
}

.attributes .attribute-label.spicy {
  background-color: #d67623;
}

.attributes .attribute-label.flying {
  background-color: #2565d1;
}

.attributes .attribute-label.green {
  background-color: #82b34a;
}

.attributes .attribute-label.sticky {
  background-color: #973ec3;
}

.attributes .attribute-label.burrowing {
  background-color: #a7724a;
}
</style>
