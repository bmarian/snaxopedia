import {defineStore} from "pinia";
import {Bug, MainState} from "../types";

export const useStore = defineStore("main", {
  state: () => ({
    snaxopedia: [],
    loading: false,
  } as MainState),
  getters: {
    getLocations(state): string[] {
      const listOfLocations = state.snaxopedia.map((bug) => bug.location);
      return [...new Set(listOfLocations.sort((a, b) => a.localeCompare(b)))];
    },
    getBugsGroupedByLocation(state) {
      const locations: string[] = this.getLocations;
      return locations.reduce((acc: { location: string, bugs: Bug[] }[], location: string) => {
        const bugsForLocation = state.snaxopedia
          .filter((bug) => bug.location === location)
          .sort((a, b) => a.name.localeCompare(b.name));
        return [...acc, { location, bugs: bugsForLocation }];
      }, [])
    },
    selectedBug(state): Bug | undefined {
      return state.snaxopedia.find((snack: Bug) => snack.isSelected);
    }
  },
  actions: {
    async loadSnaxopedia() {
      try {
        const response = await fetch("http://localhost:8000/snaxopedia");
        this.snaxopedia = await response.json();
      } catch (err) { console.log(err); }
    },
    setSelectedBug(bug: Bug) {
      this.snaxopedia = this.snaxopedia.map((snack: Bug) => ({ ...snack, isSelected: snack.name === bug.name }));
      this.saveSelectedData(bug);
    },
    modifyBug(bug: Bug, data: {} = {}) {
      const { name } = bug;
      this.snaxopedia = this.snaxopedia.map((snack: Bug) => {
        if (snack.name !== name) return { ...snack };

        const modifiedSnack = { ...snack, ...data };
        this.saveBugData(modifiedSnack);
        return modifiedSnack;
      });
    },
    async saveBugData(bug: Bug) {
      const { name } = bug;
      try {
        await fetch(`http://localhost:8000/snaxopedia/${name}`, {
          method: "POST",
          mode: 'cors',
          body: JSON.stringify(bug)
        });
      } catch (err) { console.log(err); }
    },
    async saveSelectedData(bug: Bug) {
      const { name } = bug;
      try {
        await fetch(`http://localhost:8000/snaxopedia/selected/${name}`);
      } catch (err) { console.log(err); }
    },
    setLoading(state: boolean) {
      this.loading = state;
    }
  }
});