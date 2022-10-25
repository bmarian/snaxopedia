import type { Component } from 'solid-js';
import LeftPage from './components/LeftPage/LeftPage';
import Loading from './components/Loading/Loading';
import RightPage from './components/RightPage/RightPage';
import { state } from './stores/store';

const App: Component = () => {
  return (<>
    <LeftPage />
    <RightPage />
    {state.loading && <Loading />}
  </>);
};

export default App;
