import './Map.css';
import './groups.css';
import worldMap from '../assets/earth.png';
import { MapCell } from './Cell';
import { useAppSelector } from '../hooks/storeHooks';
import type React from 'react';
import { jsondata } from '../assets/data/data';
import { yearimg } from '../assets/img/img';
import { store } from '../store/store';
import { useState, useRef } from 'react';

type SelectionMode = 'brush' | 'rectangle';

interface RectSelection {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  active: boolean;
}

export function Map() {

  const [show_map, setShowMap] = useState(true);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('brush');
  const [rectSelection, setRectSelection] = useState<RectSelection>({
    startX: 0, startY: 0, currentX: 0, currentY: 0, active: false
  });

  const mapContainerRef = useRef<HTMLDivElement>(null);

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
    let cells = jsondata.tempdata.filter((cell: { lat: number }) => (cell.lat == latitude));
    cells.forEach(
      (cell: { lat: number, lon: number }) => {
        store.dispatch({
          type: 'select/selectCell',
          payload: {
            cell: { lat: cell.lat, lon: cell.lon }
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

  // Rectangle selection handlers
  function handleRectMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (selectionMode !== 'rectangle') return;

    // Prevent default browser drag behavior on images
    e.preventDefault();

    const rect = mapContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRectSelection({
      startX: x,
      startY: y,
      currentX: x,
      currentY: y,
      active: true
    });
  }

  function handleRectMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!rectSelection.active || selectionMode !== 'rectangle') return;

    // Prevent default browser drag behavior
    e.preventDefault();

    const rect = mapContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    setRectSelection(prev => ({
      ...prev,
      currentX: x,
      currentY: y
    }));
  }

  function handleRectMouseUp() {
    if (!rectSelection.active || selectionMode !== 'rectangle') return;

    const rect = mapContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Calculate selection bounds as percentages
    const minX = Math.min(rectSelection.startX, rectSelection.currentX) / rect.width;
    const maxX = Math.max(rectSelection.startX, rectSelection.currentX) / rect.width;
    const minY = Math.min(rectSelection.startY, rectSelection.currentY) / rect.height;
    const maxY = Math.max(rectSelection.startY, rectSelection.currentY) / rect.height;

    // Convert to lat/lon (map goes from -180 to 180 lon, 88 to -88 lat)
    const minLon = -180 + (minX * 360);
    const maxLon = -180 + (maxX * 360);
    const maxLat = 88 - (minY * 176); // Inverted Y axis
    const minLat = 88 - (maxY * 176);

    // Select all cells within bounds
    jsondata.tempdata.forEach((cell: { lat: number, lon: number }) => {
      if (cell.lat >= minLat && cell.lat <= maxLat &&
        cell.lon >= minLon && cell.lon <= maxLon) {
        store.dispatch({
          type: 'select/selectCell',
          payload: {
            cell: { lat: cell.lat, lon: cell.lon }
          }
        });
      }
    });

    setRectSelection({
      startX: 0, startY: 0, currentX: 0, currentY: 0, active: false
    });
  }

  // Get rectangle overlay style
  function getRectStyle(): React.CSSProperties {
    if (!rectSelection.active) return { display: 'none' };

    const left = Math.min(rectSelection.startX, rectSelection.currentX);
    const top = Math.min(rectSelection.startY, rectSelection.currentY);
    const width = Math.abs(rectSelection.currentX - rectSelection.startX);
    const height = Math.abs(rectSelection.currentY - rectSelection.startY);

    return {
      position: 'absolute',
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
      border: '2px dashed var(--primary-color)',
      backgroundColor: 'rgba(74, 158, 255, 0.2)',
      pointerEvents: 'none',
      zIndex: 100
    };
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
                <div className='selection-mode-toggle'>
                  <button
                    className={`mode-button ${selectionMode === 'brush' ? 'active' : ''}`}
                    onClick={() => setSelectionMode('brush')}
                    title="Brush selection: click and drag to paint cells"
                  >
                    🖌️ Brush
                  </button>
                  <button
                    className={`mode-button ${selectionMode === 'rectangle' ? 'active' : ''}`}
                    onClick={() => setSelectionMode('rectangle')}
                    title="Rectangle selection: draw a box to select area"
                  >
                    ⬚ Rectangle
                  </button>
                </div>
                <button className='.create-group-button' onClick={() => (store.dispatch({ type: 'select/createGroup' }))}>
                  Create group
                </button>
                <button className='.deselect-button' onClick={() => (store.dispatch({ type: 'select/clearSelection' }))}>
                  Deselect cells
                </button>
                <button className='.deselect-latitudes-button' onClick={() => {
                  store.dispatch({ type: 'select/clearLatitudes' });
                  document.querySelectorAll('.latitude-selected').forEach(el => el.classList.remove('latitude-selected'));
                }}>
                  Deselect latitudes
                </button>
                <button className='.clear-groups-button' onClick={() => (store.dispatch({ type: 'select/clearGroups' }))}>
                  Clear groups
                </button>
              </div>
              <div className='world-map'>
                {
                  jsondata ? (
                    <>
                      <div className='latitude-selection-container'>
                        {
                          [...Array(45).keys()].map((v) => (4 * v - 88))
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
                      <div
                        className={`world-map-container ${selectionMode === 'rectangle' ? 'rectangle-mode' : ''}`}
                        ref={mapContainerRef}
                        onMouseDown={handleRectMouseDown}
                        onMouseMove={handleRectMouseMove}
                        onMouseUp={handleRectMouseUp}
                        onMouseLeave={handleRectMouseUp}
                      >
                        <img src={worldMap} className="world-map-img"
                          draggable={false}
                          onLoad={() => {
                            world_map = document.querySelector('.world-map-img');
                            windowResizeHandler();
                          }}
                        />
                        <div className='world-map-data'>
                          <img className='world-map-data-img' src={yearimg[map_year]} draggable={false} />
                        </div>
                        <div className={`world-map-grid ${selectionMode === 'rectangle' ? 'no-pointer-events' : ''}`}>
                          {
                            jsondata.tempdata.map(
                              (_: any, i: number) => (
                                <MapCell key={i} index={i} />
                              )
                            )
                          }
                        </div>
                        {/* Rectangle selection overlay */}
                        <div style={getRectStyle()} className="rect-selection-overlay" />
                      </div>
                    </>
                  ) : (
                    <h3>Loading...</h3>
                  )
                }
              </div>
            </>) : []
      }


    </div>
  )
}