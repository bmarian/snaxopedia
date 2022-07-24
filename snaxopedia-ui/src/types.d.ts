export type Bug = { 
  name: string, 
  location: string, 
  bug: string, 
  snack: string, 
  image: string,
  isSelected?: boolean,
  hasBeenSeen?: boolean,
  hasBeenPhotographed?: boolean,
};

export type MainState = {
  snaxopedia: Bug[] | [],
  selectedBug: Bug | null,
};