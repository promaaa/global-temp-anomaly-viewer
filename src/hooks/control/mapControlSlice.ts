import type { MapControlAction } from "./mapControlActions";

export type MapAnimationMode = 'PLAY' | 'PAUSE';

interface MapControls {
  year: number,
  animation_mode: MapAnimationMode,
  animation_speed: number,
  loop: boolean
};

const initialControls: MapControls = {
  year: 2000,
  animation_mode: 'PAUSE',
  animation_speed: 3,
  loop: false
}

export default function mapControlsReducer(state: MapControls = initialControls, action: MapControlAction) {
  switch (action.type) {
    case 'control/map/changeYear':
      return {
        ...state,
        year: action.payload
      };
    case 'control/map/changeAnimationMode':
      return {
        ...state,
        animation_mode: action.payload
      };
    case 'control/map/changeAnimationSpeed':
      return {
        ...state,
        animation_speed: action.payload
      };
    case 'control/map/setLoop':
      return {
        ...state,
        loop: action.payload
      };
    default:
      return state;
  }
}