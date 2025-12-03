import './Map.css';
import './groups.css';
import worldMap from '../assets/earth.png';
import { MapCell } from './Cell';
import { useAppSelector } from '../hooks/storeHooks';
import type React from 'react';
import { jsondata } from '../assets/data/data';
import { yearimg } from '../assets/img/img';
import { store } from '../store/store';
import { useState } from 'react';

export function Map() {

  const [ show_map, setShowMap ] = useState(true);

  const map_year = useAppSelector((state) => (state.controls.year));

  const root = document.documentElement;
  let world_map: HTMLImageElement | null = null;

  window.onresize = windowResizeHandler;

  // Handle selecting all cells in a given latitude.
  function latitudeSelectionHandler(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const data_latitude = (e.target as HTMLDivElement).getAttribute('data-latitude'); // Get latitude value from second class in div
    if (!data_latitude) {
      console.error("Latitude not registered!");
      return;
    }
    const latitude = parseInt(data_latitude);

    // Check if we're in latitude selection mode for histogram
    const is_latitude_selected = document.querySelector(`.latitude-selection-button.--lat${latitude}`)?.classList.contains('latitude-selected');
    
    if (is_latitude_selected) {
      // Deselect the latitude
      store.dispatch({
        type: 'select/deselectLatitude',
        payload: {
          latitude: latitude
        }
      });
      document.querySelector(`.latitude-selection-button.--lat${latitude}`)?.classList.remove('latitude-selected');
    } else {
      // Select the latitude
      store.dispatch({
        type: 'select/selectLatitude',
        payload: {
          latitude: latitude
        }
      });
      document.querySelector(`.latitude-selection-button.--lat${latitude}`)?.classList.add('latitude-selected');
    }

    // Also select all cells in that latitude for the map
    let cells = jsondata.tempdata.filter((cell: {lat: number}) => (cell.lat == latitude));
    cells.forEach(
      (cell: {lat: number, lon: number}) => {
        store.dispatch({
          type: 'select/selectCell',
          payload: {
            cell: {lat: cell.lat, lon: cell.lon}
          }
        })
      }
    )
  }

  function windowResizeHandler() {
    if (!world_map) {
      console.error("No world map image!");
      return;
    }

    const dimensions = world_map.getBoundingClientRect();
    root.style.setProperty('--world-map-width', dimensions.width.toString() + "px");
    root.style.setProperty('--world-map-height', dimensions.height.toString() + "px");
  }

  return (
    <div className='container'>
      <button className='show-button'
        onClick={() => setShowMap(!show_map)}
      >
        {show_map ? "Hide map" : "Show map"}
      </button>

      {
        show_map
        ? (
          <>
          <div className='world-map-controls'>
            <button className='.create-group-button' onClick={() => (store.dispatch({type: 'select/createGroup'}))}>
              Create group
            </button>
            <button className='.deselect-button' onClick={() => (store.dispatch({type: 'select/clearSelection'}))}>
              Deselect cells
            </button>
            <button className='.deselect-latitudes-button' onClick={() => {
              store.dispatch({type: 'select/clearLatitudes'});
              document.querySelectorAll('.latitude-selected').forEach(el => el.classList.remove('latitude-selected'));
            }}>
              Deselect latitudes
            </button>
            <button className='.clear-groups-button' onClick={() => (store.dispatch({type: 'select/clearGroups'}))}>
              Clear groups
            </button>
          </div>
          <div className='world-map'>
            {
              jsondata ? (
                <>
                  <div className='latitude-selection-container'>
                    {
                      [...Array(45).keys()].map((v) => (4*v - 88))
                      .sort((a, b) => (b - a))
                      .map(
                        (v) => (
                          <div 
                            key={v}
                            data-latitude={v}
                            className={`latitude-selection-button --lat${v}`}
                            onMouseDown={latitudeSelectionHandler}
                            onMouseEnter={(e) => {
                              const data_latitude = (e.target as HTMLDivElement).getAttribute('data-latitude'); // Get latitude value from second class in div
                              if (!data_latitude) {
                                console.error("Latitude not registered!");
                                return;
                              }
                              const latitude = parseInt(data_latitude);

                              Array.prototype.forEach.call(
                                document.getElementsByClassName(`world-map-lat-${latitude}`),
                                (v: HTMLDivElement) => {
                                  v.classList.add('world-map-cell-highlight');
                                }
                              )
                            }}
                            onMouseLeave={(e) => {
                              const data_latitude = (e.target as HTMLDivElement).getAttribute('data-latitude'); // Get latitude value from second class in div
                              if (!data_latitude) {
                                console.error("Latitude not registered!");
                                return;
                              }
                              const latitude = parseInt(data_latitude);

                              Array.prototype.forEach.call(
                                document.getElementsByClassName(`world-map-lat-${latitude}`),
                                (v: HTMLDivElement) => {
                                  v.classList.remove('world-map-cell-highlight');
                                }
                              )
                            }}
                          >
                            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                              <path 
                                d="M 2 10
                                    l 16 0
                                    l -4 -4
                                    l 4 4
                                    l -4 4
                                    l 4 -4
                                    z"
                              />
                            </svg>
                          </div>
                        )
                      )
                    }
                  </div>
                  <div className='world-map-container'>
                    <img src={worldMap} className="world-map-img"
                      onLoad={() => {
                        world_map = document.querySelector('.world-map-img');
                        windowResizeHandler();
                      }}
                    />
                    <div className='world-map-data'>
                      <img className='world-map-data-img' src={yearimg[map_year]}/>
                    </div>
                    <div className='world-map-grid'>
                      {
                        jsondata.tempdata.map(
                          (_: any, i: number) => (
                            <MapCell key={i} index={i} />
                          )
                        )
                      }
                    </div>
                  </div>
                </>
              ) : (
                <h3>Loading...</h3>
              )
            }
          </div>
          </> ) : []
      }

      
    </div>
  )
}