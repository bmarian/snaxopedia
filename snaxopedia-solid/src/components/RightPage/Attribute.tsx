import { Component, For } from 'solid-js'
import style from './RightPage.module.css'

const Attribute: Component<{ attributes: string[] }> = (props) => {
  return (<div class={style.attributes}>
    <For each={props.attributes || []}>
      {(attr: string) => (<span class={`${style.attributeLabel} ${style[attr.toLowerCase()]}`}>{attr.toUpperCase()}</span>)}
    </For>
  </div>);
};

export default Attribute