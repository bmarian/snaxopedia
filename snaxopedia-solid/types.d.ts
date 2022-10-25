export type Bug = {
  name: string,
  location: string,
  bug: string,
  snack: string,
  image: string,
  calories?: string,
  strategy?: string,
  attributes?: string[],
  isSelected?: boolean,
  hasBeenSeen?: boolean,
  hasBeenPhotographed?: boolean,
}

export type StoreType = {
  loading: boolean,
  snaxopedia: Bug[],
}

export type StoreFunctions = {
  setLoading(loading: boolean): void;
  loadSnaxopedia(): Promise<void>;
  getBugsGroupedByLocation(): GroupedSnaxopedia[];
  getSelectedBug(): Bug | undefined;
  setSelectedBug(bug: Bug): void;
  modifyBug(bug: Bug, data?: {}): void;
}

export type StoreContext = [state: StoreType, functions: StoreFunctions]

export type GroupedSnaxopedia = {
  location: string,
  bugs: Bug[],
}