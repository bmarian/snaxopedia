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

const locationURL = (locationName: string) => `http://localhost:8000/locations/${locationName}.webp`
const bugImageURL = (bugName: string) => `http://localhost:8000/bugs/${bugName}.png`

const changeSnaxopedia = (newSnaxopedia: any): void => {
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

const loadSnaxopedia = async (): Promise<void> => {
  try {
    const response = await fetch("http://localhost:8000/snaxopedia")
    const newSnaxopedia = await response.json()
    changeSnaxopedia(newSnaxopedia)
  } catch (err) { console.log(err) }
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

const getSelectedBug = (): Bug | undefined => {
  return snaxopedia.find((snack) => snack.isSelected)
}

const generateId = (bugName: string): string => bugName.toLowerCase().replaceAll(' ', '').replaceAll('\'', '')

const setSelectedBug = (bug: Bug): void => {
  const newSnaxopedia = snaxopedia.map((snack: Bug) => ({ ...snack, isSelected: snack.name === bug.name }))

  const selectedBugs = document.querySelectorAll('.is-selected')
  if (selectedBugs.length) selectedBugs.forEach((el) => { el.classList.remove('is-selected') })

  const bugToSelect = document.querySelector(`#${generateId(bug.name)}`)
  if (bugToSelect) bugToSelect.classList.add('is-selected')

  changeSnaxopedia(newSnaxopedia)
  saveSelectedData(bug)
}

const modifyBug = (bug: Bug, data: {} = {}): void => {
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

const generateBug = (bug: Bug) => {
  const { hasBeenPhotographed, hasBeenSeen, isSelected } = bug
  const bugClasses = `bug${hasBeenPhotographed ? ' has-photo' : ''}${isSelected ? ' is-selected' : ''}`;
  const bugId = generateId(bug.name)

  const changeBugStateEvent = (data: { hasBeenSeen?: boolean, hasBeenPhotographed?: boolean, isSelected?: boolean, }) => (evt: any) => {
    evt.stopPropagation()

    modifyBug(bug, data)

    const { hasBeenSeen, hasBeenPhotographed } = data;

    const seenOnElement = document.querySelector(`#${bugId} .has-been-seen.on`)
    const seenOffElement = document.querySelector(`#${bugId} .has-been-seen.off`)

    const photographedOnElement = document.querySelector(`#${bugId} .has-been-photographed.on`)
    const photographedOffElement = document.querySelector(`#${bugId} .has-been-photographed.off`)

    if (!seenOnElement || !seenOffElement || !photographedOnElement || !photographedOffElement) return

    if (hasBeenSeen) {
      seenOnElement.classList.remove('hidden')
      seenOffElement.classList.add('hidden')
    } else {
      seenOnElement.classList.add('hidden')
      seenOffElement.classList.remove('hidden')
    }

    if (hasBeenPhotographed) {
      photographedOnElement.classList.remove('hidden')
      photographedOffElement.classList.add('hidden')
    } else {
      photographedOnElement.classList.add('hidden')
      photographedOffElement.classList.remove('hidden')
    }
  }

  const bugElement = document.createElement('li')
  bugElement.id = generateId(bug.name)
  bugElement.className = bugClasses
  bugElement.onclick = () => setSelectedBug(bug)

  const bugImageElement = document.createElement('img')
  bugImageElement.className = 'bug-image'
  bugImageElement.src = bugImageURL(bug.name)
  bugImageElement.alt = bug.name
  bugImageElement.title = bug.name

  const seenOnElement = document.createElement('span')
  seenOnElement.innerText = 'visibility'
  seenOnElement.className = `has-been-seen on material-symbols-outlined${hasBeenSeen ? '' : ' hidden'}`
  seenOnElement.onclick = (evt) => changeBugStateEvent({ hasBeenSeen: false, hasBeenPhotographed: false })(evt)

  const seenOffElement = document.createElement('span')
  seenOffElement.innerText = 'visibility_off'
  seenOffElement.className = `has-been-seen off material-symbols-outlined${hasBeenSeen ? ' hidden' : ''}`
  seenOffElement.onclick = (evt) => changeBugStateEvent({ hasBeenSeen: true })(evt)

  const photographedOnElement = document.createElement('span')
  photographedOnElement.innerText = 'check_circle'
  photographedOnElement.className = `has-been-photographed on material-symbols-outlined${hasBeenPhotographed ? '' : ' hidden'}`
  photographedOnElement.onclick = (evt) => changeBugStateEvent({ hasBeenPhotographed: false })(evt)

  const photographedOffElement = document.createElement('span')
  photographedOffElement.innerText = 'circle'
  photographedOffElement.className = `has-been-photographed off material-symbols-outlined${hasBeenPhotographed ? ' hidden' : ''}`
  photographedOffElement.onclick = (evt) => changeBugStateEvent({ hasBeenSeen: true, hasBeenPhotographed: true })(evt)

  bugElement.appendChild(bugImageElement)
  bugElement.appendChild(seenOnElement)
  bugElement.appendChild(seenOffElement)
  bugElement.appendChild(photographedOnElement)
  bugElement.appendChild(photographedOffElement)

  return bugElement
}

const generateLocationList = (): void => {
  const locationList = document.querySelector('.locations-list')
  if (!locationList) return
  const bugs = groupedSnaxopedia[0].bugs
  bugs.forEach((bug: Bug) => {
    const bugElement = generateBug(bug)
    locationList.appendChild(bugElement)
  })
}

(async () => {
  await loadSnaxopedia()
  generateLocationList()
})()