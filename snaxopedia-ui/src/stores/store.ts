import { defineStore } from "pinia";
import { Bug, MainState } from "../types";

export const useStore = defineStore("main", {
  state: () => ({
    snaxopedia: [],
    selectedBug: null,
  } as MainState),
  getters: {
    getLocations(state): string[] {
      const listOfLocations = state.snaxopedia.map((bug) => bug.location);
      return [...new Set(listOfLocations.sort((a, b) => a.localeCompare(b)))];
    },
    getBugsGroupedByLocation(state) {
      const locations: string[] = this.getLocations;
      return locations.reduce((acc: {}[], location: string) => {
        const bugsForLocation = state.snaxopedia
          .filter((bug) => bug.location === location)
          .sort((a, b) => a.name.localeCompare(b.name));
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
    setSelectedBug(bug: Bug) {
      this.selectedBug = bug;
      this.snaxopedia = this.snaxopedia.map((snack: Bug) => ({ ...snack, isSelected: snack.name === bug.name }))
    },
    changeSeenStatus(seenStatus: boolean, bug: Bug) {
      const { name } = bug;
      this.snaxopedia = this.snaxopedia.map((snack: Bug) => {
        if (snack.name !== name) return snack;
        return { ...snack,  hasBeenSeen: seenStatus};
      });
    },
    changePhotographedStatus(photographedStatus: boolean, bug: Bug) {
      const { name } = bug;
      this.snaxopedia = this.snaxopedia.map((snack: Bug) => {
        if (snack.name !== name) return snack;
        return { ...snack, hasBeenPhotographed: photographedStatus };
      });
    },
  }
});