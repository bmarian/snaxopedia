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

  const groupBugsByLocation = (): { location: string, bugs: Bug[] }[] => {
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

const generateId = (bugName: string): string => {
  return bugName.toLowerCase().replaceAll(' ', '').replaceAll('\'', '')
}

const toggleLoading = (loading: boolean): void => {
  const loader = document.querySelector('.loader-container')
  if (!loader) return

  if (loading) loader.classList.remove('hidden')
  else loader.classList.add('hidden')
}

const cleanupFormatting = (formattedString: string): string => {
  return formattedString
    .replaceAll(/\[\[(.*?)\|.*?\]\]/g, (_match, $1) => $1)
    .replaceAll(/\[\[(.*?)\]\]/g, (_match, $1) => $1)
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

const parsePageContent = (page: string): void => {
  const selectedBug = getSelectedBug()
  const sections: string[] = page.split(/^==(.*)==$/m)
  let data: any = null

  if (!selectedBug?.strategy) {
    const strategySectionIndex = sections.findIndex((section) =>
      section.toLowerCase().includes("strategy")
    )
    const strategySection = cleanupFormatting(
      sections[strategySectionIndex + 1]
    )
    data = { strategy: strategySection }
  }

  if (typeof selectedBug?.calories === "undefined") {
    const caloriesSection = sections
      .find((section: string) => section.includes("calories"))
      ?.split?.("\n")
      ?.find?.((row: string) => row.includes("calories"))
    const calories = caloriesSection?.match(/[\d,]+/g)?.[0]

    if (calories) data = { ...data, calories }
  }

  if (!selectedBug?.attributes) {
    const attributesSection = sections
      .find((section: string) => section.includes("attributes"))
      ?.split?.("\n")
      ?.find?.((row: string) => row.includes("attributes"))
    const attributes = [
      ...(attributesSection?.matchAll(/\[\[.*?Attribute (.*?)\..*?\]\]/g) ||
        []),
    ].map(([_, attribute]) => attribute)

    if (attributes) data = { ...data, attributes }
  }

  if (data) modifyBug(selectedBug as Bug, data)
  toggleLoading(false)
}

const updateSelected = async (): Promise<void> => {
  const selectedBug = getSelectedBug()
  if (!selectedBug?.name) return

  const hasAllAttributes = [
    selectedBug.strategy,
    selectedBug.attributes,
    selectedBug.calories,
  ].reduce((acc, attribute) => acc && typeof attribute !== "undefined", true)
  if (hasAllAttributes) return
  toggleLoading(true)

  const bugsnaxWikiAuthPage = "https://bugsnax.fandom.com/api.php?action=centralauthtoken&origin=*"
  const bugsnaxWikiPage = `https://bugsnax.fandom.com/api.php?action=query&titles=${selectedBug.name}&gaplimit=5&prop=revisions&rvprop=content&format=json&origin=*`

  try {
    await fetch(bugsnaxWikiAuthPage, { mode: "cors" })
    const response = await fetch(bugsnaxWikiPage, { mode: "cors" })
    const responseJSON = await response.json()

    const revisions = Object.values(
      // @ts-ignore
      Object.values(responseJSON?.query?.pages)?.[0]?.revisions
    )
    if (!revisions) {
      toggleLoading(false)
      return
    }
    // @ts-ignore
    const pageContent = revisions[revisions.length - 1]?.["*"]
    if (!pageContent) {
      toggleLoading(false)
      return
    }

    parsePageContent(pageContent)
  } catch (err) {
    console.log(err)
    toggleLoading(false)
  }
}

const generateBugInfoForSelectedBug = async (): Promise<void> => {
  const bugInfoElement = document.querySelector('.bug-info')
  if (!bugInfoElement) return

  await updateSelected()

  const selectedBug = getSelectedBug()
  if (!selectedBug) {
    bugInfoElement.classList.add('hidden')
    return
  }

  bugInfoElement.classList.remove('hidden')
  const bugNameElement = bugInfoElement.querySelector('.bug-name') as HTMLParagraphElement
  if (bugNameElement) bugNameElement.innerText = selectedBug.name

  const caloriesContainerElement = bugInfoElement.querySelector('.calories-container')
  if (caloriesContainerElement) {
    if (typeof selectedBug.calories !== 'undefined') {
      caloriesContainerElement.classList.remove('hidden')
      const caloriesNumberElement = caloriesContainerElement.querySelector('.calories-number') as HTMLParagraphElement
      if (caloriesNumberElement) caloriesNumberElement.innerText = selectedBug.calories
    } else {
      caloriesContainerElement.classList.add('hidden')
    }
  }

  const bugImageElement = bugInfoElement.querySelector('.right-bug-image') as HTMLImageElement
  if (bugImageElement) {
    bugImageElement.src = bugImageURL(selectedBug.name)
    bugImageElement.alt = selectedBug.name
    bugImageElement.title = selectedBug.name
  }

  const attributesElement = bugInfoElement.querySelector('.attributes')
  if (attributesElement) {
    if (selectedBug.attributes) {
      attributesElement.classList.remove('hidden')
      attributesElement.innerHTML = ''

      selectedBug.attributes.forEach((attr: string) => {
        const attrElement = document.createElement('span')
        attrElement.innerText = attr.toUpperCase()
        attrElement.className = `attribute-label ${attr.toLowerCase()}`

        attributesElement.appendChild(attrElement)
      })
    } else {
      attributesElement.classList.add('hidden')
    }
  }

  const bugStrategyElement = bugInfoElement.querySelector('.bug-strategy')
  if (bugStrategyElement) {
    if (selectedBug.strategy) {
      bugStrategyElement.classList.remove('hidden')
      const strategyElement = bugInfoElement.querySelector('.strategy') as HTMLParagraphElement
      if (strategyElement) strategyElement.innerText = selectedBug.strategy
    } else {
      bugStrategyElement.classList.add('hidden')
    }
  }
}

const setSelectedBug = (bug: Bug): void => {
  const newSnaxopedia = snaxopedia.map((snack: Bug) => ({ ...snack, isSelected: snack.name === bug.name }))

  const selectedBugs = document.querySelectorAll('.is-selected')
  if (selectedBugs.length) selectedBugs.forEach((el) => { el.classList.remove('is-selected') })

  const bugToSelect = document.querySelector(`#${generateId(bug.name)}`)
  if (bugToSelect) bugToSelect.classList.add('is-selected')

  changeSnaxopedia(newSnaxopedia)
  saveSelectedData(bug)
  generateBugInfoForSelectedBug()
}

const generateBug = (bug: Bug): HTMLElement => {
  const { hasBeenPhotographed, hasBeenSeen, isSelected } = bug
  const bugClasses = `bug${hasBeenPhotographed ? ' has-photo' : ''}${isSelected ? ' is-selected' : ''}`;
  const bugId = generateId(bug.name)

  const bugElement = document.createElement('li')
  const changeBugStateEvent = (data: { hasBeenSeen?: boolean, hasBeenPhotographed?: boolean, isSelected?: boolean, }) => (evt: any) => {
    evt.stopPropagation()

    modifyBug(bug, data)

    const { hasBeenSeen, hasBeenPhotographed } = data;

    const seenOnElement = document.querySelector(`#${bugId} .has-been-seen.on`)
    const seenOffElement = document.querySelector(`#${bugId} .has-been-seen.off`)

    const photographedOnElement = document.querySelector(`#${bugId} .has-been-photographed.on`)
    const photographedOffElement = document.querySelector(`#${bugId} .has-been-photographed.off`)

    if (!seenOnElement || !seenOffElement || !photographedOnElement || !photographedOffElement) return

    if (typeof hasBeenSeen !== 'undefined') {
      if (hasBeenSeen) {
        seenOnElement.classList.remove('hidden')
        seenOffElement.classList.add('hidden')
      } else {
        seenOnElement.classList.add('hidden')
        seenOffElement.classList.remove('hidden')
      }
    }

    if (typeof hasBeenPhotographed !== 'undefined') {
      if (hasBeenPhotographed) {
        bugElement.classList.add('has-photo')
        photographedOnElement.classList.remove('hidden')
        photographedOffElement.classList.add('hidden')
      } else {
        bugElement.classList.remove('has-photo')
        photographedOnElement.classList.add('hidden')
        photographedOffElement.classList.remove('hidden')
      }
    }
  }

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

  groupedSnaxopedia.forEach((group: SnaxopediaGroup) => {
    const { location, bugs } = group

    const groupElement = document.createElement('div')
    groupElement.className = 'group'

    const groupTitleElement = document.createElement('h2')
    groupTitleElement.className = 'group-title'

    const groupTitleImgElement = document.createElement('img')
    groupTitleImgElement.className = 'location-image'
    groupTitleImgElement.src = locationURL(location)
    groupTitleImgElement.alt = location
    groupTitleImgElement.title = location

    const groupTitleSpanElement = document.createElement('span')
    groupTitleSpanElement.innerText = location

    groupTitleElement.appendChild(groupTitleImgElement)
    groupTitleElement.appendChild(groupTitleSpanElement)

    const bugGroupElement = document.createElement('ul')
    bugGroupElement.className = 'group-bugs'
    bugs.forEach((bug: Bug) => {
      const bugElement = generateBug(bug)
      bugGroupElement.appendChild(bugElement)
    })

    groupElement.appendChild(groupTitleElement)
    groupElement.appendChild(bugGroupElement)
    locationList.appendChild(groupElement)
  })
}

(async () => {
  await loadSnaxopedia()
  generateLocationList()
  await generateBugInfoForSelectedBug()
})()