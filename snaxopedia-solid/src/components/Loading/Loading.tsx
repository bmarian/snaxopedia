import type { Component } from 'solid-js';
import style from './Loading.module.css'

const Loading: Component = () => {
  return (
    <div class={style.loaderContainer}>
      <div class={style.loader}>Loading...</div>
    </div>
  );
};

export default Loading;