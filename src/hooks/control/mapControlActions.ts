import type { MapAnimationMode } from "./mapControlSlice"

interface MapControlChangeYear {
  type: 'control/map/changeYear',
  payload: number
}

interface MapControlChangeAnimationMode {
  type: 'control/map/changeAnimationMode',
  payload: MapAnimationMode
}

interface MapControlChangeAnimationSpeed {
  type: 'control/map/changeAnimationSpeed',
  payload: number
}

interface MapControlSetLoop {
  type: 'control/map/setLoop',
  payload: boolean
}

export type MapControlAction = MapControlChangeYear 
                               | MapControlChangeAnimationMode 
                               | MapControlChangeAnimationSpeed
                               | MapControlSetLoop;