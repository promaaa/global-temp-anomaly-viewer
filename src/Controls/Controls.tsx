import './Controls.css';
import { useAppSelector } from "../hooks/storeHooks";
import { store } from '../store/store'
import type { MapAnimationMode } from '../hooks/control/mapControlSlice';
import { useEffect, type MouseEvent } from 'react';

export function AnimControls() {

  const map_year: number = useAppSelector((state) => (state.controls.year));
  const animation_mode: MapAnimationMode = useAppSelector((state) => (state.controls.animation_mode));
  const animation_speed: number = useAppSelector((state) => (state.controls.animation_speed));
  const loop: boolean = useAppSelector((state) => (state.controls.loop));

  useEffect(() => {
    if ((map_year >= 2025) && !loop)
      store.dispatch({
        type: 'control/map/changeAnimationMode',
        payload: 'PAUSE'
      })
    const timer = setTimeout(() => (
      (animation_mode == "PLAY") && store.dispatch({
        type: 'control/map/changeYear',
        payload: (
          (map_year < 2025) ? (map_year + 1) : 1880
        )
      })
    ), 400 / (1 << animation_speed));
    return () => clearTimeout(timer);
  }, [animation_mode, map_year]);

  function modeButtonHandler(e: MouseEvent<HTMLButtonElement>) {
    const input_element = e.target as HTMLInputElement;
    const action = {
      type: 'control/map/changeAnimationMode',
      payload: input_element.value as MapAnimationMode
    }
    console.log(action);
    store.dispatch(action);
  }

  function speedDecrementHandler() {
    if (animation_speed <= 0) {
      console.log("Animation speed reached lower limit. Cannot decrement.");
      return;
    }
    const action = {
      type: 'control/map/changeAnimationSpeed',
      payload: (animation_speed - 1)
    }
    store.dispatch(action);
  }

  function speedIncrementHandler() {
    if (animation_speed >= 4) {
      console.log("Animation speed reached upper limit. Cannot increment.");
      return;
    }
    const action = {
      type: 'control/map/changeAnimationSpeed',
      payload: (animation_speed + 1)
    }
    store.dispatch(action);
  }

  return (
    <div className='controls-container'>
      <section className='animation-controls'>
        <p>Current year: </p>
        <input
          type='number'
          value={map_year}
          className='input-map-year'
          onChange={(e) => {
            let new_year = parseInt(e.target.value);
            if (!new_year)
              return;

            if (new_year < 1880) new_year = 1880;
            if (new_year > 2025) new_year = 2025;

            store.dispatch({
              type: 'control/map/changeYear',
              payload: new_year
            })
          }}
        />
        <section className='animation-buttons'>
          <button // Speed decrement button
            onClick={speedDecrementHandler}
            disabled={animation_speed <= 0}
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
              <path 
                d="M 18 4
                    l -8 6
                    v -6
                    l -8 6
                    l 8 6
                    v -6
                    l 8 6
                    Z"
              />
            </svg>
          </button>
          <button // Toggle loop button
            onClick={() => (
              store.dispatch({
                type: 'control/map/setLoop',
                payload: !loop
              })
            )}
            style={{
              backgroundColor: loop ? 'green' : 'red'
            }}
            disabled={animation_speed <= 0}
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'>
              <path 
                fillOpacity={0}
                d="M 15 5
                    a 10 10 0 1 1 -7.07 2.93
                    l -6 0
                    l 6 0
                    l 4 4
                    l -4 -4
                    "
              />
            </svg>
          </button>
          <button // Pause button
            value={"PAUSE"}
            onClick={modeButtonHandler}
            disabled={animation_mode == "PAUSE"}
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
              <path 
                d="M 4 4
                    h 12
                    v 12
                    h -12
                    v -12
                    Z"
              />
            </svg>
          </button>
          <button // Play button
            value={"PLAY"}
            onClick={modeButtonHandler}
            disabled={animation_mode == "PLAY"}
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
              <path 
                d="M 4 4
                    l 12 6
                    l -12 6
                    v -12
                    Z"
              />
            </svg>
          </button>
          <button // Speed increment button
            onClick={speedIncrementHandler}
            disabled={animation_speed >= 4}
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
              <path 
                d="M 2 4
                    l 8 6
                    v -6
                    l 8 6
                    l -8 6
                    v -6
                    l -8 6
                    Z"
              />
            </svg>
          </button>
        </section>
        <span className='animation-speed-feedback'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'>
            <rect
              width={5} height={24} x={4} y={8} rx={2} ry={2}
              fill='green'
            />
            <rect
              width={5} height={24} x={12} y={8} rx={2} ry={2}
              fill={(animation_speed >= 1) ? 'greenyellow' : 'black'}
            />
            <rect
              width={5} height={24} x={20} y={8} rx={2} ry={2}
              fill={(animation_speed >= 2) ? 'yellow' : 'black'}
            />
            <rect
              width={5} height={24} x={28} y={8} rx={2} ry={2}
              fill={(animation_speed >= 3) ? 'orange' : 'black'}
            />
            <rect
              width={5} height={24} x={36} y={8} rx={2} ry={2}
              fill={(animation_speed >= 4) ? 'red' : 'black'}
            />
          </svg>
        </span>
      </section>
      <input 
        type='range' 
        min={1880} 
        max={2025}
        className='map-year-slider'
        step={1}
        value={map_year}
        onChange={(e) => {
          store.dispatch({
            type: 'control/map/changeYear',
            payload: parseInt(e.target.value)
          });
        }}
      />
    </div>
  )
}