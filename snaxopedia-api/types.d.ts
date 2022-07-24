export type Bug = {
  name: string,
  location: string,
  bug: string,
  snack: string,
  image: string,
  calories: number,
  strategy: string,
  isSelected?: boolean,
  hasBeenSeen?: boolean,
  hasBeenPhotographed?: boolean,
};

export type Snaxopedia = Bug[] | [];