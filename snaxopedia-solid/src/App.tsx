import { Component, onMount } from 'solid-js'
import type { StoreContext } from '../types'
import LeftPage from './components/LeftPage/LeftPage'
import Loading from './components/Loading/Loading'
import RightPage from './components/RightPage/RightPage'
import { useStore } from './stores/store'

const App: Component = () => {
  const [state, { loadSnaxopedia }]: StoreContext = useStore()
  onMount(() => { loadSnaxopedia() })

  return (<>
    <LeftPage />
    <RightPage />
    {state.loading && <Loading />}
  </>)
}

export default App
