import { Component, For } from 'solid-js'
import type { GroupedSnaxopedia } from '../../../types';
import { getBugsGroupedByLocation } from '../../stores/store';
import style from './LeftPage.module.css'
import Location from './Location';

const LeftPage: Component = () => {
  return (<div class={style.leftPage}>
    <header class={style.header}><span class={style.title}>Snaxopedia</span></header>
    <div class={style.locationList}>
      <For each={getBugsGroupedByLocation()}>
        {(group: GroupedSnaxopedia) => (<Location group={group} />)}
      </For>
    </div>
  </div>);
};

export default LeftPage