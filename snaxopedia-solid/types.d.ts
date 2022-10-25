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

export type GroupedSnaxopedia = {
  location: string,
  bugs: Bug[],
}