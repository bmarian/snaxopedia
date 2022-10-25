import type { Component } from 'solid-js'
import type { Bug as BugType } from '../../../types';
import { modifyBug, setSelectedBug } from '../../stores/store';
import { bugImageURL } from '../../utils/utils';
import style from './LeftPage.module.css'

const Bug: Component<{ bug: BugType }> = (props) => {
  const bugClasses = `${style.bug}${props.bug.hasBeenPhotographed ? ` ${style.hasPhoto}` : ''}${props.bug.isSelected ? ` ${style.isSelected}` : ''}`

  const changeBugStateEvent = (data: { hasBeenSeen?: boolean, hasBeenPhotographed?: boolean, isSelected?: boolean, }) => (evt: any) => {
    evt.stopPropagation()
    modifyBug(props.bug, data)
  }

  return (<li class={bugClasses} onClick={() => setSelectedBug(props.bug)}>
    <img class={style.bugImage} src={bugImageURL(props.bug.name)} alt={props.bug.name} title={props.bug.name} />
    {props.bug.hasBeenSeen ?
      (<span class={`${style.hasBeenSeen} on material-symbols-outlined`} onClick={changeBugStateEvent({ hasBeenSeen: false, hasBeenPhotographed: false })}>visibility</span>) :
      (<span class={`${style.hasBeenSeen} off material-symbols-outlined`} onClick={changeBugStateEvent({ hasBeenSeen: true })}>visibility_off</span>)
    }
    {props.bug.hasBeenPhotographed ?
      (<span class={`${style.hasBeenPhotographed} on material-symbols-outlined`} onClick={changeBugStateEvent({ hasBeenPhotographed: false })}>check_circle</span>) :
      (<span class={`${style.hasBeenPhotographed} off material-symbols-outlined`} onClick={changeBugStateEvent({ hasBeenSeen: true, hasBeenPhotographed: true })}>circle</span>)
    }
  </li>);
};

export default Bug