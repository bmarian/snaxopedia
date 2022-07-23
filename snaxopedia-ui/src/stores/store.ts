import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => ({
    snaxopedia: [],
  }),
  actions: {
    async loadSnaxopedia() {
      try {
        const response = await fetch("http://localhost:8000/snaxopedia");
        const jsonValue = await response.json();
        this.snaxopedia = jsonValue;
      } catch (err) { console.log(err); }
    },
  },
});