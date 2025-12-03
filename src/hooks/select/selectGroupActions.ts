import type { Cell } from "./selectGroupSlice";

interface SelectGroupSelectCell {
  type: 'select/selectCell',
  payload: {
    cell: Cell
  }
}

interface SelectGroupClearSelection {
  type: 'select/clearSelection',
  payload: null
}

interface SelectGroupCreateGroup {
  type: 'select/createGroup',
  payload: {
    cells: Cell[],
    color: string
  }
}

interface SelectGroupDeleteGroup {
  type: 'select/deleteGroup',
  payload: {
    index: number
  }
}

interface SelectGroupAddToGroup {
  type: 'select/addToGroup',
  payload: {
    cells: Cell[],
    index: number
  }
}

interface SelectGroupRemoveFromGroup {
  type: 'select/removeFromGroup',
  payload: {
    cells: Cell[],
    index: number
  }
}

interface SelectGroupClearGroups {
  type: 'select/clearGroups',
  payload: never
}

interface SelectGroupSetGroupName {
  type: 'select/setGroupName',
  payload: {
    index: number,
    name: string
  }
}

interface SelectGroupSetGroupColor {
  type: 'select/setGroupColor',
  payload: {
    index: number,
    color: string
  }
}

interface SelectGroupSelectLatitude {
  type: 'select/selectLatitude',
  payload: {
    latitude: number
  }
}

interface SelectGroupDeselectLatitude {
  type: 'select/deselectLatitude',
  payload: {
    latitude: number
  }
}

interface SelectGroupClearLatitudes {
  type: 'select/clearLatitudes',
  payload: never
}

export type SelectGroupAction = SelectGroupSelectCell
                                | SelectGroupClearSelection
                                | SelectGroupCreateGroup
                                | SelectGroupDeleteGroup
                                | SelectGroupAddToGroup
                                | SelectGroupRemoveFromGroup
                                | SelectGroupClearGroups
                                | SelectGroupSetGroupName
                                | SelectGroupSetGroupColor
                                | SelectGroupSelectLatitude
                                | SelectGroupDeselectLatitude
                                | SelectGroupClearLatitudes;