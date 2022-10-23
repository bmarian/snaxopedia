import './style.css'

type Bug = {
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
};
type SnaxopediaGroup = {
  location: string,
  bugs: Bug[],
};

let snaxopedia: Bug[] = []
let groupedSnaxopedia: SnaxopediaGroup[] = []

const changeSnaxopedia = (newSnaxopedia: any) => {
  const getLocations = (): string[] => {
    const listOfLocations = newSnaxopedia.map((bug: Bug) => bug.location)
    return [...new Set(listOfLocations.sort((a: string, b: string) => a.localeCompare(b)))] as string[]
  }

  const groupBugsByLocation = (): {location: string, bugs: Bug[]}[] => {
    const locations: string[] = getLocations()
    return locations.reduce((acc: { location: any, bugs: any[] }[], location: string) => {
      const bugsForLocation = newSnaxopedia
        .filter((bug: Bug) => bug.location === location)
        .sort((a: Bug, b: Bug) => a.name.localeCompare(b.name))
      return [...acc, { location, bugs: bugsForLocation }]
    }, [])
  }

  snaxopedia = newSnaxopedia
  groupedSnaxopedia = groupBugsByLocation()
}

const loadSnaxopedia = async () => {
  try {
    const response = await fetch("http://localhost:8000/snaxopedia")
    const newSnaxopedia = await response.json()
    changeSnaxopedia(newSnaxopedia)
  } catch (err) { console.log(err) }
}

const saveBugData = async (bug: Bug) => {
  const { name } = bug
  try {
    await fetch(`http://localhost:8000/snaxopedia/${name}`, {
      method: "POST",
      mode: 'cors',
      body: JSON.stringify(bug)
    })
  } catch (err) { console.log(err) }
}

const saveSelectedData = async (bug: Bug) => {
  const { name } = bug
  try {
    await fetch(`http://localhost:8000/snaxopedia/selected/${name}`)
  } catch (err) { console.log(err) }
}

const getSelectedBug = () => {
  return snaxopedia.find((snack) => snack.isSelected)
}

const setSelectedBug = (bug: Bug) => {
  const newSnaxopedia = snaxopedia.map((snack: Bug) => ({ ...snack, isSelected: snack.name === bug.name }))
  changeSnaxopedia(newSnaxopedia)

  saveSelectedData(bug)
}

const modifyBug = (bug: Bug, data: {} = {}) => {
  const { name } = bug
  const newSnaxopedia = snaxopedia.map((snack: Bug) => {
    if (snack.name !== name) return { ...snack }

    const modifiedSnack = { ...snack, ...data }
    saveBugData(modifiedSnack)
    return modifiedSnack
  })
  changeSnaxopedia(newSnaxopedia)
}


const toggleLoading = (loading: boolean): void => {
  const loader = document.querySelector('.loader-container')
  if (!loader) return

  if (loading) loader.classList.remove("hidden")
  else loader.classList.add("hidden")
}