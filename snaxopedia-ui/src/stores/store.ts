import { defineStore } from "pinia";

export type MainState = {
  snaxopedia: { name: string, location: string, bug: string, snack: string, image: string }[]
};

export const useStore = defineStore("main", {
  state: () => ({
    snaxopedia: [],
  } as MainState),
  getters: {
    getLocations(state): string[] {
      const listOfLocations = state.snaxopedia.map((bug) => bug.location);
      return [...new Set(listOfLocations)];
    },
    getBugsGroupedByLocation(state) {
      const locations: string[] = this.getLocations;
      return locations.reduce((acc: {}[], location: string) => {
        const bugsForLocation = state.snaxopedia.filter((bug) => bug.location === location);
        return [...acc, { location, bugs: bugsForLocation }];
      }, [])
    },
  },
  actions: {
    async loadSnaxopedia() {
      try {
        const response = await fetch("http://localhost:8000/snaxopedia");
        const jsonValue = await response.json();
        this.snaxopedia = jsonValue;
      } catch (err) { console.log(err); }
    },
  }
});