import { Component, For } from 'solid-js'
import type { Bug as BugType, GroupedSnaxopedia } from '../../../types';
import { locationURL } from '../../utils/utils';
import Bug from './Bug';
import style from './LeftPage.module.css'

const Location: Component<{ group: GroupedSnaxopedia }> = (props) => {
  return (<div class={style.group}>
    <h2 class={style.groupTitle}>
      <img class={style.locationImage} src={locationURL(props.group.location)} alt={props.group.location} title={props.group.location} />
      <span>{props.group.location}</span>
    </h2>
    <ul class={style.groupBugs}>
      <For each={props.group.bugs}>
        {(bug: BugType) => (<Bug bug={bug} />)}
      </For>
    </ul>
  </div>);
};

export default Location