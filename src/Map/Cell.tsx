import { jsondata } from "../assets/data/data";
import { store } from "../store/store";

export function MapCell({index}: {index: number}) {

  const cell = jsondata.tempdata[index];
  const latitude: number = cell.lat;
  const longitude: number = cell.lon;

  function selectCell(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e.buttons == 1) {
      e.preventDefault();

      store.dispatch({
        type: 'select/selectCell',
        payload: {
          cell: { lat: latitude, lon: longitude }
        }
      });
    }
  }

  return (
    <div 
      key={index}
      data-lat={latitude}
      data-lon={longitude}
      className={'world-map-cell world-map-lat-' + latitude.toFixed(0) + ' world-map-lon-' + longitude.toFixed(0)}
      onMouseDown={selectCell}
      onMouseMove={selectCell}
    />
  )
}