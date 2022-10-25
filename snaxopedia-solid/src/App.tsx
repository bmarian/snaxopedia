import { Component, createEffect } from 'solid-js'
import LeftPage from './components/LeftPage/LeftPage'
import Loading from './components/Loading/Loading'
import RightPage from './components/RightPage/RightPage'
import { loadSnaxopedia, state } from './stores/store'

const App: Component = () => {

  createEffect(() => { loadSnaxopedia() })

  return (<>
    <LeftPage />
    <RightPage />
    {state.loading && <Loading />}
  </>)
}

export default App
