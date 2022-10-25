import { Component, createEffect } from 'solid-js'
import { useStore } from '../../stores/store';
import { bugImageURL } from '../../utils/utils';
import style from './RightPage.module.css'

const RightPage: Component = () => {
  const [state, { getSelectedBug }] = useStore()

  return (<div class={style.rightPage}>
    <header class={style.header}></header>
    {getSelectedBug()?.name && <div class={style.bugInfo}>
      <p class={style.bugName}>{getSelectedBug().name}</p>
      <div class={style.bugImageContainer}>
        <span class={style.bugImageTopLeftTriangle}>◤</span>
        <span class={style.bugImageTopRightTriangle}>◥</span>

        {getSelectedBug().calories && <div class={style.caloriesContainer}>
          <span class={style.caloriesTitle}>CALORIES</span>
          <span class={style.caloriesCounter}>{getSelectedBug().calories}</span>
        </div>}

        <img class={style.bugImage} src={bugImageURL(getSelectedBug().name)} alt={getSelectedBug().name} title={getSelectedBug().name} />

        <span class={style.bugImageBottomLeftTriangle}>◣</span>
        <span class={style.bugImageBottomRightTriangle}>◢</span>
      </div>
    </div>}
  </div >);
};

export default RightPage