import { useCallback, useEffect, useMemo, useState } from 'react'
import Loading from './components/Loading/Loading'
import LeftPage from './components/LeftPage/LeftPage'
import RightPage from './components/RightPage/RightPage'
import type { Bug } from './types'

export default function App() {
  const [snaxopedia, setSnaxopedia]: [Bug[], Function] = useState([])
  const [loading, setLoading]: [boolean, Function] = useState(false)

  const loadSnaxopedia = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/snaxopedia")
      const jsonSnaxopedia = await response.json()
      setSnaxopedia(jsonSnaxopedia)
    } catch (err) { console.log(err) }
  }, [])
  const saveBugData = useCallback(async (bug: Bug) => {
    const { name } = bug
    try {
      await fetch(`http://localhost:8000/snaxopedia/${name}`, {
        method: "POST",
        mode: 'cors',
        body: JSON.stringify(bug)
      })
    } catch (err) { console.log(err) }
  }, [])
  const saveSelectedData = useCallback(async (bug: Bug) => {
    const { name } = bug
    try {
      await fetch(`http://localhost:8000/snaxopedia/selected/${name}`)
    } catch (err) { console.log(err) }
  }, [])

  const getLocations = useCallback(() => {
    const listOfLocations = snaxopedia.map((bug) => bug.location)
    return [...new Set(listOfLocations.sort((a, b) => a.localeCompare(b)))]
  }, [snaxopedia])
  const getBugsGroupedByLocation = useCallback(() => {
    const locations: string[] = getLocations()
    return locations.reduce((acc: { location: any, bugs: any[] }[], location: string) => {
      const bugsForLocation = snaxopedia
        .filter((bug) => bug.location === location)
        .sort((a, b) => a.name.localeCompare(b.name))
      return [...acc, { location, bugs: bugsForLocation }]
    }, [])
  }, [snaxopedia])
  const getSelectedBug = useCallback(() => {
    return snaxopedia.find((snack) => snack.isSelected)
  }, [snaxopedia])
  const modifyBug = useCallback((bug: Bug, data: {} = {}) => {
    const { name } = bug
    const newSnaxopedia = snaxopedia.map((snack: Bug) => {
      if (snack.name !== name) return { ...snack }

      const modifiedSnack = { ...snack, ...data }
      saveBugData(modifiedSnack)
      return modifiedSnack
    })
    setSnaxopedia(newSnaxopedia)
  }, [snaxopedia])
  const setSelectedBug = useCallback((bug: Bug) => {
    const newSnaxopedia = snaxopedia.map((snack: Bug) => ({ ...snack, isSelected: snack.name === bug.name }))
    setSnaxopedia(newSnaxopedia)

    saveSelectedData(bug)
  }, [snaxopedia])

  useEffect(() => { loadSnaxopedia() }, [])
  const groupedSnaxopedia = useMemo(() => getBugsGroupedByLocation(), [snaxopedia])
  const selectedBug = useMemo(() => getSelectedBug(), [groupedSnaxopedia])

  return (<>
    <LeftPage snaxopedia={groupedSnaxopedia} modifyBug={modifyBug} setSelectedBug={setSelectedBug} />
    <RightPage selectedBug={selectedBug} modifyBug={modifyBug} setLoading={setLoading} />
    {loading && <Loading></Loading>}
  </>)
}
