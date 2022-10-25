import type { Bug, GroupedSnaxopedia, StoreType } from '../../types'
import { createStore } from 'solid-js/store'

const [state, setState] = createStore({
  snaxopedia: [],
  loading: false,
} as StoreType)

const getSnaxopedia = async (): Promise<Bug[]> => {
  try {
    const response = await fetch("http://localhost:8000/snaxopedia")
    const jsonSnaxopedia = await response.json()
    return jsonSnaxopedia
  } catch (err) {
    console.log(err)
    return []
  }
}

const saveBugData = async (bug: Bug): Promise<void> => {
  const { name } = bug
  try {
    await fetch(`http://localhost:8000/snaxopedia/${name}`, {
      method: "POST",
      mode: 'cors',
      body: JSON.stringify(bug)
    })
  } catch (err) { console.log(err) }
}

const saveSelectedData = async (bug: Bug): Promise<void> => {
  const { name } = bug
  try {
    await fetch(`http://localhost:8000/snaxopedia/selected/${name}`)
  } catch (err) { console.log(err) }
}

export { state }

export const setLoading = (loading: boolean): void => {
  setState({ loading })
}

export const loadSnaxopedia = async (): Promise<void> => {
  const snaxopedia = await getSnaxopedia()
  setState({ snaxopedia })
}

export const getBugsGroupedByLocation = (): GroupedSnaxopedia[] => {
  const getLocations = (snx: Bug[]): string[] => {
    const listOfLocations = snx.map((bug: Bug) => bug.location)
    return [...new Set(listOfLocations.sort((a: string, b: string) => a.localeCompare(b)))]
  }

  const locations = getLocations(state.snaxopedia)
  return locations.reduce((acc: GroupedSnaxopedia[], location: string) => {
    const bugsForLocation = state.snaxopedia
      .filter((bug: Bug) => bug.location === location)
      .sort((a: Bug, b: Bug) => a.name.localeCompare(b.name))
    return [...acc, { location, bugs: bugsForLocation } as GroupedSnaxopedia]
  }, [])
}

export const getSelectedBug = (): Bug | undefined => {
  return state.snaxopedia.find((bug: Bug) => bug.isSelected)
}

export const setSelectedBug = (bug: Bug): void => {
  const newSnaxopedia = state.snaxopedia.map((snack: Bug) => ({ ...snack, isSelected: snack.name === bug.name }))
  setState({ snaxopedia: newSnaxopedia })
  saveSelectedData(bug)
}

export const modifyBug = (bug: Bug, data: {} = {}): void => {
  const { name } = bug
  const newSnaxopedia = state.snaxopedia.map((snack: Bug) => {
    if (snack.name !== name) return { ...snack }

    const modifiedSnack = { ...snack, ...data }
    saveBugData(modifiedSnack)
    return modifiedSnack
  })

  setState({ snaxopedia: newSnaxopedia })
}